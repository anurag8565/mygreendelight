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
    <div className="w-full py-4 sm:py-6 bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Flash Deals Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Flame size={18} />
            </div>
            
            <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
              Daily Flash Harvest Deals
            </h2>

            {/* Live Admin-Controlled Timer */}
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-xl text-xs font-black shadow-2xs">
              <Clock size={13} className="text-red-600 animate-pulse" />
              <span className="font-mono tracking-wider">
                {isExpired
                  ? "Deal Ended"
                  : `Ends in ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
              </span>
            </div>

            {badgeText && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-black text-[#0f8646] bg-green-100/80 border border-green-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                <Zap size={11} className="text-yellow-500 fill-yellow-500" />
                {badgeText}
              </span>
            )}
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition shrink-0"
          >
            <span>See all</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </Link>
        </div>

        {/* Product Carousel */}
        <ProductCarousel>
          {products.map((item: any) => (
            <div
              key={item._id}
              className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[300px] sm:h-[320px]"
            >
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>

      </div>
    </div>
  );
}
