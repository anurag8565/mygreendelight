import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const rawBody = await req.json();
        const { updateLocationSchema } = await import("@/lib/validations/zodSchemas");
        const parsed = updateLocationSchema.safeParse(rawBody);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: parsed.error.issues[0]?.message || "Invalid coordinates" },
                { status: 400 }
            );
        }

        const { latitude, longitude } = parsed.data;

        await User.findByIdAndUpdate(
            session.user.id,
            {
                location: {
                    type: "Point",
                    coordinates: [
                        longitude,
                        latitude
                    ]
                }
            }
        );

        try {
            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
            await fetch(`${socketUrl}/update-location`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id, latitude, longitude })
            });
        } catch (e) {
            // Socket offline fallback
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: `Update location error ${error}`,
            },
            { status: 500 }
        );
    }
}