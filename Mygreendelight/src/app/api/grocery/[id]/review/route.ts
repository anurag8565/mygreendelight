import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import User from "@/model/user.model";
import Testimonial from "@/model/testimonial.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Please login to write a review" }, { status: 401 });
    }

    const { id } = await context.params;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ message: "Rating and comment are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const grocery = await Grocery.findById(id);

    if (!grocery) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Check if user already reviewed
    const alreadyReviewed = grocery.reviews?.find(
      (r: any) => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json({ message: "You have already reviewed this product" }, { status: 400 });
    }

    const review = {
      name: user.name || "Anonymous",
      rating: Number(rating),
      comment,
      user: user._id,
      date: new Date()
    };

    if (!grocery.reviews) grocery.reviews = [];
    grocery.reviews.push(review);
    grocery.numReviews = grocery.reviews.length;
    grocery.rating =
      grocery.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      grocery.reviews.length;

    await grocery.save();

    // ALSO create a pending Testimonial so admin can feature it on the home page!
    try {
      await Testimonial.create({
        user: user._id,
        name: user.name || "Anonymous",
        rating: Number(rating),
        comment: comment,
        status: "pending"
      });
    } catch (err) {
      console.error("Error creating testimonial from product review:", err);
    }

    return NextResponse.json({ message: "Review added successfully", grocery }, { status: 201 });

  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
