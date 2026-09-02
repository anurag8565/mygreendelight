"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const defaultCategories = [
  {
    _id: "1",
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "2",
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "3",
    name: "Dairy & Eggs",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "4",
    name: "Exotics",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "5",
    name: "Salad Mixes",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "6",
    name: "Oils & Ghee",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "7",
    name: "Wholesome Snacks",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "8",
    name: "Fresh Juices",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=85",
  },
];

export default function CategorySlider({
  categories = [],
}: {
  categories?: any[];
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loadedCategories, setLoadedCategories] = useState<any[]>(
    categories.length > 0 ? categories : []
  );

  useEffect(() => {
    if (categories.length > 0) {
      setLoadedCategories(categories);
      return;
    }

    fetch("/api/admin/category")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length >= 4) {
          // If less than 6 from DB, merge with default categories so carousel has rich sliding content
          const names = new Set(data.categories.map((c: any) => c.name.toLowerCase()));
          const extra = defaultCategories.filter((dc) => !names.has(dc.name.toLowerCase()));
          setLoadedCategories([...data.categories, ...extra]);
        } else {
          setLoadedCategories(defaultCategories);
        }
      })
      .catch(() => {
        setLoadedCategories(defaultCategories);
      });
  }, [categories]);

  // Ensure there are always at least 8 categories so the desktop carousel fills nicely
  const getFullCategories = () => {
    if (loadedCategories.length >= 6) return loadedCategories;
    const names = new Set(loadedCategories.map((c: any) => c.name.toLowerCase()));
    const extra = defaultCategories.filter((dc) => !names.has(dc.name.toLowerCase()));
    return [...loadedCategories, ...extra];
  };

  const activeCategories = getFullCategories();

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
        const totalDots = Math.min(8, activeCategories.length);
        const currentIndex = Math.min(
          totalDots - 1,
          Math.floor(progress * totalDots)
        );
        setActiveIndex(currentIndex);
      }
    }
  };

  const totalDots = Math.min(8, activeCategories.length);

  return (
    <div className="w-full py-4 sm:py-7 bg-white">
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

        {/* Circular Story Carousel Container */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex absolute -left-2 sm:-left-4 top-[38%] -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-700 hover:text-[#0f8646] w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-gray-200 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft size={18} className="stroke-[2.5]" />
          </button>

          {/* Horizontal Circular Carousel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 pb-3 pt-1 snap-x snap-mandatory scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 scroll-smooth items-start"
          >
            {activeCategories.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className="flex flex-col items-center shrink-0 cursor-pointer snap-start group text-center w-[78px] xs:w-[86px] sm:w-[110px] md:w-[130px]"
              >
                {/* Perfect Circular Image Frame with Emerald Glow Ring */}
                <div className="w-[72px] h-[72px] xs:w-[80px] xs:h-[80px] sm:w-[98px] sm:h-[98px] md:w-[115px] md:h-[115px] rounded-full overflow-hidden bg-white border-2 border-white shadow-md ring-2 ring-emerald-100/90 group-hover:ring-[#0f8646] transition-all duration-300 flex items-center justify-center relative p-0.5">
                  <img
                    src={item.image || "/categories/vegetables.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Clean Bold Category Label */}
                <span className="text-[11px] sm:text-xs md:text-sm font-black text-gray-800 group-hover:text-[#0f8646] transition-colors line-clamp-1 mt-2 tracking-tight">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow Button (Green Accent like reference screenshot) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex absolute -right-2 sm:-right-4 top-[38%] -translate-y-1/2 z-20 bg-[#0f8646] hover:bg-[#0c6a38] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-green-600 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        {totalDots > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {[...Array(totalDots)].map((_, i) => (
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
