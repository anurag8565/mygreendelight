import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";
import User from "@/model/user.model";
import { generateSlug } from "../route";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    // Check admin authorization
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await User.findById(session.user.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const forceOverwrite = body?.forceOverwrite || false;

    // Fetch all groceries
    const products = await Grocery.find({});
    let updatedCount = 0;

    for (const prod of products) {
      const needsOptimization =
        forceOverwrite ||
        !prod.metaTitle ||
        !prod.metaDescription ||
        !prod.metaKeywords ||
        !prod.slug;

      if (needsOptimization) {
        const rawName = prod.name || "Fresh Produce";
        const cleanName = rawName.split("/")[0].trim();
        const hindiName = rawName.includes("/") ? rawName.split("/")[1].trim() : "";
        const priceStr = prod.price ? `₹${prod.price}/${prod.unit || "kg"}` : "Best Mandi Rate";
        const cat = prod.category || "Vegetables";

        // Auto-craft High-Ranking Title (Max 60 chars)
        const metaTitle = `${rawName} (${priceStr}) | Mandi Fresh Bhopal - SubziQuick`.slice(0, 70);

        // Auto-craft High-Ranking Meta Description (120-160 chars)
        const metaDescription = `Buy farm-fresh ${cleanName}${
          hindiName ? ` (${hindiName})` : ""
        } online in Bhopal at wholesale Karond Mandi rates. 100% ozone-washed, pesticide-safe. Same-day delivery across Bhopal on SubziQuick.`.slice(0, 160);

        // Auto-craft Local Bhopal Keywords
        const metaKeywords = [
          cleanName.toLowerCase(),
          hindiName ? hindiName.toLowerCase() : "",
          `${cleanName.toLowerCase()} price bhopal`,
          `${cleanName.toLowerCase()} delivery bhopal`,
          `buy ${cleanName.toLowerCase()} online bhopal`,
          `karond mandi ${cleanName.toLowerCase()}`,
          `fresh ${cat.toLowerCase()} bhopal`,
          "subziquick bhopal",
        ]
          .filter(Boolean)
          .join(", ");

        const focusKeyword = `${cleanName.toLowerCase()} delivery bhopal`;
        const slug = prod.slug || generateSlug(`${cleanName}-${cat}-bhopal`);

        await Grocery.findByIdAndUpdate(prod._id, {
          $set: {
            slug,
            metaTitle,
            metaDescription,
            metaKeywords,
            focusKeyword,
            canonicalUrl: `https://subziquick.in/product/${prod._id}`,
          },
        });

        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully optimized SEO for ${updatedCount} product(s)!`,
      updatedCount,
      totalProducts: products.length,
    });
  } catch (error: any) {
    console.error("Bulk SEO Optimize error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to bulk optimize SEO" },
      { status: 500 }
    );
  }
}
