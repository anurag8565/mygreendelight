import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import RecipeKit from "@/model/recipekit.model";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const { id } = await params;
    const body = await req.json();

    const updated = await RecipeKit.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Recipe kit not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Recipe kit updated successfully!",
      kit: updated,
    });
  } catch (error: any) {
    console.error("PUT Recipe Kit Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const { id } = await params;

    const deleted = await RecipeKit.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Recipe kit not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Recipe kit deleted successfully from database!",
    });
  } catch (error: any) {
    console.error("DELETE Recipe Kit Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
