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
    <div className="w-full py-2.5 sm:py-3.5 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="bg-[#f8f9fa] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          {/* Left: Icon & Text */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Gift size={20} className="stroke-[2.5]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                  🎁 Daily Scratch Reward
                </span>
              </div>

              <h3 className="text-gray-900 font-bold text-xs sm:text-sm mt-0.5">
                {reward?.isScratched
                  ? `🎉 You won FLAT ₹${reward.discountAmount} OFF!`
                  : "Scratch Today's Card & Win Instant Discount"}
              </h3>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            {reward?.isScratched ? (
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-gray-50 text-[#0c831f] border border-[#0c831f] px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? "Copied" : reward.couponCode}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartScratch}
                className="bg-[#0c831f] hover:bg-[#096618] text-white px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Scratch Card</span>
                <ArrowRight size={13} />
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
