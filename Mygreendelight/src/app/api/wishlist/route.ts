import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: true, items: [], wishlist: [] }, { status: 200 });
    }

    // Ensure Grocery model is registered
    const Grocery = (await import("@/model/groseri.model")).default;
    const cleanEmail = session.user.email.trim().toLowerCase();

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    }).populate("wishlist");

    const validWishlist = (user?.wishlist || []).filter(
      (item: any) => item && typeof item === "object" && item.name
    );

    return NextResponse.json({
      success: true,
      wishlist: validWishlist,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    const cleanEmail = session.user.email.trim().toLowerCase();
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    const prodIdStr = String(productId).trim();
    const existingIndex = user.wishlist.findIndex(
      (item: any) => String(item?._id || item) === prodIdStr
    );

    let isAdded = false;
    if (existingIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(existingIndex, 1);
      isAdded = false;
    } else {
      // Add to wishlist
      if (mongoose.Types.ObjectId.isValid(prodIdStr)) {
        user.wishlist.push(new mongoose.Types.ObjectId(prodIdStr));
      }
      isAdded = true;
    }

    await user.save();

    // Populate and return clean updated wishlist for this user
    const Grocery = (await import("@/model/groseri.model")).default;
    const updatedUser = await User.findById(user._id).populate("wishlist");
    const validWishlist = (updatedUser?.wishlist || []).filter(
      (item: any) => item && typeof item === "object" && item.name
    );

    return NextResponse.json({
      success: true,
      isAdded,
      message: isAdded ? "Added to wishlist" : "Removed from wishlist",
      wishlist: validWishlist,
    });
  } catch (error: any) {
    console.error("WISHLIST API ERROR", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    const cleanEmail = session.user.email.trim().toLowerCase();
    await User.updateOne(
      { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } },
      { $set: { wishlist: [] } }
    );

    return NextResponse.json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist: [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to clear wishlist" }, { status: 500 });
  }
}

