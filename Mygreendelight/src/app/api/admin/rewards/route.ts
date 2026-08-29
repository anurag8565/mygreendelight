import { auth } from "@/auth";
import connectDb from "@/lib/db";
import RewardConfig from "@/model/rewardConfig.model";
import ScratchReward from "@/model/reward.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let config = await RewardConfig.findOne().sort({ createdAt: -1 });
    if (!config) {
      config = await RewardConfig.create({
        minCashback: 15,
        maxCashback: 50,
        minOrderValue: 199,
        expiryDays: 7,
        isActive: true,
        couponPrefix: "LUCKY",
      });
    }

    const totalIssued = await ScratchReward.countDocuments();
    const totalScratched = await ScratchReward.countDocuments({ isScratched: true });
    const recentRewards = await ScratchReward.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    return NextResponse.json({
      success: true,
      config,
      stats: {
        totalIssued,
        totalScratched,
        totalUnscratched: totalIssued - totalScratched,
      },
      recentRewards,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { minCashback, maxCashback, minOrderValue, expiryDays, isActive, couponPrefix } = body;

    let config = await RewardConfig.findOne().sort({ createdAt: -1 });
    if (config) {
      if (minCashback !== undefined) config.minCashback = Number(minCashback);
      if (maxCashback !== undefined) config.maxCashback = Number(maxCashback);
      if (minOrderValue !== undefined) config.minOrderValue = Number(minOrderValue);
      if (expiryDays !== undefined) config.expiryDays = Number(expiryDays);
      if (isActive !== undefined) config.isActive = Boolean(isActive);
      if (couponPrefix) config.couponPrefix = couponPrefix.toUpperCase();
      await config.save();
    } else {
      config = await RewardConfig.create({
        minCashback: Number(minCashback) || 15,
        maxCashback: Number(maxCashback) || 50,
        minOrderValue: Number(minOrderValue) || 199,
        expiryDays: Number(expiryDays) || 7,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        couponPrefix: (couponPrefix || "LUCKY").toUpperCase(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Reward Rules & Cashback Limits Updated Successfully!",
      config,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
