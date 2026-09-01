import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Banner from "@/model/banner.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { title, subtitle, btnText, link, image } = body;

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(btnText !== undefined && { btnText }),
        ...(link !== undefined && { link }),
        ...(image !== undefined && { image }),
      },
      { new: true }
    );

    if (!updatedBanner) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await Banner.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
