import connectDb from "@/lib/db";
import Setting from "@/model/setting.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    let setting = await Setting.findOne({ key: "store_delivery_settings" }).lean();
    if (!setting) {
      setting = {
        key: "store_delivery_settings",
        deliveryFee: 30,
        freeDeliveryThreshold: 199,
        isFreeDeliveryActive: false,
        minOrderAmount: 0,
        expressDeliveryMins: "15-45 Mins",
        deliveryNotice: "",
      } as any;
    }

    return NextResponse.json({
      success: true,
      deliveryFee: setting?.deliveryFee ?? 30,
      freeDeliveryThreshold: setting?.freeDeliveryThreshold ?? 199,
      isFreeDeliveryActive: Boolean(setting?.isFreeDeliveryActive),
      minOrderAmount: setting?.minOrderAmount ?? 0,
      expressDeliveryMins: setting?.expressDeliveryMins || "15-45 Mins",
      deliveryNotice: setting?.deliveryNotice || "",
    });
  } catch (error) {
    console.error("Public Settings GET Error:", error);
    // Return safe default fallback if DB error
    return NextResponse.json({
      success: true,
      deliveryFee: 30,
      freeDeliveryThreshold: 199,
      isFreeDeliveryActive: false,
      minOrderAmount: 0,
      expressDeliveryMins: "15-45 Mins",
      deliveryNotice: "",
    });
  }
}
