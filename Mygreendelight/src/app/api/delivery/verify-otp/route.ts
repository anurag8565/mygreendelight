import connectDb from "@/lib/db";
import Order from "@/model/order";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import User from "@/model/user.model";
import UserWallet from "@/model/wallet.model";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || ((session.user as any).role !== "deliveryboy" && (session.user as any).role !== "admin")) {
      return NextResponse.json(
        { message: "Unauthorized: Delivery driver or admin privileges required" },
        { status: 401 }
      );
    }

    const { orderId, otp, bagsReturned } = await req.json();

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

    // Process Zero-Plastic Eco-Bag Return (₹10 per bag returned, max 10)
    const returnedCount = Math.max(0, Math.min(10, parseInt(bagsReturned) || 0));
    const bagCashback = returnedCount * 10;

    // Mark verified & delivered
    order.deliveryOtp.verified = true;
    order.status = "delivered";
    order.ispaid = true; // Auto-mark paid on verified delivery (both COD & Online)
    order.bagsReturned = returnedCount;
    order.bagReturnCashback = bagCashback;

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

    // Award Cashback to Customer Wallet
    try {
      const orderCashback = Math.max(15, Math.round((order.totalamount || 0) * 0.03));
      const totalCredit = orderCashback + bagCashback;

      // 1. Sync UserWallet model
      let wallet = await UserWallet.findOne({ user: order.user });
      if (!wallet) {
        wallet = await UserWallet.create({
          user: order.user,
          balance: 0,
          totalCashback: 0,
          transactions: [],
        });
      }

      wallet.balance += totalCredit;
      wallet.totalCashback += totalCredit;

      // Log Order Cashback transaction
      wallet.transactions.push({
        type: "credit",
        amount: orderCashback,
        description: `🌿 Order Delivery Cashback (#${order._id.toString().slice(-6).toUpperCase()})`,
        orderId: order._id.toString(),
        createdAt: new Date(),
      });

      // Log Eco-Bag Return Cashback if bags were collected
      if (returnedCount > 0) {
        wallet.transactions.push({
          type: "credit",
          amount: bagCashback,
          description: `♻️ Eco-Bag Return Cashback (${returnedCount} bag${returnedCount > 1 ? "s" : ""} @ ₹10/bag)`,
          orderId: order._id.toString(),
          createdAt: new Date(),
        });
      }
      await wallet.save();

      // 2. Sync User model
      const userUpdates: any = {
        $inc: { walletBalance: totalCredit },
        $push: {
          walletHistory: {
            $each: [
              {
                amount: orderCashback,
                type: "credit",
                description: `🌿 Order Delivery Cashback (#${order._id.toString().slice(-6).toUpperCase()})`,
                date: new Date(),
              },
              ...(returnedCount > 0
                ? [
                    {
                      amount: bagCashback,
                      type: "credit",
                      description: `♻️ Eco-Bag Return Cashback (${returnedCount} bag${returnedCount > 1 ? "s" : ""} @ ₹10/bag)`,
                      date: new Date(),
                    },
                  ]
                : []),
            ],
          },
        },
      };
      await User.findByIdAndUpdate(order.user, userUpdates);
    } catch (e) {
      console.error("Wallet credit error:", e);
    }

    const returnMsg = returnedCount > 0
      ? `Order Delivered! ₹${bagCashback} Eco-Bag Cashback + Delivery Points credited to customer wallet!`
      : "Order Delivered Successfully & Payment Verified!";

    return NextResponse.json({
      success: true,
      message: returnMsg,
      bagsReturned: returnedCount,
      bagReturnCashback: bagCashback,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Verify OTP Error" },
      { status: 500 }
    );
  }
}