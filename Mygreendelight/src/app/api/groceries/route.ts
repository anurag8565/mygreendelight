import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import Category from "@/model/category.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const category = url.searchParams.get("category");
    const sort = url.searchParams.get("sort");
    const search = url.searchParams.get("search");
    const featured = url.searchParams.get("featured");
    const skip = (page - 1) * limit;

    const query: any = {
      status: { $ne: "draft" },
    };
    if (category) {
      query.category = category;
    } else {
      const activeCats = await Category.find({}).select("name").lean();
      if (activeCats.length > 0) {
        query.category = { $in: activeCats.map((c) => c.name) };
      }
    }
    if (featured === "true") {
      query.isFeatured = true;
    }
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    let sortObj: any = { createdAt: -1 }; // default newest
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };

    const groceries = await Grocery.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, groceries }, { status: 200 });
  } catch (error) {
    console.error("Pagination API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch groceries" },
      { status: 500 }
    );
  }
}
