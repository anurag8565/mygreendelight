import connectDb from "@/lib/db";
import Testimonial from "@/model/testimonial.model";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await connectDb();
    const testimonials = await Testimonial.find({
      status: "approved",
      comment: { $nin: ["yummy", "bad rice", "test", ""] },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("Testimonial GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();

    const body = await req.json();
    const { name, location, rating, comment, image } = body;

    if (!name || !comment) {
      return NextResponse.json({ success: false, message: "Name and comment are required" }, { status: 400 });
    }

    const testimonial = await Testimonial.create({
      user: session?.user?.id ? (session.user.id as any) : undefined,
      name: name.trim(),
      location: location || "Bhopal Resident",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      image,
      status: "approved", // Auto-approved for live visibility
    });

    return NextResponse.json({
      success: true,
      testimonial,
      message: "🎉 Thank you! Your verified review has been published live.",
    });
  } catch (error: any) {
    console.error("Testimonial POST Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}