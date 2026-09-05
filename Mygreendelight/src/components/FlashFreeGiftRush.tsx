"use client";

import React, { useState, useEffect } from "react";
import { Gift, Check, Zap, ShoppingBag, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Link from "next/link";

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
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if free gift is already in cart
  const isGiftInCart = cartdata.some(
    (item: any) =>
      item.cartItemId === "free-gift-mirch-dhaniya" ||
      item._id === "free-gift-mirch-dhaniya"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClaimFreeGift = () => {
    dispatch(addToCart(FREE_GIFT_ITEM as any));
    setHasClaimed(true);
    setTimeout(() => setHasClaimed(false), 3000);
  };

  if (!mounted) return null;

  return (
    <div className="w-full py-1.5 sm:py-2 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        <div className="bg-gradient-to-r from-[#063318] via-[#0a4823] to-[#0e5c2e] rounded-2xl p-2.5 sm:p-3.5 text-white shadow-sm border border-emerald-700/60 relative overflow-hidden flex items-center justify-between gap-2.5">
          {/* Subtle Ambient Glow */}
          <div className="absolute right-0 top-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Gift Icon & Compact Value Pitch */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Gift size={18} className="stroke-[2.5]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="bg-yellow-300 text-gray-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide shrink-0">
                  ⚡ FREE GIFT
                </span>
                <span className="text-white text-xs sm:text-sm font-black truncate">
                  Get <span className="text-yellow-300">250g Taaza Mirch + Dhaniya</span> FREE!
                </span>
              </div>
              <p className="text-[10px] text-emerald-300 font-medium truncate hidden sm:block">
                Added directly to your order basket with same-day fresh delivery
              </p>
            </div>
          </div>

          {/* Right: Compact Action Pill */}
          <div className="shrink-0">
            {!isGiftInCart ? (
              <button
                type="button"
                onClick={handleClaimFreeGift}
                className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 hover:from-yellow-400 hover:to-amber-500 text-gray-950 font-black px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer border border-yellow-200"
              >
                {hasClaimed ? <Check size={13} /> : <Gift size={13} />}
                <span>{hasClaimed ? "Claimed! 🎉" : "Claim Free ➔"}</span>
              </button>
            ) : (
              <Link
                href="/user/cart"
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer border border-emerald-400/50"
              >
                <Check size={13} />
                <span>In Cart ➔</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
