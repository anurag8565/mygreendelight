import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import Category from "@/model/category.model";
import ComboBundle from "@/model/combo.model";
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

    // Special handling for Combos & Value Bundles
    if (category && /combo/i.test(category.trim())) {
      const comboQuery: any = { isActive: true };
      if (search) {
        const { escapeRegex } = await import("@/lib/sanitize");
        comboQuery.$or = [
          { title: { $regex: escapeRegex(search), $options: "i" } },
          { subtitle: { $regex: escapeRegex(search), $options: "i" } },
        ];
      }
      let sortObj: any = { createdAt: -1 };
      if (sort === "price_asc") sortObj = { comboPrice: 1 };
      if (sort === "price_desc") sortObj = { comboPrice: -1 };

      const comboBundles = await ComboBundle.find(comboQuery)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean();

      const mappedCombos = comboBundles.map((c: any) => ({
        _id: c._id,
        name: c.title,
        price: c.comboPrice,
        mrp: c.originalPrice,
        unit: c.items?.length ? `${c.items.length} Items Pack` : "Value Bundle",
        image: c.image,
        category: "Combos",
        stock: 50,
        description: c.subtitle,
        rating: 4.9,
        isFeatured: true,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));

      return NextResponse.json({ success: true, groceries: mappedCombos }, { status: 200 });
    }

    const query: any = {
      status: { $ne: "draft" },
    };
    if (category && category.trim().toLowerCase() !== "all") {
      const { escapeRegex } = await import("@/lib/sanitize");
      query.category = { $regex: new RegExp(`^${escapeRegex(category.trim())}$`, "i") };
    }
    if (featured === "true") {
      query.isFeatured = true;
    }
    
    if (search) {
      const { escapeRegex } = await import("@/lib/sanitize");
      query.name = { $regex: escapeRegex(search), $options: "i" };
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
