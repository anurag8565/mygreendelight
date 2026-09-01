import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import UserWallet from "@/model/wallet.model";
import User from "@/model/user.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Reset user wallet balance to standard ₹50 Welcome Bonus
    await UserWallet.findOneAndUpdate(
      { user: session.user.id },
      {
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
      },
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(session.user.id, {
      walletBalance: 50,
      walletHistory: [
        {
          amount: 50,
          type: "credit",
          description: "🎉 Welcome Farm Gift Bonus",
          date: new Date(),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      balance: 50,
      message: "Wallet balance reset to official ₹50 Welcome Farm Gift Bonus!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
