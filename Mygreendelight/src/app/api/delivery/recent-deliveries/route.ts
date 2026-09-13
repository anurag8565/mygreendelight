import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();
    const query = session?.user?.id ? { _id: session.user.id } : { email: session?.user?.email };
    const user = session ? await User.findOne(query) : null;

    const orderFilter: any = {
      status: "delivered",
    };

    if (user && user.role === "deliveryboy") {
      orderFilter.assigneddelliveryboy = user._id;
    }

    const orders = await Order.find(orderFilter)
      .sort({ updatedAt: -1 })
      .limit(10);

    const formatted = orders.map((order: any) => {
      const payout = 35 + (Number(order.farmerTip) || 0) + ((Number(order.bagsReturned) || 0) * 10);
      return {
        _id: order._id,
        createdAt: order.updatedAt || order.createdAt,
        totalamount: order.totalamount,
        status: order.status,
        payout,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Recent Deliveries Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
