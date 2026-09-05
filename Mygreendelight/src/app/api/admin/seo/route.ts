import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import GlobalSEO from "@/model/seo.model";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

// Helper to generate a clean URL slug
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: NextRequest) {
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

    // Fetch Global SEO
    let globalSeo = await GlobalSEO.findOne();
    if (!globalSeo) {
      globalSeo = await GlobalSEO.create({});
    }

    // Fetch all groceries with SEO fields
    const products = await Grocery.find(
      {},
      {
        name: 1,
        price: 1,
        unit: 1,
        image: 1,
        category: 1,
        slug: 1,
        metaTitle: 1,
        metaDescription: 1,
        metaKeywords: 1,
        focusKeyword: 1,
        canonicalUrl: 1,
        rating: 1,
        numReviews: 1,
        updatedAt: 1,
      }
    )
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      globalSeo,
      products,
    });
  } catch (error: any) {
    console.error("Admin SEO GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load SEO data" },
      { status: 500 }
    );
  }
}

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

    const body = await req.json();
    const { action, globalSeo, productSeo } = body;

    if (action === "update-global") {
      const updatedGlobal = await GlobalSEO.findOneAndUpdate(
        {},
        { $set: globalSeo },
        { new: true, upsert: true }
      );
      return NextResponse.json({
        success: true,
        message: "Global SEO settings saved successfully!",
        globalSeo: updatedGlobal,
      });
    }

    if (action === "update-product" && productSeo?.productId) {
      const { productId, slug, metaTitle, metaDescription, metaKeywords, focusKeyword, canonicalUrl } = productSeo;
      
      const cleanSlug = slug ? generateSlug(slug) : "";

      const updatedProduct = await Grocery.findByIdAndUpdate(
        productId,
        {
          $set: {
            slug: cleanSlug,
            metaTitle: metaTitle || "",
            metaDescription: metaDescription || "",
            metaKeywords: metaKeywords || "",
            focusKeyword: focusKeyword || "",
            canonicalUrl: canonicalUrl || "",
          },
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: `SEO settings updated for "${updatedProduct?.name}"`,
        product: updatedProduct,
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin SEO POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save SEO settings" },
      { status: 500 }
    );
  }
}
