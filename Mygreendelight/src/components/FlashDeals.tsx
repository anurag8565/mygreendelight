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
    <div className="w-full py-8 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Flash Deals Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left Title */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-yellow-200 shrink-0 shadow-inner">
              <Flame size={26} className="animate-bounce text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  TODAY'S SPECIAL
                </span>
                <span className="text-yellow-300 text-xs font-extrabold flex items-center gap-1">
                  <Zap size={13} className="fill-yellow-300" /> FLAT 25% - 40% OFF
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
                Live Flash Deals
              </h2>
            </div>
          </div>

          {/* Right: Live Reverse Countdown Timer */}
          <div className="flex items-center gap-3 relative z-10 self-start sm:self-auto bg-black/20 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-200">
              <Clock size={16} className="animate-spin-slow" />
              <span>Ends in:</span>
            </div>

            {/* Timer Digits */}
            <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black">
              <span className="bg-white text-gray-900 px-2.5 py-1 rounded-lg shadow-xs">
                {timeLeft.hours}
                <span className="text-[9px] font-sans block text-gray-400 font-bold -mt-0.5 text-center">HRS</span>
              </span>
              <span className="font-bold text-white text-lg">:</span>
              <span className="bg-white text-gray-900 px-2.5 py-1 rounded-lg shadow-xs">
                {timeLeft.minutes}
                <span className="text-[9px] font-sans block text-gray-400 font-bold -mt-0.5 text-center">MIN</span>
              </span>
              <span className="font-bold text-white text-lg">:</span>
              <span className="bg-white text-red-600 px-2.5 py-1 rounded-lg shadow-xs">
                {timeLeft.seconds}
                <span className="text-[9px] font-sans block text-gray-400 font-bold -mt-0.5 text-center">SEC</span>
              </span>
            </div>
          </div>
        </div>

        {/* Product Carousel */}
        <ProductCarousel>
          {products.map((item: any) => (
            <div key={item._id} className="min-w-[200px] sm:min-w-[220px] snap-start shrink-0">
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>

      </div>
    </div>
  );
}
