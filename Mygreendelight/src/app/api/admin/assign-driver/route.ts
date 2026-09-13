import connectDb from "@/lib/db";
import Order from "@/model/order";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import User from "@/model/user.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const rawBody = await req.json();
    const { assignDriverSchema } = await import("@/lib/validations/zodSchemas");
    const parsed = assignDriverSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid Order or Driver ID" },
        { status: 400 }
      );
    }

    const { orderId, driverId } = parsed.data;

    const [order, driver] = await Promise.all([
      Order.findById(orderId),
      User.findOne({ _id: driverId, role: "deliveryboy" })
    ]);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status === "delivered" || order.status === "completed") {
      return NextResponse.json(
        { success: false, message: "Cannot assign or change driver for an already delivered order." },
        { status: 400 }
      );
    }

    if (!driver) {
      return NextResponse.json(
        { success: false, message: "Delivery driver not found" },
        { status: 404 }
      );
    }

    // 🔑 Auto-generate 4-Digit Delivery OTP if not already generated
    const otp = order.deliveryOtp?.code || Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      verified: false,
      attempts: 0,
    };

    // Assign to driver and update status
    order.assigneddelliveryboy = driver._id;
    order.status = "out of delivery";

    // Update or create DeliveryAssignment
    let assignment = null;
    if (order.assigment) {
      assignment = await DeliveryAssignment.findByIdAndUpdate(
        order.assigment,
        {
          assignedto: driver._id,
          status: "assigned",
          acceptedat: new Date(),
        },
        { new: true }
      );
    } else {
      assignment = await DeliveryAssignment.create({
        order: order._id,
        assignedto: driver._id,
        status: "assigned",
        acceptedat: new Date(),
      });
      order.assigment = assignment._id;
    }

    await order.save();

    const populatedOrder = await Order.findById(orderId)
      .populate("user", "name email mobile")
      .populate("assigneddelliveryboy", "name mobile location isonline");

    // 🔔 Notify Socket Server in Real-Time for Instant Rider Dispatch Ping
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    try {
      const sanitizedOrder = { ...populatedOrder.toObject() };
      if (sanitizedOrder.deliveryOtp) {
        sanitizedOrder.deliveryOtp.code = undefined;
      }

      await fetch(`${socketUrl}/send-assignment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryBoyId: driver._id.toString(),
          assignment: {
            _id: assignment?._id,
            order: sanitizedOrder,
            assignedto: driver._id,
            status: "assigned",
          },
        }),
        signal: AbortSignal.timeout(2000),
      });
    } catch (socketErr) {
      console.warn("Socket assignment ping note:", socketErr);
    }

    // 🔔 Dispatch OTP to Customer via Email & SMS
    try {
      const { sendDeliveryOtpNotification } = await import("@/lib/orderNotifications");
      await sendDeliveryOtpNotification(populatedOrder, driver);
    } catch (notifErr) {
      console.warn("Delivery OTP notification dispatch note:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned order to ${driver.name}. Delivery OTP (${otp}) dispatched to customer.`,
      otp,
      order: populatedOrder
    });
  } catch (error: any) {
    console.error("Assign Driver Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to assign driver" },
      { status: 500 }
    );
  }
}
