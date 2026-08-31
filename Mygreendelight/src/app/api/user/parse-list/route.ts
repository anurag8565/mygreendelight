import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import GroceryListInquiry from "@/model/groceryList.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const { rawText, guestId } = await req.json();

    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide your grocery list text" },
        { status: 400 }
      );
    }

    const allGroceries = await Grocery.find({ stock: { $gt: 0 } });
    const lines = rawText
      .split(/[\n,;]+/)
      .map((l: string) => l.trim())
      .filter(Boolean);

    const matchedItems: any[] = [];
    const unmatchedQueries: string[] = [];

    for (const line of lines) {
      const cleanLine = line.toLowerCase();
      // Extract quantity if present
      const qtyMatch = cleanLine.match(/(\d+(?:\.\d+)?)\s*(kg|g|gm|packet|pkt|litre|l|pc|pcs)?/i);
      let multiplier = 1;
      if (qtyMatch && qtyMatch[1]) {
        multiplier = Math.max(1, Math.round(parseFloat(qtyMatch[1])));
        if (qtyMatch[2]?.toLowerCase() === "kg" && multiplier > 1) {
          multiplier = Math.min(5, multiplier);
        }
      }

      // Strip numbers from search term
      const searchTerm = cleanLine.replace(/[\d.]+\s*(kg|g|gm|packet|pkt|litre|l|pc|pcs)?/gi, "").trim();

      if (!searchTerm) continue;

      // Match against MongoDB groceries
      const found = allGroceries.find((g) => {
        const name = g.name.toLowerCase();
        const cat = g.category.toLowerCase();
        return (
          name.includes(searchTerm) ||
          searchTerm.includes(name) ||
          (searchTerm.includes("aloo") && (name.includes("potato") || name.includes("aloo"))) ||
          (searchTerm.includes("pyaaz") && (name.includes("onion") || name.includes("pyaaz"))) ||
          (searchTerm.includes("tamatar") && (name.includes("tomato") || name.includes("tamatar"))) ||
          (searchTerm.includes("palak") && (name.includes("spinach") || name.includes("palak"))) ||
          (searchTerm.includes("doodh") && (name.includes("milk") || name.includes("doodh"))) ||
          (searchTerm.includes("dhaniya") && (name.includes("coriander") || name.includes("dhaniya"))) ||
          (searchTerm.includes("adrak") && (name.includes("ginger") || name.includes("adrak"))) ||
          (searchTerm.includes("mirchi") && (name.includes("chilli") || name.includes("mirch")))
        );
      });

      if (found) {
        if (!matchedItems.some((m) => m._id.toString() === found._id.toString())) {
          matchedItems.push({
            _id: found._id,
            name: found.name,
            price: found.price,
            image: found.image,
            unit: found.unit,
            category: found.category,
            quantity: multiplier,
          });
        }
      } else {
        unmatchedQueries.push(line);
      }
    }

    const totalEstimatedAmount = matchedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save inquiry to MongoDB
    await GroceryListInquiry.create({
      user: session?.user?.id || undefined,
      guestId: guestId || "guest",
      rawText,
      matchedItems: matchedItems.map((m) => ({
        groceryId: m._id,
        name: m.name,
        quantity: m.quantity,
        price: m.price,
      })),
      totalEstimatedAmount,
      status: "matched",
    }).catch((e) => console.log("List save note:", e.message));

    return NextResponse.json({
      success: true,
      matchedItems,
      unmatchedQueries,
      totalEstimatedAmount,
      message: `🎉 Matched ${matchedItems.length} fresh produce items from your list!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
