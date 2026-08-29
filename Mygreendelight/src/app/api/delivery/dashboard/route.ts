import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import Order from "@/model/order";
import { NextResponse } from "next/server";

export async function GET() {
    try {


        await connectDb();

        const session = await auth();

        const user =
            await User.findById(
                session?.user?.id
            );

        const todayStart = new Date();

        todayStart.setHours(
            0,
            0,
            0,
            0
        );

        const completedToday =
            await Order.countDocuments({
                assigneddelliveryboy:
                    user._id,
                status: "delivered",
                updatedAt: {
                    $gte: todayStart
                }
            });

        return NextResponse.json({

            totalDeliveries:
                user.deliveryStats
                    ?.totalDeliveries || 0,

            totalEarnings:
                user.deliveryStats
                    ?.totalEarnings || 0,

            todayEarnings:
                completedToday * 100,

            completedToday,

            earningPerDelivery: 100

        });


    } catch (error) {


        return NextResponse.json(
            {
                message:
                    "dashboard error"
            },
            {
                status: 500
            }
        );


    }
}
