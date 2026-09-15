"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, Check, ArrowRight, Copy, Zap, Flame, Crown } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="w-full py-4 sm:py-5 bg-[#faf9f5] border-b border-stone-200/70 font-sans select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* 🌟 LUXURY ROYAL REWARD BANNER (Deep Forest Emerald + Liquid Gold Accents) */}
        <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#051e12] via-[#0a3d24] to-[#041a0e] border border-amber-400/40 shadow-[0_10px_35px_rgba(10,61,36,0.18)] overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 group">
          
          {/* Ambient Lighting & Particle Glows */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-amber-400/25 to-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/4 -bottom-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          
          {/* Animated Diagonal Luxury Light Shimmer */}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.06)_50%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_6s_infinite_linear] pointer-events-none" />

          {/* Left: 3D Scratch Ticket Visual & Reward Typography */}
          <div className="relative z-10 flex items-center gap-3.5 sm:gap-4.5 min-w-0 flex-1">
            
            {/* 3D Glowing Ticket Icon with Floating Animation */}
            <motion.div
              animate={{ y: [0, -3.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative shrink-0"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 text-stone-950 flex items-center justify-center shadow-[0_8px_25px_rgba(245,158,11,0.35)] border-2 border-amber-200/90 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-300">
                <Gift size={26} className="stroke-[2.5] text-stone-900" />
              </div>

              {/* Floating Crown/Sparkle Accent */}
              <motion.div
                animate={{ rotate: [0, 8, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-1.5 w-6 h-6 rounded-full bg-[#f59e0b] text-stone-950 flex items-center justify-center shadow-xs border border-amber-200 text-[10px]"
              >
                <Crown size={12} className="stroke-[2.8] text-stone-950" />
              </motion.div>
            </motion.div>

            {/* Typography Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1 backdrop-blur-xs">
                  <Sparkles size={10} className="text-amber-300 fill-amber-300" />
                  <span>Daily Scratch &amp; Save</span>
                </span>

                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30 hidden xs:inline-block">
                  ⚡ 100% Free Daily Cashback
                </span>
              </div>

              <h2 className="text-white font-extrabold text-sm sm:text-base md:text-lg tracking-tight leading-snug font-heading truncate">
                {reward?.isScratched
                  ? `🎉 You Unlocked Flat ₹${reward.discountAmount} OFF!`
                  : "Scratch Today's Lucky Card & Win Up to ₹50 OFF!"}
              </h2>

              <p className="text-emerald-100/75 text-xs sm:text-[13px] font-medium mt-0.5 leading-tight truncate">
                {reward?.isScratched
                  ? `Coupon ${reward.couponCode} applied for your next order • Min order ₹${reward.minOrderAmount}`
                  : "Every day brings guaranteed instant cashback on fresh veggies & fruits"}
              </p>
            </div>
          </div>

          {/* Right: Gold Magnetic CTA Button */}
          <div className="relative z-10 flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0">
            {reward?.isScratched ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={handleCopy}
                className="bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/60 backdrop-blur-md px-4 sm:px-5 py-2.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_4px_16px_rgba(245,158,11,0.2)] w-full sm:w-auto justify-center"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400 stroke-[3]" />
                    <span className="text-emerald-300">COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-amber-300" />
                    <span>CODE: <strong className="text-white tracking-wider">{reward.couponCode}</strong></span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={handleStartScratch}
                className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-[0_6px_22px_rgba(245,158,11,0.45)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.65)] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto tracking-wide group/btn"
              >
                {/* Button Light Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                
                <Sparkles size={14} className="fill-stone-950 text-stone-950" />
                <span>SCRATCH &amp; WIN</span>
                <ArrowRight size={14} className="stroke-[2.8] group-hover/btn:translate-x-0.5 transition-transform" />
              </motion.button>
            )}
          </div>

        </div>

      </div>

      {/* Interactive Luxury Scratch Modal */}
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
