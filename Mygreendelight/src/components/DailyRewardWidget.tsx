"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, X, Copy, Check, ArrowRight, Clock, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function DailyRewardWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [reward, setReward] = useState<any>(null);
  const [canClaim, setCanClaim] = useState(true);
  const [copied, setCopied] = useState(false);
  const [guestId, setGuestId] = useState<string>("");

  useEffect(() => {
    let gid = localStorage.getItem("mgd_reward_guest_id");
    if (!gid) {
      gid = "guest-" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("mgd_reward_guest_id", gid);
    }
    setGuestId(gid);

    // Check today claim
    axios
      .get(`/api/user/rewards?guestId=${gid}`)
      .then((res) => {
        if (res.data?.success) {
          if (res.data.todayClaim) {
            setReward(res.data.todayClaim);
            setIsScratched(true);
            setCanClaim(false);
          } else {
            setCanClaim(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleClaimReward = async () => {
    if (isScratching || isScratched) return;
    setIsScratching(true);

    try {
      const res = await axios.post("/api/user/rewards", { guestId });
      if (res.data?.success && res.data.reward) {
        setReward(res.data.reward);
        setIsScratched(true);
        setCanClaim(false);
      }
    } catch (error) {
      console.error("Reward claim error:", error);
    } finally {
      setIsScratching(false);
    }
  };

  const handleCopy = () => {
    if (!reward?.couponCode) return;
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Floating Animated Reward Button on Bottom-Left */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/80 cursor-pointer animate-pulse"
        title="Claim Daily Farm Reward"
      >
        <div className="w-7 h-7 rounded-full bg-white text-orange-600 flex items-center justify-center font-black">
          <Gift size={16} />
        </div>
        <span className="text-xs font-black hidden sm:inline tracking-tight">
          {isScratched ? "🎁 My Daily Coupon" : "🎁 Scratch & Win Daily!"}
        </span>
      </motion.button>

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 relative overflow-hidden text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Header Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Trophy size={28} className="animate-bounce" />
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-1">
                Bhopal Farm Lucky Reward
              </h3>
              <p className="text-xs text-gray-500 mb-4 font-medium">
                Unlock exclusive instant discounts on fresh farm vegetables & fruits!
              </p>

              {/* Scratch / Win Card Container */}
              <div className="relative rounded-2xl border-2 border-dashed border-orange-300 p-5 bg-gradient-to-b from-orange-50/70 to-amber-50/50 mb-4 min-h-[140px] flex flex-col items-center justify-center overflow-hidden">
                {!isScratched ? (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClaimReward}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-3"
                  >
                    <Sparkles size={32} className="text-amber-500 mb-2 animate-spin" />
                    <span className="text-sm font-black text-orange-950 uppercase tracking-wider">
                      {isScratching ? "Scratching Lucky Card..." : "👉 Tap Here to Scratch"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold mt-1">
                      1 Free reward every 24 hours
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center w-full"
                  >
                    <span className="text-[11px] font-black text-[#0f8646] uppercase bg-green-100 px-3 py-0.5 rounded-full mb-1.5">
                      🎉 Winner!
                    </span>
                    <h4 className="text-lg font-black text-gray-900 mb-1">
                      {reward?.rewardTitle || "Flat ₹30 Instant Discount"}
                    </h4>
                    <p className="text-[11px] text-gray-500 mb-3 font-medium">
                      Valid on orders above ₹{reward?.minOrderValue || 249}
                    </p>

                    {/* Copy Coupon Box */}
                    <div className="flex items-center gap-2 w-full bg-white rounded-xl p-2 border border-orange-200 shadow-2xs">
                      <span className="flex-1 font-mono font-black text-sm text-orange-600 tracking-widest text-center">
                        {reward?.couponCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors cursor-pointer"
                        title="Copy Coupon"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>

                    {copied && (
                      <span className="text-[11px] font-black text-green-600 mt-2">
                        Copied to clipboard! Apply at checkout 🎉
                      </span>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Bottom Action */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (isScratched) handleCopy();
                }}
                className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isScratched ? "Shop & Apply Code" : "Close"}</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
