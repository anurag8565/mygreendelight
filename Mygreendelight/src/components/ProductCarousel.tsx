"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 640 ? clientWidth * 0.75 : 220;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* Left Arrow Button */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 text-gray-800 w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all hover:bg-[#0f8646] hover:text-white hover:border-[#0f8646] active:scale-90 cursor-pointer"
      >
        <ChevronLeft size={18} className="stroke-[2.5]" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x scroll-smooth px-0.5"
      >
        {children}
      </div>

      {/* Right Arrow Button */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 text-gray-800 w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all hover:bg-[#0f8646] hover:text-white hover:border-[#0f8646] active:scale-90 cursor-pointer"
      >
        <ChevronRight size={18} className="stroke-[2.5]" />
      </button>
    </div>
  );
}
