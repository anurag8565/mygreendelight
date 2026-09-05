import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import UserWallet from "@/model/wallet.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        isMember: false,
        vipPass: null,
      });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const isVipActive = Boolean(
      user.vipPass?.isActive &&
      user.vipPass.endDate &&
      new Date(user.vipPass.endDate) > now
    );

    const daysRemaining = isVipActive && user.vipPass?.endDate
      ? Math.max(0, Math.ceil((new Date(user.vipPass.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return NextResponse.json({
      success: true,
      isMember: isVipActive,
      vipPass: isVipActive
        ? {
            planName: user.vipPass.planName || "Farm Club VIP Pass",
            price: user.vipPass.price || 49,
            startDate: user.vipPass.startDate,
            endDate: user.vipPass.endDate,
            daysRemaining,
            totalSavings: user.vipPass.totalSavings || 0,
          }
        : null,
      walletBalance: user.walletBalance || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please log in to join Farm Club VIP" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const VIP_PRICE = 49;
    const currentBalance = user.walletBalance || 0;

    if (currentBalance < VIP_PRICE) {
      return NextResponse.json(
        {
          success: false,
          needsRecharge: true,
          requiredAmount: VIP_PRICE - currentBalance,
          message: `Insufficient wallet balance. You have ₹${currentBalance}. Please recharge ₹${VIP_PRICE - currentBalance} to activate VIP Pass.`,
        },
        { status: 400 }
      );
    }

    // Deduct ₹49 from wallet
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 Days validity

    // Update UserWallet model
    let wallet = await UserWallet.findOne({ user: user._id });
    if (wallet) {
      wallet.balance -= VIP_PRICE;
      wallet.transactions.push({
        type: "debit",
        amount: VIP_PRICE,
        description: "🏆 Activated Farm Club VIP Pass (30 Days)",
        createdAt: new Date(),
      });
      await wallet.save();
    }

    // Update User model
    user.walletBalance -= VIP_PRICE;
    user.walletHistory = user.walletHistory || [];
    user.walletHistory.push({
      amount: VIP_PRICE,
      type: "debit",
      description: "🏆 Activated Farm Club VIP Pass (30 Days)",
      date: new Date(),
    });

    user.vipPass = {
      isActive: true,
      planName: "Farm Club VIP Pass",
      price: VIP_PRICE,
      startDate,
      endDate,
      totalSavings: user.vipPass?.totalSavings || 0,
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: "🎉 Welcome to SubziQuick Farm Club VIP! Free Delivery & Extra Discounts Unlocked!",
      vipPass: {
        isActive: true,
        planName: "Farm Club VIP Pass",
        startDate,
        endDate,
        daysRemaining: 30,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
