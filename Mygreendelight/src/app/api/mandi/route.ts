import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import MandiRate from "@/model/mandi.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();
    const rates = await MandiRate.find({ isActive: true }).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, rates });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const rate = await MandiRate.create(body);
    return NextResponse.json({ success: true, rate, message: "Mandi rate added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const { id, ...updates } = await req.json();
    const rate = await MandiRate.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, rate, message: "Mandi rate updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Mandi Rate ID required" }, { status: 400 });
    }

    const deleted = await MandiRate.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Mandi rate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Mandi rate permanently deleted from database!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
