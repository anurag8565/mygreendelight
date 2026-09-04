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
      {/* Left Floating Arrow Button (Always visible on desktop, no hover hide) */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-3.5 lg:-left-4 top-[75px] -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-800 hover:text-[#0c831f] w-9 h-9 rounded-full items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-md border border-gray-200/90 active:scale-90 cursor-pointer"
      >
        <ChevronLeft size={20} className="stroke-[2.5]" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth px-0.5"
      >
        {children}
      </div>

      {/* Right Floating Arrow Button (Always visible on desktop, no hover hide) */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-3.5 lg:-right-4 top-[75px] -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-800 hover:text-[#0c831f] w-9 h-9 rounded-full items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-md border border-gray-200/90 active:scale-90 cursor-pointer"
      >
        <ChevronRight size={20} className="stroke-[2.5]" />
      </button>
    </div>
  );
}
