import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        // ✅ read body once
        const body = await req.json();
        console.log(body);
        const { userid, items, paymentmethod, totalamount, address, couponCode, discount, deliverySlot, walletDiscount } = body;

        // ❌ validation
        if (!userid || !items || !paymentmethod || !totalamount || !address) {
            return NextResponse.json(
                { success: false, message: "Missing credentials" },
                { status: 400 }
            );
        }

        // ✅ check user exists
        const user = await User.findById(userid);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // ✅ create order
        const neworder = await Order.create({
            user: userid,
            items,
            paymentmethod,
            totalamount,
            address,
            couponCode: couponCode || null,
            discount: discount || 0,
            walletDiscount: walletDiscount || 0,
            deliverySlot: deliverySlot || "Instant Express (30-45 Mins)",
        });

        // 💰 Deduct GreenPoints Wallet if redeemed
        if (walletDiscount && walletDiscount > 0) {
            await User.findByIdAndUpdate(userid, {
                $inc: { walletBalance: -walletDiscount },
                $push: {
                    walletHistory: {
                        amount: walletDiscount,
                        type: "debit",
                        description: `Redeemed GreenPoints on Order #${neworder._id.toString().slice(-6).toUpperCase()}`,
                        date: new Date(),
                    },
                },
            });
        }
        
        // 📉 Reduce stock
        const Grocery = (await import("@/model/groseri.model")).default;
        for (const item of items) {
            if (item.variationWeight) {
                await Grocery.updateOne(
                    { _id: item.grocery, "variations.weight": item.variationWeight },
                    { $inc: { "variations.$.stock": -item.quantity } }
                );
            } else {
                await Grocery.updateOne(
                    { _id: item.grocery },
                    { $inc: { stock: -item.quantity } }
                );
            }
        }
        const populatedOrder =
  await Order.findById(
    neworder._id
  )
    .populate("user")
    .populate(
      "assigneddelliveryboy",
      "name mobile"
    );

try {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
  await fetch(
    `${socketUrl}/new-order`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        order:
          populatedOrder,
      }),
    }
  );

        console.log("NEW ORDER EMITTED");
      } catch (err) {
        console.log("SOCKET ERROR", err);
      }

      // 🎁 Auto-generate Dynamic Scratch Card Reward in MongoDB
      let reward = null;
      try {
        const RewardConfig = (await import("@/model/rewardConfig.model")).default;
        const ScratchReward = (await import("@/model/reward.model")).default;

        let config = await RewardConfig.findOne().sort({ createdAt: -1 });
        if (!config) {
          config = {
            minCashback: 15,
            maxCashback: 50,
            minOrderValue: 199,
            expiryDays: 7,
            isActive: true,
            couponPrefix: "LUCKY",
          };
        }

        if (config.isActive) {
          const min = config.minCashback || 15;
          const max = config.maxCashback || 50;
          const randomDiscount =
            Math.floor(Math.random() * (max - min + 1)) + min;
          const uniqueCode = `${config.couponPrefix || "LUCKY"}${randomDiscount}-${Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()}`;

          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + (config.expiryDays || 7));

          reward = await ScratchReward.create({
            user: userid,
            order: neworder._id,
            couponCode: uniqueCode,
            discountAmount: randomDiscount,
            minOrderAmount: config.minOrderValue || 199,
            isScratched: false,
            expiresAt,
          });
        }
      } catch (rErr) {
        console.error("Reward generation error:", rErr);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Order created successfully",
          order: neworder,
          reward,
        },
        { status: 201 }
      );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
} 