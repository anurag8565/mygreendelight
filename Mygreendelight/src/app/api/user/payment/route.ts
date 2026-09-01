import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import PaytmChecksum from "paytmchecksum";

const MID = process.env.PAYTM_MID!;
const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY!;
const WEBSITE = process.env.PAYTM_WEBSITE || "DEFAULT";
const PAYTM_HOST = process.env.PAYTM_HOST || "https://securegw.paytm.in";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();
    const {
      userid,
      items,
      paymentmethod,
      totalamount,
      address,
      couponCode,
      discount,
      walletDiscount,
      deliverySlot,
    } = body;

    // ❌ validation
    if (!userid || !items || !Array.isArray(items) || items.length === 0 || !address) {
      return NextResponse.json(
        { success: false, message: "Missing required order information or empty cart" },
        { status: 400 }
      );
    }

    // ✅ check user exists
    const user = await User.findById(userid);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Sanitize items: ensure invalid/custom ObjectIds don't crash Mongoose
    const sanitizedItems = items.map((item: any) => {
      const isValid = item.grocery && mongoose.Types.ObjectId.isValid(item.grocery);
      return {
        grocery: isValid ? item.grocery : undefined,
        groceryId: item.grocery ? String(item.grocery) : undefined,
        name: item.name,
        price: Number(item.price) || 0,
        unit: item.unit,
        variationWeight: item.variationWeight,
        image: item.image,
        quantity: Number(item.quantity) || 1,
      };
    });

    // Check VIP Farm Club membership
    const isVip = Boolean(
      user.vipPass?.isActive &&
      user.vipPass.endDate &&
      new Date(user.vipPass.endDate) > new Date()
    );

    // Compute verified total
    const subtotalCalc = sanitizedItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const deliveryFeeCalc = isVip ? 0 : (subtotalCalc > 0 && subtotalCalc < 100 ? 50 : 0);
    const discountCalc = Number(discount) || 0;
    const walletDiscountCalc = Number(walletDiscount) || 0;
    const computedPayableTotal = Math.max(0, subtotalCalc + deliveryFeeCalc - discountCalc - walletDiscountCalc);
    const finalTotalToSave = (totalamount !== undefined && totalamount !== null && !isNaN(Number(totalamount)))
      ? Number(totalamount)
      : computedPayableTotal;

    if (isVip && subtotalCalc > 0 && subtotalCalc < 100) {
      await User.findByIdAndUpdate(userid, { $inc: { "vipPass.totalSavings": 50 } });
    }

    // ✅ create order (ispaid = false initially)
    const neworder = await Order.create({
      user: userid,
      items: sanitizedItems,
      paymentmethod: "online",
      totalamount: finalTotalToSave,
      address,
      couponCode: couponCode || null,
      discount: discountCalc,
      walletDiscount: walletDiscountCalc,
      deliverySlot: deliverySlot || "Instant Express (30-45 Mins)",
      ispaid: false,
    });

    // 💰 Deduct GreenPoints Wallet if redeemed
    if (walletDiscount && walletDiscount > 0) {
      await User.findByIdAndUpdate(userid, {
        $inc: { walletBalance: -walletDiscount },
        $push: {
          walletHistory: {
            amount: walletDiscount,
            type: "debit",
            description: `Redeemed GreenPoints on Order #${neworder._id
              .toString()
              .slice(-6)
              .toUpperCase()}`,
            date: new Date(),
          },
        },
      });

      try {
        const UserWallet = (await import("@/model/wallet.model")).default;
        await UserWallet.findOneAndUpdate(
          { user: userid },
          {
            $inc: { balance: -walletDiscount },
            $push: {
              transactions: {
                type: "debit",
                amount: walletDiscount,
                description: `Redeemed on Order #${neworder._id.toString().slice(-6).toUpperCase()}`,
                orderId: neworder._id.toString(),
                createdAt: new Date(),
              },
            },
          }
        );
      } catch (wErr) {
        console.warn("Wallet ledger sync warning:", wErr);
      }
    }

    // 🎟️ Mark Scratch Reward Coupon as Used if applied
    if (couponCode) {
      try {
        const ScratchReward = (await import("@/model/reward.model")).default;
        await ScratchReward.updateOne(
          { couponCode: couponCode.toUpperCase() },
          { $set: { isUsed: true, order: neworder._id } }
        );
      } catch (cErr) {
        console.warn("Coupon mark used note:", cErr);
      }
    }

    // 📉 Reduce stock safely
    const Grocery = (await import("@/model/groseri.model")).default;
    for (const item of items) {
      if (item.grocery && mongoose.Types.ObjectId.isValid(item.grocery)) {
        if (item.variationWeight) {
          await Grocery.updateOne(
            { _id: item.grocery, "variations.weight": item.variationWeight },
            { $inc: { "variations.$.stock": -item.quantity } }
          );
        } else {
          await Grocery.updateOne(
            { _id: item.grocery },
            { $inc: { stock: -item.quantity } }
          );
        }
      }
    }

    // 🔐 Generate Paytm Transaction Token
    const orderId = `MGD_${neworder._id.toString()}`;

    const paytmParams: Record<string, any> = {
      body: {
        requestType: "Payment",
        mid: MID,
        websiteName: WEBSITE,
        orderId: orderId,
        callbackUrl: `${process.env.NEXT_URL}/api/user/payment/verify`,
        txnAmount: {
          value: String(totalamount.toFixed(2)),
          currency: "INR",
        },
        userInfo: {
          custId: userid,
        },
      },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      MERCHANT_KEY
    );

    paytmParams.head = {
      signature: checksum,
    };

    // 🌐 Call Paytm Initiate Transaction API
    const paytmResponse = await fetch(
      `${PAYTM_HOST}/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${orderId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paytmParams),
      }
    );

    const paytmData = await paytmResponse.json();

    if (
      paytmData.body?.resultInfo?.resultStatus === "S" &&
      paytmData.body?.txnToken
    ) {
      return NextResponse.json({
        success: true,
        orderId: orderId,
        txnToken: paytmData.body.txnToken,
        amount: totalamount,
        mid: MID,
        callbackUrl: `${process.env.NEXT_URL}/api/user/payment/verify`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            paytmData.body?.resultInfo?.resultMsg ||
            "Failed to initiate Paytm transaction",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("PAYTM PAYMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: `Payment error: ${error}` },
      { status: 500 }
    );
  }
}