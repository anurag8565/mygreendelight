import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Subscription from "@/model/subscription.model";
import Order from "@/model/order";
import User from "@/model/user.model";
import UserWallet from "@/model/wallet.model";
import DeliveryAssignment from "@/model/Deliveryassigment.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    // Find all active subscriptions
    const activeSubscriptions = await Subscription.find({ status: "active" }).populate("user");

    if (activeSubscriptions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No active morning subscriptions found to dispatch.",
      });
    }

    const createdOrders: any[] = [];
    const skipped: any[] = [];

    for (const sub of activeSubscriptions) {
      try {
        const userObj: any = sub.user;
        const totalAmount = sub.totalPerDelivery || 100;

        // If payment method is wallet, check balance and debit
        let isPaid = false;
        let paymentMethod: "cod" | "online" = "cod";

        if (sub.paymentMethod === "wallet") {
          const userWallet = await UserWallet.findOne({ user: userObj._id });
          if (userWallet && userWallet.balance >= totalAmount) {
            // Debit wallet
            userWallet.balance -= totalAmount;
            userWallet.transactions.push({
              type: "debit",
              amount: totalAmount,
              description: `7:00 AM Morning Dispatch: ${sub.planName}`,
              createdAt: new Date(),
            });
            await userWallet.save();

            // Sync User.walletBalance
            await User.findByIdAndUpdate(userObj._id, {
              $inc: { walletBalance: -totalAmount },
            });

            isPaid = true;
            paymentMethod = "online";
          }
        }

        // Format items for Order
        const orderItems = sub.items.map((item) => ({
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image || "/categories/vegetables.jpg",
          quantity: item.quantity || 1,
        }));

        const newOrder = await Order.create({
          user: userObj._id,
          items: orderItems,
          totalamount: totalAmount,
          paymentmethod: paymentMethod,
          ispaid: isPaid,
          deliverySlot: "6:30 AM - 7:30 AM (Early Morning Express)",
          deliveryInstructions: `Recurring Morning 7AM Subscription: ${sub.planName}`,
          address: {
            fullname: sub.deliveryAddress.fullname,
            mobile: sub.deliveryAddress.mobile,
            city: sub.deliveryAddress.city || "Bhopal",
            state: "Madhya Pradesh",
            pincode: sub.deliveryAddress.pincode || "462001",
            fulladress: sub.deliveryAddress.fulladress,
            latitude: 23.2599,
            longitude: 77.4126,
          },
          status: "pending",
        });

        // Increment deliveries completed on subscription
        sub.deliveriesCompleted = (sub.deliveriesCompleted || 0) + 1;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (sub.frequency === "alternate_days" ? 2 : 1));
        sub.nextDeliveryDate = nextDate;
        await sub.save();

        createdOrders.push(newOrder);
      } catch (err: any) {
        console.error("Subscription dispatch row error:", err);
        skipped.push({ subId: sub._id, error: err.message });
      }
    }

    // Broadcast new orders to delivery boys
    try {
      const deliveryBoys = await User.find({ role: "deliveryboy" });
      const candidates = deliveryBoys.map((b) => b._id);
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

      for (const ord of createdOrders) {
        if (candidates.length > 0) {
          const assignment = await DeliveryAssignment.create({
            order: ord._id,
            broadcastedto: candidates,
            status: "broadcasted",
          });
          ord.assigment = assignment._id;
          await ord.save();

          for (const dId of candidates) {
            fetch(`${socketUrl}/send-assignment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deliveryBoyId: dId.toString(), assignment }),
            }).catch(() => {});
          }
        }
      }
    } catch (bErr) {
      console.warn("Delivery broadcast warning:", bErr);
    }

    return NextResponse.json({
      success: true,
      message: `🎉 Successfully created and dispatched ${createdOrders.length} morning orders!`,
      dispatchedCount: createdOrders.length,
      skippedCount: skipped.length,
      orders: createdOrders,
    });
  } catch (error: any) {
    console.error("Morning Dispatch Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
