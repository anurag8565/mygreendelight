import connectDb from "@/lib/db";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import Order from "@/model/order";
import User from "@/model/user.model";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderid: string }>; }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const { orderid } = await context.params;
    const rawBody = await req.json();

    const { updateOrderStatusSchema } = await import("@/lib/validations/zodSchemas");
    const parsed = updateOrderStatusSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid status update data" },
        { status: 400 }
      );
    }

    const { status, ispaid, paymentStatus } = parsed.data;

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

    if (typeof ispaid === "boolean") {
      order.ispaid = ispaid;
      order.paymentStatus = paymentStatus || (ispaid ? "completed" : "pending");
    }

    if ((order.status === "delivered" || order.status === "completed") && status && status !== order.status) {
      return NextResponse.json(
        { success: false, message: "Cannot change status of an already delivered order." },
        { status: 400 }
      );
    }

    const previousStatus = order.status;
    if (status && status !== order.status) {
      if (status === "cancelled" && order.status !== "cancelled") {
        // Restore stock for each valid grocery item
        for (const item of order.items) {
          if (item.grocery) {
            const weight = item.variationWeight || (item as any).variation?.weight;
            if (weight) {
              await Grocery.findOneAndUpdate(
                { _id: item.grocery, "variations.weight": weight },
                { $inc: { "variations.$.stock": item.quantity } }
              );
            } else {
              await Grocery.findByIdAndUpdate(item.grocery, {
                $inc: { stock: item.quantity },
              });
            }
          }
        }

        // Cancel active DeliveryAssignment so riders do not attempt delivery
        try {
          await DeliveryAssignment.updateMany(
            { order: order._id, status: { $nin: ["completed", "cancelled"] } },
            { $set: { status: "cancelled", assignedto: null } }
          );
        } catch (dErr) {
          console.warn("Delivery assignment cancel warning on admin cancel:", dErr);
        }
      }

      order.status = status;
    }

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

      const populatedAssignmentRaw = await DeliveryAssignment.findById(
        deliveryassignment._id
      ).populate("order").lean();

      // 🔒 Zero-Knowledge Security: Strip secret OTP from socket payload
      const populatedAssignment = populatedAssignmentRaw ? { ...populatedAssignmentRaw } : null;
      if (populatedAssignment && (populatedAssignment.order as any)?.deliveryOtp) {
        (populatedAssignment.order as any).deliveryOtp = {
          expiresAt: (populatedAssignment.order as any).deliveryOtp.expiresAt,
          verified: (populatedAssignment.order as any).deliveryOtp.verified,
          attempts: (populatedAssignment.order as any).deliveryOtp.attempts,
          code: undefined,
        };
      }

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

    // 🔔 Dispatch Status Push Notification to Customer via OneSignal
    if (status && status !== previousStatus) {
      try {
        const customerId = (order.user as any)?._id?.toString() || (order.user as any)?.toString();
        const customerName = (order.user as any)?.name || order.address?.fullname || "Customer";
        const { sendOrderStatusPushNotification } = await import("@/lib/orderNotifications");
        await sendOrderStatusPushNotification(order._id.toString(), customerId, customerName, status);
      } catch (pushErr) {
        console.warn("Status push dispatch warning:", pushErr);
      }

      // 🔔 Notify Socket Server for Instant Real-Time Status Update
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
      try {
        await fetch(`${socketUrl}/order-status-updated`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order._id.toString(),
            status,
            ispaid: order.ispaid,
          }),
          signal: AbortSignal.timeout(2000),
        });
      } catch (socketErr) {
        console.warn("Socket status update ping note:", socketErr);
      }
    }

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