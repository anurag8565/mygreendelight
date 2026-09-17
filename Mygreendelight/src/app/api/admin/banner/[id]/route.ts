import { auth } from "@/auth";
import connectDb from "@/lib/db";
import uploadoncloudinary from "@/lib/Cloudinary";
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
    const contentType = req.headers.get("content-type") || "";

    let updateData: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formdata = await req.formData();
      const title = formdata.get("title") as string | null;
      const subtitle = formdata.get("subtitle") as string | null;
      const btnText = formdata.get("btnText") as string | null;
      const link = formdata.get("link") as string | null;
      const badge = formdata.get("badge") as string | null;
      const offerPill = formdata.get("offerPill") as string | null;
      const floatingStat = formdata.get("floatingStat") as string | null;
      const isActive = formdata.get("isActive");
      const order = formdata.get("order");
      const file = formdata.get("image") as File | null;
      const imageUrlFallback = formdata.get("imageUrl") as string | null;

      if (title !== null) updateData.title = title;
      if (subtitle !== null) updateData.subtitle = subtitle;
      if (btnText !== null) updateData.btnText = btnText;
      if (link !== null) updateData.link = link;
      if (badge !== null) updateData.badge = badge;
      if (offerPill !== null) updateData.offerPill = offerPill;
      if (floatingStat !== null) updateData.floatingStat = floatingStat;
      if (isActive !== null) updateData.isActive = String(isActive) === "true";
      if (order !== null) updateData.order = Number(order);

      if (file && typeof file === "object" && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        updateData.image = await uploadoncloudinary(buffer);
      } else if (imageUrlFallback) {
        updateData.image = imageUrlFallback;
      }
    } else {
      const body = await req.json();
      updateData = body;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      updateData,
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
