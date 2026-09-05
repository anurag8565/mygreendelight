import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();
    const { itemIds, action, value } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action is required" },
        { status: 400 }
      );
    }

    let modifiedCount = 0;

    // 1. WIPE ENTIRE INVENTORY
    if (action === "wipe_all") {
      const res = await Grocery.deleteMany({});
      modifiedCount = res.deletedCount;
      return NextResponse.json({
        success: true,
        message: `Successfully wiped all ${modifiedCount} produce items from database!`,
        modifiedCount,
      });
    }

    // 2. DELETE ALL IN A SPECIFIC CATEGORY
    if (action === "delete_category") {
      const categoryName = String(value || "").trim();
      if (!categoryName) {
        return NextResponse.json(
          { success: false, message: "Category name required" },
          { status: 400 }
        );
      }
      const res = await Grocery.deleteMany({
        category: { $regex: new RegExp(`^${categoryName}$`, "i") },
      });
      modifiedCount = res.deletedCount;
      return NextResponse.json({
        success: true,
        message: `Successfully deleted all ${modifiedCount} items in "${categoryName}" from database!`,
        modifiedCount,
      });
    }

    // For item-specific actions, itemIds array is required
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items selected for bulk update" },
        { status: 400 }
      );
    }

    if (action === "discount") {
      const discountPercent = Number(value);
      if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 90) {
        return NextResponse.json(
          { success: false, message: "Please provide a valid discount percentage (1-90%)" },
          { status: 400 }
        );
      }

      const multiplier = (100 - discountPercent) / 100;
      const items = await Grocery.find({ _id: { $in: itemIds } });

      for (const item of items) {
        item.mrp = item.mrp || item.price;
        item.price = Math.max(1, Math.round(item.price * multiplier));
        if (Array.isArray(item.variations) && item.variations.length > 0) {
          item.variations = item.variations.map((v: any) => ({
            ...v,
            price: Math.max(1, Math.round((v.price || item.price) * multiplier)),
          }));
        }
        await item.save();
        modifiedCount++;
      }
    } else if (action === "price_adjust") {
      const adjustment = Number(value);
      if (isNaN(adjustment)) {
        return NextResponse.json(
          { success: false, message: "Please provide a valid price adjustment amount" },
          { status: 400 }
        );
      }

      const items = await Grocery.find({ _id: { $in: itemIds } });
      for (const item of items) {
        item.price = Math.max(1, item.price + adjustment);
        if (Array.isArray(item.variations) && item.variations.length > 0) {
          item.variations = item.variations.map((v: any) => ({
            ...v,
            price: Math.max(1, (v.price || item.price) + adjustment),
          }));
        }
        await item.save();
        modifiedCount++;
      }
    } else if (action === "restock") {
      const restockAmount = Number(value);
      if (isNaN(restockAmount) || restockAmount <= 0) {
        return NextResponse.json(
          { success: false, message: "Please provide a positive restock quantity" },
          { status: 400 }
        );
      }

      const items = await Grocery.find({ _id: { $in: itemIds } });
      for (const item of items) {
        item.stock = (item.stock || 0) + restockAmount;
        if (Array.isArray(item.variations) && item.variations.length > 0) {
          item.variations = item.variations.map((v: any) => ({
            ...v,
            stock: (v.stock || 0) + restockAmount,
          }));
        }
        await item.save();
        modifiedCount++;
      }
    } else if (action === "change_category") {
      const categoryName = String(value || "").trim();
      if (!categoryName) {
        return NextResponse.json(
          { success: false, message: "Please select a valid category" },
          { status: 400 }
        );
      }

      const res = await Grocery.updateMany(
        { _id: { $in: itemIds } },
        { $set: { category: categoryName } }
      );
      modifiedCount = res.modifiedCount;
    } else if (action === "bulk_publish") {
      const res = await Grocery.updateMany(
        { _id: { $in: itemIds } },
        { $set: { status: "published" } }
      );
      modifiedCount = res.modifiedCount;
    } else if (action === "bulk_draft") {
      const res = await Grocery.updateMany(
        { _id: { $in: itemIds } },
        { $set: { status: "draft" } }
      );
      modifiedCount = res.modifiedCount;
    } else if (action === "bulk_feature") {
      const res = await Grocery.updateMany(
        { _id: { $in: itemIds } },
        { $set: { isFeatured: true } }
      );
      modifiedCount = res.modifiedCount;
    } else if (action === "bulk_unfeature") {
      const res = await Grocery.updateMany(
        { _id: { $in: itemIds } },
        { $set: { isFeatured: false } }
      );
      modifiedCount = res.modifiedCount;
    } else if (action === "delete") {
      const res = await Grocery.deleteMany({ _id: { $in: itemIds } });
      modifiedCount = res.deletedCount;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${modifiedCount} produce items in database`,
      modifiedCount,
    });
  } catch (error: any) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      { success: false, message: `Bulk update failed: ${error.message}` },
      { status: 500 }
    );
  }
}
