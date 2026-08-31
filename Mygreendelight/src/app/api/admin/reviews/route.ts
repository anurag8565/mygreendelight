import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
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

    const groceriesWithReviews = await Grocery.find({
      reviews: { $exists: true, $not: { $size: 0 } },
    })
      .select("name image category price rating numReviews reviews")
      .lean();

    const flattenedReviews: any[] = [];
    groceriesWithReviews.forEach((item: any) => {
      item.reviews?.forEach((rev: any) => {
        flattenedReviews.push({
          reviewId: rev._id,
          productId: item._id,
          productName: item.name,
          productImage: item.image,
          category: item.category,
          userName: rev.name,
          rating: rev.rating,
          comment: rev.comment,
          date: rev.date || rev.createdAt || new Date(),
        });
      });
    });

    flattenedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      reviews: flattenedReviews,
      totalReviews: flattenedReviews.length,
    });
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

    const { productId, reviewId } = await req.json();
    const grocery = await Grocery.findById(productId);
    if (!grocery) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    grocery.reviews = grocery.reviews.filter(
      (r: any) => r._id.toString() !== reviewId.toString()
    );
    grocery.numReviews = grocery.reviews.length;
    grocery.rating =
      grocery.reviews.length > 0
        ? grocery.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / grocery.reviews.length
        : 0;

    await grocery.save();

    return NextResponse.json({
      success: true,
      message: "Review removed and product rating recalculated successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
