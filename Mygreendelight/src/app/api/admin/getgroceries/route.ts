import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }
    const groceries = await Grocery.find({}).sort({ createdAt: -1 });
    return NextResponse.json(groceries, { status: 200 });
  } catch (error) {
    console.error("Get groceries error:", error);
    return NextResponse.json(
      { message: `Get groceries error: ${error}` },
      { status: 500 }
    );
  }
}