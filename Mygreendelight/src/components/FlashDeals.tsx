"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Clock, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import axios from "axios";

export default function FlashDeals({ products = [] }: { products: any[] }) {
  const carouselRef = React.useRef<any>(null);
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
  }, [endTime]);

  if (!isActive || !products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 sm:py-6 bg-white font-sans border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Modern Header Row with Integrated Navigation Controls */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-amber-500 fill-amber-500 shrink-0" />
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading">
              Flash Deals
            </h2>

            {/* Minimalist Clean Countdown Pill */}
            {!isExpired && (
              <div className="flex items-center gap-1.5 bg-amber-50/90 border border-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <Clock size={12} className="text-amber-700" />
                <span className="tabular-nums font-mono">
                  {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                </span>
              </div>
            )}
          </div>

          {/* Right: Header Navigation Arrows [ < ] [ > ] + See All */}
          <div className="flex items-center gap-2">
            {/* Carousel Buttons */}
            <div className="hidden xs:flex items-center gap-1 bg-stone-100/80 p-0.5 rounded-full border border-stone-200/80">
              <button
                type="button"
                onClick={() => carouselRef.current?.scrollLeft()}
                className="w-7 h-7 rounded-full bg-white hover:bg-stone-50 text-stone-700 hover:text-[#0a3d24] flex items-center justify-center shadow-2xs transition active:scale-90 cursor-pointer"
                title="Scroll Left"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={14} className="stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => carouselRef.current?.scrollRight()}
                className="w-7 h-7 rounded-full bg-white hover:bg-stone-50 text-stone-700 hover:text-[#0a3d24] flex items-center justify-center shadow-2xs transition active:scale-90 cursor-pointer"
                title="Scroll Right"
                aria-label="Scroll Right"
              >
                <ChevronRight size={14} className="stroke-[2.5]" />
              </button>
            </div>

            <Link
              href="/shop"
              className="text-stone-500 hover:text-[#0a3d24] font-semibold text-xs sm:text-sm flex items-center gap-0.5 px-2 py-1 rounded-full hover:bg-stone-50 transition"
            >
              <span>See all</span>
              <ChevronRight size={14} className="stroke-[2]" />
            </Link>
          </div>
        </div>

        {/* Swipeable Carousel */}
        <ProductCarousel ref={carouselRef}>
          {products.map((item: any) => (
            <div
              key={item._id}
              className="w-[155px] sm:w-[185px] md:w-[200px] snap-start shrink-0 flex flex-col h-[255px] sm:h-[275px]"
            >
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>
      </div>
    </section>
  );
}
