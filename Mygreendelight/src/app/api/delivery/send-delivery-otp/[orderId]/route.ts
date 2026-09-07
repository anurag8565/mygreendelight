import connectDb from "@/lib/db";
import Order from "@/model/order";
import { sendMail } from "@/lib/mailer";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      orderId: string;
    }>;
  }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: Session required" },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const userRole = (session.user as any).role;
    const isCustomer = (order.user as any)?._id?.toString() === userId || (order.user as any)?.toString() === userId;
    const isAssignedRider = order.assigneddelliveryboy?.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isCustomer && !isAssignedRider && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Not authorized to request delivery OTP for this order" },
        { status: 403 }
      );
    }

    // 4-digit clean numeric OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    order.deliveryOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      verified: false,
      attempts: 0,
    };

    await order.save();

    // 🔔 Dispatch OTP via unified Email & SMS
    try {
      const { sendDeliveryOtpNotification } = await import("@/lib/orderNotifications");
      await sendDeliveryOtpNotification(order);
    } catch (notifErr) {
      console.warn("Delivery OTP dispatch warning:", notifErr);
    }

    return NextResponse.json({
      success: true,
      otp,
      message: `Delivery OTP (${otp}) dispatched successfully to customer!`,
    });
  } catch (error: any) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Send OTP Error" },
      { status: 500 }
    );
  }
}