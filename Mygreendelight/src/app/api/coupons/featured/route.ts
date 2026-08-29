import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Coupon from "@/model/coupon.model";

export async function GET() {
  try {
    await connectDb();

    // Fetch the latest active and non-expired coupon
    const featuredCoupon = await Coupon.findOne({
      isActive: true,
      expiryDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!featuredCoupon) {
      return NextResponse.json({
        success: true,
        coupon: {
          code: "FRESH10",
          discountType: "percentage",
          discountValue: 10,
          minOrderValue: 199,
        },
      });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: featuredCoupon.code,
        discountType: featuredCoupon.discountType,
        discountValue: featuredCoupon.discountValue,
        minOrderValue: featuredCoupon.minOrderValue,
      },
    });
  } catch (error: any) {
    console.error("Error fetching featured coupon:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}
