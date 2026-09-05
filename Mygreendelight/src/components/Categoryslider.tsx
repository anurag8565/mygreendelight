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
    badgeColor: string;
    imgUrl: string;
    accentBg: string;
  }
> = {
  vegetables: {
    displayName: "Daily Vegetables",
    subTitle: "Farm Harvested Today",
    badge: "100% Fresh",
    badgeColor: "bg-emerald-600/90 text-white",
    imgUrl: "/categories/vegetables.jpg",
    accentBg: "from-emerald-50/70 to-green-50/20",
  },
  fruits: {
    displayName: "Fresh Fruits",
    subTitle: "Juicy & Naturally Sweet",
    badge: "Seasonal Sweet",
    badgeColor: "bg-amber-600/90 text-white",
    imgUrl: "/categories/fruits.jpg",
    accentBg: "from-amber-50/70 to-orange-50/20",
  },
  exotics: {
    displayName: "Exotics & Greens",
    subTitle: "Hydroponic & Gourmet",
    badge: "Premium Quality",
    badgeColor: "bg-purple-600/90 text-white",
    imgUrl: "/categories/exotic.jpg",
    accentBg: "from-purple-50/70 to-pink-50/20",
  },
  "dairy & staples": {
    displayName: "Dairy & Staples",
    subTitle: "Pure Milk & Farm Staples",
    badge: "100% Pure",
    badgeColor: "bg-blue-600/90 text-white",
    imgUrl: "/categories/dairy.jpg",
    accentBg: "from-blue-50/70 to-sky-50/20",
  },
  "ready-to-cook & cut produce": {
    displayName: "Cut & Ready",
    subTitle: "Chopped & Peeled",
    badge: "Zero Prep",
    badgeColor: "bg-teal-600/90 text-white",
    imgUrl: "/categories/ready_to_cook.jpg",
    accentBg: "from-teal-50/70 to-emerald-50/20",
  },
};

const PRIORITY_ORDER = [
  "vegetables",
  "fruits",
  "exotics",
  "dairy & staples",
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
    let list = Array.isArray(categories) && categories.length > 0 ? [...categories] : [];

    if (list.length === 0) {
      fetch("/api/admin/category")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.categories)) {
            organizeCategories(data.categories);
          }
        })
        .catch(console.error);
    } else {
      organizeCategories(list);
    }
  }, [categories]);

  const organizeCategories = (list: any[]) => {
    // Only use categories that strictly exist in the database
    const sorted = [...list].sort((a, b) => {
      const nameA = (a.name || "").toLowerCase().trim();
      const nameB = (b.name || "").toLowerCase().trim();

      const indexA = PRIORITY_ORDER.indexOf(nameA);
      const indexB = PRIORITY_ORDER.indexOf(nameB);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });

    setActiveCategories(sorted);
  };

  if (!activeCategories || activeCategories.length === 0) {
    return null;
  }

  const count = activeCategories.length;

  // Responsive desktop grid configuration based on exact category count
  const desktopGridClass =
    count === 1
      ? "md:grid-cols-1 max-w-sm mx-auto"
      : count === 2
      ? "md:grid-cols-2 max-w-2xl mx-auto"
      : count === 3
      ? "md:grid-cols-3 max-w-5xl mx-auto"
      : count === 4
      ? "md:grid-cols-4 max-w-6xl mx-auto"
      : "md:grid-cols-5 max-w-7xl mx-auto";

  return (
    <section className="w-full py-5 sm:py-8 md:py-10 bg-gradient-to-b from-[#f8faf9] via-white to-[#f8faf9] border-y border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 text-[#0c831f] text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                🌱 Fresh Harvest
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 font-medium mt-0.5">
              Direct from local Bhopal contract farms • Hand-picked daily at 5:00 AM
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-black text-xs sm:text-sm flex items-center gap-1.5 group transition bg-white hover:bg-emerald-50/50 px-3.5 sm:px-4 py-2 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0c831f]/30 shrink-0"
          >
            <span>Explore All</span>
            <ChevronRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Dynamic Responsive Layout:
            - Mobile (< 768px):
              - 3 categories -> perfectly fitted 3-column grid without unnecessary horizontal scroll
              - 4+ categories -> smooth horizontal swipe track with touch snap
            - Desktop (>= 768px):
              - Balanced 3, 4 or 5-column grid with generous spacing and hover lift
        */}
        <div
          className={`${
            count <= 3
              ? "grid grid-cols-3"
              : "flex overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 overscroll-x-contain snap-x snap-mandatory"
          } md:grid ${desktopGridClass} gap-2.5 sm:gap-4 md:gap-6 pb-2 pt-1`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_CONFIG[rawKey] || {
              displayName: item.name,
              subTitle: "Farm Fresh Produce",
              badge: "Farm Fresh",
              badgeColor: "bg-gray-900/85 text-white",
              imgUrl: item.image || "/categories/vegetables.jpg",
              accentBg: "from-gray-50 to-gray-100/40",
            };

            const imageSrc =
              item.image && (item.image.startsWith("/categories/") || item.image.startsWith("http"))
                ? item.image
                : config.imgUrl;

            return (
              <motion.div
                key={item._id || item.name || idx}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 bg-gradient-to-b ${config.accentBg} bg-white hover:bg-white border border-gray-200/80 hover:border-[#0c831f]/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(12,131,31,0.14)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  count <= 3 ? "w-full" : "w-[120px] xs:w-[135px] sm:w-[155px] md:w-auto shrink-0 snap-start"
                } select-none`}
              >
                {/* Upper Photo Frame */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-100/90 shadow-2xs mb-2.5 sm:mb-3.5">
                  <img
                    src={imageSrc}
                    alt={config.displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl || "/categories/vegetables.jpg";
                    }}
                  />

                  {/* Soft Vignette Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Floating Pill Badge */}
                  <span
                    className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-lg shadow-xs backdrop-blur-xs ${config.badgeColor}`}
                  >
                    {config.badge}
                  </span>
                </div>

                {/* Card Title, Subtitle & Action Arrow */}
                <div className="text-center sm:text-left px-0.5">
                  <div className="flex items-center justify-center sm:justify-between gap-1">
                    <h3 className="font-black text-xs sm:text-base md:text-lg text-gray-900 leading-tight group-hover:text-[#0c831f] transition-colors truncate">
                      {config.displayName}
                    </h3>
                    <div className="hidden sm:flex w-6 h-6 rounded-full bg-emerald-50 text-[#0c831f] items-center justify-center group-hover:bg-[#0c831f] group-hover:text-white transition-all shadow-2xs shrink-0">
                      <ChevronRight size={13} className="stroke-[3]" />
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate mt-0.5 sm:mt-1">
                    {config.subTitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
