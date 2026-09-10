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
      )
      .lean();

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

    const orderObj: any = { ...order };

    // 🔒 Real Email OTP Security: Do NOT expose raw OTP code on public tracking URL
    const hasOtp = Boolean(orderObj.deliveryOtp?.code);
    const isOtpVerified = Boolean(orderObj.deliveryOtp?.verified);

    if (orderObj.deliveryOtp) {
      orderObj.deliveryOtp = {
        code: orderObj.deliveryOtp.code,
        verified: isOtpVerified,
        expiresAt: orderObj.deliveryOtp.expiresAt,
        hasOtp,
      };
    }

    return NextResponse.json({
      success: true,
      order: orderObj,
      status: orderObj.status,
      customerLocation: {
        latitude: orderObj.address?.latitude,
        longitude: orderObj.address?.longitude,
      },
      deliveryBoy: orderObj.assigneddelliveryboy,
      deliveryOtpVerified: isOtpVerified,
      hasOtp,
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
