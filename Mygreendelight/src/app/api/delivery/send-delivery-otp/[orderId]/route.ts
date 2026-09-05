import connectDb from "@/lib/db";
import Order from "@/model/order";
import { sendMail } from "@/lib/mailer";
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

    const { orderId } = await context.params;
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    order.deliveryOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    };

    await order.save();

    if (order.user?.email) {
      try {
        await sendMail(
          order.user.email,
          "SubziQuick Bhopal - Delivery Verification OTP",
          `
          <div style="font-family:sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
            <h2 style="color: #0f8646; margin-bottom: 8px;">SubziQuick Bhopal Delivery OTP</h2>
            <p style="color: #4b5563; font-size: 14px;">Your delivery partner is at your doorstep. Please share this verification OTP with the rider:</p>
            <div style="background-color: #f0fdf4; border: 1px dashed #0f8646; border-radius: 12px; text-align: center; padding: 16px; margin: 20px 0;">
              <h1 style="color: #0f8646; letter-spacing: 6px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 12px;">Share this OTP only after inspecting your produce. Valid for 10 minutes.</p>
          </div>
          `
        );
      } catch (mailErr) {
        console.warn("Mail send warning:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      otp, // return for testing/fallback
    });
  } catch (error: any) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Send OTP Error" },
      { status: 500 }
    );
  }
}