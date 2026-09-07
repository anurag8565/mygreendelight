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

    // 🔑 If order is out for delivery or rider is assigned, guarantee OTP exists
    if ((order.status === "out of delivery" || order.assigneddelliveryboy) && !order.deliveryOtp?.code) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      order.deliveryOtp = {
        code: otp,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
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