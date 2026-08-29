import connectDb from "@/lib/db";

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Cart from "@/model/cart.model";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } =
      await req.json();

    let cart = await Cart.findOne({
      user: session.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [],
      });
    }

    const existing = cart.items.find(
      (i: any) =>
        i.product.toString() ===
        productId
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
      message: "Added to cart",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Cart error" },
      { status: 500 }
    );
  }
}