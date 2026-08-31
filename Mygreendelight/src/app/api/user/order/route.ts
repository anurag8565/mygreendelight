import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        // ✅ read body once
        const body = await req.json();
        console.log(body);
        const { userid, items, paymentmethod, totalamount, address, couponCode, discount, deliverySlot, walletDiscount, farmerTip, isSilentDelivery, deliveryInstructions } = body;

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

        // Sanitize items: ensure invalid/custom ObjectIds don't crash Mongoose
        const sanitizedItems = items.map((item: any) => {
            const isValid = item.grocery && mongoose.Types.ObjectId.isValid(item.grocery);
            return {
                grocery: isValid ? item.grocery : undefined,
                groceryId: item.grocery ? String(item.grocery) : undefined,
                name: item.name,
                price: item.price,
                unit: item.unit,
                variationWeight: item.variationWeight,
                image: item.image,
                quantity: item.quantity || 1,
            };
        });

        // ✅ create order
        const neworder = await Order.create({
            user: userid,
            items: sanitizedItems,
            paymentmethod,
            totalamount,
            address,
            couponCode: couponCode || null,
            discount: discount || 0,
            walletDiscount: walletDiscount || 0,
            farmerTip: farmerTip || 0,
            isSilentDelivery: isSilentDelivery || false,
            deliveryInstructions: deliveryInstructions || "",
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

            try {
                const UserWallet = (await import("@/model/wallet.model")).default;
                await UserWallet.findOneAndUpdate(
                    { user: userid },
                    {
                        $inc: { balance: -walletDiscount },
                        $push: {
                            transactions: {
                                type: "debit",
                                amount: walletDiscount,
                                description: `Redeemed on Order #${neworder._id.toString().slice(-6).toUpperCase()}`,
                                orderId: neworder._id.toString(),
                                createdAt: new Date(),
                            },
                        },
                    }
                );
            } catch (wErr) {
                console.warn("Wallet ledger sync warning:", wErr);
            }
        }

        // 🎟️ Mark Scratch Reward Coupon as Used if applied
        if (couponCode) {
            try {
                const ScratchReward = (await import("@/model/reward.model")).default;
                await ScratchReward.updateOne(
                    { couponCode: couponCode.toUpperCase() },
                    { $set: { isUsed: true, order: neworder._id } }
                );
            } catch (cErr) {
                console.warn("Coupon mark used note:", cErr);
            }
        }
        
        // 📉 Reduce stock safely
        const Grocery = (await import("@/model/groseri.model")).default;
        for (const item of items) {
            if (item.grocery && mongoose.Types.ObjectId.isValid(item.grocery)) {
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