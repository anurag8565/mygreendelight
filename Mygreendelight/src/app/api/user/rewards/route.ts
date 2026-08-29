import { auth } from "@/auth";
import connectDb from "@/lib/db";
import ScratchReward from "@/model/reward.model";
import Coupon from "@/model/coupon.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!session?.user?.id && !orderId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let query: any = {};
    if (orderId) {
      query.order = orderId;
    } else if (session?.user?.id) {
      query.user = session.user.id;
    }

    const rewards = await ScratchReward.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, rewards });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json({ success: false, message: "Reward ID required" }, { status: 400 });
    }

    const reward = await ScratchReward.findById(rewardId);
    if (!reward) {
      return NextResponse.json({ success: false, message: "Reward not found" }, { status: 404 });
    }

    if (!reward.isScratched) {
      reward.isScratched = true;
      reward.scratchedAt = new Date();
      await reward.save();

      // Ensure valid active coupon exists in MongoDB Coupon collection
      const existingCoupon = await Coupon.findOne({ code: reward.couponCode });
      if (!existingCoupon) {
        await Coupon.create({
          code: reward.couponCode,
          discountType: "fixed",
          discountValue: reward.discountAmount,
          minOrderValue: reward.minOrderAmount || 199,
          expiryDate: reward.expiresAt,
          isActive: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reward unlocked successfully!",
      reward,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
