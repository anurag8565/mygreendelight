import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import Grocery from "@/model/groseri.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not Authenticated" },
        { status: 401 }
      );
    }

    let user = null;
    if (session.user.id) {
      user = await User.findById(session.user.id).populate("wishlist").select("-password");
    }

    if (!user && session.user.email) {
      const cleanEmail = session.user.email.trim().toLowerCase();
      user = await User.findOne({
        email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
      }).populate("wishlist").select("-password");
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}