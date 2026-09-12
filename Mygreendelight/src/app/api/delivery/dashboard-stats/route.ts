import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const query = session.user.id ? { _id: session.user.id } : { email: session.user.email };
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderFilter: any = {
      status: "delivered",
      updatedAt: { $gte: today },
    };

    if (user.role === "deliveryboy") {
      orderFilter.assigneddelliveryboy = user._id;
    }

    const completedToday = await Order.countDocuments(orderFilter);
    const totalDeliveries = user.deliveryStats?.totalDeliveries || (user.role === "admin" ? await Order.countDocuments({ status: "delivered" }) : 0);
    const totalEarnings = user.deliveryStats?.totalEarnings || (totalDeliveries * 35);

    return NextResponse.json({
      stats: {
        totalDeliveries,
        totalEarnings,
        todayEarnings: completedToday * 35,
        earningPerDelivery: 35,
      },
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return NextResponse.json(
      {
        stats: {
          totalDeliveries: 0,
          totalEarnings: 0,
          todayEarnings: 0,
          earningPerDelivery: 100,
        }
      },
      { status: 200 }
    );
  }
}
