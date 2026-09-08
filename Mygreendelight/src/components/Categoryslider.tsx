"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Clean, theme-based category metadata with rich visual tokens
const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    subtitle: string;
    tag: string;
    imgUrl: string;
    cardBg: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    textColor: string;
    accentHover: string;
  }
> = {
  vegetables: {
    title: "Fresh Vegetables",
    subtitle: "Farm Fresh Daily Harvest",
    tag: "Daily Mandi Fresh",
    imgUrl: "/categories/vegetables_4k.jpg",
    cardBg: "bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/20",
    badgeBg: "bg-emerald-100/80",
    badgeText: "text-emerald-800",
    borderColor: "border-emerald-100 hover:border-emerald-300",
    textColor: "text-gray-900 group-hover:text-emerald-800",
    accentHover: "group-hover:bg-emerald-600",
  },
  vegetable: {
    title: "Fresh Vegetables",
    subtitle: "Farm Fresh Daily Harvest",
    tag: "Daily Mandi Fresh",
    imgUrl: "/categories/vegetables_4k.jpg",
    cardBg: "bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/20",
    badgeBg: "bg-emerald-100/80",
    badgeText: "text-emerald-800",
    borderColor: "border-emerald-100 hover:border-emerald-300",
    textColor: "text-gray-900 group-hover:text-emerald-800",
    accentHover: "group-hover:bg-emerald-600",
  },
  fruits: {
    title: "Seasonal Fruits",
    subtitle: "Sweet & Naturally Ripe",
    tag: "Orchard Picked",
    imgUrl: "/categories/fruits_4k.jpg",
    cardBg: "bg-gradient-to-b from-amber-50/60 via-white to-amber-50/20",
    badgeBg: "bg-amber-100/80",
    badgeText: "text-amber-800",
    borderColor: "border-amber-100 hover:border-amber-300",
    textColor: "text-gray-900 group-hover:text-amber-800",
    accentHover: "group-hover:bg-amber-600",
  },
  fruit: {
    title: "Seasonal Fruits",
    subtitle: "Sweet & Naturally Ripe",
    tag: "Orchard Picked",
    imgUrl: "/categories/fruits_4k.jpg",
    cardBg: "bg-gradient-to-b from-amber-50/60 via-white to-amber-50/20",
    badgeBg: "bg-amber-100/80",
    badgeText: "text-amber-800",
    borderColor: "border-amber-100 hover:border-amber-300",
    textColor: "text-gray-900 group-hover:text-amber-800",
    accentHover: "group-hover:bg-amber-600",
  },
  exotics: {
    title: "Hydroponic Exotics",
    subtitle: "Gourmet Salads & Greens",
    tag: "100% Pesticide Free",
    imgUrl: "/categories/exotics_4k.jpg",
    cardBg: "bg-gradient-to-b from-purple-50/60 via-white to-purple-50/20",
    badgeBg: "bg-purple-100/80",
    badgeText: "text-purple-800",
    borderColor: "border-purple-100 hover:border-purple-300",
    textColor: "text-gray-900 group-hover:text-purple-800",
    accentHover: "group-hover:bg-purple-600",
  },
  exotic: {
    title: "Hydroponic Exotics",
    subtitle: "Gourmet Salads & Greens",
    tag: "100% Pesticide Free",
    imgUrl: "/categories/exotics_4k.jpg",
    cardBg: "bg-gradient-to-b from-purple-50/60 via-white to-purple-50/20",
    badgeBg: "bg-purple-100/80",
    badgeText: "text-purple-800",
    borderColor: "border-purple-100 hover:border-purple-300",
    textColor: "text-gray-900 group-hover:text-purple-800",
    accentHover: "group-hover:bg-purple-600",
  },
  dairy: {
    title: "Dairy & Essentials",
    subtitle: "Pure Milk, Paneer & Butter",
    tag: "Daily Farm Fresh",
    imgUrl: "/categories/dairy_4k.jpg",
    cardBg: "bg-gradient-to-b from-sky-50/60 via-white to-sky-50/20",
    badgeBg: "bg-sky-100/80",
    badgeText: "text-sky-800",
    borderColor: "border-sky-100 hover:border-sky-300",
    textColor: "text-gray-900 group-hover:text-sky-800",
    accentHover: "group-hover:bg-sky-600",
  },
  "ready to cook": {
    title: "Ready to Cook",
    subtitle: "Pre-Cleaned & Peeled",
    tag: "Saves 20 Mins",
    imgUrl: "/categories/ready_to_cook.jpg",
    cardBg: "bg-gradient-to-b from-rose-50/60 via-white to-rose-50/20",
    badgeBg: "bg-rose-100/80",
    badgeText: "text-rose-800",
    borderColor: "border-rose-100 hover:border-rose-300",
    textColor: "text-gray-900 group-hover:text-rose-800",
    accentHover: "group-hover:bg-rose-600",
  },
};

const PRIORITY = ["vegetables", "fruits", "exotics", "dairy", "ready to cook"];

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
            sortAndSet(data.categories);
          }
        })
        .catch(console.error);
    } else {
      sortAndSet(list);
    }
  }, [categories]);

  const sortAndSet = (list: any[]) => {
    const sorted = [...list].sort((a, b) => {
      const nameA = (a.name || "").toLowerCase().trim();
      const nameB = (b.name || "").toLowerCase().trim();

      const idxA = PRIORITY.findIndex((p) => nameA.includes(p));
      const idxB = PRIORITY.findIndex((p) => nameB.includes(p));

      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    setActiveCategories(sorted);
  };

  if (!activeCategories || activeCategories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-5 sm:py-8 bg-white font-sans border-b border-gray-100/90">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Sparkles size={10} className="text-emerald-600" />
                Handpicked Fresh
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-950 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block mt-0.5">
              Direct farm-sourced & graded for crispness, freshness, and quality
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/70 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 shrink-0 group shadow-2xs"
          >
            <span>All Produce</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 
          Clean Minimalist Theme-Based Cards Grid
        */}
        <div className="grid grid-cols-3 max-w-5xl md:mx-auto gap-2.5 sm:gap-4 md:gap-6">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const matchedKey =
              Object.keys(CATEGORY_MAP).find((k) => rawKey.includes(k)) || "";
            const config = CATEGORY_MAP[matchedKey] || {
              title: item.name,
              subtitle: "Fresh Harvest Produce",
              tag: "Farm Fresh",
              imgUrl: item.image || "/categories/vegetables_4k.jpg",
              cardBg: "bg-gradient-to-b from-gray-50/70 via-white to-gray-50/20",
              badgeBg: "bg-gray-100",
              badgeText: "text-gray-700",
              borderColor: "border-gray-100 hover:border-gray-300",
              textColor: "text-gray-900 group-hover:text-emerald-800",
              accentHover: "group-hover:bg-emerald-600",
            };

            const imageSrc =
              item.image &&
              (item.image.startsWith("/categories/") || item.image.startsWith("http"))
                ? item.image
                : config.imgUrl;

            return (
              <motion.div
                key={item._id || item.name || idx}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 ${config.cardBg} border ${config.borderColor} shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between select-none relative overflow-hidden`}
              >
                {/* Image Container with Soft Shadow & Border */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-2xs border border-white/90">
                  <img
                    src={imageSrc}
                    alt={config.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl || "/categories/vegetables_4k.jpg";
                    }}
                  />

                  {/* Minimalist Micro Tag Badge */}
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                    <span
                      className={`inline-block text-[9px] sm:text-[11px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-md sm:rounded-lg ${config.badgeBg} ${config.badgeText} shadow-2xs backdrop-blur-xs`}
                    >
                      {config.tag}
                    </span>
                  </div>

                  {/* Corner Micro Action Link on Hover */}
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-200 shadow-xs hidden sm:flex items-center justify-center">
                    <ArrowUpRight size={13} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* Typography & Details */}
                <div className="mt-2.5 sm:mt-3.5 text-center sm:text-left flex flex-col justify-between">
                  <div className="flex items-center justify-center sm:justify-between gap-1">
                    <h3
                      className={`font-black text-xs sm:text-base md:text-lg ${config.textColor} leading-tight tracking-tight transition-colors duration-200 truncate`}
                    >
                      {config.title}
                    </h3>
                    <div
                      className={`hidden sm:flex w-6 h-6 rounded-full bg-gray-100 text-gray-600 items-center justify-center ${config.accentHover} group-hover:text-white transition-all duration-200 shadow-2xs shrink-0 group-hover:translate-x-0.5`}
                    >
                      <ChevronRight size={13} className="stroke-[2.5]" />
                    </div>
                  </div>

                  <p className="hidden sm:block text-xs text-gray-500 font-medium truncate mt-1">
                    {config.subtitle}
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

