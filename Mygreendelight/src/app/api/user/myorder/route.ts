import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in to view orders" },
        { status: 401 }
      );
    }

    // Resolve user by ID or email
    let userIds: any[] = [];
    if (session.user.id) {
      userIds.push(session.user.id);
    }
    if (session.user.email) {
      const cleanEmail = session.user.email.trim().toLowerCase();
      const users = await User.find({
        email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
      }).select("_id");
      for (const u of users) {
        if (!userIds.some((id) => id.toString() === u._id.toString())) {
          userIds.push(u._id);
        }
      }
    }

    const orders = await Order.find({ user: { $in: userIds } })
      .populate("user", "name email mobile")
      .populate("assigneddelliveryboy", "name mobile")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders || [], { status: 200 });
  } catch (error) {
    console.error("My orders fetch error:", error);
    return NextResponse.json({ success: false, message: `Failed to fetch orders: ${error}` }, { status: 500 });
  }
}