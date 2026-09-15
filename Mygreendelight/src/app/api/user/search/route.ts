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

    // Hindi-English phonetic vocabulary mapping for quick Indian produce search
    const HINDI_SYNONYMS: Record<string, string[]> = {
      aloo: ["potato", "aalu", "alu"],
      aalu: ["potato", "aloo", "alu"],
      alu: ["potato", "aloo"],
      potato: ["aloo", "aalu", "alu"],
      tamatar: ["tomato"],
      tomato: ["tamatar"],
      pyaz: ["onion", "pyaaz", "kanda"],
      pyaaz: ["onion", "pyaz", "kanda"],
      onion: ["pyaz", "pyaaz", "kanda"],
      kanda: ["onion", "pyaz"],
      mirch: ["chilli", "chili", "mirchi"],
      mirchi: ["chilli", "chili", "mirch"],
      chilli: ["mirch", "mirchi"],
      dhaniya: ["coriander", "dhania", "kothmir"],
      dhania: ["coriander", "dhaniya"],
      coriander: ["dhaniya", "dhania"],
      adrak: ["ginger"],
      ginger: ["adrak"],
      lahsun: ["garlic", "lehsun"],
      lehsun: ["garlic", "lahsun"],
      garlic: ["lahsun", "lehsun"],
      nimbu: ["lemon", "lime"],
      lemon: ["nimbu"],
      palak: ["spinach"],
      spinach: ["palak"],
      kheera: ["cucumber", "kakdi"],
      cucumber: ["kheera", "kakdi"],
      bhindi: ["okra", "ladyfinger", "lady finger"],
      okra: ["bhindi"],
      ladyfinger: ["bhindi"],
      gobi: ["cauliflower", "patta gobhi", "phool gobhi", "cabbage"],
      gobhi: ["cauliflower", "cabbage"],
      cauliflower: ["gobi", "gobhi"],
      matar: ["peas", "green peas"],
      peas: ["matar"],
      shimla: ["capsicum", "shimla mirch"],
      capsicum: ["shimla mirch", "shimla"],
      baingan: ["brinjal", "eggplant"],
      brinjal: ["baingan"],
      seb: ["apple"],
      apple: ["seb"],
      kela: ["banana"],
      banana: ["kela"],
      aam: ["mango"],
      mango: ["aam"],
      doodh: ["milk"],
      milk: ["doodh"],
      paneer: ["cottage cheese"],
      sev: ["ratlami sev", "ujjaini sev", "bhopali sev", "namkeen"],
      poha: ["pohe", "chiwda", "bhopali poha"],
    };

    const words = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const searchTerms = new Set<string>([cleanQuery.toLowerCase(), ...words]);

    words.forEach((w) => {
      if (HINDI_SYNONYMS[w]) {
        HINDI_SYNONYMS[w].forEach((syn) => searchTerms.add(syn.toLowerCase()));
      }
    });

    const orClauses: any[] = [];

    searchTerms.forEach((term) => {
      const safe = escapeRegex(term);
      orClauses.push(
        { name: { $regex: safe, $options: "i" } },
        { category: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
        { metaKeywords: { $regex: safe, $options: "i" } },
        { slug: { $regex: safe, $options: "i" } }
      );
    });

    const filter: any = {
      status: { $ne: "draft" },
      $or: orClauses,
    };

    const results = await Grocery.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json([]);
  }
}