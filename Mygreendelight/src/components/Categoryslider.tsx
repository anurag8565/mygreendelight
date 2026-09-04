"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// High-converting quick-commerce metadata with vibrant soft pastels & high-res icons
const CATEGORY_CONFIG: Record<
  string,
  {
    displayName: string;
    subTitle: string;
    badge: string;
    emoji: string;
    gradient: string;
    border: string;
    badgeBg: string;
    textColor: string;
    imgUrl: string;
  }
> = {
  vegetables: {
    displayName: "Daily Vegetables",
    subTitle: "Farm Harvested",
    badge: "Fresh Today",
    emoji: "🥬",
    gradient: "from-emerald-50 to-green-100/70",
    border: "border-emerald-200/90 hover:border-[#0f8646]",
    badgeBg: "bg-emerald-600 text-white",
    textColor: "text-emerald-950",
    imgUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=320&q=80",
  },
  fruits: {
    displayName: "Fresh Fruits",
    subTitle: "Sweet & Juicy",
    badge: "Seasonal",
    emoji: "🍎",
    gradient: "from-amber-50 to-orange-100/70",
    border: "border-amber-200/90 hover:border-orange-500",
    badgeBg: "bg-orange-500 text-white",
    textColor: "text-amber-950",
    imgUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=320&q=80",
  },
  "dairy & staples": {
    displayName: "Dairy & Staples",
    subTitle: "Milk, Ghee & Atta",
    badge: "100% Pure",
    emoji: "🥛",
    gradient: "from-sky-50 to-blue-100/70",
    border: "border-sky-200/90 hover:border-blue-500",
    badgeBg: "bg-blue-600 text-white",
    textColor: "text-sky-950",
    imgUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=320&q=80",
  },
  exotics: {
    displayName: "Exotics & Greens",
    subTitle: "Hydroponic Picks",
    badge: "Premium",
    emoji: "🥑",
    gradient: "from-teal-50 to-emerald-100/70",
    border: "border-teal-200/90 hover:border-teal-600",
    badgeBg: "bg-teal-600 text-white",
    textColor: "text-teal-950",
    imgUrl: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=320&q=80",
  },
  "ready-to-cook & cut produce": {
    displayName: "Cut & Ready Veggies",
    subTitle: "Peeled & Chopped",
    badge: "Zero Prep",
    emoji: "🥗",
    gradient: "from-purple-50 to-violet-100/70",
    border: "border-purple-200/90 hover:border-purple-600",
    badgeBg: "bg-purple-600 text-white",
    textColor: "text-purple-950",
    imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=320&q=80",
  },
};

const PRIORITY_ORDER = [
  "vegetables",
  "fruits",
  "dairy & staples",
  "exotics",
  "ready-to-cook & cut produce",
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
    <div className="w-full py-3 sm:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/90 text-[#0f8646] flex items-center justify-center font-black text-sm shadow-xs border border-emerald-200/60">
              🌱
            </div>
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>Shop by Category</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block">
                Farm-fresh morning picks, pure daily essentials & ready-to-cook
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition bg-emerald-50/80 hover:bg-emerald-100/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-emerald-200/60 shadow-2xs"
          >
            <span>See All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Ultra-Clean Modern Quick-Commerce Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_CONFIG[rawKey] || {
              displayName: item.name,
              subTitle: "Fresh Produce",
              badge: "Farm Fresh",
              emoji: "🌱",
              gradient: "from-emerald-50 to-green-100/60",
              border: "border-emerald-200 hover:border-[#0f8646]",
              badgeBg: "bg-emerald-600 text-white",
              textColor: "text-gray-900",
              imgUrl: item.image || "/categories/vegetables.jpg",
            };

            return (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-gradient-to-br ${config.gradient} border ${config.border} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-[125px] sm:h-[145px] md:h-[155px]`}
              >
                {/* Top Badge & Text */}
                <div className="z-10 relative">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs ${config.badgeBg}`}
                    >
                      {config.badge}
                    </span>
                    <span className="text-base sm:text-lg group-hover:scale-125 transition-transform">
                      {config.emoji}
                    </span>
                  </div>

                  <h3
                    className={`font-black text-xs sm:text-sm md:text-base ${config.textColor} leading-tight group-hover:text-[#0f8646] transition-colors`}
                  >
                    {config.displayName}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mt-0.5">
                    {config.subTitle}
                  </p>
                </div>

                {/* Subtle visual footer indicator */}
                <div className="z-10 relative flex items-center justify-between pt-1 border-t border-black/5 mt-auto">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#0f8646] flex items-center gap-0.5">
                    Explore
                    <ChevronRight size={12} className="stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                {/* Decorative Soft Watermark Circle */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/40 blur-xs pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
