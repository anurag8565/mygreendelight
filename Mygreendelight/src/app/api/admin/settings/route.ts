import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Setting from "@/model/setting.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let setting = await Setting.findOne({ key: "store_delivery_settings" });
    if (!setting) {
      setting = await Setting.create({
        key: "store_delivery_settings",
        deliveryFee: 30,
        freeDeliveryThreshold: 199,
        isFreeDeliveryActive: false,
        minOrderAmount: 0,
        expressDeliveryMins: "15-45 Mins",
      });
    }

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("Admin Settings GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      deliveryFee,
      freeDeliveryThreshold,
      isFreeDeliveryActive,
      minOrderAmount,
      expressDeliveryMins,
      deliveryNotice,
    } = body;

    const updatedSetting = await Setting.findOneAndUpdate(
      { key: "store_delivery_settings" },
      {
        $set: {
          deliveryFee: Number(deliveryFee) >= 0 ? Number(deliveryFee) : 30,
          freeDeliveryThreshold:
            Number(freeDeliveryThreshold) >= 0 ? Number(freeDeliveryThreshold) : 199,
          isFreeDeliveryActive: Boolean(isFreeDeliveryActive),
          minOrderAmount: Number(minOrderAmount) >= 0 ? Number(minOrderAmount) : 0,
          expressDeliveryMins: expressDeliveryMins || "15-45 Mins",
          deliveryNotice: deliveryNotice || "",
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Delivery Fee & Store Settings updated successfully!",
      setting: updatedSetting,
    });
  } catch (error) {
    console.error("Admin Settings POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
