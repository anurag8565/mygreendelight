import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
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

    // If deliveryboy, fetch broadcasted to them or unassigned broadcasted; if admin, fetch all broadcasted
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
      .populate("order")
      .sort({ createdAt: -1 })
      .lean();

    const sanitizedAssignments = (assignments || []).map((a: any) => {
      const aObj = { ...a };
      if (aObj.order && aObj.order.deliveryOtp) {
        aObj.order.deliveryOtp = {
          expiresAt: aObj.order.deliveryOtp.expiresAt,
          verified: aObj.order.deliveryOtp.verified,
          attempts: aObj.order.deliveryOtp.attempts,
          code: undefined, // 🔒 Strip secret OTP
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
