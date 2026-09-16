"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";

export interface ProductCarouselHandle {
  scrollLeft: () => void;
  scrollRight: () => void;
}

const ProductCarousel = forwardRef<
  ProductCarouselHandle,
  { children: React.ReactNode; showDots?: boolean }
>(function ProductCarousel({ children, showDots = true }, ref) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalDots, setTotalDots] = useState(0);

  // Compute number of pages / dots based on child count and scroll container
  const updateDots = () => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
    if (scrollWidth <= clientWidth + 10) {
      setTotalDots(0);
      return;
    }

    // Usually 3-5 visual dots representing progress chunks
    const pages = Math.min(5, Math.ceil(scrollWidth / clientWidth) + 1);
    setTotalDots(pages);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      const current = Math.min(pages - 1, Math.round(progress * (pages - 1)));
      setActiveIndex(current);
    }
  };

  useEffect(() => {
    updateDots();
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      updateDots();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateDots);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDots);
    };
  }, [children]);

  const scrollToPage = (dotIndex: number) => {
    if (!scrollRef.current || totalDots <= 1) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (dotIndex / (totalDots - 1)) * maxScroll;
    scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 640 ? clientWidth * 0.7 : clientWidth * 0.82;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useImperativeHandle(ref, () => ({
    scrollLeft: () => scroll("left"),
    scrollRight: () => scroll("right"),
  }));

  return (
    <div className="relative w-full select-none">
      {/* Free-Flowing Smooth Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 pt-0.5 no-scrollbar scrollbar-none scrollbar-hide -mx-3.5 px-3.5 sm:mx-0 sm:px-0 overscroll-x-contain scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>

      {/* 
        🌟 SLEEK BOTTOM INDICATOR DOTS (Pure Circular Dots - Zero Dashes/Lines)
        - Active dot is a clean circular green bead
        - Inactive dots are soft subtle beads
        - Tap/Click on any dot to jump directly
      */}
      {showDots && totalDots > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-0.5">
          {Array.from({ length: totalDots }).map((_, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToPage(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-2 h-2 bg-[#0a3d24] scale-125 shadow-xs"
                    : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

export default ProductCarousel;
