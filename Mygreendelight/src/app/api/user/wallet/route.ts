import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import UserWallet from "@/model/wallet.model";
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
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please log in to add money" },
        { status: 401 }
      );
    }

    const { amount, packBonus = 0 } = await req.json();
    const numAmount = Number(amount);
    const numBonus = Number(packBonus);

    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid top-up amount" },
        { status: 400 }
      );
    }

    let wallet = await UserWallet.findOne({ user: session.user.id });
    if (!wallet) {
      wallet = new UserWallet({ user: session.user.id, balance: 0, totalCashback: 0, transactions: [] });
    }

    const totalCredit = numAmount + numBonus;
    wallet.balance += totalCredit;
    if (numBonus > 0) {
      wallet.totalCashback += numBonus;
    }

    wallet.transactions.push({
      type: "credit",
      amount: totalCredit,
      description:
        numBonus > 0
          ? `💳 Wallet Recharge (₹${numAmount} + ₹${numBonus} 10% Extra Bonus)`
          : `💳 Wallet Recharge of ₹${numAmount}`,
      createdAt: new Date(),
    });

    await wallet.save();

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      message: `🎉 ₹${totalCredit} added to your MGD Green Wallet!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
