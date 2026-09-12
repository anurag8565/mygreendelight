"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Clock, ChevronRight } from "lucide-react";
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
    <div className="w-full py-6 sm:py-8 bg-white font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Flash Deals Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Flame size={20} className="text-amber-500 fill-amber-500" />
              <span>Flash Deals</span>
            </h2>

            {/* Real-time Reverse Countdown Badge */}
            {!isExpired && (
              <div className="relative overflow-hidden flex items-center gap-1.5 bg-gradient-to-r from-rose-50 via-rose-100/60 to-rose-50 text-rose-600 border border-rose-300/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs">
                <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                <Clock size={12} className="stroke-[2.5] text-rose-600 animate-pulse relative z-10" />
                <span className="tabular-nums font-mono text-[11px] font-black relative z-10">
                  {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds} left
                </span>
              </div>
            )}

            {badgeText && (
              <span className="relative overflow-hidden hidden md:inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md shadow-2xs tracking-wider">
                <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <Flame size={10} className="fill-white relative z-10" />
                <span className="relative z-10">{badgeText}</span>
              </span>
            )}
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>See All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Swipeable Carousel */}
        <ProductCarousel>
          {products.map((item: any) => (
            <div
              key={item._id}
              className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[320px] sm:h-[340px]"
            >
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>
      </div>
    </div>
  );
}
