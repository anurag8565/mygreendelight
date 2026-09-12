import connectDb from "@/lib/db";
import User from "@/model/user.model";
import Order from "@/model/order";
import Cart from "@/model/cart.model";
import Wallet from "@/model/wallet.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const rawUsers = await User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch order stats per user
    const orders = await Order.find({}).select("user totalamount status").lean();
    const orderStatsByUser: Record<string, { count: number; totalSpent: number }> = {};

    orders.forEach((o: any) => {
      const uId = String(o.user);
      if (!orderStatsByUser[uId]) {
        orderStatsByUser[uId] = { count: 0, totalSpent: 0 };
      }
      orderStatsByUser[uId].count += 1;
      orderStatsByUser[uId].totalSpent += o.totalamount || 0;
    });

    const customers = rawUsers.map((u: any) => {
      const stats = orderStatsByUser[String(u._id)] || { count: 0, totalSpent: 0 };
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        mobile: u.mobile || "N/A",
        role: u.role,
        createdAt: u.createdAt,
        orderCount: stats.count,
        totalSpent: stats.totalSpent,
      };
    });

    return NextResponse.json(
      {
        success: true,
        customers,
        totalCustomers: customers.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Customers fetch error:", error);
    return NextResponse.json(
      { success: false, message: `Error: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const userId = body?.userId || searchParams.get("userId");
    const cleanTestCustomers =
      body?.cleanTestCustomers === true ||
      searchParams.get("cleanTestCustomers") === "true";

    if (cleanTestCustomers) {
      // Find all user IDs who have an order in the database
      const userIdsWithOrders = await Order.distinct("user");

      // Find all users who are NOT admin and DO NOT have any order
      const usersToDelete = await User.find({
        role: { $ne: "admin" },
        _id: { $nin: userIdsWithOrders },
      }).select("_id");

      const deleteIds = usersToDelete.map((u) => u._id);

      if (deleteIds.length > 0) {
        // Clean related carts and wallets
        await Cart.deleteMany({ user: { $in: deleteIds } }).catch(() => {});
        await Wallet.deleteMany({ user: { $in: deleteIds } }).catch(() => {});
        const result = await User.deleteMany({ _id: { $in: deleteIds } });

        return NextResponse.json(
          {
            success: true,
            message: `Cleaned ${result.deletedCount} dummy test customer accounts. Preserved customers with active orders.`,
            deletedCount: result.deletedCount,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "No test accounts to clean. All existing accounts have active orders.",
          deletedCount: 0,
        },
        { status: 200 }
      );
    }

    if (userId) {
      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return NextResponse.json(
          { success: false, message: "Customer not found" },
          { status: 404 }
        );
      }

      if (targetUser.role === "admin") {
        return NextResponse.json(
          { success: false, message: "Cannot delete Admin account" },
          { status: 403 }
        );
      }

      // Check if user has orders
      const userOrdersCount = await Order.countDocuments({ user: userId });
      if (userOrdersCount > 0 && !body?.force) {
        return NextResponse.json(
          {
            success: false,
            message: `This customer has ${userOrdersCount} existing order(s). Pass force: true if you really want to delete.`,
            hasOrders: true,
          },
          { status: 400 }
        );
      }

      // Clean related items
      await Cart.deleteMany({ user: userId }).catch(() => {});
      await Wallet.deleteMany({ user: userId }).catch(() => {});
      await User.findByIdAndDelete(userId);

      return NextResponse.json(
        {
          success: true,
          message: `Customer ${targetUser.name} (${targetUser.email}) deleted successfully.`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Missing userId or cleanTestCustomers parameter" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Customer delete error:", error);
    return NextResponse.json(
      { success: false, message: `Error: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
