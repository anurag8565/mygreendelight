import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import Grocery from "@/model/groseri.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // Ensure all referenced schemas are initialized in mongoose
    const [rawOrders, deliveryBoys] = await Promise.all([
      Order.find({})
        .populate("user", "name email mobile")
        .populate("assigneddelliveryboy", "name mobile email")
        .populate("assigment")
        .sort({ createdAt: -1 })
        .lean(),
      User.find({ role: "deliveryboy" }).select("name email mobile").lean(),
    ]);

    const orders = JSON.parse(JSON.stringify(rawOrders || []));

    return NextResponse.json(
      {
        success: true,
        orders,
        deliveryBoys: deliveryBoys || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Manage order error:", error);
    return NextResponse.json(
      { success: false, message: `Manage order error: ${error?.message || error}` },
      { status: 500 }
    );
  }
}