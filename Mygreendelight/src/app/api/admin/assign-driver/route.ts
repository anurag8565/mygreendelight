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

    const { orderId, driverId } = await req.json();

    if (!orderId || !driverId) {
      return NextResponse.json(
        { success: false, message: "Order ID and Driver ID are required" },
        { status: 400 }
      );
    }

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

    if (!driver) {
      return NextResponse.json(
        { success: false, message: "Delivery driver not found" },
        { status: 404 }
      );
    }

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
          acceptedAt: new Date(),
        },
        { new: true }
      );
    } else {
      assignment = await DeliveryAssignment.create({
        order: order._id,
        assignedto: driver._id,
        status: "assigned",
        acceptedAt: new Date(),
      });
      order.assigment = assignment._id;
    }

    await order.save();

    const populatedOrder = await Order.findById(orderId)
      .populate("user", "name email mobile")
      .populate("assigneddelliveryboy", "name mobile");

    return NextResponse.json({
      success: true,
      message: `Successfully assigned order to ${driver.name}`,
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
