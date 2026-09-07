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
          activeAssignments: [],
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
          activeAssignments: [],
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 1. Fetch all DeliveryAssignment entries assigned to this driver
    const dbAssignments = await DeliveryAssignment.find({
      assignedto: user._id,
      status: "assigned",
    })
      .populate({
        path: "order",
        populate: { path: "user", select: "name email mobile" },
      })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Fetch all Order entries directly assigned to this driver (fallback for 100% sync)
    const directAssignedOrders = await Order.find({
      assigneddelliveryboy: user._id,
      status: { $in: ["out of delivery", "picked_up", "assigned", "pending"] },
    })
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 })
      .lean();

    // Map of orderId -> assignment
    const activeMap = new Map<string, any>();

    // Process dbAssignments
    for (const a of dbAssignments) {
      const ord = a.order as any;
      if (ord && ord._id) {
        if (ord.status === "delivered" || ord.status === "cancelled") {
          // Auto-clean completed/cancelled assignment
          await DeliveryAssignment.findByIdAndUpdate(a._id, {
            status: ord.status === "delivered" ? "completed" : "broadcasted",
            assignedto: null,
          });
        } else {
          activeMap.set(String(ord._id), a);
        }
      }
    }

    // Process directAssignedOrders (merge / auto-create missing assignments)
    for (const ord of directAssignedOrders) {
      const ordIdStr = String(ord._id);
      if (!activeMap.has(ordIdStr)) {
        const newAssignment = await DeliveryAssignment.findOneAndUpdate(
          { order: ord._id },
          {
            order: ord._id,
            assignedto: user._id,
            status: "assigned",
            acceptedat: new Date(),
          },
          { upsert: true, new: true }
        );

        activeMap.set(ordIdStr, {
          _id: newAssignment._id,
          order: ord,
          assignedto: user._id,
          status: "assigned",
        });
      }
    }

    const activeAssignments = Array.from(activeMap.values()).map((a: any) => {
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

    const hasActive = activeAssignments.length > 0;

    return NextResponse.json(
      {
        active: hasActive,
        activeAssignments,
        assigment: hasActive ? activeAssignments[0] : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CURRENT ORDER ERROR:", error);

    return NextResponse.json(
      {
        active: false,
        activeAssignments: [],
        message: "Current order error",
      },
      {
        status: 500,
      }
    );
  }
}
