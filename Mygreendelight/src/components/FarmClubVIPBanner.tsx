"use client";

import React, { useState, useEffect } from "react";
import { Crown, Sparkles, Check, ArrowRight, ShieldCheck, Sun, Zap, Gift, X } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FarmClubVIPBanner() {
  const router = useRouter();
  const [vipData, setVipData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchVipStatus();
  }, []);

  const fetchVipStatus = async () => {
    try {
      const res = await axios.get("/api/user/vip-pass");
      if (res.data.success) {
        setVipData(res.data);
      }
    } catch (e) {
      // Not logged in or guest
    } finally {
      setLoading(false);
    }
  };

  const handleJoinVip = async () => {
    setIsBuying(true);
    setMsg(null);
    try {
      const res = await axios.post("/api/user/vip-pass");
      if (res.data.success) {
        setMsg({ type: "success", text: res.data.message });
        setTimeout(() => {
          setShowModal(false);
          fetchVipStatus();
        }, 2000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to activate VIP Pass";
      setMsg({ type: "error", text: errorMsg });
      if (error.response?.data?.needsRecharge) {
        setTimeout(() => {
          router.push("/user/wallet");
        }, 2500);
      }
    } finally {
      setIsBuying(false);
    }
  };

  const isMember = vipData?.isMember;
  const daysLeft = vipData?.vipPass?.daysRemaining || 0;

  return (
    <div className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Main VIP Gold / Emerald Container */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#042412] via-[#094723] to-[#0c592f] p-6 sm:p-10 text-white shadow-xl border-2 border-amber-400/40">
          
          {/* Ambient Lighting */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Headline & Core Perks */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow-md">
                  <Crown size={15} />
                  <span>MyGreenDelight Farm Club</span>
                </span>
                {isMember ? (
                  <span className="bg-emerald-500/30 border border-emerald-400 text-emerald-200 text-xs font-extrabold px-3 py-0.5 rounded-full">
                    👑 Active Member ({daysLeft} Days Left)
                  </span>
                ) : (
                  <span className="bg-white/10 text-yellow-300 text-xs font-extrabold px-3 py-0.5 rounded-full border border-white/10">
                    VIP Green Pass
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight mb-3">
                Save ₹400+ Every Month On Pure Bhopal Farm Produce
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-6 font-medium">
                Get unlimited free deliveries, daily discounts on fresh orchard fruits, and early morning 6:30 AM harvest dispatch!
              </p>

              {/* 3 Core Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <div className="flex items-center gap-2 text-yellow-300 font-black text-xs mb-1">
                    <Zap size={15} />
                    <span>Flat FREE Delivery</span>
                  </div>
                  <p className="text-[11px] text-emerald-100">
                    ₹0 delivery charges on all orders, no minimum cart value needed!
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <div className="flex items-center gap-2 text-yellow-300 font-black text-xs mb-1">
                    <Gift size={15} />
                    <span>10% Extra on Fruits</span>
                  </div>
                  <p className="text-[11px] text-emerald-100">
                    Daily 10% instant discount auto-unlocked across all seasonal fruits.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <div className="flex items-center gap-2 text-yellow-300 font-black text-xs mb-1">
                    <Sun size={15} />
                    <span>6:30 AM Priority Slot</span>
                  </div>
                  <p className="text-[11px] text-emerald-100">
                    First priority morning slot directly picked from sunrise harvest.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Pricing Box & Action */}
            <div className="w-full lg:w-auto shrink-0 bg-white/10 backdrop-blur-xl border-2 border-amber-400/50 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-2xl">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Exclusive Membership
              </span>
              
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl sm:text-4xl font-black text-white">₹49</span>
                <span className="text-xs text-emerald-200 font-bold">/ month</span>
              </div>

              <p className="text-[11px] text-emerald-100 max-w-[200px] mb-5">
                Pay just ₹49 once and unlock 30 days of VIP privileges.
              </p>

              {!isMember ? (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 hover:from-yellow-300 hover:to-amber-300 text-gray-950 font-black py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
                >
                  <Crown size={16} />
                  <span>Join Farm Club for ₹49</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <div className="w-full bg-emerald-700/80 border border-emerald-400/60 py-3 px-6 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-inner">
                  <Check size={16} className="text-yellow-300" />
                  <span>VIP Pass Active ({daysLeft} Days)</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Modal: Join VIP Pass Confirmation */}
      <AnimatePresence>
        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="cursor-default bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative text-gray-900 animate-in fade-in zoom-in-95 duration-200"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition border border-gray-200 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 mx-auto shadow-inner">
                <Crown size={28} />
              </div>

              <h3 className="text-xl font-black text-center text-gray-900 mb-1">
                Activate VIP Farm Club Pass
              </h3>
              <p className="text-xs text-gray-500 text-center mb-6">
                30 Days of Unlimited Free Delivery & 10% Extra Fruit Discounts
              </p>

              {/* Summary Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Membership Duration:</span>
                  <span className="font-bold text-gray-900">30 Days</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Your Current Wallet Balance:</span>
                  <span className="font-bold text-emerald-700">₹{vipData?.walletBalance || 0}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-black text-sm text-gray-900">
                  <span>Pass Price:</span>
                  <span className="text-[#0f8646]">₹49</span>
                </div>
              </div>

              {msg && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold mb-4 ${
                    msg.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleJoinVip}
                  disabled={isBuying}
                  className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isBuying ? "Activating..." : "Pay ₹49 From Wallet & Activate"}
                </button>

                <Link
                  href="/user/wallet"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs text-center transition"
                >
                  Recharge Wallet / Add Money
                </Link>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
