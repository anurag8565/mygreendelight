"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// High-converting category metadata with pastel themes & HD transparent images
const CATEGORY_THEMES: Record<string, { bg: string; border: string; badge: string; text: string; defaultImg: string; count: string }> = {
  "vegetables": {
    bg: "from-emerald-50/90 to-green-100/60",
    border: "border-emerald-200/80 hover:border-[#0f8646]",
    badge: "bg-emerald-100 text-[#0f8646]",
    text: "text-emerald-950",
    defaultImg: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    count: "220+ Fresh Picks"
  },
  "fruits": {
    bg: "from-amber-50/90 to-orange-100/60",
    border: "border-amber-200/80 hover:border-orange-500",
    badge: "bg-amber-100 text-amber-900",
    text: "text-amber-950",
    defaultImg: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80",
    count: "120+ Sweet & Juicy"
  },
  "dairy & staples": {
    bg: "from-sky-50/90 to-blue-100/60",
    border: "border-sky-200/80 hover:border-blue-500",
    badge: "bg-sky-100 text-sky-900",
    text: "text-sky-950",
    defaultImg: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80",
    count: "Pure Desi Ghee & Milk"
  },
  "exotics": {
    bg: "from-teal-50/90 to-emerald-100/60",
    border: "border-teal-200/80 hover:border-teal-500",
    badge: "bg-teal-100 text-teal-900",
    text: "text-teal-950",
    defaultImg: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=400&q=80",
    count: "Hydroponic & Exotics"
  },
  "ready-to-cook & cut produce": {
    bg: "from-purple-50/90 to-violet-100/60",
    border: "border-purple-200/80 hover:border-purple-500",
    badge: "bg-purple-100 text-purple-900",
    text: "text-purple-950",
    defaultImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    count: "Peeled & Chopped"
  },
};

// Priority sorting order
const PRIORITY_ORDER = [
  "vegetables",
  "fruits",
  "dairy & staples",
  "exotics",
  "ready-to-cook & cut produce"
];

export default function CategorySlider({
  categories = [],
}: {
  categories?: any[];
}) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState<any[]>([]);

  useEffect(() => {
    let list = categories.length > 0 ? [...categories] : [];

    if (list.length === 0) {
      fetch("/api/admin/category")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.categories && data.categories.length > 0) {
            organizeCategories(data.categories);
          }
        })
        .catch(console.error);
    } else {
      organizeCategories(list);
    }
  }, [categories]);

  const organizeCategories = (rawList: any[]) => {
    // Sort according to preferred customer priority
    const sorted = [...rawList].sort((a, b) => {
      const aName = (a.name || "").toLowerCase().trim();
      const bName = (b.name || "").toLowerCase().trim();
      const aIdx = PRIORITY_ORDER.indexOf(aName);
      const bIdx = PRIORITY_ORDER.indexOf(bName);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
    setActiveCategories(sorted);
  };

  if (!activeCategories || activeCategories.length === 0) return null;

  return (
    <div className="w-full py-3.5 sm:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black text-xs shadow-2xs">
              🥬
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-[10.5px] sm:text-xs text-gray-400 font-medium">
                Sunrise farm-harvested veggies, fruits & fresh daily staples
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

        {/* Blinkit/Zepto-style Modern Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
          {activeCategories.map((item, idx) => {
            const key = (item.name || "").toLowerCase().trim();
            const theme = CATEGORY_THEMES[key] || {
              bg: "from-gray-50 to-emerald-50/40",
              border: "border-gray-200/80 hover:border-[#0f8646]",
              badge: "bg-emerald-100 text-[#0f8646]",
              text: "text-gray-900",
              defaultImg: "/categories/vegetables.jpg",
              count: "Fresh Produce"
            };

            return (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-gradient-to-b ${theme.bg} border ${theme.border} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-[120px] xs:h-[130px] sm:h-[160px]`}
              >
                {/* Top Label & Count */}
                <div className="z-10 relative">
                  <h3 className={`font-black text-xs sm:text-sm md:text-base ${theme.text} leading-tight line-clamp-1 group-hover:text-[#0f8646] transition-colors`}>
                    {item.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 font-bold block mt-0.5">
                    {theme.count}
                  </span>
                </div>

                {/* Bottom Graphic Image */}
                <div className="relative flex justify-end items-end mt-auto h-[60px] sm:h-[80px]">
                  <img
                    src={item.image || theme.defaultImg}
                    alt={item.name}
                    className="h-full w-auto max-w-[85px] sm:max-w-[110px] object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                    onError={(e: any) => {
                      e.target.src = theme.defaultImg;
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
