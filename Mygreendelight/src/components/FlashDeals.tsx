"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Clock, ChevronRight, Zap } from "lucide-react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import axios from "axios";

export default function FlashDeals({ products = [] }: { products: any[] }) {
  const [endTime, setEndTime] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [badgeText, setBadgeText] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // 1. Fetch dynamic timer & status configured by Admin in /admin/manage-flash-deals
  useEffect(() => {
    axios
      .get("/api/flash-deal")
      .then((res) => {
        if (res.data?.success && res.data?.setting) {
          const s = res.data.setting;
          setEndTime(s.endTime);
          setIsActive(s.isActive !== undefined ? s.isActive : true);
          setBadgeText(s.badgeText || "FLAT 25% - 40% OFF");
        }
      })
      .catch(() => {});
  }, []);

  // 2. Real-time reverse countdown timer
  useEffect(() => {
    const calculateRemaining = () => {
      const now = Date.now();
      const targetTime = endTime ? new Date(endTime).getTime() : 0;

      if (!endTime) {
        // Default midnight timer fallback
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const diff = Math.max(0, midnight.getTime() - now);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
        setIsExpired(false);
        return;
      }

      const diff = targetTime - now;
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      setIsExpired(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
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
  }, [endTime]);

  if (!isActive || !products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-3.5 sm:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 p-3.5 sm:p-5 md:p-6 border border-orange-200/70 shadow-[0_4px_24px_rgba(249,115,22,0.06)] relative overflow-hidden">
          {/* Subtle Decorative Flame Glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Flash Deals Header Row */}
          <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5 relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/30 border border-amber-300">
                <Flame size={20} className="fill-yellow-200 text-yellow-200 animate-pulse" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Lightning Flash Deals
                  </h2>
                  <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs tracking-wide">
                    ⚡ Up to 50% OFF
                  </span>
                </div>
              </div>

              {/* Live Dynamic Rolling Timer */}
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-red-200 text-red-600 px-3 py-1 rounded-full text-xs font-black shadow-2xs ml-0 sm:ml-1">
                <Clock size={13} className="text-red-600 animate-pulse" />
                <span className="font-mono tracking-wider text-[11px] sm:text-xs">
                  {isExpired
                    ? "Next Batch in 04:00:00"
                    : `Ends in ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
                </span>
              </div>
            </div>

            <Link
              href="/shop"
              className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs shrink-0"
            >
              <span>See All</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </Link>
          </div>

          {/* Product Carousel */}
          <div className="relative z-10">
            <ProductCarousel>
              {products.map((item: any) => (
                <div
                  key={item._id}
                  className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[325px] sm:h-[345px]"
                >
                  <Groceryitemcard item={item} />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </div>
      </div>
    </div>
  );
}
