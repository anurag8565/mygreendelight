import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formatted = orders.map((o: any) => ({
      _id: o._id ? o._id.toString() : "",
      id: o._id ? o._id.toString().slice(-6) : "",
      customer: o.address?.fullname || o.user?.name || "Customer",
      totalamount: o.totalamount || 0,
      amount: o.totalamount || 0,
      status: o.status || "pending",
      paymentmethod: o.paymentmethod || "cod",
      ispaid: o.ispaid || false,
      itemsCount: o.items?.length || 1,
      createdAt: o.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Recent orders error:", error);
    return NextResponse.json(
      { message: "Recent orders error" },
      { status: 500 }
    );
  }
}
