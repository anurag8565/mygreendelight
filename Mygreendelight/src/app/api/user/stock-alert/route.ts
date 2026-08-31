import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import StockAlert from "@/model/stockAlert.model";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const { groceryId, mobile, email } = await req.json();

    if (!groceryId || !mobile) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid mobile number." },
        { status: 400 }
      );
    }

    const grocery = await Grocery.findById(groceryId);
    if (!grocery) {
      return NextResponse.json(
        { success: false, message: "Produce item not found." },
        { status: 404 }
      );
    }

    // Check if already subscribed
    const existing = await StockAlert.findOne({
      grocery: groceryId,
      mobile,
      status: "pending",
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: `You are already registered for ${grocery.name} fresh harvest alert! 🔔`,
      });
    }

    await StockAlert.create({
      user: session?.user?.id || undefined,
      email: email || session?.user?.email || undefined,
      mobile,
      grocery: groceryId,
      groceryName: grocery.name,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: `🔔 Alert set! We will WhatsApp / SMS you as soon as ${grocery.name} is harvested!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
