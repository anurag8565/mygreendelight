import connectDb from "@/lib/db";
import Category from "@/model/category.model";
import Grocery from "@/model/groseri.model";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch all categories (deduplicated by name)
export async function GET() {
  try {
    await connectDb();
    const categories = await Category.find({}).sort({ createdAt: -1 });

    // Deduplicate by lowercased name
    const uniqueMap = new Map<string, any>();
    for (const cat of categories) {
      const key = cat.name.trim().toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, cat);
      }
    }

    const uniqueCategories = Array.from(uniqueMap.values());

    return NextResponse.json({ success: true, categories: uniqueCategories }, { status: 200 });
  } catch (error: any) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Add a new category
export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const formdata = await req.formData();
    const name = formdata.get("name") as string;
    const file = formdata.get("image") as File | null;

    if (!name || !file) {
      return NextResponse.json(
        { success: false, message: "Name and Image are required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { v2: cloudinary } = require("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "category",
    });

    const category = await Category.create({
      name: name.trim(),
      image: uploadResponse.secure_url,
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
    } catch (_) {}

    return NextResponse.json(
      { success: true, message: "Category added successfully", category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Category Error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to add category" },
      { status: 500 }
    );
  }
}

// Delete category
export async function DELETE(req: NextRequest) {
  try {
    await connectDb();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID required" },
        { status: 400 }
      );
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Cascade delete/clean up any products associated with this deleted category
    if (deleted.name) {
      await Grocery.deleteMany({
        category: { $regex: `^${deleted.name.trim()}$`, $options: "i" },
      });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
    } catch (_) {}

    return NextResponse.json(
      { success: true, message: "Category and associated products deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
