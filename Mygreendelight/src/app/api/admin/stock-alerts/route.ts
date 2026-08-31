import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import StockAlert from "@/model/stockAlert.model";
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

    const alerts = await StockAlert.find({ status: "pending" })
      .populate("grocery", "name image price stock category")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const { groceryId } = await req.json();
    await StockAlert.updateMany(
      { grocery: groceryId, status: "pending" },
      { status: "notified", notifiedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      message: "Harvest Restock Alerts sent to all waiting customers! 📩",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
