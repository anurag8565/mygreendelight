import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import Setting from "@/model/setting.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import PaytmChecksum from "paytmchecksum";
import { getBaseUrl } from "@/lib/getBaseUrl";

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

    // Validate Bhopal Delivery Zone
    const pincodeStr = String(address?.pincode || "").trim();
    if (!pincodeStr.startsWith("462")) {
      return NextResponse.json(
        { success: false, message: "Delivery is available exclusively across Bhopal city (MP - 462xxx)." },
        { status: 400 }
      );
    }
    address.city = "Bhopal";
    address.state = "Madhya Pradesh";

    // Sanitize items & fetch real produce data from DB to prevent client price tampering
    const GroceryModel = (await import("@/model/groseri.model")).default;
    const sanitizedItems: any[] = [];
    let subtotalCalc = 0;

    for (const item of items) {
      if (!item.grocery || !mongoose.Types.ObjectId.isValid(item.grocery)) {
        return NextResponse.json(
          { success: false, message: "Invalid product item in checkout basket." },
          { status: 400 }
        );
      }

      const dbGrocery = await GroceryModel.findById(item.grocery);
      if (!dbGrocery) {
        return NextResponse.json(
          { success: false, message: `Produce item "${item.name || "Unknown"}" is no longer available.` },
          { status: 400 }
        );
      }

      let realPrice = Number(dbGrocery.price) || 0;
      let realName = dbGrocery.name || item.name;
      let realImage = dbGrocery.image || item.image;
      let realUnit = dbGrocery.unit || item.unit;

      if (item.variationWeight && dbGrocery.variations && dbGrocery.variations.length > 0) {
        const matchedVar = dbGrocery.variations.find((v: any) => v.weight === item.variationWeight);
        if (matchedVar && matchedVar.price) {
          realPrice = Number(matchedVar.price);
        }
      }

      const itemQty = Math.max(1, Math.min(100, Number(item.quantity) || 1));
      subtotalCalc += realPrice * itemQty;

      sanitizedItems.push({
        grocery: item.grocery,
        groceryId: String(item.grocery),
        name: realName,
        price: realPrice,
        unit: realUnit,
        variationWeight: item.variationWeight,
        image: realImage,
        quantity: itemQty,
      });
    }

    // Fetch dynamic delivery fee settings from Database
    let deliveryFeeCalc = 0;
    try {
      const storeSetting = await Setting.findOne({ key: "store_delivery_settings" }).lean();
      const baseFee = storeSetting?.deliveryFee ?? 30;
      const threshold = storeSetting?.freeDeliveryThreshold ?? 199;
      const isFreePromo = Boolean(storeSetting?.isFreeDeliveryActive);

      if (subtotalCalc > 0) {
        if (isFreePromo || baseFee === 0 || subtotalCalc >= threshold) {
          deliveryFeeCalc = 0;
        } else {
          deliveryFeeCalc = baseFee;
        }
      }
    } catch (setErr) {
      console.warn("Failed to fetch dynamic delivery fee in payment, using default:", setErr);
      deliveryFeeCalc = subtotalCalc > 0 && subtotalCalc < 199 ? 30 : 0;
    }

    const discountCalc = Number(discount) || 0;
    const walletDiscountCalc = 0;
    const finalTotalToSave = Math.max(0, subtotalCalc + deliveryFeeCalc - discountCalc);

    // 🔑 Generate 4-digit Doorstep Delivery Verification OTP
    const autoDeliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // ✅ create order (ispaid = false initially)
    const neworder = await Order.create({
      user: userid,
      items: sanitizedItems,
      paymentmethod: "online",
      totalamount: finalTotalToSave,
      address,
      couponCode: couponCode || null,
      discount: discountCalc,
      walletDiscount: 0,
      deliverySlot: deliverySlot || "Instant Express (30-45 Mins)",
      ispaid: false,
      deliveryOtp: {
        code: autoDeliveryOtp,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        verified: false,
        attempts: 0,
      },
    });

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
        callbackUrl: `${getBaseUrl()}/api/user/payment/verify`,
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
        callbackUrl: `${getBaseUrl()}/api/user/payment/verify`,
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