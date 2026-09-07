import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import Order from "@/model/order";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        {
          active: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const query = session.user.id 
      ? { _id: session.user.id } 
      : { email: session.user.email };

    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        {
          active: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 1. First check active DeliveryAssignment
    let activeAssignment = await DeliveryAssignment.findOne({
      assignedto: user._id,
      status: "assigned",
    })
      .populate("order")
      .lean();

    // 2. Fallback check: Direct Order assignment if DeliveryAssignment was desynced
    if (!activeAssignment || !activeAssignment.order) {
      const activeOrder = await Order.findOne({
        assigneddelliveryboy: user._id,
        status: { $in: ["out of delivery", "picked_up", "assigned", "pending"] },
      })
        .populate("user", "name email mobile")
        .lean();

      if (activeOrder) {
        // Auto-heal / create the DeliveryAssignment
        const newAssignment = await DeliveryAssignment.findOneAndUpdate(
          { order: activeOrder._id },
          {
            order: activeOrder._id,
            assignedto: user._id,
            status: "assigned",
            acceptedat: new Date(),
          },
          { upsert: true, new: true }
        );

        activeAssignment = {
          _id: newAssignment._id,
          order: activeOrder,
          assignedto: user._id,
          status: "assigned",
        } as any;
      }
    }

    // No active assignment found
    if (!activeAssignment || !activeAssignment.order) {
      return NextResponse.json(
        {
          active: false,
        },
        { status: 200 }
      );
    }

    const order = activeAssignment.order as any;

    // Order already delivered or cancelled
    if (!order || order.status === "delivered" || order.status === "cancelled") {
      await DeliveryAssignment.findByIdAndUpdate(activeAssignment._id, {
        status: order?.status === "delivered" ? "completed" : "broadcasted",
        assignedto: null,
      });

      return NextResponse.json(
        {
          active: false,
        },
        { status: 200 }
      );
    }

    // 🔒 Security: Hide secret OTP code from delivery rider
    if (order && order.deliveryOtp) {
      order.deliveryOtp = {
        expiresAt: order.deliveryOtp.expiresAt,
        verified: order.deliveryOtp.verified,
        attempts: order.deliveryOtp.attempts,
        code: undefined, // Stripped for security
      };
    }

    return NextResponse.json(
      {
        active: true,
        assigment: activeAssignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CURRENT ORDER ERROR:", error);

    return NextResponse.json(
      {
        active: false,
        message: "Current order error",
      },
      {
        status: 500,
      }
    );
  }
}
