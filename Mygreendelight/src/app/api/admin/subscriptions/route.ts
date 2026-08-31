import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Subscription from "@/model/subscription.model";
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

    const subscriptions = await Subscription.find({})
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });

    const activeCount = subscriptions.filter((s) => s.status === "active").length;
    const pausedCount = subscriptions.filter((s) => s.status === "paused").length;
    const totalDailyRevenue = subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.totalPerDelivery, 0);

    return NextResponse.json({
      success: true,
      subscriptions,
      stats: {
        total: subscriptions.length,
        active: activeCount,
        paused: pausedCount,
        dailyRevenue: totalDailyRevenue,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
