"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Luxury, high-converting category metadata
const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    subtitle: string;
    itemCount: string;
    badge: string;
    btnLabel: string;
    imgUrl: string;
    haloColor: string;
    cardBg: string;
    borderHover: string;
    hoverShadow: string;
    badgeClass: string;
    btnHoverBg: string;
  }
> = {
  vegetables: {
    title: "Fresh Vegetables",
    subtitle: "Ozone-Washed & Chemical Free",
    itemCount: "92+ Items",
    badge: "🌱 5:00 AM Harvest",
    btnLabel: "Shop Vegetables",
    imgUrl: "/categories/vegetables_4k.jpg",
    haloColor: "bg-emerald-400/25",
    cardBg: "from-emerald-50/60 via-white to-emerald-50/20",
    borderHover: "group-hover:border-emerald-400",
    hoverShadow: "hover:shadow-[0_18px_38px_rgba(16,185,129,0.16)]",
    badgeClass: "bg-emerald-100/90 text-emerald-800 border-emerald-200/90",
    btnHoverBg: "group-hover:bg-[#0f8646] group-hover:text-white group-hover:border-[#0f8646]",
  },
  fruits: {
    title: "Seasonal Fruits",
    subtitle: "Crisp, Juicy & Naturally Sweet",
    itemCount: "129+ Items",
    badge: "🍎 Wax & Carbide Free",
    btnLabel: "Shop Fruits",
    imgUrl: "/categories/fruits_4k.jpg",
    haloColor: "bg-amber-400/25",
    cardBg: "from-amber-50/60 via-white to-orange-50/20",
    borderHover: "group-hover:border-amber-400",
    hoverShadow: "hover:shadow-[0_18px_38px_rgba(245,158,11,0.16)]",
    badgeClass: "bg-amber-100/90 text-amber-800 border-amber-200/90",
    btnHoverBg: "group-hover:bg-[#d97706] group-hover:text-white group-hover:border-[#d97706]",
  },
  exotics: {
    title: "Exotics & Greens",
    subtitle: "Hydroponic European Salads",
    itemCount: "55+ Items",
    badge: "🥑 Pesticide-Free",
    btnLabel: "Shop Exotics",
    imgUrl: "/categories/exotics_4k.jpg",
    haloColor: "bg-purple-400/25",
    cardBg: "from-purple-50/60 via-white to-fuchsia-50/20",
    borderHover: "group-hover:border-purple-400",
    hoverShadow: "hover:shadow-[0_18px_38px_rgba(168,85,247,0.16)]",
    badgeClass: "bg-purple-100/90 text-purple-800 border-purple-200/90",
    btnHoverBg: "group-hover:bg-[#9333ea] group-hover:text-white group-hover:border-[#9333ea]",
  },
};

const PRIORITY = ["vegetables", "fruits", "exotics"];

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
        
        {/* Minimalist Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Shop by Category</span>
              <span className="w-2 h-2 rounded-full bg-[#0f8646] animate-pulse" />
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
              Handpicked 100% farm-fresh produce sourced daily for Bhopal households
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-1 group transition shrink-0 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs"
          >
            <span>See All 300+</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 
          Ultra Eye-Catching Minimalist Luxury Cards (3 Equal Grid Columns)
        */}
        <div className="grid grid-cols-3 max-w-5xl md:mx-auto gap-2.5 sm:gap-5 md:gap-7">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_MAP[rawKey] || {
              title: item.name,
              subtitle: "Fresh Daily Harvest",
              itemCount: "90+ Items",
              badge: "🌿 Daily Harvest",
              btnLabel: "Explore",
              imgUrl: item.image || "/categories/vegetables_4k.jpg",
              haloColor: "bg-emerald-400/20",
              cardBg: "from-emerald-50/60 via-white to-emerald-50/20",
              borderHover: "group-hover:border-emerald-400",
              hoverShadow: "hover:shadow-[0_18px_38px_rgba(16,185,129,0.16)]",
              badgeClass: "bg-emerald-100/90 text-emerald-800 border-emerald-200",
              btnHoverBg: "group-hover:bg-[#0f8646] group-hover:text-white",
            };

            const imageSrc =
              item.image && (item.image.startsWith("/categories/") || item.image.startsWith("http"))
                ? item.image
                : config.imgUrl;

            return (
              <motion.div
                key={item._id || item.name || idx}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 bg-gradient-to-b ${config.cardBg} border border-gray-200/80 ${config.borderHover} shadow-[0_4px_16px_rgba(0,0,0,0.03)] ${config.hoverShadow} transition-all duration-500 flex flex-col justify-between select-none relative overflow-hidden`}
              >
                {/* Background Ambient Color Halo Glow */}
                <div
                  className={`absolute -top-10 -right-10 w-36 h-36 ${config.haloColor} rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150`}
                />

                {/* Top Badge & Count Row */}
                <div className="flex items-center justify-between gap-1 mb-2.5 sm:mb-4 relative z-10">
                  <span
                    className={`text-[9px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border shadow-2xs ${config.badgeClass} truncate`}
                  >
                    {config.badge}
                  </span>

                  <span className="hidden sm:inline-block text-[11px] font-black text-gray-500 font-mono bg-white/90 border border-gray-200 px-2 py-0.5 rounded-full shadow-2xs">
                    {config.itemCount}
                  </span>
                </div>

                {/* 4K Produce Floating Image Container */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white/90 shadow-sm border border-white/95 my-1 sm:my-2">
                  <img
                    src={imageSrc}
                    alt={config.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl || "/categories/vegetables_4k.jpg";
                    }}
                  />

                  {/* Glassmorphic Reflection Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Bottom Title & Action Button */}
                <div className="mt-2.5 sm:mt-4 text-center sm:text-left relative z-10 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-xs sm:text-lg md:text-xl text-gray-900 leading-tight tracking-tight group-hover:text-emerald-900 transition-colors">
                      {config.title}
                    </h3>

                    <p className="hidden sm:block text-xs text-gray-500 font-medium mt-1 truncate">
                      {config.subtitle}
                    </p>
                  </div>

                  {/* Sleek Minimalist CTA Pill (Desktop) */}
                  <div className="hidden sm:flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                    <span className="text-xs font-black text-gray-800 group-hover:text-[#0f8646] transition-colors">
                      {config.btnLabel}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white text-gray-400 group-hover:text-[#0f8646] group-hover:bg-emerald-50 border border-gray-200 flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1">
                      <ArrowRight size={13} className="stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Mobile Minimal Count Label */}
                  <span className="sm:hidden text-[10px] text-gray-500 font-bold block mt-0.5">
                    {config.itemCount}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
