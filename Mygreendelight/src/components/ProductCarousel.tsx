"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 640 ? clientWidth * 0.75 : clientWidth * 0.85;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-full group">
      {/* Left Floating Arrow Button (Desktop Only, outside cards) */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden sm:flex absolute -left-3 md:-left-5 top-[75px] -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-gray-200 active:scale-90 cursor-pointer backdrop-blur-xs opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={20} className="stroke-[2.5]" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth px-1"
      >
        {children}
      </div>

      {/* Right Floating Arrow Button (Desktop Only, outside cards) */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden sm:flex absolute -right-3 md:-right-5 top-[75px] -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-gray-200 active:scale-90 cursor-pointer backdrop-blur-xs opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={20} className="stroke-[2.5]" />
      </button>
    </div>
  );
}
