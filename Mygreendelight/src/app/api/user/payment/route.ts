import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
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
    if (!userid || !items || !paymentmethod || !totalamount || !address) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
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

    // ✅ create order (ispaid = false initially)
    const neworder = await Order.create({
      user: userid,
      items,
      paymentmethod: "online",
      totalamount,
      address,
      couponCode: couponCode || null,
      discount: discount || 0,
      walletDiscount: walletDiscount || 0,
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
    }

    // 📉 Reduce stock
    const Grocery = (await import("@/model/groseri.model")).default;
    for (const item of items) {
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