import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import Grocery from "@/model/groseri.model";
import User from "@/model/user.model";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: true, hasPastOrder: false });
    }

    // Find database user
    let userId = session.user.id;
    if (!userId && session.user.email) {
      const dbUser = await User.findOne({ email: session.user.email });
      userId = dbUser?._id?.toString();
    }

    if (!userId) {
      return NextResponse.json({ success: true, hasPastOrder: false });
    }

    // Find the most recent order with real items
    const latestOrder = await Order.findOne({ 
      user: userId,
      "items.0": { $exists: true }
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestOrder || !latestOrder.items || latestOrder.items.length === 0) {
      return NextResponse.json({
        success: true,
        hasPastOrder: false,
        message: "No previous orders found.",
      });
    }

    // Fetch current live grocery prices & stock for each item in the order
    const groceryIds = latestOrder.items.map((i: any) => i.grocery).filter(Boolean);
    const liveGroceries = await Grocery.find({ _id: { $in: groceryIds } }).lean();

    const verifiedItems = latestOrder.items.map((orderItem: any) => {
      const live = liveGroceries.find(
        (g: any) => g._id.toString() === orderItem.grocery?.toString()
      );

      const inStock = live ? live.stock > 0 : true;
      const currentPrice = live ? live.price : (orderItem.price || 0);
      const currentImage = live ? live.image : (orderItem.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80");

      return {
        _id: orderItem.grocery || orderItem._id,
        name: orderItem.name || live?.name || "Farm Produce",
        orderedQuantity: orderItem.quantity || 1,
        orderedPrice: orderItem.price || 0,
        currentPrice,
        image: currentImage,
        unit: orderItem.unit || live?.unit || "unit",
        variationWeight: orderItem.variationWeight,
        category: live?.category || "Vegetables",
        inStock,
        currentStock: live ? live.stock : 10,
      };
    }).filter((i: any) => i.currentPrice > 0);

    const totalCurrentPrice = verifiedItems
      .filter((i: any) => i.inStock)
      .reduce((sum: number, item: any) => sum + item.currentPrice * item.orderedQuantity, 0);

    if (verifiedItems.length === 0 || totalCurrentPrice <= 0) {
      return NextResponse.json({
        success: true,
        hasPastOrder: false,
      });
    }

    return NextResponse.json({
      success: true,
      hasPastOrder: true,
      orderId: latestOrder._id,
      orderDate: latestOrder.createdAt,
      items: verifiedItems,
      totalCurrentPrice,
      availableItemCount: verifiedItems.filter((i: any) => i.inStock).length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, hasPastOrder: false, message: error.message });
  }
}
