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
        <div className="bg-gradient-to-r from-[#042612] via-[#094723] to-[#0c592f] rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-white shadow-md border border-emerald-700/60 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Subtle Ambient Glow */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Gift Icon & Real Value Pitch */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 flex items-center justify-center font-black shadow-md">
                <Gift size={20} className="stroke-[2.5]" />
              </div>
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
                Today&apos;s Express Gift: Get <span className="text-yellow-300">250g Fresh Hari Mirch + Dhaniya</span> FREE in your basket!
              </p>
            </div>
          </div>

          {/* Right: 1-Click Action */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-emerald-800/60">
            {!isGiftInCart ? (
              <button
                type="button"
                onClick={handleClaimFreeGift}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 hover:from-yellow-400 hover:to-amber-500 text-gray-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-200"
              >
                {hasClaimed ? <Check size={14} /> : <Gift size={14} />}
                <span>{hasClaimed ? "Added to Basket! 🎉" : "Claim Free Gift ➔"}</span>
              </button>
            ) : (
              <Link
                href="/user/cart"
                className="w-full sm:w-auto bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/50"
              >
                <Check size={14} />
                <span>Gift in Basket • View Cart ➔</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
