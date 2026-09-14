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

    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: Session required to track order" },
        { status: 401 }
      );
    }

    const userId = session.user.id || "";
    const userRole = (session.user as any)?.role || "user";
    const isOwner = order.user && String(order.user) === String(userId);
    const isAssignedRider = order.assigneddelliveryboy && String(order.assigneddelliveryboy._id || order.assigneddelliveryboy) === String(userId);
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAssignedRider && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: You are not authorized to view this order" },
        { status: 403 }
      );
    }

    const isDeliveryBoy = userRole === "deliveryboy" || isAssignedRider;

    // 🔒 Real Email OTP Security: Never expose raw OTP to delivery riders
    const hasOtp = Boolean(orderObj.deliveryOtp?.code);
    const isOtpVerified = Boolean(orderObj.deliveryOtp?.verified);

    if (orderObj.deliveryOtp) {
      orderObj.deliveryOtp = {
        code: isDeliveryBoy ? undefined : orderObj.deliveryOtp.code,
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
