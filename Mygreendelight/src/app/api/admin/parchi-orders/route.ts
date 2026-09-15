import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ParchiOrder from "@/model/parchiOrder.model";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const orders = await ParchiOrder.find()
      .populate("assignedDeliveryBoy", "name mobile email")
      .sort({ createdAt: -1 })
      .lean();

    const pendingCount = await ParchiOrder.countDocuments({ status: "pending" });

    return NextResponse.json({
      success: true,
      orders,
      pendingCount,
    });
  } catch (error: any) {
    console.error("Admin parchi fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch parchi orders" },
      { status: 500 }
    );
  }
}
