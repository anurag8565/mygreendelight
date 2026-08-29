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

    order.assigneddelliveryboy = deliveryboyid;

    // ⭐ THIS WAS MISSING
    order.assigment = assigment._id;

    // Optional but recommended
    order.status = "out of delivery";

    await order.save();

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