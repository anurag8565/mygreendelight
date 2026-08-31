import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";

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
        ]);

        const totalSales =
            deliveredOrdersData.reduce(
                (sum, order) =>
                    sum + order.totalamount,
                0
            );

        return NextResponse.json({
            totalSales,
            totalOrders,
            totalCustomers,
            totalDeliveryBoys,
            pendingOrders,
            deliveredOrders,
            outForDeliveryOrders,
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
