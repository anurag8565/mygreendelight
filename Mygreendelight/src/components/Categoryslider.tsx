"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles, ArrowRight, Zap, Leaf, Heart } from "lucide-react";
import { motion } from "framer-motion";

// Clean, high-converting category metadata
const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    hindiTitle: string;
    subtitle: string;
    tag: string;
    itemCountText: string;
    imgUrl: string;
    bgGradient: string;
    borderColor: string;
    textColor: string;
    badgeBg: string;
    accentGlow: string;
  }
> = {
  vegetables: {
    title: "Fresh Vegetables",
    hindiTitle: "ताज़ी सब्जियां",
    subtitle: "5:00 AM Mandi Harvest • 100% Ozone Washed",
    tag: "Daily Fresh",
    itemCountText: "40+ Varieties",
    imgUrl: "/categories/vegetables.jpg",
    bgGradient: "bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-600/15",
    borderColor: "border-emerald-300/80 hover:border-emerald-500",
    textColor: "text-emerald-950",
    badgeBg: "bg-emerald-600 text-white",
    accentGlow: "group-hover:shadow-emerald-500/20",
  },
  fruits: {
    title: "Sweet Fruits",
    hindiTitle: "मीठे व ताज़े फल",
    subtitle: "Naturally Ripened • Sweet, Juicy & Handpicked",
    tag: "Sweet & Juicy",
    itemCountText: "25+ Varieties",
    imgUrl: "/categories/fruits.jpg",
    bgGradient: "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/15",
    borderColor: "border-amber-300/80 hover:border-amber-500",
    textColor: "text-amber-950",
    badgeBg: "bg-amber-600 text-white",
    accentGlow: "group-hover:shadow-amber-500/20",
  },
  exotics: {
    title: "Hydroponics & Exotics",
    hindiTitle: "विदेशी फल व सलाद",
    subtitle: "Pesticide-Free • Gourmet Greens & Fresh Herbs",
    tag: "Hydroponic Grade",
    itemCountText: "20+ Varieties",
    imgUrl: "/categories/exotic.jpg",
    bgGradient: "bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-purple-600/15",
    borderColor: "border-purple-300/80 hover:border-purple-500",
    textColor: "text-purple-950",
    badgeBg: "bg-purple-600 text-white",
    accentGlow: "group-hover:shadow-purple-500/20",
  },
  "dairy & staples": {
    title: "Dairy & Staples",
    hindiTitle: "दूध व किराना",
    subtitle: "Pure Desi Cow Milk & Daily Kitchen Staples",
    tag: "100% Pure",
    itemCountText: "Pure Batch",
    imgUrl: "/categories/dairy.jpg",
    bgGradient: "bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-blue-600/15",
    borderColor: "border-blue-300/80 hover:border-blue-500",
    textColor: "text-blue-950",
    badgeBg: "bg-blue-600 text-white",
    accentGlow: "group-hover:shadow-blue-500/20",
  },
  "ready-to-cook & cut produce": {
    title: "Cut & Ready Veggies",
    hindiTitle: "कटी हुई सब्जियां",
    subtitle: "Pre-Washed, Peeled & Chopped • Zero Prep Time",
    tag: "Zero Prep",
    itemCountText: "Ready-to-Cook",
    imgUrl: "/categories/ready_to_cook.jpg",
    bgGradient: "bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-teal-600/15",
    borderColor: "border-teal-300/80 hover:border-teal-500",
    textColor: "text-teal-950",
    badgeBg: "bg-teal-600 text-white",
    accentGlow: "group-hover:shadow-teal-500/20",
  },
};

const PRIORITY = ["vegetables", "fruits", "exotics", "dairy & staples", "ready-to-cook & cut produce"];

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

      const idxA = PRIORITY.indexOf(nameA);
      const idxB = PRIORITY.indexOf(nameB);

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
    <section className="w-full py-4 sm:py-7 bg-white font-sans border-b border-gray-100/90">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧺</span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Shop by Produce Category
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden sm:block mt-0.5">
              Select category to buy fresh Bhopal Mandi harvest with 10-15 min express delivery
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition shrink-0"
          >
            <span>All Produce</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 
          3-Pillar Category Cards for Vegetables, Fruits, and Exotics
        */}
        <div className="grid grid-cols-3 md:grid-cols-3 max-w-6xl md:mx-auto gap-2.5 sm:gap-4 md:gap-6">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_MAP[rawKey] || {
              title: item.name,
              hindiTitle: item.name,
              subtitle: "Fresh Harvested Produce",
              tag: "Farm Fresh",
              itemCountText: "Fresh Today",
              imgUrl: item.image || "/categories/vegetables.jpg",
              bgGradient: "bg-gradient-to-br from-gray-50 to-slate-50",
              borderColor: "border-gray-200",
              textColor: "text-gray-900",
              badgeBg: "bg-gray-800 text-white",
              accentGlow: "group-hover:shadow-gray-500/20",
            };

            const imageSrc =
              item.image && (item.image.startsWith("/categories/") || item.image.startsWith("http"))
                ? item.image
                : config.imgUrl;

            return (
              <motion.div
                key={item._id || item.name || idx}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -4 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 ${config.bgGradient} border ${config.borderColor} shadow-xs hover:shadow-lg ${config.accentGlow} transition-all duration-300 flex flex-col justify-between select-none relative overflow-hidden`}
              >
                {/* Visual Top Badge */}
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 z-10">
                  <span className={`text-[8.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full ${config.badgeBg} shadow-2xs tracking-tight`}>
                    {config.tag}
                  </span>
                  <span className="text-[9px] sm:text-xs text-gray-500 font-bold hidden sm:inline">
                    {config.itemCountText}
                  </span>
                </div>

                {/* Image Section */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-2xs border border-white/60">
                  <img
                    src={imageSrc}
                    alt={config.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl || "/categories/vegetables.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Text Content */}
                <div className="mt-2 sm:mt-3 text-center sm:text-left flex flex-col justify-between">
                  <div className="flex items-center justify-center sm:justify-between gap-1">
                    <div>
                      <h3 className={`font-black text-xs sm:text-base md:text-lg ${config.textColor} leading-tight tracking-tight`}>
                        {config.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-500 mt-0.5">
                        {config.hindiTitle}
                      </p>
                    </div>

                    <div className="hidden sm:flex w-7 h-7 rounded-full bg-white text-[#0c831f] items-center justify-center group-hover:bg-[#0c831f] group-hover:text-white transition-all shadow-xs shrink-0">
                      <ChevronRight size={14} className="stroke-[3]" />
                    </div>
                  </div>

                  <p className="hidden md:block text-xs text-gray-500 font-medium truncate mt-1">
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

