import connectDb from "@/lib/db";
import Chat from "@/model/Chat.model";
import Message from "@/model/Message.model";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId, text } = await req.json();

    if (!chatId || !text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { message: "Chat ID and valid message text are required" },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(chatId).populate("order");
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    const order = chat.order as any;
    const userId = session.user.id;
    const userRole = (session.user as any).role;
    const isCustomer = order?.user?.toString() === userId;
    const isRider = order?.assigneddelliveryboy?.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isCustomer && !isRider && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: You cannot post to this chat" },
        { status: 403 }
      );
    }

    const msg = await Message.create({
      chat: chatId,
      sender: userId,
      text: text.trim(),
    });

    const populatedMsg = await Message.findById(msg._id).populate("sender", "name");

    return NextResponse.json(populatedMsg);
  } catch (error) {
    console.error("send message error:", error);
    return NextResponse.json(
      { message: "send message error" },
      { status: 500 }
    );
  }
}