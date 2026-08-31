import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { RewardConfig, ScratchReward } from "@/model/reward.model";
import Coupon from "@/model/coupon.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get("guestId");

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
        ],
      });
    }

    // Check if user already claimed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const filter: any = { createdAt: { $gte: startOfDay } };
    if (session?.user?.id) {
      filter.user = session.user.id;
    } else if (guestId) {
      filter.guestId = guestId;
    } else {
      filter.guestId = "guest-unregistered";
    }

    const todayClaim = await ScratchReward.findOne(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      config,
      todayClaim,
      canClaim: !todayClaim,
    });
  } catch (error: any) {
    console.error("Error in rewards API GET:", error);
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
    const body = await req.json().catch(() => ({}));
    const guestId = body.guestId || "guest-" + Math.random().toString(36).substring(2, 9);

    let config = await RewardConfig.findOne({});
    if (!config || !config.isActive) {
      return NextResponse.json(
        { success: false, message: "Rewards currently disabled" },
        { status: 400 }
      );
    }

    // Check if already claimed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const filter: any = { createdAt: { $gte: startOfDay } };
    if (session?.user?.id) {
      filter.user = session.user.id;
    } else {
      filter.guestId = guestId;
    }

    const existing = await ScratchReward.findOne(filter);
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyClaimed: true,
        reward: existing,
        message: "You already unlocked today's reward! Come back tomorrow.",
      });
    }

    // Pick random reward from config
    const rewards = config.availableRewards;
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
    const newReward = await ScratchReward.create({
      user: session?.user?.id || undefined,
      guestId,
      rewardTitle: selected.title,
      couponCode: code,
      discountType: selected.discountType,
      discountValue: selected.discountValue,
      minOrderValue: selected.minOrderValue,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      reward: newReward,
      message: `🎉 Congratulations! You won ${selected.title}!`,
    });
  } catch (error: any) {
    console.error("Error in rewards API POST:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
