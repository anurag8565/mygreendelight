import connectDb from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Cart from "@/model/cart.model";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDb();
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session check error in cart GET:", sErr);
    }

    const userId = session?.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: true, cart: { items: [] } }, { status: 200 });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    return NextResponse.json({
      success: true,
      cart: cart || { items: [] },
    });
  } catch (error: any) {
    console.error("Cart API GET error:", error);
    return NextResponse.json({ success: true, cart: { items: [] } }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session check error in cart POST:", sErr);
    }

    const userId = session?.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json().catch(() => ({}));

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const existing = cart.items.find(
      (i: any) => i.product?.toString() === productId?.toString()
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Added to cart",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDb();
    let session = null;
    try {
      session = await auth();
    } catch (sErr) {
      console.warn("Session check error in cart DELETE:", sErr);
    }

    const userId = session?.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
