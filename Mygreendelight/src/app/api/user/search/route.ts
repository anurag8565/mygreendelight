import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import Category from "@/model/category.model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const trending = searchParams.get("trending");

    // Fetch active categories to filter valid store catalog items
    const activeCats = await Category.find({}).select("name").lean();
    const activeCatNames = activeCats.map((c) => c.name);

    // If requesting trending items, return top real products from DB
    if (trending === "true" || (!query && trending !== null)) {
      const trendingFilter: any = {
        status: { $ne: "draft" },
      };
      if (activeCatNames.length > 0) {
        trendingFilter.category = { $in: activeCatNames };
      }

      const trendingProducts = await Grocery.find(trendingFilter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(8)
        .select("_id name category price image unit")
        .lean();

      return NextResponse.json(trendingProducts);
    }

    if (!query || query.trim() === "") {
      return NextResponse.json([]);
    }

    const cleanQuery = query.trim();
    const { escapeRegex } = await import("@/lib/sanitize");
    const safePattern = escapeRegex(cleanQuery);

    const filter: any = {
      status: { $ne: "draft" },
      $or: [
        { name: { $regex: safePattern, $options: "i" } },
        { category: { $regex: safePattern, $options: "i" } },
        { description: { $regex: safePattern, $options: "i" } },
      ],
    };


    if (activeCatNames.length > 0) {
      filter.category = { $in: activeCatNames };
    }

    const results = await Grocery.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json([]);
  }
}