"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
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
  PartyPopper,
  Receipt,
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

  useEffect(() => {
    dispatch(clearCart());

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

    // Fetch newly generated reward for this user/order
    axios
      .get("/api/user/rewards")
      .then((res) => {
        if (res.data?.success && res.data.rewards?.length > 0) {
          const unscratched = res.data.rewards.find((r: any) => !r.isScratched);
          const activeReward = unscratched || res.data.rewards[0];
          setReward(activeReward);
          if (!activeReward.isScratched) {
            setTimeout(() => {
              setShowRewardModal(true);
            }, 1000);
          }
        }
      })
      .catch(() => {});
  }, [dispatch, orderId]);

  const displayTotal = orderDetails?.totalamount ?? (amountParam ? Number(amountParam) : 0);
  const formattedOrderId = orderId ? `#MGD-${orderId.slice(-6).toUpperCase()}` : "CONFIRMED";

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-3xl mx-auto px-4 py-10 pb-32 sm:pb-16 w-full flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-12 shadow-sm w-full"
        >
          {/* Animated Success Badge */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-[#0f8646] to-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-700/20">
              <CheckCircle2 size={44} className="stroke-[2.5]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-[#0f8646] text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles size={14} /> ORDER CONFIRMED
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
            Thank You for Your Order!
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Your farm-fresh harvest is packed and ready for express delivery to your doorstep.
          </p>

          {/* Verified Order Receipt Box */}
          <div className="bg-gradient-to-r from-emerald-50/70 via-gray-50 to-green-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 max-w-md mx-auto mb-6 text-left shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/80 mb-3 text-xs">
              <div className="flex items-center gap-1.5 font-black text-gray-800">
                <Receipt size={16} className="text-[#0f8646]" />
                <span>Order ID: <span className="text-[#0f8646] font-mono">{formattedOrderId}</span></span>
              </div>
              <span className="bg-white text-emerald-800 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                {orderDetails?.paymentmethod === "cod" ? "Cash On Delivery" : "Online Verified"}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 block">Total Order Payable</span>
                <span className="text-[10px] text-emerald-700 font-medium">Bhopal Mandi Fresh Produce</span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#0f8646]">
                  ₹{displayTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-6 text-left">
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-[#0f8646] mb-1">
                <Clock size={16} />
                <span className="font-extrabold text-xs text-gray-900">10-15 Mins</span>
              </div>
              <p className="text-[10px] text-gray-500">Express Delivery</p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-[#0f8646] mb-1">
                <ShieldCheck size={16} />
                <span className="font-extrabold text-xs text-gray-900">100% Organic</span>
              </div>
              <p className="text-[10px] text-gray-500">Farm Verified</p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-[#0f8646] mb-1">
                <Truck size={16} />
                <span className="font-extrabold text-xs text-gray-900">Live GPS</span>
              </div>
              <p className="text-[10px] text-gray-500">Rider Navigation</p>
            </div>
          </div>

          {/* Scratch Card Prize Banner */}
          {reward && (
            <div className="max-w-md mx-auto mb-6 bg-gradient-to-r from-amber-100 via-yellow-50 to-emerald-100 border-2 border-dashed border-amber-300 rounded-3xl p-4 sm:p-5 text-left flex items-center justify-between gap-3 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shrink-0 animate-bounce">
                  <Gift size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Cashback Reward Unlocked
                  </span>
                  <h4 className="font-black text-sm text-gray-900 leading-tight">
                    {reward.isScratched
                      ? `You won FLAT ₹${reward.discountAmount} OFF!`
                      : "Scratch to Reveal Your Cashback!"}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {reward.isScratched
                      ? `Code: ${reward.couponCode}`
                      : "Tap to scratch & win next order discount"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRewardModal(true)}
                className="px-4 py-2.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer shrink-0"
              >
                {reward.isScratched ? "View Code" : "Scratch 🎁"}
              </button>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href={orderId ? `/track/${orderId}` : "/user/myorder"}
              className="w-full sm:w-auto flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck size={16} />
              <span>Track Live Delivery</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto flex-1 bg-white border border-gray-300 hover:border-green-500 text-gray-700 hover:text-[#0f8646] py-3.5 px-6 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* WhatsApp Direct Updates Button */}
          <div className="max-w-md mx-auto mt-4 pt-4 border-t border-gray-100">
            <a
              href={`https://wa.me/919981418565?text=Hello%20MyGreenDelight!%20I%20just%20placed%20order%20${formattedOrderId}.%20Please%20send%20me%20live%20delivery%20updates%20on%20WhatsApp.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white py-3 px-5 rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-base">💬</span>
              <span>Get Order Updates on WhatsApp</span>
            </a>
          </div>
        </motion.div>
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-10 h-10 border-4 border-[#0f8646] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}