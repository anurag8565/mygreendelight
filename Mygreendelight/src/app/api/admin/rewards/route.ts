import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { RewardConfig, ScratchReward } from "@/model/reward.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

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
        availableRewards: [
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
        ],
      });
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
