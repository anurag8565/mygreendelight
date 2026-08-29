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

    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin && existingAdmin.email !== session.user.email) {
        return NextResponse.json(
          { message: "Admin role is restricted. An admin already exists for this store." },
          { status: 403 }
        );
      }
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { role: role || "user", mobile },
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