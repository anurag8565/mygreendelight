"use client";

import React, { useState, useEffect } from "react";
import { Crown, Sparkles, Check, ArrowRight, ShieldCheck, Sun, Zap, Gift, ArrowLeft, HeartHandshake, Truck, Star } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VipPassPage() {
  const router = useRouter();
  const [vipData, setVipData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
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
      // Handle guest
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
          fetchVipStatus();
        }, 1500);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#0f8646] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-gray-50 py-8 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Farm Store</span>
        </Link>

        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#042412] via-[#094723] to-[#0c592f] p-6 sm:p-10 text-white shadow-2xl border-2 border-amber-400/50 mb-8">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-950 font-black text-xs uppercase px-3.5 py-1 rounded-full shadow-md">
                <Crown size={15} />
                <span>SubziQuick Farm Club VIP</span>
              </span>
              {isMember && (
                <span className="bg-emerald-500/30 border border-emerald-400 text-emerald-200 text-xs font-black px-3 py-0.5 rounded-full">
                  👑 Active Member ({daysLeft} Days Left)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-3">
              Unlimited FREE Deliveries & Extra 10% Off On Fresh Fruits
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-6 font-medium">
              Join Bhopal&apos;s exclusive farm-to-table VIP membership for just ₹49/month. Save ₹400+ on your family&apos;s monthly farm produce basket!
            </p>

            {/* Action or Active Status */}
            {msg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-black mb-4 ${
                  msg.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {msg.text}
              </div>
            )}

            {!isMember ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleJoinVip}
                  disabled={isBuying}
                  className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 hover:from-yellow-300 hover:to-amber-300 text-gray-950 font-black py-3 px-8 rounded-2xl text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
                >
                  <Crown size={18} />
                  <span>{isBuying ? "Activating VIP..." : "Join Farm Club for ₹49 (30 Days)"}</span>
                  <ArrowRight size={16} />
                </button>

                <Link
                  href="/user/wallet"
                  className="bg-white/15 hover:bg-white/20 text-white font-bold py-3 px-5 rounded-2xl text-xs text-center border border-white/20 transition backdrop-blur-md"
                >
                  Wallet Balance: ₹{vipData?.walletBalance || 0} (Recharge)
                </Link>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center font-black">
                    <Check size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">VIP Farm Club Active</h3>
                    <p className="text-xs text-emerald-200">
                      Valid till {new Date(vipData.vipPass.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {daysLeft} Days Remaining
                    </p>
                  </div>
                </div>
                <Link
                  href="/shop"
                  className="bg-white text-[#0f8646] font-black text-xs px-4 py-2 rounded-xl shadow-md hover:bg-green-50 transition"
                >
                  Shop with FREE Delivery ➔
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3 VIP Member Super Perks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">
              Flat FREE Delivery
            </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
              Never pay ₹50 delivery charge again. Enjoy unlimited ₹0 delivery fees on every order, no matter how small or large your basket is.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-4">
              <Gift size={24} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">
              Daily 10% Extra on Fruits
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Special members-only 10% instant discount auto-unlocked across all seasonal orchard fruits (Apples, Mangoes, Papaya, Pomegranate, etc.).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-4">
              <Sun size={24} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">
              6:30 AM Priority Harvest
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Get exclusive access to the early morning 6:30 AM sunrise delivery slot. Your produce is picked fresh at dawn and delivered right to your breakfast table.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-black text-gray-900 mb-1">How is the ₹49 fee charged?</h4>
              <p className="text-gray-600 leading-relaxed">
                The ₹49 fee is deducted directly from your GreenPoints Wallet balance. You can recharge your wallet via UPI, GPay, or Paytm in seconds!
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-black text-gray-900 mb-1">Is there any minimum order limit for Free Delivery?</h4>
              <p className="text-gray-600 leading-relaxed">
                None! VIP members enjoy ₹0 Delivery fee on all orders regardless of cart total.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-black text-gray-900 mb-1">Can I combine VIP Free Delivery with discount coupons?</h4>
              <p className="text-gray-600 leading-relaxed">
                Yes! Your VIP Free Delivery and 10% fruit discounts stack seamlessly with promotional coupon codes and wallet cashbacks!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
