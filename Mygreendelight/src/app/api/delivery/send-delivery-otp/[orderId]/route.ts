import connectDb from "@/lib/db";
import Order from "@/model/order";
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
    const order = await Order.findById(orderId)
      .populate("user", "name email mobile")
      .populate("assigneddelliveryboy", "name mobile");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const customerEmail = (order.user as any)?.email || order.address?.mobile ? `${(order.user as any)?.email || ""}` : "";

    // Generate fresh 4-digit on-demand numeric OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    order.deliveryOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins validity
      verified: false,
      attempts: 0,
    };

    await order.save();

    // 📧 Real Email Dispatch using Nodemailer
    try {
      const { sendDeliveryOtpNotification } = await import("@/lib/orderNotifications");
      await sendDeliveryOtpNotification(order);
    } catch (notifErr) {
      console.warn("Delivery OTP email dispatch warning:", notifErr);
    }

    const targetEmail = (order.user as any)?.email || "your registered email";

    return NextResponse.json({
      success: true,
      message: `✅ 4-Digit Delivery OTP sent to customer's email (${targetEmail}). Ask customer to check inbox.`,
    });
  } catch (error: any) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to dispatch email OTP" },
      { status: 500 }
    );
  }
}
