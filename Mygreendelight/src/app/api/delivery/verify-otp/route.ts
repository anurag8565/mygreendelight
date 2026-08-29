import connectDb from "@/lib/db";
import Order from "@/model/order";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const { orderId, otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "Order ID and OTP are required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (!order.deliveryOtp?.code) {
      return NextResponse.json(
        { message: "OTP not generated yet. Please click Send OTP." },
        { status: 400 }
      );
    }

    if (order.deliveryOtp.code !== otp.trim()) {
      return NextResponse.json(
        { message: "Invalid OTP code. Please check again." },
        { status: 400 }
      );
    }

    if (
      order.deliveryOtp.expiresAt &&
      new Date() > new Date(order.deliveryOtp.expiresAt)
    ) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (order.status === "delivered") {
      return NextResponse.json(
        { message: "Order already delivered" },
        { status: 400 }
      );
    }

    // Mark verified & delivered
    order.deliveryOtp.verified = true;
    order.status = "delivered";
    order.ispaid = true; // Auto-mark paid on verified delivery (both COD & Online)

    await order.save();

    // Update assignment status
    if (order.assigment) {
      await DeliveryAssignment.findByIdAndUpdate(order.assigment, {
        status: "completed",
        assignedto: null,
      });
    }

    // Update rider stats & earnings
    if (order.assigneddelliveryboy) {
      const deliveryBoy = await User.findById(order.assigneddelliveryboy);

      if (deliveryBoy) {
        if (!deliveryBoy.deliveryStats) {
          deliveryBoy.deliveryStats = { totalDeliveries: 0, totalEarnings: 0 };
        }
        deliveryBoy.deliveryStats.totalDeliveries = (deliveryBoy.deliveryStats.totalDeliveries || 0) + 1;
        deliveryBoy.deliveryStats.totalEarnings = (deliveryBoy.deliveryStats.totalEarnings || 0) + 100;

        await deliveryBoy.save();
      }
    }

    // Award GreenPoints Cashback to Customer Wallet (3% or min ₹15)
    try {
      const cashbackAmount = Math.max(15, Math.round(order.totalamount * 0.03));
      await User.findByIdAndUpdate(order.user, {
        $inc: { walletBalance: cashbackAmount },
        $push: {
          walletHistory: {
            amount: cashbackAmount,
            type: "credit",
            description: `GreenPoints Cashback for Order #${order._id.toString().slice(-6).toUpperCase()}`,
            date: new Date(),
          },
        },
      });
    } catch (e) {
      console.error("Wallet credit error:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Order Delivered Successfully & Payment Verified!",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Verify OTP Error" },
      { status: 500 }
    );
  }
}