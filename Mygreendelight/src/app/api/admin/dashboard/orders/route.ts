import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";

export async function GET() {
    try {
        await connectDb();


        const data = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();

            date.setDate(date.getDate() - i);

            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            const count = await Order.countDocuments({
                createdAt: {
                    $gte: start,
                    $lte: end,
                },
            });

            data.push({
                day: date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short",
                    }
                ),
                orders: count,
            });
        }

        return NextResponse.json(data);


    } catch (error) {
        return NextResponse.json(
            {
                message: "Orders graph error",
            },
            {
                status: 500,
            }
        );
    }
}
