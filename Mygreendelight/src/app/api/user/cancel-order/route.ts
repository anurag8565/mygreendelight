import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import Grocery from "@/model/groseri.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { orderId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.user.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "You are not authorized to cancel this order." },
        { status: 403 }
      );
    }

    // Only pending orders can be cancelled by user
    if (order.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: `Order cannot be cancelled because it is already ${order.status}.`,
        },
        { status: 400 }
      );
    }

    // 1. Mark status as cancelled
    order.status = "cancelled";
    order.cancellationReason = reason || "Cancelled by customer";
    await order.save();

    // 2. Automatically Restore Produce Stock in MongoDB
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        if (item.grocery) {
          if (item.variationWeight) {
            await Grocery.updateOne(
              { _id: item.grocery, "variations.weight": item.variationWeight },
              { $inc: { "variations.$.stock": item.quantity } }
            );
          } else {
            await Grocery.updateOne(
              { _id: item.grocery },
              { $inc: { stock: item.quantity } }
            );
          }
        }
      }
    }

    // 3. Refund GreenPoints wallet if used
    if (order.walletDiscount && order.walletDiscount > 0) {
      await User.findByIdAndUpdate(order.user, {
        $inc: { walletBalance: order.walletDiscount },
        $push: {
          walletHistory: {
            amount: order.walletDiscount,
            type: "credit",
            description: `Refund for Cancelled Order #${order._id.toString().slice(-6).toUpperCase()}`,
            date: new Date(),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully and inventory restored.",
      order,
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
