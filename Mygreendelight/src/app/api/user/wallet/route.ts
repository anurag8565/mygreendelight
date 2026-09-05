import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import UserWallet from "@/model/wallet.model";
import User from "@/model/user.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please log in to view wallet" },
        { status: 401 }
      );
    }

    let wallet = await UserWallet.findOne({ user: session.user.id });
    if (!wallet) {
      wallet = await UserWallet.create({
        user: session.user.id,
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
    await User.findByIdAndUpdate(session.user.id, { walletBalance: wallet.balance });

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      totalCashback: wallet.totalCashback,
      transactions: wallet.transactions.slice().reverse(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
