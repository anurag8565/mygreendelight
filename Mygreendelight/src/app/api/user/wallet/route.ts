import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import UserWallet from "@/model/wallet.model";
import User from "@/model/user.model";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session check warning in wallet GET:", sErr);
    }

    const userId = session?.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Please log in to view wallet", balance: 0, transactions: [] },
        { status: 200 }
      );
    }

    let wallet = await UserWallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await UserWallet.create({
        user: userId,
        balance: 50,
        totalCashback: 50,
        transactions: [
          {
            type: "credit",
            amount: 50,
            description: "🎉 Welcome Farm Gift Bonus",
            createdAt: new Date(),
          },
        ],
      });
    }

    // Keep User model in sync for checkout
    await User.findByIdAndUpdate(userId, { walletBalance: wallet.balance }).catch(() => {});

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      totalCashback: wallet.totalCashback,
      transactions: (wallet.transactions || []).slice().reverse(),
    });
  } catch (error: any) {
    console.error("Wallet API GET error:", error);
    return NextResponse.json({ success: true, balance: 0, transactions: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Direct wallet balance crediting is strictly disabled for security. All recharges must go through the verified Paytm Gateway flow via /api/user/wallet/initiate.",
    },
    { status: 403 }
  );
}
