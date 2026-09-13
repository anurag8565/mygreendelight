import connectDb from "@/lib/db";
import Order from "@/model/order";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import User from "@/model/user.model";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || ((session.user as any).role !== "deliveryboy" && (session.user as any).role !== "admin")) {
      return NextResponse.json(
        { message: "Unauthorized: Delivery driver or admin privileges required" },
        { status: 401 }
      );
    }

    const { orderId, otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "Order ID and OTP are required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Rate-limiting on verification attempts to prevent brute-force attacks
    const attempts = (order.deliveryOtp?.attempts || 0) + 1;
    if (attempts > 5) {
      return NextResponse.json(
        { 
          message: "Too many incorrect attempts. Please report to the dispatcher.",
          isLocked: true 
        },
        { status: 429 }
      );
    }

    if (!order.deliveryOtp?.code) {
      return NextResponse.json(
        { message: "OTP not generated for this order" },
        { status: 400 }
      );
    }

    if (order.deliveryOtp.code !== otp.trim()) {
      await Order.findByIdAndUpdate(orderId, {
        $inc: { "deliveryOtp.attempts": 1 },
      });

      return NextResponse.json(
        { 
          message: `Invalid OTP. ${Math.max(0, 5 - attempts)} attempt(s) remaining.`,
          attemptsRemaining: Math.max(0, 5 - attempts)
        },
        { status: 400 }
      );
    }

    if (order.deliveryOtp.expiresAt) {
      const now = new Date();
      if (now > new Date(order.deliveryOtp.expiresAt)) {
        return NextResponse.json(
          { message: "OTP has expired. Please request customer to refresh." },
          { status: 400 }
        );
      }
    }

    if (order.status === "delivered") {
      return NextResponse.json(
        { message: "Order already delivered" },
        { status: 400 }
      );
    }

    // Mark verified & delivered
    order.deliveryOtp.verified = true;
    order.status = "delivered";
    order.ispaid = true; // Auto-mark paid on verified delivery (both COD & Online)
    order.paymentStatus = "completed";

    await order.save();

    // 🔔 Notify Socket Server in Real-Time for Instant Order Status Update across dashboards
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    try {
      await fetch(`${socketUrl}/order-status-updated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id.toString(),
          status: "delivered",
          ispaid: true,
          paymentStatus: "completed",
        }),
        signal: AbortSignal.timeout(2000),
      });
    } catch (socketErr) {
      console.warn("Socket delivered ping note:", socketErr);
    }

    // Update assignment status
    if (order.assigment) {
      await DeliveryAssignment.findByIdAndUpdate(order.assigment, {
        status: "completed",
        assignedto: null,
      });
    }

    // Update rider stats
    if (order.assigneddelliveryboy) {
      const deliveryBoy = await User.findById(order.assigneddelliveryboy);

      if (deliveryBoy) {
        if (!deliveryBoy.deliveryStats) {
          deliveryBoy.deliveryStats = { totalDeliveries: 0, totalEarnings: 0 };
        }
        deliveryBoy.deliveryStats.totalDeliveries = (deliveryBoy.deliveryStats.totalDeliveries || 0) + 1;
        await deliveryBoy.save();
      }
    }

    // 🔔 Dispatch Delivered Push Notification to Customer via OneSignal
    try {
      const { sendOrderStatusPushNotification } = await import("@/lib/orderNotifications");
      const customerUserId = order.user ? String(order.user._id || order.user) : undefined;
      const customerName = order.address?.fullname || "Customer";
      await sendOrderStatusPushNotification(order._id.toString(), customerUserId, customerName, "delivered");
    } catch (pushErr) {
      console.warn("Delivery push dispatch warning:", pushErr);
    }

    return NextResponse.json({
      success: true,
      message: "Order Delivered Successfully & Verified!",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Verify OTP Error" },
      { status: 500 }
    );
  }
}