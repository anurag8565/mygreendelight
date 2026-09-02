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
      {/* Left Floating Arrow Button */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="flex absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-lg border border-gray-200/90 active:scale-95 cursor-pointer backdrop-blur-xs"
      >
        <ChevronLeft size={18} className="stroke-[2.5]" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth px-1"
      >
        {children}
      </div>

      {/* Right Floating Arrow Button */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="flex absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-lg border border-gray-200/90 active:scale-95 cursor-pointer backdrop-blur-xs"
      >
        <ChevronRight size={18} className="stroke-[2.5]" />
      </button>
    </div>
  );
}
