import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
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

    const tippedOrders = await Order.find({ farmerTip: { $gt: 0 } })
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });

    const totalFund = tippedOrders.reduce((sum, o) => sum + (o.farmerTip || 0), 0);
    const avgTip = tippedOrders.length > 0 ? Math.round(totalFund / tippedOrders.length) : 0;

    return NextResponse.json({
      success: true,
      tippedOrders,
      stats: {
        totalFund,
        totalTippedOrders: tippedOrders.length,
        avgTip,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
