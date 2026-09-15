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
    <section className="w-full py-3 sm:py-4 bg-[#faf9f5] border-b border-stone-200/70 font-sans select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Clean, 100% Responsive Single-Row Reward Bar */}
        <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 md:p-4 bg-gradient-to-r from-amber-50/90 via-[#fcfbf7] to-emerald-50/70 border border-amber-300/80 shadow-[0_2px_12px_rgba(217,119,6,0.06)] hover:border-amber-400 transition-all flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Gift Icon & Text */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 text-stone-900 flex items-center justify-center shrink-0 shadow-xs border border-amber-300/90">
              <Gift size={18} className="stroke-[2.5]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                  <Sparkles size={10} className="text-amber-600 fill-amber-600" />
                  Daily Scratch &amp; Save
                </span>
              </div>

              <h3 className="text-stone-900 font-extrabold text-xs sm:text-sm md:text-[15px] mt-0.5 tracking-tight font-heading leading-tight truncate">
                {reward?.isScratched
                  ? `🎉 You Won ₹${reward.discountAmount} OFF On Your Order!`
                  : "Scratch Today's Card & Win Up to ₹50 OFF"}
              </h3>

              <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-none mt-0.5 hidden xs:block truncate">
                {reward?.isScratched
                  ? `Coupon ${reward.couponCode} ready to use at checkout`
                  : "Guaranteed daily cashback on farm-fresh veggies & fruits"}
              </p>
            </div>
          </div>

          {/* Right: Clean Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            {reward?.isScratched ? (
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-stone-50 text-stone-900 border border-amber-300/90 px-3 sm:px-4 py-2 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
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
                onClick={handleStartScratch}
                className="bg-[#0a3d24] hover:bg-[#072817] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-[13px] flex items-center gap-1.5 transition shadow-[0_4px_12px_rgba(10,61,36,0.22)] cursor-pointer whitespace-nowrap active:scale-95 border border-emerald-800/60"
              >
                <span>Scratch &amp; Win</span>
                <ArrowRight size={13} className="stroke-[2.5]" />
              </motion.button>
            )}
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
