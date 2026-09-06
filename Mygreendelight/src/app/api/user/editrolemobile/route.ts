import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { role, mobile } = await req.json();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Only existing admins can change a user's role
    const updateData: Record<string, any> = {};
    if (mobile !== undefined) updateData.mobile = mobile;

    if (role && role !== currentUser.role) {
      if (currentUser.role !== "admin") {
        return NextResponse.json(
          { message: "Forbidden: Only an admin can modify account roles." },
          { status: 403 }
        );
      }
      updateData.role = role;
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Role updated successfully", user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("UPDATE_ROLE_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}