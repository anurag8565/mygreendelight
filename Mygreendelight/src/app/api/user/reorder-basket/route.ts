import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    // Find the most recent completed or delivered order (or any latest order)
    const latestOrder = await Order.findOne({ user: userId })
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
    const groceryIds = latestOrder.items.map((i: any) => i.grocery);
    const liveGroceries = await Grocery.find({ _id: { $in: groceryIds } }).lean();

    const verifiedItems = latestOrder.items.map((orderItem: any) => {
      const live = liveGroceries.find(
        (g: any) => g._id.toString() === orderItem.grocery?.toString()
      );

      const inStock = live ? live.stock > 0 : false;
      const currentPrice = live ? live.price : orderItem.price;
      const currentImage = live ? live.image : orderItem.image;

      return {
        _id: orderItem.grocery,
        name: orderItem.name,
        orderedQuantity: orderItem.quantity || 1,
        orderedPrice: orderItem.price,
        currentPrice,
        image: currentImage,
        unit: orderItem.unit || live?.unit || "unit",
        variationWeight: orderItem.variationWeight,
        category: live?.category || "Produce",
        inStock,
        currentStock: live ? live.stock : 0,
      };
    });

    const totalCurrentPrice = verifiedItems
      .filter((i: any) => i.inStock)
      .reduce((sum: number, item: any) => sum + item.currentPrice * item.orderedQuantity, 0);

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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
