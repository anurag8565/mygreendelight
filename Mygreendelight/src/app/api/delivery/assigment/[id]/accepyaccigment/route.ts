import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import Order from "@/model/order";
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

    const deliveryboyid = session?.user?.id;

    if (!deliveryboyid) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const assigment = await DeliveryAssignment.findById(id);

    if (!assigment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 }
      );
    }

    if (assigment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "Assignment expired" },
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
          message: "You already have an active order",
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
      await sendDeliveryOtpNotification(populatedOrder || order);
    } catch (notifErr) {
      console.warn("Delivery OTP notification dispatch note on accept:", notifErr);
    }

    // Remove other broadcasts
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
        message: "Order accepted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Accept assignment error",
      },
      {
        status: 500,
      }
    );
  }
}