import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        activeOrder: null,
      });
    }

    const userId = session.user.id;

    // Find the latest active uncompleted order for this user
    const order = await Order.findOne({
      user: userId,
      status: { $in: ["pending", "out of delivery"] },
    })
      .sort({ createdAt: -1 })
      .populate("assigneddelliveryboy", "name mobile location")
      .lean();

    if (!order) {
      return NextResponse.json({
        success: true,
        activeOrder: null,
      });
    }

    const orderObj: any = { ...order };

    // Format safe response
    return NextResponse.json({
      success: true,
      activeOrder: {
        _id: String(orderObj._id),
        status: orderObj.status,
        totalamount: orderObj.totalamount,
        itemsCount: (orderObj.items || []).reduce(
          (acc: number, item: any) => acc + (item.quantity || 1),
          0
        ),
        paymentmethod: orderObj.paymentmethod,
        ispaid: orderObj.ispaid,
        address: {
          fullname: orderObj.address?.fullname,
          city: orderObj.address?.city || "Bhopal",
          fulladress: orderObj.address?.fulladress,
          latitude: orderObj.address?.latitude,
          longitude: orderObj.address?.longitude,
        },
        assigneddelliveryboy: orderObj.assigneddelliveryboy
          ? {
              _id: String(orderObj.assigneddelliveryboy._id),
              name: orderObj.assigneddelliveryboy.name,
              mobile: orderObj.assigneddelliveryboy.mobile,
              location: orderObj.assigneddelliveryboy.location,
            }
          : null,
        deliveryOtp: orderObj.deliveryOtp?.code
          ? {
              code: orderObj.deliveryOtp.code,
              verified: Boolean(orderObj.deliveryOtp.verified),
            }
          : null,
        deliverySlot: orderObj.deliverySlot || "15-20 Min Express",
        createdAt: orderObj.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Active order API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch active order",
      },
      { status: 500 }
    );
  }
}
