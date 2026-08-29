import connectDb from "@/lib/db";
import Chat from "@/model/Chat.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const { orderId, userId, deliveryBoyId } =
      await req.json();

    let chat = await Chat.findOne({ order: orderId });

    if (!chat) {
      chat = await Chat.create({
        order: orderId,
        users: [userId, deliveryBoyId],
      });
    }

    return NextResponse.json(chat);
  } catch (error) {
    return NextResponse.json(
      { message: "chat create error" },
      { status: 500 }
    );
  }
}