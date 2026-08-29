import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
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