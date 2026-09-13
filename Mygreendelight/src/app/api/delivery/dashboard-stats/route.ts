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

    const todayOrders = await Order.find(orderFilter);
    const completedToday = todayOrders.length;

    // Real dynamic calculations from database orders
    const todayEarnings = todayOrders.reduce((sum: number, o: any) => {
      const base = 35;
      const tip = Number(o.farmerTip) || 0;
      return sum + base + tip;
    }, 0);

    const todayCodCash = todayOrders
      .filter((o: any) => o.paymentmethod === "cod")
      .reduce((sum: number, o: any) => sum + (Number(o.totalamount) || 0), 0);

    const totalDeliveries = user.deliveryStats?.totalDeliveries || (user.role === "admin" ? await Order.countDocuments({ status: "delivered" }) : 0);
    const totalEarnings = user.deliveryStats?.totalEarnings || (totalDeliveries * 35);

    return NextResponse.json({
      stats: {
        todayDeliveries: completedToday,
        totalDeliveries,
        totalEarnings,
        todayEarnings,
        todayCodCash,
        earningPerDelivery: 35,
        salaryType: "Monthly Fixed Salary",
      },
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return NextResponse.json(
      {
        stats: {
          todayDeliveries: 0,
          totalDeliveries: 0,
          totalEarnings: 0,
          todayEarnings: 0,
          todayCodCash: 0,
          earningPerDelivery: 35,
          salaryType: "Monthly Fixed Salary",
        }
      },
      { status: 200 }
    );
  }
}
