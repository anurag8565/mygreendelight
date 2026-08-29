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
    })
      .sort({
        updatedAt: -1,
      })
      .limit(5);

    const formatted = orders.map((order: any) => ({
      _id: order._id,
      createdAt: order.updatedAt,
      totalamount: order.totalamount,
      status: order.status,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json([], {
      status: 500,
    });
  }
}