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

    // Atomic status transition from pending -> cancelled
    const cancelledOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: "pending",
        ...(session.user.role === "admin" ? {} : { user: session.user.id }),
      },
      {
        $set: {
          status: "cancelled",
          cancellationReason: reason || "Cancelled by customer",
        },
      },
      { new: true }
    );

    if (!cancelledOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order cannot be cancelled. It may already be processed, delivered, or cancelled.",
        },
        { status: 400 }
      );
    }

    const order = cancelledOrder;

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

      try {
        const UserWallet = (await import("@/model/wallet.model")).default;
        await UserWallet.findOneAndUpdate(
          { user: order.user },
          {
            $inc: { balance: order.walletDiscount },
            $push: {
              transactions: {
                type: "credit",
                amount: order.walletDiscount,
                description: `Refund for Cancelled Order #${order._id.toString().slice(-6).toUpperCase()}`,
                orderId: order._id.toString(),
                createdAt: new Date(),
              },
            },
          }
        );
      } catch (wErr) {
        console.warn("Wallet refund sync warning:", wErr);
      }
    }

    // 4. Cancel active DeliveryAssignment so riders don't deliver a cancelled order
    try {
      const DeliveryAssignment = (await import("@/model/Deliveryassigment.model")).default;
      await DeliveryAssignment.updateMany(
        { order: order._id, status: { $nin: ["completed", "cancelled"] } },
        { $set: { status: "cancelled", assignedto: null } }
      );
    } catch (dErr) {
      console.warn("Delivery assignment cancel note:", dErr);
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
