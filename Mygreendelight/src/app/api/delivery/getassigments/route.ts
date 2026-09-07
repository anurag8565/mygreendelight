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

    if (!session?.user?.email && !session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
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
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (user.role !== "deliveryboy" && user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    // Auto-heal: Check for any unassigned "out of delivery" orders missing DeliveryAssignment
    const unassignedOrders = await Order.find({
      status: "out of delivery",
      $or: [{ assigneddelliveryboy: null }, { assigneddelliveryboy: { $exists: false } }],
    }).select("_id");

    for (const uo of unassignedOrders) {
      await DeliveryAssignment.findOneAndUpdate(
        { order: uo._id },
        {
          order: uo._id,
          status: "broadcasted",
          assignedto: null,
        },
        { upsert: true }
      );
    }

    // Fetch broadcasted assignments that are unassigned
    const filter: any = {
      status: "broadcasted",
      assignedto: null,
    };

    if (user.role === "deliveryboy") {
      filter.$or = [
        { broadcastedto: user._id },
        { broadcastedto: { $exists: false } },
        { broadcastedto: { $size: 0 } },
      ];
    }

    const assignments = await DeliveryAssignment.find(filter)
      .populate({
        path: "order",
        populate: { path: "user", select: "name email mobile" },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Clean up & Filter: ONLY orders that are genuinely unassigned and out of delivery/pending
    const validAssignments: any[] = [];

    for (const a of assignments) {
      const ord = a.order as any;
      if (!ord || !ord._id) {
        // Stale assignment with deleted order
        await DeliveryAssignment.findByIdAndDelete(a._id);
        continue;
      }

      if (ord.status === "delivered" || ord.status === "cancelled") {
        // Mark completed
        await DeliveryAssignment.findByIdAndUpdate(a._id, {
          status: ord.status === "delivered" ? "completed" : "broadcasted",
          assignedto: null,
        });
        continue;
      }

      if (ord.assigneddelliveryboy && String(ord.assigneddelliveryboy) !== String(user._id)) {
        // Already assigned to someone else
        await DeliveryAssignment.findByIdAndUpdate(a._id, {
          status: "assigned",
          assignedto: ord.assigneddelliveryboy,
        });
        continue;
      }

      if (ord.assigneddelliveryboy && String(ord.assigneddelliveryboy) === String(user._id)) {
        // Already assigned to THIS driver -> should not be in available requests
        await DeliveryAssignment.findByIdAndUpdate(a._id, {
          status: "assigned",
          assignedto: user._id,
        });
        continue;
      }

      validAssignments.push(a);
    }

    const sanitizedAssignments = validAssignments.map((a: any) => {
      const aObj = { ...a };
      if (aObj.order && aObj.order.deliveryOtp) {
        aObj.order = {
          ...aObj.order,
          deliveryOtp: {
            expiresAt: aObj.order.deliveryOtp.expiresAt,
            verified: aObj.order.deliveryOtp.verified,
            attempts: aObj.order.deliveryOtp.attempts,
            code: undefined, // 🔒 Strip secret OTP
          },
        };
      }
      return aObj;
    });

    return NextResponse.json({
      success: true,
      assignments: sanitizedAssignments,
    });
  } catch (error) {
    console.error("GET ASSIGNMENTS ERROR:", error);

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
