import connectDb from "@/lib/db";
import Testimonial from "@/model/testimonial.model";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDb();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    const testimonial = await Testimonial.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!testimonial) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial, message: "Testimonial updated" });
  } catch (error) {
    console.error("Admin Testimonial PUT Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDb();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    console.error("Admin Testimonial DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
