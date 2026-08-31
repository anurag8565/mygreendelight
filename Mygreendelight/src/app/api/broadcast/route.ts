import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Broadcast from "@/model/broadcast.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();
    const activeBroadcast = await Broadcast.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, broadcast: activeBroadcast || null });
  } catch (error: any) {
    console.error("Fetch broadcast error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const { message, type, isActive, linkText, linkUrl } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, message: "Announcement message cannot be empty" }, { status: 400 });
    }

    // Deactivate previous broadcasts if setting active
    if (isActive) {
      await Broadcast.updateMany({}, { $set: { isActive: false } });
    }

    let broadcast = await Broadcast.findOne().sort({ updatedAt: -1 });
    if (!broadcast) {
      broadcast = new Broadcast({
        message: message.trim(),
        type: type || "promo",
        isActive: isActive !== undefined ? isActive : true,
        linkText: linkText || "",
        linkUrl: linkUrl || "",
      });
    } else {
      broadcast.message = message.trim();
      broadcast.type = type || broadcast.type;
      broadcast.isActive = isActive !== undefined ? isActive : broadcast.isActive;
      broadcast.linkText = linkText !== undefined ? linkText : broadcast.linkText;
      broadcast.linkUrl = linkUrl !== undefined ? linkUrl : broadcast.linkUrl;
    }

    await broadcast.save();

    return NextResponse.json({
      success: true,
      message: "Store announcement broadcast updated successfully!",
      broadcast,
    });
  } catch (error: any) {
    console.error("Save broadcast error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
