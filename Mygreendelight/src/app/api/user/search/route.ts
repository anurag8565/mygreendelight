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

    if (!query || query.trim() === "") {
      return NextResponse.json([]);
    }

    const cleanQuery = query.trim();
    const activeCats = await Category.find({}).select("name").lean();
    const activeCatNames = activeCats.map((c) => c.name);

    const filter: any = {
      status: { $ne: "draft" },
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },
        { category: { $regex: cleanQuery, $options: "i" } },
        { description: { $regex: cleanQuery, $options: "i" } },
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