"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, Check, ArrowRight, Copy } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import DigitalScratchCardModal from "./DigitalScratchCardModal";
import { triggerHaptic } from "@/utils/haptics";

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
    triggerHaptic("medium");
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
    triggerHaptic("light");
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-2.5 sm:py-3.5 bg-[#faf9f5] font-sans select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Modern Promotional Mini-Banner Card */}
        <div
          onClick={reward?.isScratched ? undefined : handleStartScratch}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#eff8f3] border border-emerald-200/90 shadow-[0_2px_12px_rgba(10,61,36,0.06)] hover:shadow-[0_4px_16px_rgba(10,61,36,0.1)] transition-all cursor-pointer h-[110px] xs:h-[120px] sm:h-[135px] md:h-[145px]"
        >
          {/* Full-bleed Background Photographic Rewards Layer */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src="/banners/daily_scratch_banner.jpg"
              alt="Daily Scratch & Save Rewards"
              className="w-full h-full object-cover object-right contrast-[1.03] saturate-[1.05]"
              loading="lazy"
            />
          </div>

          {/* Soft Directional Wash for 100% Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf7f2] via-[#edf7f2]/92 via-55% sm:via-45% to-transparent pointer-events-none" />

          {/* Left Content Layer */}
          <div className="relative z-10 h-full p-3 xs:p-3.5 sm:p-5 md:p-6 flex flex-col justify-between max-w-[62%] xs:max-w-[60%] sm:max-w-[55%] md:max-w-md">
            <div>
              {/* Micro-Pill */}
              <div className="inline-flex items-center gap-1 bg-amber-100/95 border border-amber-300/80 text-amber-900 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 shadow-2xs">
                <Sparkles size={10} className="text-amber-600 fill-amber-600 shrink-0" />
                <span className="truncate">Daily Scratch &amp; Save</span>
              </div>

              {/* Title */}
              <h3 className="text-stone-900 font-extrabold text-[14px] xs:text-[15px] sm:text-lg md:text-xl tracking-tight leading-tight font-heading line-clamp-1">
                {reward?.isScratched
                  ? `🎉 You Won ₹${reward.discountAmount} OFF!`
                  : "Scratch & Win Up to ₹50 OFF"}
              </h3>

              {/* Subtitle */}
              <p className="text-[10px] xs:text-[11px] sm:text-xs text-stone-600 font-medium leading-none truncate mt-0.5 hidden xs:block">
                {reward?.isScratched
                  ? `Code: ${reward.couponCode} applied to checkout`
                  : "Guaranteed cashback on today's order"}
              </p>
            </div>

            {/* Bottom Row: Action Button */}
            <div className="pt-1">
              {reward?.isScratched ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className="bg-white hover:bg-stone-50 text-stone-900 border border-emerald-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-extrabold text-[10.5px] sm:text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-700 stroke-[3]" />
                      <span className="text-emerald-800">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} className="text-amber-700" />
                      <span>{reward.couponCode}</span>
                    </>
                  )}
                </button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartScratch();
                  }}
                  className="bg-[#0a3d24] hover:bg-[#072817] text-white px-3 xs:px-3.5 sm:px-5 py-1 xs:py-1.5 sm:py-2 rounded-full font-bold text-[11px] xs:text-xs sm:text-[13px] flex items-center gap-1 sm:gap-1.5 transition shadow-[0_3px_10px_rgba(10,61,36,0.25)] cursor-pointer whitespace-nowrap active:scale-95 border border-emerald-800/60"
                >
                  <span>Scratch Now</span>
                  <ArrowRight size={12} className="stroke-[2.5]" />
                </motion.button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Scratch Modal */}
      {isModalOpen && reward && (
        <DigitalScratchCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reward={reward}
          onSuccess={() => {
            setReward((prev: any) => (prev ? { ...prev, isScratched: true } : null));
          }}
        />
      )}
    </section>
  );
}
