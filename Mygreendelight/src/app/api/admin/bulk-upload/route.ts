import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import Category from "@/model/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();
    const { products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid array of products." },
        { status: 400 }
      );
    }

    const inserted: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      try {
        if (!item.name || item.price === undefined || item.price === null || item.price === "") {
          errors.push({ row: i + 1, name: item.name || "Unknown", error: "Missing required name or price" });
          continue;
        }

        const categoryName = item.category?.trim() || "Vegetables";

        // Auto-create category if missing
        try {
          const catExists = await Category.findOne({
            name: { $regex: `^${categoryName}$`, $options: "i" },
          });

          if (!catExists) {
            await Category.create({
              name: categoryName,
              image: item.image || "/categories/vegetables.jpg",
            });
          }
        } catch (catErr) {
          console.warn("Category check warning:", catErr);
        }

        // Format variations if any
        let variations = item.variations || [];
        if (typeof variations === "string") {
          try {
            variations = JSON.parse(variations);
          } catch {
            variations = [];
          }
        }

        // Ensure variations is array of valid objects
        if (!Array.isArray(variations)) {
          variations = [];
        }

        const validVariations = variations
          .filter((v: any) => v && v.weight && v.price)
          .map((v: any) => ({
            weight: String(v.weight),
            price: Number(v.price) || 0,
            stock: Number(v.stock) || 50,
          }));

        const newGrocery = await Grocery.create({
          name: String(item.name).trim(),
          price: Number(item.price) || 0,
          stock: Number(item.stock) || 50,
          unit: item.unit?.trim() || "kg",
          category: categoryName,
          image: item.image?.trim() || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
          description: item.description?.trim() || "Farm fresh harvest sourced directly from local Bhopal growers.",
          sourcing: item.sourcing?.trim() || "Direct from local Bhopal farms (Raisen / Sehore)",
          storage: item.storage?.trim() || "Store in a cool, dry place. Wash thoroughly before use.",
          variations: validVariations,
        });

        inserted.push(newGrocery);
      } catch (err: any) {
        console.error(`Row ${i + 1} Error:`, err);
        errors.push({ row: i + 1, name: item.name, error: err.message || "Insert failed" });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully uploaded ${inserted.length} product(s). ${errors.length > 0 ? `${errors.length} failed.` : ""}`,
        insertedCount: inserted.length,
        errorCount: errors.length,
        errors,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Bulk Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Bulk upload failed." },
      { status: 500 }
    );
  }
}
