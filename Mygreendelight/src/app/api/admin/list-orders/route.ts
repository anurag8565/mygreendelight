import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import GroceryListInquiry from "@/model/groceryList.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const inquiries = await GroceryListInquiry.find({})
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
