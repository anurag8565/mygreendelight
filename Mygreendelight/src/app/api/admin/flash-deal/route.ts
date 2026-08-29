import { auth } from "@/auth";
import connectDb from "@/lib/db";
import FlashDealSetting from "@/model/flashdeal.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    let setting = await FlashDealSetting.findOne().sort({ createdAt: -1 });
    if (!setting) {
      const defaultEndTime = new Date();
      defaultEndTime.setHours(24, 0, 0, 0);
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

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    const userRole = (session?.user as any)?.role?.toLowerCase();
    if (userRole !== "admin" && session?.user?.email !== "anurag8565@gmail.com") {
      return NextResponse.json({ success: false, message: "Not authorized as admin" }, { status: 401 });
    }

    const body = await req.json();
    const { endTime, badgeText, isActive } = body;

    let setting = await FlashDealSetting.findOne().sort({ createdAt: -1 });

    if (setting) {
      if (endTime) setting.endTime = new Date(endTime);
      if (badgeText !== undefined) setting.badgeText = badgeText;
      if (isActive !== undefined) setting.isActive = isActive;
      await setting.save();
    } else {
      setting = await FlashDealSetting.create({
        endTime: endTime ? new Date(endTime) : new Date(Date.now() + 6 * 60 * 60 * 1000),
        badgeText: badgeText || "FLAT 25% - 40% OFF",
        isActive: isActive !== undefined ? isActive : true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Flash Deal Timer & Settings Updated Successfully!",
      setting,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
