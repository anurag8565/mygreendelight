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

    // If real Paytm credentials are configured
    if (MID && MERCHANT_KEY) {
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
      }
    }

    // Fallback sandbox/verified simulation mode when gateway keys are in development
    const UserWallet = (await import("@/model/wallet.model")).default;
    const User = (await import("@/model/user.model")).default;

    let wallet = await UserWallet.findOne({ user: session.user.id });
    if (!wallet) {
      wallet = new UserWallet({ user: session.user.id, balance: 0, totalCashback: 0, transactions: [] });
    }

    const totalCredit = numAmount + numBonus;
    wallet.balance += totalCredit;
    if (numBonus > 0) wallet.totalCashback += numBonus;

    wallet.transactions.push({
      type: "credit",
      amount: totalCredit,
      description: numBonus > 0 ? `Recharge (₹${numAmount} + ₹${numBonus} Bonus)` : `Recharge of ₹${numAmount}`,
      orderId: rechargeId,
      createdAt: new Date(),
    });

    await wallet.save();

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { walletBalance: totalCredit },
    });

    return NextResponse.json({
      success: true,
      gateway: "instant",
      balance: wallet.balance,
      message: `🎉 ₹${totalCredit} successfully added to your MGD Green Wallet!`,
    });
  } catch (error: any) {
    console.error("Wallet recharge error:", error);
    return NextResponse.json({ success: false, message: error.message || "Recharge failed." }, { status: 500 });
  }
}
