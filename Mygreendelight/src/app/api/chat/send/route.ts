import connectDb from "@/lib/db";
import Message from "@/model/Message.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const { chatId, senderId, text } =
      await req.json();

    const msg = await Message.create({
      chat: chatId,
      sender: senderId,
      text,
    });

    return NextResponse.json(msg);
  } catch (error) {
    return NextResponse.json(
      { message: "send message error" },
      { status: 500 }
    );
  }
}