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

    const orders = await Order.find(orderFilter).limit(100);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = days.map((day) => ({
      day,
      deliveries: 0,
    }));

    orders.forEach((order: any) => {
      if (!order.updatedAt) return;
      const day = new Date(order.updatedAt).getDay();
      chartData[day].deliveries += 1;
    });

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Deliveries Chart Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
