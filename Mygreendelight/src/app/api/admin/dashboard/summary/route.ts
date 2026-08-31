import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import Grocery from "@/model/groseri.model";

export async function GET() {
    try {
        await connectDb();

        const [
            totalOrders,
            totalCustomers,
            totalDeliveryBoys,
            pendingOrders,
            deliveredOrders,
            outForDeliveryOrders,
            deliveredOrdersData,
            allGroceries,
        ] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "deliveryboy" }),
            Order.countDocuments({ status: "pending" }),
            Order.countDocuments({ status: { $in: ["delivered", "completed"] } }),
            Order.countDocuments({ status: "out of delivery" }),

            Order.find({
                status: { $in: ["delivered", "completed"] },
            }).select("totalamount"),

            Grocery.find({}).select("name stock unit image category variations").lean(),
        ]);

        const totalSales =
            deliveredOrdersData.reduce(
                (sum, order) =>
                    sum + order.totalamount,
                0
            );

        const lowStockItems = (allGroceries || []).filter((g: any) => {
            const baseStock = g.stock !== undefined ? g.stock : 100;
            const hasLowVariation = Array.isArray(g.variations) && g.variations.some((v: any) => (v.stock || 0) < 10);
            return baseStock < 10 || hasLowVariation;
        });

        return NextResponse.json({
            totalSales,
            totalOrders,
            totalCustomers,
            totalDeliveryBoys,
            pendingOrders,
            deliveredOrders,
            outForDeliveryOrders,
            lowStockCount: lowStockItems.length,
            lowStockItems: lowStockItems.slice(0, 5),
        });


    } catch (error) {
        console.log(error);


        return NextResponse.json(
            {
                message:
                    "Dashboard summary error",
            },
            {
                status: 500,
            }
        );


    }
}
