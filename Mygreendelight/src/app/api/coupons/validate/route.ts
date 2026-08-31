import connectDb from "@/lib/db";
import Coupon from "@/model/coupon.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Please enter a coupon code" }, { status: 400 });
    }

    let coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      // Check ScratchReward collection
      const ScratchReward = (await import("@/model/reward.model")).default;
      const reward = await ScratchReward.findOne({
        couponCode: code.toUpperCase(),
        isUsed: false,
      });

      if (!reward) {
        return NextResponse.json(
          { success: false, message: "Invalid or expired coupon code" },
          { status: 404 }
        );
      }

      // Check reward expiry
      if (new Date(reward.expiresAt) < new Date()) {
        return NextResponse.json(
          { success: false, message: "This scratch reward coupon has expired" },
          { status: 400 }
        );
      }

      const minVal = reward.minOrderAmount || reward.minOrderValue || 199;
      if (subtotal < minVal) {
        return NextResponse.json(
          {
            success: false,
            message: `Minimum order of ₹${minVal} required for this reward coupon`,
          },
          { status: 400 }
        );
      }

      let discount = reward.discountAmount || reward.discountValue || 20;
      if (reward.discountType === "percent") {
        discount = Math.round((subtotal * discount) / 100);
      }
      if (discount > subtotal) discount = subtotal;

      return NextResponse.json({
        success: true,
        discount,
        couponCode: reward.couponCode,
        message: `🎉 Scratch Reward Applied! You saved ₹${discount}`,
      });
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ success: false, message: "This coupon has expired" }, { status: 400 });
    }

    // Check minimum order value
    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        message: `Minimum order of ₹${coupon.minOrderValue} required for this coupon`,
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Discount should not exceed subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }

    return NextResponse.json({
      success: true,
      discount,
      couponCode: coupon.code,
      message: `Coupon applied! You saved ₹${discount}`,
    });
  } catch (error) {
    console.error("Coupon Validate Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
