import { auth } from "@/auth";
import connectDb from "@/lib/db";
import uploadoncloudinary from "@/lib/Cloudinary";
import Banner from "@/model/banner.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const formdata = await req.formData();
    const title = formdata.get("title") as string;
    const subtitle = formdata.get("subtitle") as string;
    const btnText = formdata.get("btnText") as string || "Shop Now";
    const link = formdata.get("link") as string || "/shop";
    const file = formdata.get("image") as File | null;

    if (!title || !subtitle || !file) {
      return NextResponse.json({ message: "Title, subtitle, and image are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageurl = await uploadoncloudinary(buffer);

    const banner = await Banner.create({
      title,
      subtitle,
      image: imageurl,
      btnText,
      link,
    });

    return NextResponse.json({ message: "Banner Added Successfully", banner }, { status: 201 });
  } catch (error) {
    console.error("BANNER ADD ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDb();
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching banners" }, { status: 500 });
  }
}
