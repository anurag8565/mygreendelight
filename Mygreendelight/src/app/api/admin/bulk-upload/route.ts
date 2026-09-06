import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import Category from "@/model/category.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

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

        // Format variations with robust CSV unescaping
        let variations = item.variations || [];
        if (typeof variations === "string") {
          try {
            let cleanStr = variations.replace(/""/g, '"').trim();
            if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
              cleanStr = cleanStr.slice(1, -1).replace(/""/g, '"').trim();
            }
            variations = JSON.parse(cleanStr);
          } catch {
            variations = [];
          }
        }

        if (!Array.isArray(variations)) {
          variations = [];
        }

        let validVariations = variations
          .filter((v: any) => v && (v.weight || v.unit) && (v.price !== undefined && v.price !== null))
          .map((v: any) => ({
            weight: String(v.weight || v.unit).trim(),
            price: Number(v.price) || 0,
            stock: Number(v.stock) !== undefined ? Number(v.stock) : 50,
          }));

        // Fallback: If no variations provided or parsed, generate standard pack variations
        const basePrice = Number(item.price) || 40;
        const defaultUnit = item.unit?.trim() || "1 kg";
        const unitLow = defaultUnit.toLowerCase();

        if (validVariations.length === 0) {
          if (unitLow.includes("pc") || unitLow.includes("piece") || unitLow.includes("dozen")) {
            validVariations = [
              { weight: "1 Pc", price: basePrice, stock: 50 },
              { weight: "2 Pcs Pack", price: Math.round(basePrice * 1.9), stock: 40 },
              { weight: "4 Pcs Family Pack", price: Math.round(basePrice * 3.7), stock: 30 },
            ];
          } else if (unitLow.includes("box") || unitLow.includes("tray") || unitLow.includes("punnet")) {
            validVariations = [
              { weight: "1 Box (125g)", price: basePrice, stock: 40 },
              { weight: "2 Boxes (250g Duo)", price: Math.round(basePrice * 1.9), stock: 30 },
            ];
          } else if (unitLow.includes("bundle") || unitLow.includes("bunch")) {
            validVariations = [
              { weight: "1 Bundle", price: basePrice, stock: 50 },
              { weight: "2 Bundles (Saver)", price: Math.round(basePrice * 1.9), stock: 40 },
            ];
          } else if (unitLow.includes("250g")) {
            validVariations = [
              { weight: "250g Pack", price: basePrice, stock: 50 },
              { weight: "500g (Twin Pack)", price: Math.round(basePrice * 1.9), stock: 40 },
              { weight: "1 kg (Family Pack)", price: Math.round(basePrice * 3.7), stock: 30 },
            ];
          } else if (categoryName === "Ready-to-Cook & Cut Produce") {
            validVariations = [
              { weight: "250g Tray", price: basePrice, stock: 50 },
              { weight: "500g Family Tray", price: Math.round(basePrice * 1.85), stock: 40 },
              { weight: "1 kg Bulk Kitchen Pack", price: Math.round(basePrice * 3.5), stock: 25 },
            ];
          } else if (categoryName === "Dairy & Staples") {
            validVariations = [
              { weight: "500g Pack", price: Math.max(25, Math.round(basePrice * 0.55)), stock: 50 },
              { weight: "1 kg Pack", price: basePrice, stock: 60 },
              { weight: "2 kg Value Pack", price: Math.round(basePrice * 1.9), stock: 40 },
            ];
          } else {
            validVariations = [
              { weight: "250g", price: Math.max(10, Math.round(basePrice * 0.3)), stock: 50 },
              { weight: "500g", price: Math.max(15, Math.round(basePrice * 0.55)), stock: 60 },
              { weight: "1 kg", price: basePrice, stock: 80 },
              { weight: "2 kg (Bulk Saver)", price: Math.round(basePrice * 1.9), stock: 40 },
              { weight: "5 kg (Society Sack)", price: Math.round(basePrice * 4.6), stock: 25 },
            ];
          }
        }

        const calculatedMrp = Number(item.mrp) || Math.round(basePrice * 1.28);
        const calculatedDiscount = Math.max(1, Math.round(((calculatedMrp - basePrice) / calculatedMrp) * 100));

        const newGrocery = await Grocery.create({
          name: String(item.name).trim(),
          price: basePrice,
          mrp: calculatedMrp,
          discount: calculatedDiscount,
          stock: Number(item.stock) || 100,
          unit: defaultUnit,
          category: categoryName,
          image: item.image?.trim() || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
          description: item.description?.trim() || "Farm fresh harvest sourced directly from local Bhopal growers.",
          sourcing: item.sourcing?.trim() || "Direct from local Bhopal contract farms",
          storage: item.storage?.trim() || "Store in a cool, dry place.",
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
