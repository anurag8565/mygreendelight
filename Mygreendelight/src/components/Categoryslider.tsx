"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CategorySlider({
  categories = [],
}: {
  categories?: any[];
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [activeCategories, setActiveCategories] = useState<any[]>(
    categories.length > 0 ? categories : []
  );

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategories(categories);
      return;
    }

    // Fetch live categories directly from MongoDB
    fetch("/api/admin/category")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setActiveCategories(data.categories);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, [categories]);

  if (!activeCategories || activeCategories.length === 0) return null;

  const isCarouselNeeded = activeCategories.length > 4;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? clientWidth * 0.6 : clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        const progress = scrollLeft / totalScrollable;
        const totalDots = activeCategories.length;
        const currentIndex = Math.min(
          totalDots - 1,
          Math.floor(progress * totalDots)
        );
        setActiveIndex(currentIndex);
      }
    }
  };

  return (
    <div className="w-full py-3.5 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-green-100 text-[#0f8646] flex items-center justify-center font-black text-xs shadow-2xs">
              🌿
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                Sunrise farm-harvested veggies, fruits & daily staples
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>Explore All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Categories Container: Evenly distributed grid for 4 items, or swipeable carousel if more */}
        <div className="relative group">
          {/* Left Arrow Button (Only when carousel is needed) */}
          {isCarouselNeeded && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex absolute -left-2 sm:-left-4 top-[38%] -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-700 hover:text-[#0f8646] w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-gray-200 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <ChevronLeft size={18} className="stroke-[2.5]" />
            </button>
          )}

          {/* Categories Row */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={`flex items-start ${
              isCarouselNeeded
                ? "overflow-x-auto gap-4 sm:gap-6 md:gap-8 pb-3 pt-1 snap-x snap-mandatory scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 scroll-smooth"
                : "grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 justify-items-center gap-2 sm:gap-6 max-w-4xl mx-auto py-1"
            }`}
          >
            {activeCategories.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className="flex flex-col items-center shrink-0 cursor-pointer snap-start group text-center w-full max-w-[90px] xs:max-w-[100px] sm:max-w-[140px] md:max-w-[160px]"
              >
                {/* Circular Image Frame with Emerald Glow Ring */}
                <div className="w-[68px] h-[68px] xs:w-[76px] xs:h-[76px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden bg-white border-2 border-white shadow-md ring-2 ring-emerald-100/90 group-hover:ring-[#0f8646] transition-all duration-300 flex items-center justify-center relative p-0.5">
                  <img
                    src={item.image || "/categories/vegetables.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Clean Bold Category Label with full text wrap */}
                <span className="text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm font-black text-gray-800 group-hover:text-[#0f8646] transition-colors line-clamp-2 mt-2 tracking-tight text-center leading-tight px-1">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow Button (Only when carousel is needed) */}
          {isCarouselNeeded && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex absolute -right-2 sm:-right-4 top-[38%] -translate-y-1/2 z-20 bg-[#0f8646] hover:bg-[#0c6a38] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-green-600 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} className="stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Carousel Pagination Dots (Only if carousel is active) */}
        {isCarouselNeeded && activeCategories.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {activeCategories.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-4 bg-[#0f8646]"
                    : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
