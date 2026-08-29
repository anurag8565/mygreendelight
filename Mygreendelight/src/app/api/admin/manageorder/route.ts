import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const [orders, deliveryBoys] = await Promise.all([
      Order.find({})
        .populate("user", "name email mobile")
        .populate("assigneddelliveryboy", "name mobile email")
        .populate("assigment")
        .sort({ createdAt: -1 }),
      User.find({ role: "deliveryboy" }).select("name email mobile")
    ]);

    return NextResponse.json({
      success: true,
      orders,
      deliveryBoys
    }, { status: 200 });
  } catch (error) {
    console.error("Manage order error:", error);
    return NextResponse.json(
      { success: false, message: `Manage order error: ${error}` },
      { status: 500 }
    );
  }
}