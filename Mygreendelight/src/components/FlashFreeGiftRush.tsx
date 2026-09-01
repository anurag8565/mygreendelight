"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Gift, Clock, ArrowRight, Check, Zap, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FREE_GIFT_ITEM = {
  _id: "free-gift-mirch-dhaniya" as any,
  name: "🎁 250g Taaza Hari Mirch + Dhaniya (FREE Gift)",
  price: 0,
  unit: "250g Pack",
  image: "https://images.unsplash.com/photo-1588879462719-74e2d33454fb?auto=format&fit=crop&w=400&q=80",
  category: "Free Gifts",
  stock: 100,
  quantity: 1,
  cartItemId: "free-gift-mirch-dhaniya",
};

export default function FlashFreeGiftRush() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cartdata } = useSelector((state: RootState) => state.cart);

  const [timeLeft, setTimeLeft] = useState<number>(240); // 4 minutes = 240s
  const [hasClaimed, setHasClaimed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if free gift is already in cart
  const isGiftInCart = cartdata.some((item: any) => item.cartItemId === "free-gift-mirch-dhaniya" || item._id === "free-gift-mirch-dhaniya");

  useEffect(() => {
    setMounted(true);

    // Initialize or load timer from localStorage
    const STORAGE_KEY = "mgd_free_gift_deadline";
    const now = Date.now();
    let deadline = localStorage.getItem(STORAGE_KEY);

    if (!deadline || Number(deadline) < now) {
      // Set new 4-minute deadline
      const newDeadline = now + 4 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(newDeadline));
      deadline = String(newDeadline);
    }

    const interval = setInterval(() => {
      const remainingSeconds = Math.max(0, Math.floor((Number(deadline) - Date.now()) / 1000));
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        // Reset timer loop for seamless engagement
        const loopDeadline = Date.now() + 4 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, String(loopDeadline));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaimFreeGift = () => {
    dispatch(addToCart(FREE_GIFT_ITEM as any));
    setHasClaimed(true);
    setTimeout(() => setHasClaimed(false), 3000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (!mounted) return null;

  return (
    <div className="w-full py-1.5 sm:py-2 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        <div className="bg-gradient-to-r from-emerald-950 via-[#063b1d] to-[#0c592f] rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-white shadow-lg border border-emerald-700/60 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Subtle Ambient Glow */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Gift Icon & Urgency Pitch */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 flex items-center justify-center font-black shadow-md">
                <Gift size={20} className="stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-950 animate-ping" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-yellow-300 text-gray-950 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                  ⚡ 10-15 Min Express Gift
                </span>
                <span className="text-[10px] sm:text-[11px] text-emerald-300 font-bold hidden xs:inline">
                  Worth ₹35 • 100% Taaza
                </span>
              </div>
              <p className="text-white text-xs sm:text-sm font-black truncate sm:whitespace-normal mt-0.5">
                Order in <span className="text-yellow-300 font-mono">{formattedTime}</span> & get <span className="text-yellow-300">250g Hari Mirch + Dhaniya</span> FREE!
              </p>
            </div>
          </div>

          {/* Right: Digital Timer & 1-Click Action */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-emerald-800/60">
            <div className="flex items-center gap-1.5 bg-black/40 border border-emerald-600/80 px-2.5 py-1.5 rounded-xl text-yellow-300 font-mono font-black text-xs shadow-inner">
              <Clock size={13} className="text-yellow-300 animate-spin" style={{ animationDuration: "8s" }} />
              <span>{formattedTime}</span>
            </div>

            {!isGiftInCart ? (
              <button
                type="button"
                onClick={handleClaimFreeGift}
                className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 hover:from-yellow-400 hover:to-amber-500 text-gray-950 font-black px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-200"
              >
                {hasClaimed ? <Check size={14} /> : <Gift size={14} />}
                <span>{hasClaimed ? "Added to Cart! 🎉" : "Claim Free Gift ➔"}</span>
              </button>
            ) : (
              <Link
                href="/user/cart"
                className="flex-1 sm:flex-none bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/50"
              >
                <Check size={14} />
                <span>Gift in Cart • View Basket ➔</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
