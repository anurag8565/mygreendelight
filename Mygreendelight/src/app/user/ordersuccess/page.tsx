"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Clock,
  Gift,
  Receipt,
  Users,
  Copy,
  Check,
  Share2,
  MessageCircle,
  MapPin,
  Leaf,
  ChevronRight,
  Package,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/CartSlice";
import axios from "axios";
import DigitalScratchCardModal from "@/components/DigitalScratchCardModal";

function OrderSuccessContent() {
  useGetMe();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amountParam = searchParams.get("amount");

  const { userdata } = useSelector((state: RootState) => state.user);
  const [reward, setReward] = useState<any>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(clearCart());

    // 🔔 Instant Order Confirmation Push Notification & OneSignal tagging
    if (typeof window !== "undefined") {
      try {
        const shortId = orderId ? `#${String(orderId).slice(-6).toUpperCase()}` : "";
        const notifTitle = `🌿 SubziQuick: Order Confirmed ${shortId}`;
        const notifBody = "Aapka order successfully place ho gaya hai! 10-15 min me Bagsewaniya Mandi hub se deliver hoga.";

        // 1. OneSignal User Tagging
        if ((window as any).OneSignalDeferred) {
          (window as any).OneSignalDeferred.push(async function (OneSignal: any) {
            try {
              if (orderId) {
                await OneSignal.User.addTag("last_order_id", String(orderId));
                await OneSignal.User.addTag("customer_tier", "active_buyer");
              }
              if (OneSignal.Notifications && !OneSignal.Notifications.permission) {
                await OneSignal.Notifications.requestPermission();
              }
            } catch (_) {}
          });
        }

        // 2. Native Browser Push Notification
        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification(notifTitle, {
              body: notifBody,
              icon: "/hero_basket.jpg",
              badge: "/hero_basket.jpg",
            });
          } else if (Notification.permission === "default") {
            Notification.requestPermission().then((perm) => {
              if (perm === "granted") {
                new Notification(notifTitle, {
                  body: notifBody,
                  icon: "/hero_basket.jpg",
                  badge: "/hero_basket.jpg",
                });
              }
            });
          }
        }

        // 3. Synthesize a clean pleasant confirmation chime via Web Audio API
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const now = ctx.currentTime;
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(659.25, now);
          gain1.gain.setValueAtTime(0.12, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.35);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(987.77, now + 0.12);
          gain2.gain.setValueAtTime(0.15, now + 0.12);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now + 0.12);
          osc2.stop(now + 0.55);
        }
      } catch (notifErr) {
        console.warn("Client notification note:", notifErr);
      }
    }

    // If orderId is present, fetch exact order details
    if (orderId) {
      axios
        .get(`/api/user/trackorder/${orderId}`)
        .then((res) => {
          if (res.data?.success) {
            setOrderDetails(res.data.order);
          }
        })
        .catch(() => {});
    }

    // Fetch or Generate Scratch Card Reward for this order
    const loadReward = async () => {
      try {
        const res = await axios.get("/api/user/rewards");
        if (res.data?.success) {
          if (res.data.todayClaim) {
            const claim = res.data.todayClaim;
            const rewardObj = {
              _id: claim._id,
              couponCode: claim.couponCode,
              discountAmount: claim.discountValue || 30,
              minOrderValue: claim.minOrderValue || 199,
              isScratched: claim.isScratched || false,
            };
            setReward(rewardObj);
            if (!claim.isScratched) {
              setTimeout(() => setShowRewardModal(true), 1200);
            }
          } else {
            // Generate fresh scratch reward for this successful purchase!
            const postRes = await axios.post("/api/user/rewards", {});
            if (postRes.data?.success && postRes.data.reward) {
              const r = postRes.data.reward;
              const rewardObj = {
                _id: r._id,
                couponCode: r.couponCode,
                discountAmount: r.discountValue || 30,
                minOrderAmount: r.minOrderValue || 199,
                isScratched: false,
              };
              setReward(rewardObj);
              setTimeout(() => setShowRewardModal(true), 1200);
            }
          }
        }
      } catch (err) {
        console.error("Reward load error:", err);
      }
    };

    loadReward();
  }, [dispatch, orderId]);

  const displayTotal = orderDetails?.totalamount ?? (amountParam ? Number(amountParam) : 0);
  const formattedOrderId = orderId ? `#SZQ-${orderId.slice(-6).toUpperCase()}` : "#SZQ-ORDER";

  const isUpiOrder = orderDetails?.paymentmethod === "upi" || searchParams.get("method") === "upi";
  const isPaid = Boolean(orderDetails?.ispaid);
  const isPendingUpi = isUpiOrder && !isPaid;

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(formattedOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const customerName =
    orderDetails?.address?.fullname ||
    orderDetails?.customer ||
    userdata?.name ||
    "Valued Customer";

  const customerMobile =
    orderDetails?.address?.mobile || userdata?.mobile || "N/A";

  const customerAddress =
    orderDetails?.address?.fulladress ||
    (orderDetails?.address?.locality ? `${orderDetails.address.locality}, Bhopal` : "Bhopal, MP");

  const deliverySlot = orderDetails?.deliverySlot || "Morning Farm Harvest (Same Day)";
  const paymentMethodText =
    orderDetails?.paymentmethod === "cod" || searchParams.get("method") === "cod"
      ? "Cash on Delivery"
      : isPaid
      ? "UPI / Online Paid"
      : "UPI (Verification Pending)";

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col justify-between font-sans text-gray-900">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12 pb-28 sm:pb-20 w-full flex-1 flex flex-col items-center">
        
        {/* Soft Radial Ambient Glow */}
        <div className="relative w-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-[2rem] border border-gray-200/70 p-6 sm:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full text-center"
          >
            {/* Top Animated Check Icon */}
            {isPendingUpi ? (
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-amber-200 rounded-full animate-ping opacity-30" />
                <div className="relative w-20 h-20 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                  <Clock size={38} className="stroke-[2.5]" />
                </div>
              </div>
            ) : (
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-emerald-300 rounded-full animate-ping opacity-30" />
                <div className="relative w-20 h-20 bg-gradient-to-tr from-[#0f8646] to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-700/25">
                  <CheckCircle2 size={40} className="stroke-[2.5]" />
                </div>
              </div>
            )}

            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase mb-2.5 bg-emerald-50 text-[#0f8646] border border-emerald-200/80">
              <Sparkles size={12} />
              <span>{isPendingUpi ? "Payment Under Review" : "Order Confirmed"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
              {isPendingUpi ? "Order Placed Successfully!" : "Thank You for Your Order!"}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
              {isPendingUpi
                ? "Aapka order receive ho gaya hai. Bhopal store team payment verify karke dispatch karegi."
                : "Your farm-fresh harvest is being handpicked & packed for express delivery."}
            </p>

            {/* Minimalist 3-Step Timeline */}
            <div className="bg-gray-50/80 rounded-2xl p-3 sm:p-3.5 mb-6 border border-gray-100">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-1.5 text-[#0f8646]">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                  <span>Placed</span>
                </div>
                <div className="h-[2px] flex-1 bg-emerald-200 mx-2" />
                <div className="flex items-center gap-1.5 text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black animate-pulse">
                    2
                  </span>
                  <span>Packing</span>
                </div>
                <div className="h-[2px] flex-1 bg-gray-200 mx-2" />
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  <span>Delivery</span>
                </div>
              </div>
            </div>

            {/* Premium Minimal Receipt Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 text-left mb-6 shadow-2xs space-y-4">
              {/* Header: ID + Method */}
              <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-[#0f8646]" />
                  <span className="text-xs font-black text-gray-900 font-mono tracking-wide">
                    {formattedOrderId}
                  </span>
                  <button
                    onClick={handleCopyOrderId}
                    className="text-gray-400 hover:text-gray-700 transition cursor-pointer p-0.5"
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    orderDetails?.paymentmethod === "cod" || searchParams.get("method") === "cod"
                      ? "bg-gray-50 text-gray-700 border-gray-200"
                      : isPaid
                      ? "bg-emerald-50 text-[#0f8646] border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {paymentMethodText}
                </span>
              </div>

              {/* Items preview if available */}
              {orderDetails?.items && orderDetails.items.length > 0 && (
                <div className="space-y-2 pb-3.5 border-b border-gray-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Package size={13} className="text-gray-400" />
                      Harvest Basket ({orderDetails.items.length} {orderDetails.items.length === 1 ? "Item" : "Items"})
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">100% Farm Fresh</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {orderDetails.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-emerald-50/60 border border-gray-100 shrink-0 flex items-center justify-center p-1">
                            <img
                              src={
                                item.image ||
                                "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
                              }
                              alt={item.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80";
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-gray-900 truncate text-[12px]">
                              {item.name}
                            </p>
                            <p className="text-[10.5px] text-gray-400 font-medium">
                              Qty: {item.quantity} × {item.variationWeight || item.unit || "unit"}
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-gray-900 text-xs shrink-0 ml-2">
                          ₹{item.price * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-0.5">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-[#0f8646] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Deliver To
                    </span>
                    <p className="font-extrabold text-gray-900 text-xs truncate">
                      {customerName}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {customerAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Delivery Slot
                    </span>
                    <p className="font-extrabold text-gray-900 text-xs">
                      {deliverySlot}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                      <Zap size={11} className="text-amber-500 fill-amber-500" />
                      Express 15-45 Mins
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Payable Row */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">
                    Total Amount
                  </span>
                  <span className="text-[10.5px] text-emerald-700 font-bold">
                    Taxes & Packaging Included
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#0f8646]">
                    ₹{displayTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Single Clean WhatsApp Confirmation / Receipt Action */}
            <a
              href={`https://wa.me/919981418565?text=${encodeURIComponent(
                `*🔔 NAYA ORDER PLACED - SubziQuick*\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `🛒 *Order ID:* #${(orderId || "").slice(-6).toUpperCase()}\n` +
                `👤 *Customer:* ${customerName} (${customerMobile})\n` +
                `📍 *Address:* ${customerAddress}\n` +
                `💵 *Total Bill:* ₹${displayTotal} (${orderDetails?.paymentmethod?.toUpperCase() || "COD"})\n` +
                `⏰ *Slot:* ${deliverySlot}\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `Please confirm dispatch & delivery timing! 🙏`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer mb-5"
            >
              <MessageCircle size={17} />
              <span>Send Order Confirmation to Store on WhatsApp</span>
            </a>

            {/* Scratch Card Prize Banner (If available) */}
            {reward && (
              <div className="mb-6 bg-gradient-to-r from-amber-50 via-yellow-50/80 to-emerald-50 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                    <Gift size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-800 block">
                      Cashback Unlocked
                    </span>
                    <h4 className="font-black text-xs sm:text-sm text-gray-900 truncate">
                      {reward.isScratched
                        ? `You won FLAT ₹${reward.discountAmount} OFF!`
                        : "Scratch to Win Cash Discount!"}
                    </h4>
                    <p className="text-[10.5px] text-gray-500 truncate">
                      {reward.isScratched
                        ? `Coupon: ${reward.couponCode}`
                        : "Tap to scratch & unlock reward"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRewardModal(true)}
                  className="px-3.5 py-2 bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer shrink-0"
                >
                  {reward.isScratched ? "View" : "Scratch & Win"}
                </button>
              </div>
            )}

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
              <Link
                href={orderId ? `/track/${orderId}` : "/user/myorder"}
                className="w-full sm:flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck size={16} />
                <span>Track Live Delivery</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/shop"
                className="w-full sm:flex-1 bg-white border border-gray-200 hover:border-[#0f8646] text-gray-700 hover:text-[#0f8646] py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <ShoppingBag size={16} />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Minimal SubziQuick Guarantee Tagline */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] text-gray-400 font-bold">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#0f8646]" /> 100% Quality Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Leaf size={13} className="text-[#0f8646]" /> Farm Direct Bhopal
              </span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Digital Scratch Card Modal */}
      {reward && (
        <DigitalScratchCardModal
          isOpen={showRewardModal}
          reward={reward}
          onClose={() => setShowRewardModal(false)}
          onSuccess={() => {
            setReward((prev: any) => ({ ...prev, isScratched: true }));
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
          <div className="w-10 h-10 border-4 border-[#0f8646] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}