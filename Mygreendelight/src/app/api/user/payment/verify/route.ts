import connectDb from "@/lib/db";
import Order from "@/model/order";
import PaytmChecksum from "paytmchecksum";
import { NextRequest, NextResponse } from "next/server";

const MID = process.env.PAYTM_MID!;
const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY!;
const PAYTM_HOST = process.env.PAYTM_HOST || "https://securegw.paytm.in";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const formData = await req.formData();
    const paytmResponse: Record<string, string> = {};

    formData.forEach((value, key) => {
      paytmResponse[key] = value.toString();
    });

    console.log("PAYTM CALLBACK DATA:", paytmResponse);

    const paytmChecksum = paytmResponse.CHECKSUMHASH;
    delete paytmResponse.CHECKSUMHASH;

    // 🔐 Verify Checksum
    const isValid = PaytmChecksum.verifySignature(
      paytmResponse,
      MERCHANT_KEY,
      paytmChecksum
    );

    if (!isValid) {
      console.error("Paytm checksum verification failed!");
      return NextResponse.redirect(
        `${process.env.NEXT_URL}/user/checkout?error=payment_verification_failed`,
        { status: 302 }
      );
    }

    const orderId = paytmResponse.ORDERID; // MGD_<mongoId>
    const mongoOrderId = orderId.replace("MGD_", "");
    const txnStatus = paytmResponse.STATUS;
    const txnId = paytmResponse.TXNID;

    // 🔍 Double-verify with Paytm Transaction Status API
    const statusParams: Record<string, any> = {
      body: {
        mid: MID,
        orderId: orderId,
      },
    };

    const statusChecksum = await PaytmChecksum.generateSignature(
      JSON.stringify(statusParams.body),
      MERCHANT_KEY
    );

    statusParams.head = { signature: statusChecksum };

    const statusResponse = await fetch(
      `${PAYTM_HOST}/v3/order/status`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusParams),
      }
    );

    const statusData = await statusResponse.json();
    console.log("PAYTM STATUS CHECK:", statusData);

    const finalStatus = statusData.body?.resultInfo?.resultStatus;

    if (finalStatus === "TXN_SUCCESS" || txnStatus === "TXN_SUCCESS") {
      // ✅ Payment Successful — Mark order as paid
      await Order.findByIdAndUpdate(mongoOrderId, {
        ispaid: true,
        paymentId: txnId || paytmResponse.TXNID,
        paymentStatus: "completed",
      });

      return NextResponse.redirect(
        `${process.env.NEXT_URL}/user/ordersuccess?orderId=${mongoOrderId}`,
        { status: 302 }
      );
    } else if (finalStatus === "PENDING" || txnStatus === "PENDING") {
      // ⏳ Payment Pending
      await Order.findByIdAndUpdate(mongoOrderId, {
        paymentStatus: "pending",
      });

      return NextResponse.redirect(
        `${process.env.NEXT_URL}/user/ordersuccess?orderId=${mongoOrderId}&status=pending`,
        { status: 302 }
      );
    } else {
      // ❌ Payment Failed — Restore stock
      const order = await Order.findById(mongoOrderId);
      if (order) {
        const Grocery = (await import("@/model/groseri.model")).default;
        for (const item of order.items) {
          if (item.variationWeight) {
            await Grocery.updateOne(
              { _id: item.grocery, "variations.weight": item.variationWeight },
              { $inc: { "variations.$.stock": item.quantity } }
            );
          } else {
            await Grocery.updateOne(
              { _id: item.grocery },
              { $inc: { stock: item.quantity } }
            );
          }
        }

        // Restore wallet if redeemed
        if (order.walletDiscount > 0) {
          const User = (await import("@/model/user.model")).default;
          await User.findByIdAndUpdate(order.user, {
            $inc: { walletBalance: order.walletDiscount },
            $push: {
              walletHistory: {
                amount: order.walletDiscount,
                type: "credit",
                description: `Payment failed refund for Order #${mongoOrderId.slice(-6).toUpperCase()}`,
                date: new Date(),
              },
            },
          });
        }

        order.status = "cancelled";
        order.cancellationReason = "Payment failed or declined";
        order.paymentStatus = "failed";
        await order.save();
      }

      return NextResponse.redirect(
        `${process.env.NEXT_URL}/user/checkout?error=payment_failed`,
        { status: 302 }
      );
    }
  } catch (error) {
    console.error("PAYTM VERIFY ERROR:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_URL}/user/checkout?error=server_error`,
      { status: 302 }
    );
  }
}
