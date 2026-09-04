import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Coupon from "@/model/coupon.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();

    // Fetch all active coupons
    let coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: new Date() },
    }).sort({ discountValue: -1 }).lean();

    // If no coupons exist in DB yet, return attractive default Bhopal starter coupons
    if (!coupons || coupons.length === 0) {
      coupons = [
        {
          _id: "starter-1",
          code: "WELCOME50",
          discountType: "fixed",
          discountValue: 50,
          minOrderValue: 249,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        {
          _id: "starter-2",
          code: "FRESH10",
          discountType: "percentage",
          discountValue: 10,
          minOrderValue: 199,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        {
          _id: "starter-3",
          code: "BHOPALFRESH",
          discountType: "fixed",
          discountValue: 30,
          minOrderValue: 179,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        {
          _id: "starter-4",
          code: "MEGAFARM75",
          discountType: "fixed",
          discountValue: 75,
          minOrderValue: 499,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        }
      ] as any;
    }

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error: any) {
    console.error("Error fetching all coupons:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}
