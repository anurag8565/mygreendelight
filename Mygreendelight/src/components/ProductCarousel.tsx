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
    <div className="relative w-full max-w-full">
      {/* Left Floating Arrow Button (Visible on Mobile & Desktop) */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="flex absolute -left-1 sm:-left-3.5 lg:-left-4 top-[70px] sm:top-[75px] -translate-y-1/2 z-20 bg-white/95 backdrop-blur-xs hover:bg-white text-gray-800 hover:text-[#0c831f] w-7 h-7 sm:w-9 sm:h-9 rounded-full items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.14)] hover:shadow-md border border-gray-200/90 active:scale-90 cursor-pointer"
      >
        <ChevronLeft size={16} className="sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>

      {/* Scroll Container with full mobile edge bleed and touch support */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-3.5 px-3.5 sm:mx-0 sm:px-0.5 touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>

      {/* Right Floating Arrow Button (Visible on Mobile & Desktop) */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="flex absolute -right-1 sm:-right-3.5 lg:-right-4 top-[70px] sm:top-[75px] -translate-y-1/2 z-20 bg-white/95 backdrop-blur-xs hover:bg-white text-gray-800 hover:text-[#0c831f] w-7 h-7 sm:w-9 sm:h-9 rounded-full items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.14)] hover:shadow-md border border-gray-200/90 active:scale-90 cursor-pointer"
      >
        <ChevronRight size={16} className="sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
