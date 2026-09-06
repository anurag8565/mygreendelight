import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in to view orders" },
        { status: 401 }
      );
    }

    const orders = await Order.find({ user: session.user.id })
      .populate("user", "name email mobile")
      .populate("assigneddelliveryboy", "name mobile")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders || [], { status: 200 });
  } catch (error) {
    console.error("My orders fetch error:", error);
    return NextResponse.json({ success: false, message: `Failed to fetch orders: ${error}` }, { status: 500 });
  }
}