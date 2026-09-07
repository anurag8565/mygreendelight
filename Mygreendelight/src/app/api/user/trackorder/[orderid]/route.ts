import connectDb from "@/lib/db";
import Order from "@/model/order";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderid: string }> }
) {
  try {
    await connectDb();

    const { orderid } = await params;

    const order = await Order.findById(orderid)
      .populate(
        "assigneddelliveryboy",
        "name mobile location"
      );

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    // 🔑 Self-Healing: Guarantee 4-Digit Delivery OTP exists for all ongoing orders
    if (order.status !== "delivered" && order.status !== "cancelled" && !order.deliveryOtp?.code) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      order.deliveryOtp = {
        code: otp,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        verified: false,
        attempts: 0,
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      order,
      status: order.status,
      customerLocation: {
        latitude: order.address?.latitude,
        longitude: order.address?.longitude,
      },
      deliveryBoy: order.assigneddelliveryboy,
      deliveryOtpVerified: Boolean(order.deliveryOtp?.verified),
    });

  } catch (error) {
    return NextResponse.json(
      {
        message: `Track order error ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
