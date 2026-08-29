import connectDb from "@/lib/db";
import Testimonial from "@/model/testimonial.model";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await connectDb();
    // Only return approved testimonials for the frontend
    const testimonials = await Testimonial.find({ status: "approved" }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("Testimonial GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    
    // Optional: Get session to auto-fill user if logged in
    const session = await auth();

    const body = await req.json();
    const { name, location, rating, comment, image } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const testimonial = await Testimonial.create({
      user: session?.user?.id ? (session.user.id as any) : undefined,
      name,
      location: location || "India",
      rating,
      comment,
      image,
      status: "pending" // Admin must approve
    });

    return NextResponse.json({ success: true, testimonial, message: "Review submitted successfully and is pending approval." });
  } catch (error) {
    console.error("Testimonial POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}