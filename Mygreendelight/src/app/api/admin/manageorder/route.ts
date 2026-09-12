import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import Grocery from "@/model/groseri.model";
import Chat from "@/model/Chat.model";
import Message from "@/model/Message.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    // Touch models so Mongoose registers them in memory
    const _models = [User.modelName, DeliveryAssignment.modelName, Grocery.modelName, Order.modelName];
    if (!_models) console.log("Models loaded");

    let rawOrders = [];
    try {
      rawOrders = await Order.find({})
        .populate({ path: "user", model: User, select: "name email mobile", strictPopulate: false })
        .populate({ path: "assigneddelliveryboy", model: User, select: "name mobile email location isonline", strictPopulate: false })
        .populate({ path: "assigment", model: DeliveryAssignment, strictPopulate: false })
        .sort({ createdAt: -1 })
        .lean();
    } catch (popErr) {
      console.warn("Populate error, falling back to plain query:", popErr);
      rawOrders = await Order.find({}).sort({ createdAt: -1 }).lean();
    }

    const deliveryBoys = await User.find({ role: "deliveryboy" })
      .select("name email mobile location isonline")
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

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty if params are in query
    }

    const orderId = body?.orderId || searchParams.get("orderId");
    const clearAll = body?.clearAll === true || searchParams.get("clearAll") === "true";

    if (clearAll) {
      // 1. Delete all Chats and Messages
      const chats = await Chat.find({}).lean();
      const chatIds = chats.map((c: any) => c._id);
      if (chatIds.length > 0) {
        await Message.deleteMany({ chat: { $in: chatIds } });
        await Chat.deleteMany({});
      }

      // 2. Delete all Delivery Assignments
      await DeliveryAssignment.deleteMany({});

      // 3. Delete all Orders
      const deleteResult = await Order.deleteMany({});

      // 4. Reset delivery stats for delivery boys
      await User.updateMany(
        { role: "deliveryboy" },
        { $set: { "deliveryStats.totalDeliveries": 0, "deliveryStats.totalEarnings": 0 } }
      );

      return NextResponse.json(
        {
          success: true,
          message: `All test orders (${deleteResult.deletedCount}) and associated data removed successfully.`,
          deletedCount: deleteResult.deletedCount,
        },
        { status: 200 }
      );
    }

    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }

      // Delete associated chat and messages
      const chats = await Chat.find({ order: orderId }).lean();
      const chatIds = chats.map((c: any) => c._id);
      if (chatIds.length > 0) {
        await Message.deleteMany({ chat: { $in: chatIds } });
        await Chat.deleteMany({ _id: { $in: chatIds } });
      }

      // Delete assignment
      await DeliveryAssignment.deleteMany({ order: orderId });

      // Delete order
      await Order.findByIdAndDelete(orderId);

      return NextResponse.json(
        {
          success: true,
          message: `Order #${String(orderId).slice(-6).toUpperCase()} deleted successfully.`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Missing orderId or clearAll parameter" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { success: false, message: `Delete order error: ${error?.message || error}` },
      { status: 500 }
    );
  }
}