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

    // 4-digit clean numeric OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    order.deliveryOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      verified: false,
    };

    await order.save();

    const customerEmail = (order.user as any)?.email;
    const customerPhone = (order.address as any)?.mobile || (order.user as any)?.mobile;
    const customerName = (order.address as any)?.fullname || (order.user as any)?.name || "Customer";

    if (customerEmail && customerEmail.includes("@")) {
      try {
        await sendMail(
          customerEmail,
          `SubziQuick Delivery OTP: ${otp} (Order #${orderId.slice(-6).toUpperCase()})`,
          `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #d1fae5; border-radius: 20px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="background: #ecfdf5; color: #065f46; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">SubziQuick Bhopal Doorstep Delivery</span>
              <h2 style="color: #0f8646; margin: 12px 0 4px 0; font-size: 22px;">Doorstep Verification OTP</h2>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Hi ${customerName}, your delivery partner is at your doorstep.</p>
            </div>

            <div style="background: #0f8646; border-radius: 16px; text-align: center; padding: 20px; margin: 20px 0; color: #ffffff;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0; opacity: 0.85;">Share this 4-Digit OTP with Rider</p>
              <h1 style="color: #ffffff; letter-spacing: 10px; margin: 0; font-size: 38px; font-family: monospace; font-weight: 900;">${otp}</h1>
            </div>

            <p style="color: #4b5563; font-size: 12px; text-align: center; line-height: 1.5; margin-bottom: 8px;">
              <strong>Note:</strong> Share this OTP only after verifying and inspecting your fresh produce.
            </p>
            <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">Valid for 15 minutes. SubziQuick Helpline: 9981418565</p>
          </div>
          `
        );
      } catch (mailErr) {
        console.warn("Mail send warning:", mailErr);
      }
    }

    if (process.env.FAST2SMS_API_KEY && customerPhone) {
      try {
        const cleanPhone = customerPhone.toString().replace(/[^0-9]/g, "").slice(-10);
        await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "otp",
            variables_values: otp,
            numbers: cleanPhone,
          }),
        });
      } catch (smsErr) {
        console.warn("Fast2SMS OTP dispatch warning:", smsErr);
      }
    }

    return NextResponse.json({
      success: true,
      otp,
      message: `OTP ${otp} generated and dispatched successfully!`,
    });
  } catch (error: any) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Send OTP Error" },
      { status: 500 }
    );
  }
}