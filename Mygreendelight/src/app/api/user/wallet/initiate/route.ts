import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { auth } from "@/auth";
import PaytmChecksum from "paytmchecksum";

const MID = process.env.PAYTM_MID;
const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
const WEBSITE = process.env.PAYTM_WEBSITE || "DEFAULT";
const PAYTM_HOST = process.env.PAYTM_HOST || "https://securegw.paytm.in";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Please log in to recharge wallet." }, { status: 401 });
    }

    const { amount, packBonus = 0 } = await req.json();
    const numAmount = Number(amount);
    const numBonus = Number(packBonus);

    if (!numAmount || numAmount < 10) {
      return NextResponse.json({ success: false, message: "Minimum recharge amount is ₹10." }, { status: 400 });
    }

    const rechargeId = `WLT_${session.user.id}_${Date.now()}`;

    if (!MID || !MERCHANT_KEY) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment Gateway is currently in maintenance. Online wallet recharge is temporarily unavailable. Please try Cash on Delivery.",
        },
        { status: 503 }
      );
    }

    const paytmParams: Record<string, any> = {
      body: {
        requestType: "Payment",
        mid: MID,
        websiteName: WEBSITE,
        orderId: rechargeId,
        callbackUrl: `${process.env.NEXT_URL}/api/user/wallet/verify`,
        txnAmount: {
          value: String(numAmount.toFixed(2)),
          currency: "INR",
        },
        userInfo: {
          custId: session.user.id,
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

    const paytmResponse = await fetch(
      `${PAYTM_HOST}/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${rechargeId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paytmParams),
      }
    );

    const paytmData = await paytmResponse.json();

    if (paytmData.body?.resultInfo?.resultStatus === "S" && paytmData.body?.txnToken) {
      return NextResponse.json({
        success: true,
        gateway: "paytm",
        orderId: rechargeId,
        txnToken: paytmData.body.txnToken,
        amount: numAmount,
        bonus: numBonus,
        mid: MID,
        callbackUrl: `${process.env.NEXT_URL}/api/user/wallet/verify`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: paytmData.body?.resultInfo?.resultMsg || "Unable to initiate payment with Paytm Gateway.",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Wallet recharge error:", error);
    return NextResponse.json({ success: false, message: error.message || "Recharge failed." }, { status: 500 });
  }
}
