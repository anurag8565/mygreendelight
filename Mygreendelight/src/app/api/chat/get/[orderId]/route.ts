import connectDb from "@/lib/db";
import Chat from "@/model/Chat.model";
import Message from "@/model/Message.model";
import Order from "@/model/order";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Verify user is either customer, assigned rider, or admin
    const userId = session.user.id;
    const userRole = (session.user as any).role;
    const isCustomer = order.user?.toString() === userId;
    const isRider = order.assigneddelliveryboy?.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isCustomer && !isRider && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: You are not authorized to view this chat" },
        { status: 403 }
      );
    }

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
    console.error("fetch chat error:", error);

    return NextResponse.json(
      { message: "fetch chat error" },
      { status: 500 }
    );
  }
}