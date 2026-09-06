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
        const {
            userid,
            items,
            paymentmethod,
            totalamount,
            address,
            couponCode,
            discount,
            walletDiscount,
            farmerTip,
            isSilentDelivery,
            deliveryInstructions,
            deliverySlot,
            paymentId,
            paymentProofImage,
        } = body;

        // ❌ validation
        if (!userid || !items || !Array.isArray(items) || items.length === 0 || !address) {
            return NextResponse.json(
                { success: false, message: "Missing required order information or empty cart" },
                { status: 400 }
            );
        }

        // 🛡️ Prevent Fake UPI: Duplicate UTR & Format Validation
        if (paymentmethod === "upi") {
            const cleanPaymentId = paymentId ? String(paymentId).trim() : "";
            if (!cleanPaymentId || cleanPaymentId.length < 6) {
                return NextResponse.json(
                    { success: false, message: "A valid 12-digit UPI UTR / Reference Number is required for UPI orders." },
                    { status: 400 }
                );
            }

            const existingOrderWithUtr = await Order.findOne({ paymentId: cleanPaymentId });
            if (existingOrderWithUtr) {
                return NextResponse.json(
                    { 
                        success: false, 
                        message: "⚠️ This UPI UTR / Reference Number has already been submitted for another order. Please check your payment receipt and enter your unique UTR." 
                    },
                    { status: 400 }
                );
            }
        }

        // ✅ check user exists
        const user = await User.findById(userid);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Validate Bhopal Delivery Zone
        const pincodeStr = String(address?.pincode || "").trim();
        if (!pincodeStr.startsWith("462")) {
            return NextResponse.json(
                { success: false, message: "Delivery is available exclusively across Bhopal city (MP - 462xxx)." },
                { status: 400 }
            );
        }
        address.city = "Bhopal";
        address.state = "Madhya Pradesh";

        // Sanitize items & fetch real produce data from DB to prevent client price tampering
        const GroceryModel = (await import("@/model/groseri.model")).default;
        const sanitizedItems: any[] = [];
        let verifiedSubtotal = 0;

        for (const item of items) {
            const isValidId = item.grocery && mongoose.Types.ObjectId.isValid(item.grocery);
            let realPrice = Number(item.price) || 0;
            let realName = item.name;
            let realImage = item.image;
            let realUnit = item.unit;

            if (isValidId) {
                const dbGrocery = await GroceryModel.findById(item.grocery);
                if (dbGrocery) {
                    realName = dbGrocery.name || item.name;
                    realImage = dbGrocery.image || item.image;
                    realUnit = dbGrocery.unit || item.unit;

                    if (item.variationWeight && dbGrocery.variations && dbGrocery.variations.length > 0) {
                        const matchedVar = dbGrocery.variations.find((v: any) => v.weight === item.variationWeight);
                        if (matchedVar && matchedVar.price) {
                            realPrice = Number(matchedVar.price);
                        } else {
                            realPrice = Number(dbGrocery.price);
                        }
                    } else {
                        realPrice = Number(dbGrocery.price);
                    }
                }
            }

            const itemQty = Math.max(1, Math.min(100, Number(item.quantity) || 1));
            verifiedSubtotal += realPrice * itemQty;

            sanitizedItems.push({
                grocery: isValidId ? item.grocery : undefined,
                groceryId: item.grocery ? String(item.grocery) : undefined,
                name: realName,
                price: realPrice,
                unit: realUnit,
                variationWeight: item.variationWeight,
                image: realImage,
                quantity: itemQty,
            });
        }

        // Check VIP Farm Club membership
        // Check VIP Farm Club membership
        const isVip = Boolean(
            user.vipPass?.isActive &&
            user.vipPass.endDate &&
            new Date(user.vipPass.endDate) > new Date()
        );

        // Server-side Coupon & Reward Validation
        let discountCalc = 0;
        let validatedCouponCode: string | null = null;
        let scratchRewardToUpdate: any = null;

        if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
            const cleanCode = couponCode.trim().toUpperCase();
            try {
                const CouponModel = (await import("@/model/coupon.model")).default;
                const dbCoupon = await CouponModel.findOne({ code: cleanCode, isActive: true });

                if (dbCoupon && new Date(dbCoupon.expiryDate) >= new Date() && verifiedSubtotal >= (dbCoupon.minOrderValue || 0)) {
                    validatedCouponCode = cleanCode;
                    if (dbCoupon.discountType === "percentage") {
                        let disc = Math.round((verifiedSubtotal * Number(dbCoupon.discountValue || 0)) / 100);
                        if (dbCoupon.maxDiscount && disc > dbCoupon.maxDiscount) {
                            disc = dbCoupon.maxDiscount;
                        }
                        discountCalc = disc;
                    } else {
                        discountCalc = Number(dbCoupon.discountValue || 0);
                    }
                } else {
                    const RewardModel = (await import("@/model/reward.model")).default;
                    const dbReward = await RewardModel.findOne({ couponCode: cleanCode, isUsed: false });
                    if (dbReward && new Date(dbReward.expiresAt) >= new Date()) {
                        const minReq = dbReward.minOrderAmount || dbReward.minOrderValue || 199;
                        if (verifiedSubtotal >= minReq) {
                            validatedCouponCode = cleanCode;
                            let disc = dbReward.discountAmount || dbReward.discountValue || 20;
                            if (dbReward.discountType === "percent") {
                                disc = Math.round((verifiedSubtotal * disc) / 100);
                            }
                            discountCalc = disc;
                            scratchRewardToUpdate = dbReward;
                        }
                    }
                }
            } catch (cErr) {
                console.warn("Coupon validation error during order creation:", cErr);
            }
        }

        discountCalc = Math.min(discountCalc, verifiedSubtotal);

        // Compute verified total to prevent price tampering
        const deliveryFeeCalc = isVip ? 0 : (verifiedSubtotal > 0 && verifiedSubtotal < 199 ? 30 : 0);
        
        let walletDiscountCalc = Math.max(0, Number(walletDiscount) || 0);
        const currentWalletBal = Number(user.walletBalance) || 0;
        if (walletDiscountCalc > currentWalletBal) {
            walletDiscountCalc = currentWalletBal;
        }

        const finalTotalToSave = Math.max(0, verifiedSubtotal + deliveryFeeCalc - discountCalc - walletDiscountCalc);

        if (isVip && verifiedSubtotal > 0 && verifiedSubtotal < 199) {
            await User.findByIdAndUpdate(userid, { $inc: { "vipPass.totalSavings": 30 } });
        }

        // ✅ create order
        const neworder = await Order.create({
            user: userid,
            items: sanitizedItems,
            paymentmethod,
            totalamount: finalTotalToSave,
            address,
            couponCode: validatedCouponCode,
            discount: discountCalc,
            walletDiscount: walletDiscountCalc,
            farmerTip: 0,
            isSilentDelivery: isSilentDelivery || false,
            deliveryInstructions: deliveryInstructions || "",
            deliverySlot: deliverySlot || "Instant Express (30-45 Mins)",
            paymentId: paymentId || null,
            paymentProofImage: paymentProofImage || null,
            paymentStatus: "pending",
            ispaid: false,
        });

        // Mark single-use scratch reward as used
        if (scratchRewardToUpdate) {
            try {
                scratchRewardToUpdate.isUsed = true;
                scratchRewardToUpdate.usedInOrder = neworder._id;
                await scratchRewardToUpdate.save();
            } catch (rErr) {
                console.warn("Error marking scratch reward as used:", rErr);
            }
        }

        // 💰 Deduct GreenPoints Wallet atomically if redeemed
        if (walletDiscountCalc > 0) {
            await User.findOneAndUpdate(
                { _id: userid, walletBalance: { $gte: walletDiscountCalc } },
                {
                    $inc: { walletBalance: -walletDiscountCalc },
                    $push: {
                        walletHistory: {
                            amount: walletDiscountCalc,
                            type: "debit",
                            description: `Redeemed GreenPoints on Order #${neworder._id.toString().slice(-6).toUpperCase()}`,
                            date: new Date(),
                        },
                    },
                }
            );

            try {
                const UserWallet = (await import("@/model/wallet.model")).default;
                await UserWallet.findOneAndUpdate(
                    { user: userid, balance: { $gte: walletDiscountCalc } },
                    {
                        $inc: { balance: -walletDiscountCalc },
                        $push: {
                            transactions: {
                                type: "debit",
                                amount: walletDiscountCalc,
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
        
        // 📉 Reduce stock safely with non-negative protection
        for (const item of sanitizedItems) {
            if (item.grocery && mongoose.Types.ObjectId.isValid(item.grocery)) {
                if (item.variationWeight) {
                    await GroceryModel.updateOne(
                        { _id: item.grocery, "variations.weight": item.variationWeight, "variations.stock": { $gte: item.quantity } },
                        { $inc: { "variations.$.stock": -item.quantity } }
                    );
                } else {
                    await GroceryModel.updateOne(
                        { _id: item.grocery, stock: { $gte: item.quantity } },
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