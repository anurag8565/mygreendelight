"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel({
  children,
  headerControls = false,
}: {
  children: React.ReactNode;
  headerControls?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

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
    <div className="relative w-full group/track">
      {/* 
        Free-Flowing Smooth Scroll Container 
        - Zero card-overlapping arrow buttons!
        - Native smooth inertial swipe on mobile & tablet
        - Edge padding with subtle shadow depth
      */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2.5 pt-1 no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0 overscroll-x-contain scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>

      {/* 
        Desktop Subtle Hover Pagers (Only on large screens, aligned with track edges, never covering product cards)
      */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-[#0a3d24] items-center justify-center shadow-[0_3px_12px_rgba(0,0,0,0.12)] border border-stone-200/80 transition-all active:scale-90 cursor-pointer opacity-0 group-hover/track:opacity-100"
        >
          <ChevronLeft size={16} className="stroke-[2.5]" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-[#0a3d24] items-center justify-center shadow-[0_3px_12px_rgba(0,0,0,0.12)] border border-stone-200/80 transition-all active:scale-90 cursor-pointer opacity-0 group-hover/track:opacity-100"
        >
          <ChevronRight size={16} className="stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
