import connectDb from "@/lib/db";
import Chat from "@/model/Chat.model";
import Message from "@/model/Message.model";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDb();

    const { orderId } = await params;

    const chat = await Chat.findOne({
      order: orderId,
    });

    if (!chat) {
      return NextResponse.json([]);
    }

    const messages = await Message.find({
      chat: chat._id,
    }).populate("sender", "name");

    return NextResponse.json(messages);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "fetch chat error" },
      { status: 500 }
    );
  }
}