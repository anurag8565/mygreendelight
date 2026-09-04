"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, Check, PartyPopper, ArrowRight, Zap, Copy } from "lucide-react";
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
    <div className="w-full py-2.5 sm:py-3.5 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="bg-gradient-to-r from-[#093e21] via-[#0f8646] to-emerald-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-md border border-emerald-400/30 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3.5">
          {/* Subtle Glow & Sparkles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300/15 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Icon & Pitch */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-xs text-yellow-300 border border-white/20 flex items-center justify-center font-black shrink-0 shadow-inner">
              <Gift size={24} className="stroke-[2.5]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-yellow-400 text-gray-950 text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-800" />
                  <span>Daily Lucky Scratch</span>
                </span>
                <span className="text-[11px] text-green-100 font-bold hidden xs:inline">
                  1 Free Reward / Day
                </span>
              </div>

              <h3 className="text-white font-black text-xs sm:text-base leading-snug mt-1">
                {reward?.isScratched
                  ? `🎉 You Won FLAT ₹${reward.discountAmount} OFF on your order!`
                  : "Scratch Today's Lucky Card & Win Flat ₹30 - ₹50 OFF!"}
              </h3>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/15">
            {reward?.isScratched ? (
              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-gray-900 font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/50"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copied ? "Code Copied! ✓" : `Copy Code: ${reward.couponCode}`}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartScratch}
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-200"
              >
                <Sparkles size={14} className="text-amber-950" />
                <span>Scratch Today&apos;s Card ➔</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Digital Scratch Card Modal */}
      {reward && (
        <DigitalScratchCardModal
          isOpen={isModalOpen}
          reward={reward}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setReward((prev: any) => ({ ...prev, isScratched: true }));
          }}
        />
      )}
    </div>
  );
}
