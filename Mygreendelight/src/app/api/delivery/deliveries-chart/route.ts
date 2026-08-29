import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    const deliveryBoyId = session?.user?.id;

    const orders = await Order.find({
      assigneddelliveryboy: deliveryBoyId,
      status: "delivered",
    });

    const days = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

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
    return NextResponse.json([], {
      status: 500,
    });
  }
}