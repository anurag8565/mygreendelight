"use client";

import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DailyRewardWidget from "@/components/DailyRewardWidget";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import axios from "axios";
import Link from "next/link";
import {
  Tag,
  Percent,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Gift,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function OffersPage() {
  const { userdata } = useSelector((state: RootState) => state.user);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/coupons/all");
      if (res.data?.success && res.data.coupons) {
        setCoupons(res.data.coupons);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] flex flex-col font-sans">
      <Nav user={userdata as any} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 md:px-8 py-6 sm:py-10">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#032412] via-[#073b1d] to-[#0f8646] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden mb-6 sm:mb-8">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="bg-white/20 text-emerald-200 border border-white/20 text-xs font-black uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3">
              <Sparkles size={14} className="text-amber-400" />
              <span>Verified Savings & Deals</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2">
              Discount Coupons & Daily Rewards
            </h1>
            <p className="text-xs sm:text-sm text-green-100/90 leading-relaxed">
              Unlock exclusive Bhopal farm-fresh discounts, copy coupon codes with 1-tap, and apply them at checkout for instant price drops!
            </p>
          </div>
        </div>

        {/* 1. Daily Lucky Scratch Card Widget */}
        <div className="mb-8">
          <DailyRewardWidget />
        </div>

        {/* 2. Active Promo Codes Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black">
                <Tag size={18} />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-gray-900">
                  Active Discount Coupons
                </h2>
                <p className="text-xs text-gray-500">
                  Tap to copy code and apply at checkout
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="text-xs sm:text-sm font-black text-[#0f8646] hover:text-[#0c6a38] flex items-center gap-1 transition"
            >
              <span>Shop All Produce</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-200">
              <p className="text-sm font-bold text-gray-500">No active coupons right now. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {coupons.map((coupon, idx) => {
                const isPercentage = coupon.discountType === "percentage";
                const isCopied = copiedCode === coupon.code;

                return (
                  <motion.div
                    key={coupon._id || idx}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-3xl border-2 border-dashed border-emerald-300/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
                  >
                    {/* Corner Tag */}
                    <div className="absolute top-0 right-0 bg-emerald-50 text-[#0f8646] text-[10px] font-black uppercase px-3 py-1 rounded-bl-2xl border-l border-b border-emerald-200">
                      Verified
                    </div>

                    <div>
                      {/* Discount Value */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl sm:text-3xl font-black text-gray-900">
                          {isPercentage ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-600 mb-3">
                        On minimum produce order of <strong>₹{coupon.minOrderValue || 199}</strong>
                      </p>

                      <p className="text-[11px] text-gray-400 font-medium line-clamp-1 mb-4">
                        Valid for all fresh fruits, vegetables, dairy & contract farm harvest.
                      </p>
                    </div>

                    {/* Coupon Code Strip & Copy Button */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl font-mono font-black text-xs sm:text-sm text-emerald-950 tracking-wider">
                        {coupon.code}
                      </div>

                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                          isCopied
                            ? "bg-[#0f8646] text-white"
                            : "bg-gray-100 hover:bg-emerald-100 text-gray-800 hover:text-[#0f8646]"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check size={13} />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. How to Use Promo Codes Banner */}
        <div className="bg-emerald-50/70 rounded-3xl p-5 sm:p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#0f8646] flex items-center justify-center font-black shadow-2xs shrink-0 border border-emerald-200">
              <Zap size={22} className="text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">
                Ready to Save on Fresh Bhopal Produce?
              </h4>
              <p className="text-xs text-gray-500">
                Add fresh vegetables & fruits to cart and paste your coupon at checkout.
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="w-full sm:w-auto bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>Start Shopping ➔</span>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
