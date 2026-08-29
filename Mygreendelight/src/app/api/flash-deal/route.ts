import connectDb from "@/lib/db";
import FlashDealSetting from "@/model/flashdeal.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    let setting = await FlashDealSetting.findOne().sort({ createdAt: -1 });
    if (!setting) {
      const defaultEndTime = new Date();
      defaultEndTime.setHours(24, 0, 0, 0); // Tonight midnight
      setting = await FlashDealSetting.create({
        endTime: defaultEndTime,
        badgeText: "FLAT 25% - 40% OFF",
        isActive: true,
      });
    }
    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
