import uploadoncloudinary from "@/lib/Cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = await uploadoncloudinary(buffer);

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Failed to upload image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error: any) {
    console.error("Upload payment proof error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
