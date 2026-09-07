import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import Order from "@/model/order";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDb();

    const { id } = await context.params;

    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const query = session.user.id 
      ? { _id: session.user.id } 
      : { email: session.user.email };

    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const deliveryboyid = user._id;

    const assigment = await DeliveryAssignment.findById(id);

    if (!assigment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 }
      );
    }

    if (assigment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "Assignment already taken or expired" },
        { status: 400 }
      );
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedto: deliveryboyid,
      status: "assigned",
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        {
          message: "You already have an active order in progress",
        },
        {
          status: 400,
        }
      );
    }

    // Accept assignment
    assigment.assignedto = deliveryboyid;
    assigment.status = "assigned";
    assigment.acceptedat = new Date();

    await assigment.save();

    // Update order
    const order = await Order.findById(assigment.order);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // 🔑 Auto-generate 4-Digit Delivery OTP if not already generated
    const otp = order.deliveryOtp?.code || Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      verified: false,
      attempts: 0,
    };

    order.assigneddelliveryboy = deliveryboyid;
    order.assigment = assigment._id;
    order.status = "out of delivery";

    await order.save();

    // 🔔 Dispatch OTP to Customer via Email & SMS
    try {
      const populatedOrder = await Order.findById(order._id)
        .populate("user", "name email mobile")
        .populate("assigneddelliveryboy", "name mobile");
      const { sendDeliveryOtpNotification } = await import("@/lib/orderNotifications");
      await sendDeliveryOtpNotification(populatedOrder || order, user);
    } catch (notifErr) {
      console.warn("Delivery OTP notification dispatch note on accept:", notifErr);
    }

    // Remove other broadcasts for this order
    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assigment._id },
        broadcastedto: deliveryboyid,
        status: "broadcasted",
      },
      {
        $pull: {
          broadcastedto: deliveryboyid,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Order accepted successfully! Trip started.",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Accept assignment error:", error);

    return NextResponse.json(
      {
        message: error?.message || "Accept assignment error",
      },
      {
        status: 500,
      }
    );
  }
}
