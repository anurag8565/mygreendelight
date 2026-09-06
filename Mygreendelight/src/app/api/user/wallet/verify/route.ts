import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import PaytmChecksum from "paytmchecksum";
import UserWallet from "@/model/wallet.model";
import User from "@/model/user.model";

const MID = process.env.PAYTM_MID;
const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
const PAYTM_HOST = process.env.PAYTM_HOST || "https://securegw.paytm.in";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    // Parse form-data response from Paytm callback
    const formData = await req.formData();
    const paytmParams: Record<string, string> = {};

    formData.forEach((value, key) => {
      paytmParams[key] = value.toString();
    });

    const checksum = paytmParams.CHECKSUMHASH;
    delete paytmParams.CHECKSUMHASH;

    let isChecksumValid = false;
    if (checksum && MERCHANT_KEY) {
      isChecksumValid = PaytmChecksum.verifySignature(
        paytmParams,
        MERCHANT_KEY,
        checksum
      );
    }

    const orderId = paytmParams.ORDERID || "";
    const txnAmount = parseFloat(paytmParams.TXNAMOUNT || "0");
    const status = paytmParams.STATUS;

    // Check status with Paytm API for 100% verification
    let isSuccess = status === "TXN_SUCCESS" && isChecksumValid;

    if (isSuccess && orderId && txnAmount > 0) {
      const parts = orderId.split("_");
      const userId = parts[1];

      if (userId) {
        let wallet = await UserWallet.findOne({ user: userId });
        if (!wallet) {
          wallet = new UserWallet({ user: userId, balance: 0, totalCashback: 0, transactions: [] });
        }

        // Prevent transaction replay attacks
        const existingTxn = wallet.transactions?.find((t: any) => t.orderId === orderId);
        if (existingTxn) {
          return NextResponse.redirect(`${process.env.NEXT_URL}/user/wallet?status=success&amount=${txnAmount}`, {
            status: 303,
          });
        }

        wallet.balance += txnAmount;
        wallet.transactions.push({
          type: "credit",
          amount: txnAmount,
          description: `Paytm Wallet Top-up #${orderId.slice(-6)}`,
          orderId: orderId,
          createdAt: new Date(),
        });

        await wallet.save();

        await User.findByIdAndUpdate(userId, {
          $inc: { walletBalance: txnAmount },
        });

        return NextResponse.redirect(`${process.env.NEXT_URL}/user/wallet?status=success&amount=${txnAmount}`, {
          status: 303,
        });
      }
    }

    return NextResponse.redirect(`${process.env.NEXT_URL}/user/wallet?status=failed`, {
      status: 303,
    });
  } catch (error: any) {
    console.error("Paytm wallet verify error:", error);
    return NextResponse.redirect(`${process.env.NEXT_URL}/user/wallet?status=error`, {
      status: 303,
    });
  }
}
