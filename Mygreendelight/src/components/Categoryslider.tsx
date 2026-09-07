"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

// Clean, high-converting minimalist category metadata
const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    subtitle: string;
    itemCount: string;
    tag: string;
    imgUrl: string;
    bgGradient: string;
    borderColor: string;
    hoverGlow: string;
    textColor: string;
    accentColor: string;
    pillBg: string;
  }
> = {
  vegetables: {
    title: "Vegetables",
    subtitle: "Bhopal Farm Harvest",
    itemCount: "90+ Fresh Items",
    tag: "Farm Fresh",
    imgUrl: "/categories/vegetables_4k.jpg",
    bgGradient: "bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40",
    borderColor: "border-emerald-100 group-hover:border-emerald-300",
    hoverGlow: "hover:shadow-[0_14px_30px_rgba(16,185,129,0.14)]",
    textColor: "text-emerald-950",
    accentColor: "#10b981",
    pillBg: "bg-emerald-100/90 text-emerald-800 border-emerald-200/80",
  },
  fruits: {
    title: "Fruits",
    subtitle: "Crisp & Naturally Sweet",
    itemCount: "120+ Seasonal",
    tag: "Sweet & Juicy",
    imgUrl: "/categories/fruits_4k.jpg",
    bgGradient: "bg-gradient-to-b from-amber-50/80 via-white to-orange-50/40",
    borderColor: "border-amber-100 group-hover:border-amber-300",
    hoverGlow: "hover:shadow-[0_14px_30px_rgba(245,158,11,0.14)]",
    textColor: "text-amber-950",
    accentColor: "#f59e0b",
    pillBg: "bg-amber-100/90 text-amber-800 border-amber-200/80",
  },
  exotics: {
    title: "Exotics",
    subtitle: "Hydroponic & Gourmet",
    itemCount: "50+ Greens",
    tag: "Hydroponic",
    imgUrl: "/categories/exotics_4k.jpg",
    bgGradient: "bg-gradient-to-b from-purple-50/80 via-white to-fuchsia-50/40",
    borderColor: "border-purple-100 group-hover:border-purple-300",
    hoverGlow: "hover:shadow-[0_14px_30px_rgba(168,85,247,0.14)]",
    textColor: "text-purple-950",
    accentColor: "#a855f7",
    pillBg: "bg-purple-100/90 text-purple-800 border-purple-200/80",
  },
  "dairy & staples": {
    title: "Dairy & Staples",
    subtitle: "A2 Milk & Pure Ghee",
    itemCount: "Daily Fresh",
    tag: "100% Pure",
    imgUrl: "/categories/dairy_4k.jpg",
    bgGradient: "bg-gradient-to-b from-blue-50/80 via-white to-sky-50/40",
    borderColor: "border-blue-100 group-hover:border-blue-300",
    hoverGlow: "hover:shadow-[0_14px_30px_rgba(56,189,248,0.14)]",
    textColor: "text-blue-950",
    accentColor: "#0284c7",
    pillBg: "bg-blue-100/90 text-blue-800 border-blue-200/80",
  },
};

const PRIORITY = ["vegetables", "fruits", "exotics", "dairy & staples"];

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
    <section className="w-full py-4 sm:py-7 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Minimalist Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Shop by Category</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </h2>
            <p className="hidden sm:block text-xs text-gray-400 font-medium mt-0.5">
              Handpicked, ozone-washed daily harvest sorted by fresh category
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-1 group transition shrink-0 bg-emerald-50/70 hover:bg-emerald-100/70 px-3 py-1.5 rounded-full border border-emerald-200/60"
          >
            <span>View All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 
          Ultra Minimalist & Attractive Category Grid (3 Columns)
        */}
        <div className="grid grid-cols-3 max-w-5xl md:mx-auto gap-2.5 sm:gap-4 md:gap-6">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_MAP[rawKey] || {
              title: item.name,
              subtitle: "Fresh Harvest Produce",
              itemCount: "Fresh Daily",
              tag: "Farm Fresh",
              imgUrl: item.image || "/categories/vegetables_4k.jpg",
              bgGradient: "bg-gradient-to-b from-gray-50 via-white to-gray-50/40",
              borderColor: "border-gray-100 group-hover:border-gray-300",
              hoverGlow: "hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]",
              textColor: "text-gray-900",
              accentColor: "#10b981",
              pillBg: "bg-gray-100 text-gray-800 border-gray-200",
            };

            const imageSrc =
              item.image && (item.image.startsWith("/categories/") || item.image.startsWith("http"))
                ? item.image
                : config.imgUrl;

            return (
              <motion.div
                key={item._id || item.name || idx}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 ${config.bgGradient} border ${config.borderColor} shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${config.hoverGlow} transition-all duration-400 flex flex-col justify-between select-none relative overflow-hidden`}
              >
                {/* Minimalist Top Tag Pill (Desktop) */}
                <div className="hidden sm:flex items-center justify-between mb-2">
                  <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full border ${config.pillBg}`}>
                    {config.tag}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white text-gray-400 group-hover:text-[#0f8646] group-hover:bg-emerald-50 border border-gray-100 flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-0.5">
                    <ArrowUpRight size={13} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* 4K High-Definition Produce Image Card */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xs border border-white/90">
                  <img
                    src={imageSrc}
                    alt={config.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-600 ease-out"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl || "/categories/vegetables_4k.jpg";
                    }}
                  />

                  {/* Soft Vignette Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Typography & Subtitle */}
                <div className="mt-2 sm:mt-3 text-center sm:text-left flex flex-col justify-between relative z-10">
                  <h3 className={`font-black text-xs sm:text-base md:text-lg ${config.textColor} leading-tight tracking-tight`}>
                    {config.title}
                  </h3>

                  {/* Subtitle & Item Count */}
                  <p className="text-[10px] sm:text-xs text-gray-500 font-semibold sm:font-medium truncate mt-0.5">
                    <span className="sm:hidden">{config.itemCount}</span>
                    <span className="hidden sm:inline">{config.subtitle} • {config.itemCount}</span>
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
