"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, Check, ArrowRight, Copy } from "lucide-react";
import axios from "axios";
import DigitalScratchCardModal from "./DigitalScratchCardModal";

export default function DailyRewardWidget() {
  const [reward, setReward] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user already claimed today
    axios
      .get("/api/user/rewards")
      .then((res) => {
        if (res.data?.success && res.data.todayClaim) {
          const claim = res.data.todayClaim;
          setReward({
            _id: claim._id,
            couponCode: claim.couponCode,
            discountAmount: claim.discountValue || 30,
            minOrderAmount: claim.minOrderValue || 199,
            isScratched: true,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStartScratch = async () => {
    if (reward) {
      setIsModalOpen(true);
      return;
    }

    try {
      const res = await axios.post("/api/user/rewards", {});
      if (res.data?.success && res.data.reward) {
        const r = res.data.reward;
        setReward({
          _id: r._id,
          couponCode: r.couponCode,
          discountAmount: r.discountValue || 30,
          minOrderAmount: r.minOrderValue || 199,
          isScratched: false,
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    if (!reward?.couponCode) return;
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full py-3.5 sm:py-5 bg-[#f5f6f5] border-b border-gray-200/60 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-white border border-emerald-200/80 shadow-[0_2px_12px_rgba(15,134,70,0.06)] flex items-center justify-between gap-3 group">
          
          {/* Subtle Shimmer Sweep */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent" />

          {/* Left: Animated Icon & Dynamic Reward Typography */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 relative z-10">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(15,134,70,0.25)] group-hover:scale-105 transition-transform duration-300">
              <Gift size={20} className="stroke-[2.5] drop-shadow-xs" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-emerald-100 text-[#0f8646] text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles size={10} className="text-[#0f8646]" />
                  <span>Daily Surprise Card</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 hidden xs:inline">
                  • 100% Free Win Today
                </span>
              </div>

              <h3 className="text-gray-900 font-black text-xs sm:text-sm mt-1 truncate tracking-tight">
                {reward?.isScratched
                  ? `🎉 You Won FLAT ₹${reward.discountAmount} OFF On Your Order!`
                  : "Scratch Today's Reward Card & Win Instant Discount!"}
              </h3>
            </div>
          </div>

          {/* Right: Interactive CTA Button with Brand Green */}
          <div className="flex items-center gap-2 shrink-0 relative z-10">
            {reward?.isScratched ? (
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
              >
                {copied ? <Check size={13} className="text-[#0f8646]" /> : <Copy size={13} />}
                <span>{copied ? "Copied Code!" : reward.couponCode}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartScratch}
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3.5 sm:px-5 py-2 rounded-xl font-black text-xs sm:text-xs flex items-center gap-1.5 transition-all shadow-[0_4px_14px_rgba(15,134,70,0.3)] hover:shadow-[0_6px_20px_rgba(15,134,70,0.4)] cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Gift size={13} />
                <span>Scratch & Win</span>
                <ArrowRight size={13} className="stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {reward && (
        <DigitalScratchCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reward={reward}
          onSuccess={() => {
            setReward((prev: any) => (prev ? { ...prev, isScratched: true } : null));
          }}
        />
      )}
    </div>
  );
}
