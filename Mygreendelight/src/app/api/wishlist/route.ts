import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session check error in wishlist GET:", sErr);
    }

    if (!session?.user?.email) {
      return NextResponse.json({ success: true, wishlist: [] }, { status: 200 });
    }

    const Grocery = (await import("@/model/groseri.model")).default;
    const cleanEmail = session.user.email.trim().toLowerCase();
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } 
    }).populate("wishlist");

    return NextResponse.json({
      success: true,
      wishlist: user?.wishlist || [],
    });
  } catch (error: any) {
    console.error("Wishlist API GET error:", error);
    return NextResponse.json({ success: true, wishlist: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session check error in wishlist POST:", sErr);
    }

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
    }

    const { productId } = await req.json().catch(() => ({}));

    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    const cleanEmail = session.user.email.trim().toLowerCase();
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } 
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const index = user.wishlist?.indexOf(productId);

    if (index !== undefined && index > -1) {
      // Remove from wishlist
      user.wishlist?.splice(index, 1);
    } else {
      // Add to wishlist
      if (!user.wishlist) {
        user.wishlist = [];
      }
      user.wishlist.push(productId);
    }

    await user.save();

    return NextResponse.json({ message: "Wishlist updated", wishlist: user.wishlist });

  } catch (error) {
    console.log("WISHLIST API ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
