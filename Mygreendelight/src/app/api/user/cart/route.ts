import connectDb from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Cart from "@/model/cart.model";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, items: [] }, { status: 401 });
    }

    const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    return NextResponse.json({
      success: true,
      cart: cart || { items: [] },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    let cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await Cart.findOneAndUpdate({ user: session.user.id }, { items: [] });
    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
