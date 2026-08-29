"use client";

import React from "react";
import Link from "next/link";
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
} from "lucide-react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/CartSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import DigitalScratchCardModal from "@/components/DigitalScratchCardModal";

export default function OrderSuccess() {
  useGetMe();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state: RootState) => state.user);
  const [reward, setReward] = useState<any>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  useEffect(() => {
    dispatch(clearCart());

    // Fetch newly generated reward for this user/order
    axios
      .get("/api/user/rewards")
      .then((res) => {
        if (res.data?.success && res.data.rewards?.length > 0) {
          // Find first unscratched reward or latest reward
          const unscratched = res.data.rewards.find((r: any) => !r.isScratched);
          const activeReward = unscratched || res.data.rewards[0];
          setReward(activeReward);
          if (!activeReward.isScratched) {
            // Auto open scratch modal after 1 second for excitement!
            setTimeout(() => {
              setShowRewardModal(true);
            }, 1000);
          }
        }
      })
      .catch(() => {});
  }, [dispatch]);

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-3xl mx-auto px-4 py-12 pb-32 sm:pb-16 w-full flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 shadow-sm w-full"
        >
          {/* Animated Success Badge */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-gradient-to-tr from-[#0f8646] to-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-700/20">
              <CheckCircle2 size={48} className="stroke-[2.5]" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-[#0f8646] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Sparkles size={14} /> ORDER CONFIRMED
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Thank You for Your Order!
          </h1>

          <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Your farm-fresh harvest is being handpicked and packed at our nearest Bhopal Hub. Our express rider will reach you in <strong>10–15 minutes!</strong>
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-left">
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
            <div className="max-w-md mx-auto mb-8 bg-gradient-to-r from-amber-100 via-yellow-50 to-emerald-100 border-2 border-dashed border-amber-300 rounded-3xl p-4 sm:p-5 text-left flex items-center justify-between gap-3 shadow-md relative overflow-hidden">
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
              href="/user/myorder"
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
              href="https://wa.me/919981418565?text=Hello%20MyGreenDelight!%20I%20just%20placed%20an%20order.%20Please%20send%20me%20live%20delivery%20updates%20on%20WhatsApp."
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