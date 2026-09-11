import connectDb from "@/lib/db";
import Order from "@/model/order";
import User from "@/model/user.model";
import Setting from "@/model/setting.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        // ✅ read body once & sanitize
        const rawBody = await req.json();
        const body = sanitizeInput(rawBody);
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

        // 🛡️ UPI Handling: Validate UTR uniqueness if provided
        if (paymentmethod === "upi") {
            const cleanPaymentId = paymentId ? String(paymentId).trim() : "";
            if (cleanPaymentId && cleanPaymentId.startsWith("UTR_") && cleanPaymentId.length >= 8) {
                const existingOrderWithUtr = await Order.findOne({ paymentId: cleanPaymentId });
                if (existingOrderWithUtr) {
                    return NextResponse.json(
                        { 
                            success: false, 
                            message: "This UPI Reference Number has already been submitted for another order." 
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // 🔐 Authentication Check
        const { auth } = await import("@/auth");
        const session = await auth();
        if (!session?.user || (session.user.id !== userid && (session.user as any).role !== "admin")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Invalid or expired session" },
                { status: 401 }
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
            if (!isValidId) {
                return NextResponse.json(
                    { success: false, message: `Invalid produce item ID provided for "${item.name || 'item'}"` },
                    { status: 400 }
                );
            }

            const dbGrocery = await GroceryModel.findById(item.grocery);
            if (!dbGrocery) {
                return NextResponse.json(
                    { success: false, message: `Item "${item.name || 'produce'}" is no longer available.` },
                    { status: 400 }
                );
            }

            let realPrice = Number(dbGrocery.price);
            let realName = dbGrocery.name;
            let realImage = dbGrocery.image;
            let realUnit = dbGrocery.unit || "kg";
            let effectiveVariationWeight: string | null = null;
            const itemQty = Math.max(1, Math.min(100, Number(item.quantity) || 1));

            // Check if product has variations and match variation weight
            if (dbGrocery.variations && Array.isArray(dbGrocery.variations) && dbGrocery.variations.length > 0) {
                const requestedWeight = (item.variationWeight || item.unit || "").trim().toLowerCase();
                const matchedVar = dbGrocery.variations.find(
                    (v: any) => v.weight && v.weight.trim().toLowerCase() === requestedWeight
                ) || dbGrocery.variations.find(
                    (v: any) => item.variationWeight && v.weight && v.weight.trim() === item.variationWeight.trim()
                );

                if (matchedVar) {
                    effectiveVariationWeight = matchedVar.weight;
                    realUnit = matchedVar.weight;
                    realPrice = Number(matchedVar.price);
                    if (matchedVar.stock < itemQty) {
                        return NextResponse.json(
                            { success: false, message: `Insufficient stock for "${dbGrocery.name} (${matchedVar.weight})". Available: ${matchedVar.stock}` },
                            { status: 400 }
                        );
                    }
                } else if (item.variationWeight) {
                    // If variation was explicitly requested but not found in DB
                    effectiveVariationWeight = item.variationWeight;
                    realUnit = item.variationWeight;
                    if (dbGrocery.stock < itemQty) {
                        return NextResponse.json(
                            { success: false, message: `Insufficient stock for "${dbGrocery.name}". Available: ${dbGrocery.stock}` },
                            { status: 400 }
                        );
                    }
                } else {
                    if (dbGrocery.stock < itemQty) {
                        return NextResponse.json(
                            { success: false, message: `Insufficient stock for "${dbGrocery.name}". Available: ${dbGrocery.stock}` },
                            { status: 400 }
                        );
                    }
                }
            } else {
                effectiveVariationWeight = item.variationWeight || item.unit || realUnit;
                realUnit = item.unit || realUnit;
                if (dbGrocery.stock < itemQty) {
                    return NextResponse.json(
                        { success: false, message: `Insufficient stock for "${dbGrocery.name}". Available: ${dbGrocery.stock}` },
                        { status: 400 }
                    );
                }
            }

            verifiedSubtotal += realPrice * itemQty;

            sanitizedItems.push({
                grocery: item.grocery,
                groceryId: String(item.grocery),
                name: realName,
                price: realPrice,
                unit: effectiveVariationWeight || realUnit,
                variationWeight: effectiveVariationWeight || realUnit,
                image: realImage,
                quantity: itemQty,
            });
        }

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

        // Fetch dynamic delivery fee settings from Database
        let deliveryFeeCalc = 0;
        try {
            const storeSetting = await Setting.findOne({ key: "store_delivery_settings" }).lean();
            const baseFee = storeSetting?.deliveryFee ?? 30;
            const threshold = storeSetting?.freeDeliveryThreshold ?? 199;
            const isFreePromo = Boolean(storeSetting?.isFreeDeliveryActive);

            if (verifiedSubtotal > 0) {
                if (isFreePromo || baseFee === 0 || verifiedSubtotal >= threshold) {
                    deliveryFeeCalc = 0;
                } else {
                    deliveryFeeCalc = baseFee;
                }
            }
        } catch (setErr) {
            console.warn("Failed to fetch dynamic delivery fee, using default:", setErr);
            deliveryFeeCalc = verifiedSubtotal > 0 && verifiedSubtotal < 199 ? 30 : 0;
        }
        
        let walletDiscountCalc = Math.max(0, Number(walletDiscount) || 0);
        const currentWalletBal = Number(user.walletBalance) || 0;
        if (walletDiscountCalc > currentWalletBal) {
            walletDiscountCalc = currentWalletBal;
        }

        const finalTotalToSave = Math.max(0, verifiedSubtotal + deliveryFeeCalc - discountCalc - walletDiscountCalc);

        // 🔑 Generate 4-digit Doorstep Delivery Verification OTP
        const autoDeliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

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
            deliveryOtp: {
                code: autoDeliveryOtp,
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
                verified: false,
                attempts: 0,
            },
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

      // 🔔 Dispatch Multi-Channel Notifications (Admin Email, Customer Email & SMS)
      try {
        const { sendOrderNotifications } = await import("@/lib/orderNotifications");
        await sendOrderNotifications({
          orderId: neworder._id.toString(),
          customerId: user._id ? user._id.toString() : user.id ? user.id.toString() : undefined,
          customerName: user.name || address?.fullname || "Customer",
          customerMobile: user.mobile || address?.mobile || "",
          customerEmail: user.email || undefined,
          address: {
            fullname: address?.fullname,
            mobile: address?.mobile,
            fulladress: address?.fulladress,
            city: address?.city || "Bhopal",
            pincode: address?.pincode || "462043",
          },
          items: sanitizedItems.map((si: any) => ({
            name: si.name,
            quantity: si.quantity,
            price: si.price,
            unit: si.unit,
            variationWeight: si.variationWeight,
          })),
          subtotal: verifiedSubtotal,
          deliveryFee: deliveryFeeCalc,
          discount: discountCalc,
          walletDiscount: walletDiscountCalc,
          farmerTip: Number(farmerTip) || 0,
          totalAmount: finalTotalToSave,
          paymentMethod: String(paymentmethod || "cod"),
          paymentId: paymentId ? String(paymentId) : undefined,
          deliverySlot: String(deliverySlot || "Standard Morning"),
          createdAt: new Date(),
        });
      } catch (notifErr) {
        console.warn("Order notification dispatch note:", notifErr);
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