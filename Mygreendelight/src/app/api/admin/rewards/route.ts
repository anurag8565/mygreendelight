import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { RewardConfig, ScratchReward } from "@/model/reward.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

const DEFAULT_REWARDS = [
  {
    title: "Flat ₹30 Instant OFF",
    discountType: "fixed",
    discountValue: 30,
    couponPrefix: "FARM30",
    minOrderValue: 249,
    description: "Flat ₹30 discount on orders above ₹249",
  },
  {
    title: "Flat 15% Extra Savings",
    discountType: "percent",
    discountValue: 15,
    couponPrefix: "FRESH15",
    minOrderValue: 299,
    description: "15% OFF on fresh farm produce",
  },
  {
    title: "Flat ₹50 Mega Discount",
    discountType: "fixed",
    discountValue: 50,
    couponPrefix: "BHOPAL50",
    minOrderValue: 499,
    description: "Flat ₹50 OFF on pantry & veggies",
  },
  {
    title: "100% Free 10-Min Delivery",
    discountType: "fixed",
    discountValue: 25,
    couponPrefix: "FREESHIP",
    minOrderValue: 199,
    description: "Zero delivery fee on your order",
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    let config = await RewardConfig.findOne({});
    if (!config) {
      config = await RewardConfig.create({
        isActive: true,
        dailyLimitPerUser: 1,
        availableRewards: DEFAULT_REWARDS,
      });
    } else if (!config.availableRewards || config.availableRewards.length === 0) {
      config.availableRewards = DEFAULT_REWARDS as any;
      await config.save();
    }

    const recentClaims = await ScratchReward.find({})
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 })
      .limit(20);

    const totalClaims = await ScratchReward.countDocuments({});

    return NextResponse.json({
      success: true,
      config,
      recentClaims,
      totalClaims,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    let config = await RewardConfig.findOne({});
    if (!config) {
      config = new RewardConfig(body);
    } else {
      if (body.isActive !== undefined) config.isActive = body.isActive;
      if (body.dailyLimitPerUser !== undefined) config.dailyLimitPerUser = body.dailyLimitPerUser;
      if (body.availableRewards) config.availableRewards = body.availableRewards;
    }

    await config.save();

    return NextResponse.json({
      success: true,
      config,
      message: "Reward configuration updated successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
