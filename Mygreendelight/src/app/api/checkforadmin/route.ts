import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const admin = await User.findOne({
      role: "admin",
    });

    if (admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "No admin exists",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}