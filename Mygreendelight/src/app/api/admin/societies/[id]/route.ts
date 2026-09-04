import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Society from "@/model/society.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.locality !== undefined) updateData.locality = body.locality;
    if (body.landmark !== undefined) updateData.landmark = body.landmark;
    if (body.pincode !== undefined) updateData.pincode = body.pincode;
    if (body.targetOrders !== undefined) updateData.targetOrders = Number(body.targetOrders);
    if (body.discountPercent !== undefined) updateData.discountPercent = Number(body.discountPercent);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.keywords !== undefined) {
      updateData.keywords = Array.isArray(body.keywords)
        ? body.keywords
        : body.keywords.split(",").map((k: string) => k.trim()).filter(Boolean);
    }

    const updated = await Society.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Society not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      society: updated,
      message: "Society updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const deleted = await Society.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Society not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Society deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
