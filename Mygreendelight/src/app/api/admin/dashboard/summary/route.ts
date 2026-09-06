import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";

export async function GET() {
    try {
        await connectDb();
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
        }

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

            Order.find({}).select("address totalamount status createdAt").lean(),
            Grocery.find({}).select("name stock unit image category variations").lean(),
        ]);

        const allOrders = deliveredOrdersData; // raw all orders

        const totalSales =
            allOrders
                .filter((o: any) => o.status === "delivered" || o.status === "completed")
                .reduce((sum: number, order: any) => sum + (order.totalamount || 0), 0);

        const lowStockItems = (allGroceries || []).filter((g: any) => {
            const baseStock = g.stock !== undefined ? g.stock : 100;
            const hasLowVariation = Array.isArray(g.variations) && g.variations.some((v: any) => (v.stock || 0) < 10);
            return baseStock < 10 || hasLowVariation;
        });

        // 🗺️ Real Bhopal Locality Demand Breakdown
        const bhopalPockets = [
            { key: "mp nagar", name: "MP Nagar Zone", count: 0, revenue: 0, lat: 23.2332, lng: 77.4343 },
            { key: "arera", name: "Arera Colony", count: 0, revenue: 0, lat: 23.2133, lng: 77.4338 },
            { key: "kolar", name: "Kolar Road", count: 0, revenue: 0, lat: 23.1762, lng: 77.4244 },
            { key: "hoshangabad", name: "Hoshangabad Road", count: 0, revenue: 0, lat: 23.1950, lng: 77.4580 },
            { key: "indrapuri", name: "Indrapuri & BHEL", count: 0, revenue: 0, lat: 23.2505, lng: 77.4722 },
            { key: "ayodhya", name: "Ayodhya Bypass", count: 0, revenue: 0, lat: 23.2750, lng: 77.4520 },
            { key: "new market", name: "New Market / TT Nagar", count: 0, revenue: 0, lat: 23.2384, lng: 77.3995 },
            { key: "shahpura", name: "Shahpura & Chunabhatti", count: 0, revenue: 0, lat: 23.2010, lng: 77.4210 },
            { key: "bhopal", name: "Central Bhopal Hub", count: 0, revenue: 0, lat: 23.2599, lng: 77.4126 },
        ];

        (allOrders || []).forEach((o: any) => {
            const addr = String(o.address?.fulladress || o.address?.city || "").toLowerCase();
            let matched = false;
            for (const pocket of bhopalPockets) {
                if (addr.includes(pocket.key)) {
                    pocket.count++;
                    pocket.revenue += o.totalamount || 0;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                bhopalPockets[bhopalPockets.length - 1].count++;
                bhopalPockets[bhopalPockets.length - 1].revenue += o.totalamount || 0;
            }
        });

        const activeBhopalLocalities = bhopalPockets
            .filter((p) => p.count > 0)
            .sort((a, b) => b.count - a.count);

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
            bhopalLocalities: activeBhopalLocalities.length > 0 ? activeBhopalLocalities : bhopalPockets.slice(0, 4),
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
