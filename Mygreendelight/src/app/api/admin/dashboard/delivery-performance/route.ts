import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import { auth } from "@/auth";

export async function GET() {
    try {
        await connectDb();
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
        }


        const deliveryBoys = await User.find({
            role: "deliveryboy",
        });

        const result = await Promise.all(
            deliveryBoys.map(async (boy: any) => {
                const deliveries = await Order.countDocuments({
                    assigneddelliveryboy: boy._id,
                    status: "delivered",
                });

                return {
                    name: boy.name,
                    deliveries,
                };
            })
        );

        return NextResponse.json(result);


    } catch (error) {
        return NextResponse.json(
            { message: "Performance error" },
            { status: 500 }
        );
    }
}
