"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileStickyCartBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { cartdata } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show if empty or if on cart/checkout pages
  if (
    !cartdata ||
    cartdata.length === 0 ||
    pathname === "/user/cart" ||
    pathname === "/user/checkout"
  ) {
    return null;
  }

  const totalItems = cartdata.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartdata.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed bottom-[68px] left-3 right-3 sm:hidden z-40"
      >
        <div
          onClick={() => router.push("/user/cart")}
          className="bg-gradient-to-r from-[#032412] via-[#073b1d] to-[#0f8646] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center justify-between cursor-pointer active:scale-98 transition-transform backdrop-blur-md"
        >
          {/* Left: Item count & Price */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <ShoppingBag size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </span>
                <span className="text-[10px] font-bold text-green-200 bg-white/15 px-1.5 py-0.2 rounded-md">
                  Express 10m
                </span>
              </div>
              <span className="text-sm font-black text-amber-300">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right: CTA View Cart */}
          <div className="flex items-center gap-1 bg-white text-[#0f8646] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xs hover:bg-green-50 transition">
            <span>View Cart</span>
            <ArrowRight size={13} className="stroke-[3]" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
