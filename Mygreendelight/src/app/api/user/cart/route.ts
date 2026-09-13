import connectDb from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Cart from "@/model/cart.model";
import User from "@/model/user.model";
import mongoose from "mongoose";

async function getUserIdFromSession(session: any): Promise<string | null> {
  if (session?.user?.id) return String(session.user.id);
  if (session?.user?.email) {
    const cleanEmail = session.user.email.trim().toLowerCase();
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    }).select("_id");
    if (user?._id) return String(user._id);
  }
  return null;
}

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const userId = await getUserIdFromSession(session);

    if (!userId) {
      return NextResponse.json({ success: false, items: [] }, { status: 401 });
    }

    const cart = await Cart.findOne({ user: userId });
    return NextResponse.json({
      success: true,
      cart: cart || { items: [], couponCode: null, discountAmount: 0 },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();
    const userId = await getUserIdFromSession(session);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Case 1: Bulk Sync of entire cart (from Redux / local storage across devices)
    if (Array.isArray(body.items)) {
      const sanitizedItems = body.items
        .filter((item: any) => item && (item._id || item.product))
        .map((item: any) => {
          const rawProdId = item.product || item._id;
          const isObjId = mongoose.Types.ObjectId.isValid(rawProdId);
          return {
            product: isObjId ? new mongoose.Types.ObjectId(String(rawProdId)) : new mongoose.Types.ObjectId(),
            cartItemId: item.cartItemId || String(rawProdId),
            name: String(item.name || "Item"),
            price: Number(item.price) || 0,
            unit: String(item.unit || "kg"),
            image: String(item.image || ""),
            quantity: Math.max(1, Number(item.quantity) || 1),
            stock: typeof item.stock === "number" ? item.stock : 50,
            category: String(item.category || "Produce"),
            variation: item.variation
              ? {
                  weight: String(item.variation.weight || ""),
                  price: Number(item.variation.price) || 0,
                  stock: Number(item.variation.stock) || 0,
                }
              : undefined,
          };
        });

      const updated = await Cart.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          items: sanitizedItems,
          couponCode: body.couponCode || null,
          discountAmount: Number(body.discountAmount) || 0,
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        message: "Cart synced successfully",
        cart: updated,
      });
    }

    // Case 2: Single item add / update
    const { productId, quantity, cartItemId, name, price, unit, image, stock, category, variation } = body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const targetKey = cartItemId || String(productId);
    const existing = cart.items.find(
      (i: any) => (i.cartItemId && i.cartItemId === targetKey) || (i.product?.toString() === String(productId))
    );

    if (existing) {
      existing.quantity += Number(quantity || 1);
    } else {
      cart.items.push({
        product: mongoose.Types.ObjectId.isValid(productId)
          ? new mongoose.Types.ObjectId(String(productId))
          : new mongoose.Types.ObjectId(),
        cartItemId: targetKey,
        name: name || "Item",
        price: Number(price) || 0,
        unit: unit || "kg",
        image: image || "",
        quantity: Math.max(1, Number(quantity || 1)),
        stock: stock || 50,
        category: category || "Produce",
        variation,
      });
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Item updated in cart",
      cart,
    });
  } catch (error: any) {
    console.error("Cart API POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDb();
    const session = await auth();
    const userId = await getUserIdFromSession(session);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], couponCode: null, discountAmount: 0 }
    );
    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
