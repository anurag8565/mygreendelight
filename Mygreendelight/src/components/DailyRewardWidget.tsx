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
    <section className="w-full py-3.5 sm:py-5 bg-[#faf9f5] border-b border-stone-200/70 font-sans select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-gradient-to-r from-amber-50/90 via-emerald-50/50 to-amber-50/90 border border-amber-300/80 shadow-[0_4px_16px_rgba(217,119,6,0.08)] flex items-center justify-between gap-3 group transition-all hover:border-amber-400">
          {/* Left: Icon & Reward Details */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-950 flex items-center justify-center shrink-0 shadow-xs border border-amber-300">
              <Gift size={18} className="stroke-[2.5]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-600 fill-amber-600" />
                  Daily Lucky Scratch Card
                </span>
              </div>

              <h3 className="text-stone-900 font-extrabold text-xs sm:text-sm mt-0.5 truncate tracking-tight font-heading">
                {reward?.isScratched
                  ? `You Won ₹${reward.discountAmount} OFF On Your Order!`
                  : "Scratch today's card to reveal your instant discount coupon"}
              </h3>
            </div>
          </div>

          {/* Right: Clean Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            {reward?.isScratched ? (
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-stone-50 text-stone-900 border border-amber-300 px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
              >
                {copied ? <Check size={13} className="text-emerald-700 stroke-[3]" /> : <Copy size={13} className="text-amber-700" />}
                <span>{copied ? "Copied" : reward.couponCode}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartScratch}
                className="bg-[#0a3d24] hover:bg-[#072817] text-white px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition shadow-[0_4px_12px_rgba(10,61,36,0.25)] cursor-pointer whitespace-nowrap active:scale-95 border border-emerald-800/60"
              >
                <span>Scratch & Win</span>
                <ArrowRight size={13} className="stroke-[2.5]" />
              </button>
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
