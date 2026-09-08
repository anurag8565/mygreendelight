import connectDb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/model/user.model";
import Order from "@/model/order";
import Grocery from "@/model/groseri.model";
import Category from "@/model/category.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // 🛡️ Strict Admin Authentication Check
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access: Admin role required." },
        { status: 401 }
      );
    }

    // Fetch collections (exclude sensitive user password hashes)
    const users = await User.find({}).select("-password").lean();
    const orders = await Order.find({}).lean();
    const groceries = await Grocery.find({}).lean();
    const categories = await Category.find({}).lean();

    let subscriptions: any[] = [];
    try {
      const SubModel = (await import("@/model/subscription.model")).default;
      subscriptions = await SubModel.find({}).lean();
    } catch (_) {}

    const backupPayload = {
      store: "SubziQuick Bhopal",
      generatedAt: new Date().toISOString(),
      counts: {
        users: users.length,
        orders: orders.length,
        groceries: groceries.length,
        categories: categories.length,
        subscriptions: subscriptions.length,
      },
      data: {
        users,
        orders,
        groceries,
        categories,
        subscriptions,
      },
    };

    const fileName = `subziquick_backup_${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(backupPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Database backup generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate database backup" },
      { status: 500 }
    );
  }
}
