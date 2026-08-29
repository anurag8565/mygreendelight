"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Clock, ChevronRight, Zap } from "lucide-react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import { motion } from "framer-motion";

export default function FlashDeals({ products = [] }: { products: any[] }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: "04",
    minutes: "30",
    seconds: "00",
  });

  useEffect(() => {
    const calculateRemaining = () => {
      const now = new Date();
      // Target is end of current 6-hour window or midnight
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-4 sm:py-6 bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Flash Deals Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Flame size={18} className="animate-bounce" />
            </div>
            <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
              Flash Deals
            </h2>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-black">
              <Clock size={12} className="animate-spin-slow" />
              <span>Ends in: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition shrink-0"
          >
            <span>See all</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Product Carousel */}
        <ProductCarousel>
          {products.map((item: any) => (
            <div key={item._id} className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[300px] sm:h-[320px]">
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>

      </div>
    </div>
  );
}
