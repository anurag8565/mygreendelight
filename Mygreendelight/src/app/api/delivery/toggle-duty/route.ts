import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const query = session.user.id ? { _id: session.user.id } : { email: session.user.email };

    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Toggle or set specific online state
    if (typeof body.isonline === "boolean") {
      user.isonline = body.isonline;
    } else {
      user.isonline = !user.isonline;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      isonline: user.isonline,
      message: user.isonline ? "You are now ONLINE. You will receive delivery requests." : "You are now OFFLINE. Rest mode active.",
    });
  } catch (error) {
    console.error("Toggle Duty Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { success: false, isonline: false },
        { status: 401 }
      );
    }

    const query = session.user.id ? { _id: session.user.id } : { email: session.user.email };
    const user = await User.findOne(query).select("isonline name deliveryStats");

    return NextResponse.json({
      success: true,
      isonline: !!user?.isonline,
      deliveryStats: user?.deliveryStats || { totalDeliveries: 0, totalEarnings: 0 },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, isonline: false },
      { status: 500 }
    );
  }
}
