import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Subscription from "@/model/subscription.model";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please log in to view subscriptions" },
        { status: 401 }
      );
    }

    const subscriptions = await Subscription.find({ user: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please log in to start subscription" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planName, items, frequency, deliveryAddress, paymentMethod, totalPerDelivery } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please select at least 1 item for subscription" },
        { status: 400 }
      );
    }

    if (!deliveryAddress?.fulladress) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid delivery address" },
        { status: 400 }
      );
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);

    const subscription = await Subscription.create({
      user: session.user.id,
      planName: planName || "Daily Morning Fresh Plan",
      items,
      frequency: frequency || "daily",
      deliveryAddress,
      paymentMethod: paymentMethod || "wallet",
      status: "active",
      startDate: new Date(),
      nextDeliveryDate: tomorrow,
      totalPerDelivery: totalPerDelivery || 100,
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: "🎉 Subah 7:00 AM Morning Subscription Activated!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    const subscription = await Subscription.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { status },
      { new: true }
    );

    if (!subscription) {
      return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      subscription,
      message: `Subscription status updated to ${status}!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
