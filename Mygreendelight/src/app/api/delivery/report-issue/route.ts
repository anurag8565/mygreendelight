import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (
      !session?.user ||
      ((session.user as any).role !== "deliveryboy" && (session.user as any).role !== "admin")
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Delivery driver or admin privileges required" },
        { status: 401 }
      );
    }

    const { orderId, issueReason, notes } = await req.json();

    if (!orderId || !issueReason) {
      return NextResponse.json(
        { success: false, message: "Order ID and issue reason are required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status === "delivered") {
      return NextResponse.json(
        { success: false, message: "Cannot report issue on an already delivered order" },
        { status: 400 }
      );
    }

    const noteText = notes?.trim() ? ` — Notes: ${notes.trim()}` : "";
    const fullReason = `[Rider Report: ${issueReason}]${noteText}`;

    // Update order with issue/cancellation details
    order.cancellationReason = fullReason;

    // If customer explicitly refused or requested cancellation, mark cancelled, otherwise return to pending for re-dispatch
    if (issueReason.toLowerCase().includes("refused") || issueReason.toLowerCase().includes("cancel")) {
      order.status = "cancelled";
    } else {
      order.status = "pending";
    }

    order.assigneddelliveryboy = undefined;
    await order.save();

    // Release/complete assignment so driver is unblocked
    if (order.assigment) {
      await DeliveryAssignment.findByIdAndUpdate(order.assigment, {
        status: "completed",
        assignedto: null,
      });
    }

    // Also clear any other assignment records for this order
    await DeliveryAssignment.updateMany(
      { order: order._id },
      { status: "completed", assignedto: null }
    );

    // Broadcast status update to Admin Panel and Customer tracking via Socket
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    try {
      await fetch(`${socketUrl}/order-status-updated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id.toString(),
          status: order.status,
          cancellationReason: fullReason,
        }),
        signal: AbortSignal.timeout(2000),
      });
    } catch (socketErr) {
      console.warn("Socket notification note on issue report:", socketErr);
    }

    return NextResponse.json({
      success: true,
      message: "Delivery issue reported successfully. Order updated.",
    });

  } catch (error: any) {
    console.error("Report Issue API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to report delivery issue" },
      { status: 500 }
    );
  }
}
