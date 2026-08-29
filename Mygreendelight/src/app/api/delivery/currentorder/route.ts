import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          active: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const deliveryboyid = session.user.id;

    const activeAssignment = await DeliveryAssignment.findOne({
      assignedto: deliveryboyid,
      status: "assigned",
    })
      .populate("order")
      .lean();

    // No active assignment
    if (!activeAssignment) {
      return NextResponse.json(
        {
          active: false,
        },
        { status: 200 }
      );
    }

    const order = activeAssignment.order as any;

    // Order already delivered
    if (!order || order.status === "delivered") {
      await DeliveryAssignment.findByIdAndUpdate(activeAssignment._id, {
        status: "completed",
        assignedto: null,
      });

      return NextResponse.json(
        {
          active: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        active: true,
        assigment: activeAssignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("CURRENT ORDER ERROR:", error);

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