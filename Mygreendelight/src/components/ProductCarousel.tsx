"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProductCarouselHandle {
  scrollLeft: () => void;
  scrollRight: () => void;
}

const ProductCarousel = forwardRef<ProductCarouselHandle, { children: React.ReactNode }>(
  function ProductCarousel({ children }, ref) {
    const scrollRef = useRef<HTMLDivElement>(null);

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
      <div className="relative w-full">
        {/* Free-Flowing Smooth Scroll Container (Zero card-covering arrows) */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 pt-0.5 no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0 overscroll-x-contain scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {children}
        </div>
      </div>
    );
  }
);

export default ProductCarousel;
