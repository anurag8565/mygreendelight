import { auth } from "@/auth";
import connectDb from "@/lib/db";
import uploadoncloudinary from "@/lib/Cloudinary";
import Banner from "@/model/banner.model";
import { NextRequest, NextResponse } from "next/server";
import { OFFICIAL_DEFAULT_BANNERS } from "./seed/route";

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
    const btnText = (formdata.get("btnText") as string) || "Shop Fresh Produce";
    const link = (formdata.get("link") as string) || "/shop";
    const badge = (formdata.get("badge") as string) || "🌿 Farm Fresh • 10-15 Min Express";
    const offerPill = (formdata.get("offerPill") as string) || "";
    const floatingStat = (formdata.get("floatingStat") as string) || "🌱 100% Farm Fresh";
    const file = formdata.get("image") as File | null;
    const imageUrlFallback = formdata.get("imageUrl") as string | null;

    if (!title || !subtitle) {
      return NextResponse.json({ message: "Title and subtitle are required" }, { status: 400 });
    }

    let finalImageUrl = imageUrlFallback || "";
    if (file && typeof file === "object" && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      finalImageUrl = await uploadoncloudinary(buffer);
    }

    if (!finalImageUrl) {
      return NextResponse.json({ message: "Banner image is required" }, { status: 400 });
    }

    const maxOrderBanner = await Banner.findOne({}).sort({ order: -1 }).lean();
    const nextOrder = (maxOrderBanner?.order || 0) + 1;

    const banner = await Banner.create({
      title,
      subtitle,
      image: finalImageUrl,
      btnText,
      link,
      badge,
      offerPill,
      floatingStat,
      isActive: true,
      order: nextOrder,
    });

    return NextResponse.json({ message: "Banner Added Successfully", banner }, { status: 201 });
  } catch (error: any) {
    console.error("BANNER ADD ERROR:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDb();
    let banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
    
    // Auto-seed if completely empty
    if (banners.length === 0) {
      await Banner.insertMany(OFFICIAL_DEFAULT_BANNERS);
      banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
    }

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching banners" }, { status: 500 });
  }
}

