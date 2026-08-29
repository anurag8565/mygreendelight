import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await Order.countDocuments({
      assigneddelliveryboy: user._id,
      status: "delivered",
      updatedAt: { $gte: today },
    });

    return NextResponse.json({
      stats: {
        totalDeliveries:
          user.deliveryStats?.totalDeliveries || 0,
        totalEarnings:
          user.deliveryStats?.totalEarnings || 0,
        todayEarnings: completedToday * 100,
        earningPerDelivery: 100,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Dashboard Error" },
      { status: 500 }
    );
  }
}