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
      console.warn("Session check warning in api/me:", sErr);
    }

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not Authenticated", user: null },
        { status: 200 }
      );
    }

    const cleanEmail = session.user.email.trim().toLowerCase();
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    }).populate("wishlist").select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found in database", user: null },
        { status: 200 }
      );
    }

    return NextResponse.json(user);

  } catch (error: any) {
    console.error("API /api/me error:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}