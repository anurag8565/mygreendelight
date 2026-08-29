import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const admin = await User.findOne({
      role: "admin",
    });

    return NextResponse.json(
      {
        adminExists: !!admin,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CHECK_ADMIN_ERROR:", error);

    return NextResponse.json(
      {
        adminExists: true,
      },
      { status: 200 }
    );
  }
}