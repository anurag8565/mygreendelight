"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// High-converting quick-commerce metadata with HD studio images & color themes
const CATEGORY_CONFIG: Record<
  string,
  {
    displayName: string;
    subTitle: string;
    badge: string;
    bgHover: string;
    border: string;
    badgeBg: string;
    imgUrl: string;
  }
> = {
  vegetables: {
    displayName: "Daily Vegetables",
    subTitle: "Farm Harvested",
    badge: "Fresh Today",
    bgHover: "hover:border-emerald-500 hover:shadow-emerald-100",
    border: "border-emerald-100/90",
    badgeBg: "bg-emerald-600 text-white",
    imgUrl: "/categories/vegetables.jpg",
  },
  fruits: {
    displayName: "Fresh Fruits",
    subTitle: "Sweet & Juicy",
    badge: "Seasonal",
    bgHover: "hover:border-orange-500 hover:shadow-orange-100",
    border: "border-amber-100/90",
    badgeBg: "bg-orange-500 text-white",
    imgUrl: "/categories/fruits.jpg",
  },
  "dairy & staples": {
    displayName: "Dairy & Staples",
    subTitle: "Milk, Ghee & Atta",
    badge: "100% Pure",
    bgHover: "hover:border-blue-500 hover:shadow-blue-100",
    border: "border-sky-100/90",
    badgeBg: "bg-blue-600 text-white",
    imgUrl: "/categories/dairy.jpg",
  },
  exotics: {
    displayName: "Exotics & Greens",
    subTitle: "Hydroponic Picks",
    badge: "Premium",
    bgHover: "hover:border-teal-500 hover:shadow-teal-100",
    border: "border-teal-100/90",
    badgeBg: "bg-teal-600 text-white",
    imgUrl: "/categories/exotic.jpg",
  },
  "ready-to-cook & cut produce": {
    displayName: "Cut & Ready",
    subTitle: "Peeled & Chopped",
    badge: "Zero Prep",
    bgHover: "hover:border-purple-500 hover:shadow-purple-100",
    border: "border-purple-100/90",
    badgeBg: "bg-purple-600 text-white",
    imgUrl: "/categories/ready_to_cook.jpg",
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
    <div className="w-full py-3.5 sm:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/90 text-[#0f8646] flex items-center justify-center font-black text-sm shadow-2xs border border-emerald-200/60">
              🥦
            </div>
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block">
                Farm-fresh morning picks, seasonal fruits & pure dairy staples
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-200/70 shadow-2xs"
          >
            <span>See All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Real HD Photo Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_CONFIG[rawKey] || {
              displayName: item.name,
              subTitle: "Farm Fresh",
              badge: "Fresh",
              bgHover: "hover:border-[#0f8646] hover:shadow-emerald-100",
              border: "border-gray-100",
              badgeBg: "bg-emerald-600 text-white",
              imgUrl: item.image || "/categories/vegetables.jpg",
            };

            const imageSrc = item.image && item.image.startsWith("/categories/") 
              ? item.image 
              : config.imgUrl;

            return (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 bg-white border ${config.border} ${config.bgHover} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Upper Photo Window */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 mb-2">
                  <img
                    src={imageSrc}
                    alt={config.displayName}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl;
                    }}
                  />

                  {/* Floating Micro Badge */}
                  <span
                    className={`absolute top-2 left-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm ${config.badgeBg}`}
                  >
                    {config.badge}
                  </span>
                </div>

                {/* Card Title & Subtitle */}
                <div className="px-1 pb-1">
                  <h3 className="font-black text-xs sm:text-sm md:text-base text-gray-900 leading-tight group-hover:text-[#0f8646] transition-colors truncate">
                    {config.displayName}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium truncate mt-0.5">
                    {config.subTitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
