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

    // Touch models so Mongoose registers them in memory
    const _models = [User.modelName, DeliveryAssignment.modelName, Grocery.modelName, Order.modelName];
    if (!_models) console.log("Models loaded");

    let rawOrders = [];
    try {
      rawOrders = await Order.find({})
        .populate({ path: "user", model: User, select: "name email mobile", strictPopulate: false })
        .populate({ path: "assigneddelliveryboy", model: User, select: "name mobile email", strictPopulate: false })
        .populate({ path: "assigment", model: DeliveryAssignment, strictPopulate: false })
        .sort({ createdAt: -1 })
        .lean();
    } catch (popErr) {
      console.warn("Populate error, falling back to plain query:", popErr);
      rawOrders = await Order.find({}).sort({ createdAt: -1 }).lean();
    }

    const deliveryBoys = await User.find({ role: "deliveryboy" })
      .select("name email mobile")
      .lean();

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