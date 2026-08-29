import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json([]);
    }

    const cleanQuery = query.trim();

    const results = await Grocery.find({
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },
        { category: { $regex: cleanQuery, $options: "i" } },
        { description: { $regex: cleanQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json([]);
  }
}