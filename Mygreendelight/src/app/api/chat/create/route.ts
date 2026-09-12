import connectDb from "@/lib/db";
import Chat from "@/model/Chat.model";
import Order from "@/model/order";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ message: "Order ID required" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const currentUserId = session.user.id;
    const userRole = (session.user as any).role;
    const isOwner = order.user?.toString() === currentUserId;
    const isRider = order.assigneddelliveryboy?.toString() === currentUserId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isRider && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: You cannot access this chat" },
        { status: 403 }
      );
    }

    let chat = await Chat.findOne({ order: orderId });

    if (!chat) {
      const chatUsers = [order.user, order.assigneddelliveryboy].filter(Boolean);
      chat = await Chat.create({
        order: orderId,
        users: chatUsers,
      });
    }

    return NextResponse.json(chat);
  } catch (error: any) {
    console.error("Chat create error:", error);
    return NextResponse.json(
      { message: error.message || "chat create error" },
      { status: 500 }
    );
  }
}