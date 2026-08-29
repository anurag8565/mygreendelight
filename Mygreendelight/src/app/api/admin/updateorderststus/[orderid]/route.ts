import connectDb from "@/lib/db";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import Order from "@/model/order";
import User from "@/model/user.model";
import Grocery from "@/model/groseri.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderid: string }>; }
) {
  try {
    await connectDb();

    const { orderid } = await context.params;
    const { status } = await req.json();

    const order = await Order.findById(orderid).populate("user");

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    if (status === "cancelled" && order.status !== "cancelled") {
      // Restore stock for each item
      for (const item of order.items) {
        if (item.variation && item.variation.weight) {
          await Grocery.findOneAndUpdate(
            { _id: item.grocery, "variations.weight": item.variation.weight },
            { $inc: { "variations.$.stock": item.quantity } }
          );
        } else {
          await Grocery.findByIdAndUpdate(item.grocery, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    order.status = status;

    let avaliabeldeliveryboy: any[] = [];

    if (status === "out of delivery" && !order.assigment) {
      const { latitude, longitude } = order.address || {};

      const nearbydeliveryboy = await User.find({
        role: "deliveryboy",
      });

      const nearbyid = nearbydeliveryboy.map((boy) => boy._id);

      const busyid = await DeliveryAssignment.find({
        assignedto: {
          $in: nearbyid,
        },
        status: {
          $nin: ["broadcasted", "completed"],
        },
      }).distinct("assignedto");

      const busyset = new Set(busyid.map((id) => String(id)));

      avaliabeldeliveryboy = nearbydeliveryboy.filter(
        (boy) => !busyset.has(String(boy._id))
      );

      const candidates = avaliabeldeliveryboy.map((boy) => boy._id);

      if (candidates.length === 0) {
        await order.save();
        return NextResponse.json({
          success: true,
          message: "Status updated (No idle delivery boys available at the moment)",
          order,
          availableDeliveryBoys: [],
        });
      }

      const deliveryassignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedto: candidates,
        status: "broadcasted",
      });

      const populatedAssignment = await DeliveryAssignment.findById(
        deliveryassignment._id
      ).populate("order");

      // Broadcast to socket server safely
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
      for (const deliveryBoyId of candidates) {
        try {
          await fetch(`${socketUrl}/send-assignment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              deliveryBoyId: deliveryBoyId.toString(),
              assignment: populatedAssignment,
            }),
            signal: AbortSignal.timeout(2000), // 2s timeout
          });
        } catch (fetchErr) {
          console.warn("Socket broadcast ping failed (Socket server might be idle):", fetchErr);
        }
      }

      order.assigment = deliveryassignment._id;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      order,
      availableDeliveryBoys: avaliabeldeliveryboy,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}