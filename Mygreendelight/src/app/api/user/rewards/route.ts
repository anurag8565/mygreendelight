import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { RewardConfig, ScratchReward } from "@/model/reward.model";
import Coupon from "@/model/coupon.model";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session error in rewards GET:", sErr);
    }

    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get("guestId");

    let config = null;
    try {
      config = await RewardConfig.findOne({});
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
            {
              title: "Flat ₹50 Mega Discount",
              discountType: "fixed",
              discountValue: 50,
              couponPrefix: "BHOPAL50",
              minOrderValue: 499,
              description: "Flat ₹50 OFF on pantry & veggies",
            },
            {
              title: "100% Free Express Delivery",
              discountType: "fixed",
              discountValue: 25,
              couponPrefix: "FREESHIP",
              minOrderValue: 199,
              description: "Zero delivery fee on your order",
            },
          ],
        });
      }
    } catch (cErr) {
      console.warn("Config load error in rewards GET:", cErr);
    }

    // Check if user already claimed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const filter: any = { createdAt: { $gte: startOfDay } };
    const userId = session?.user?.id;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = new mongoose.Types.ObjectId(userId);
    } else if (guestId) {
      filter.guestId = guestId;
    } else {
      filter.guestId = "guest-unregistered";
    }

    let todayClaim = null;
    try {
      todayClaim = await ScratchReward.findOne(filter).sort({ createdAt: -1 });
    } catch (fErr) {
      console.warn("ScratchReward find error:", fErr);
    }

    return NextResponse.json({
      success: true,
      config: config || {
        isActive: true,
        availableRewards: [],
      },
      todayClaim,
      canClaim: !todayClaim,
    });
  } catch (error: any) {
    console.error("Error in rewards API GET:", error);
    return NextResponse.json(
      { 
        success: true, 
        config: { isActive: true, availableRewards: [] },
        todayClaim: null,
        canClaim: true,
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session error in rewards POST:", sErr);
    }
    const body = await req.json().catch(() => ({}));
    const guestId = body.guestId || "guest-" + Math.random().toString(36).substring(2, 9);

    let config = null;
    try {
      config = await RewardConfig.findOne({});
    } catch (cErr) {
      console.warn("RewardConfig find error in POST:", cErr);
    }
    if (!config) {
      try {
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
            {
              title: "Flat ₹50 Mega Discount",
              discountType: "fixed",
              discountValue: 50,
              couponPrefix: "BHOPAL50",
              minOrderValue: 499,
              description: "Flat ₹50 OFF on pantry & veggies",
            },
            {
              title: "100% Free Express Delivery",
              discountType: "fixed",
              discountValue: 25,
              couponPrefix: "FREESHIP",
              minOrderValue: 199,
              description: "Zero delivery fee on your order",
            },
          ],
        });
      } catch (err) {
        console.warn("RewardConfig create error:", err);
      }
    }

    if (config && !config.isActive) {
      config.isActive = true;
      await config.save().catch(() => {});
    }

    // Check if already claimed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const filter: any = { createdAt: { $gte: startOfDay } };
    const userId = session?.user?.id;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = new mongoose.Types.ObjectId(userId);
    } else {
      filter.guestId = guestId;
    }

    let existing = null;
    try {
      existing = await ScratchReward.findOne(filter);
    } catch (eErr) {
      console.warn("ScratchReward find error in POST:", eErr);
    }
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyClaimed: true,
        reward: existing,
        message: "You already unlocked today's reward! Come back tomorrow.",
      });
    }

    // Pick random reward from config
    const rewards = (config?.availableRewards && config.availableRewards.length > 0)
      ? config.availableRewards
      : [
          {
            title: "Flat ₹30 Instant OFF",
            discountType: "fixed",
            discountValue: 30,
            couponPrefix: "FARM30",
            minOrderValue: 249,
            description: "Flat ₹30 discount on orders above ₹249",
          },
        ];
    const selected = rewards[Math.floor(Math.random() * rewards.length)];

    // Generate unique real coupon code
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const code = `${selected.couponPrefix || "LUCKY"}${randomSuffix}`.toUpperCase();

    // 48 hours expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Create real coupon in MongoDB Coupon collection
    await Coupon.create({
      code,
      discountType: selected.discountType === "percent" ? "percentage" : "flat",
      discountValue: selected.discountValue,
      minOrderAmount: selected.minOrderValue || 199,
      maxDiscountAmount: selected.discountType === "percent" ? 100 : selected.discountValue,
      expiryDate: expiresAt,
      usageLimit: 1,
      usedCount: 0,
      isActive: true,
      description: selected.description,
    }).catch((e) => console.log("Coupon create note:", e.message));

    // Save ScratchReward
    const rewardPayload: any = {
      guestId,
      rewardTitle: selected.title,
      couponCode: code,
      discountType: selected.discountType,
      discountValue: selected.discountValue,
      minOrderValue: selected.minOrderValue,
      expiresAt,
    };
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      rewardPayload.user = new mongoose.Types.ObjectId(userId);
    }

    const newReward = await ScratchReward.create(rewardPayload);

    return NextResponse.json({
      success: true,
      reward: newReward,
      message: `🎉 Congratulations! You won ${selected.title}!`,
    });
  } catch (error: any) {
    console.error("Error in rewards API POST:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate reward" },
      { status: 500 }
    );
  }
}
