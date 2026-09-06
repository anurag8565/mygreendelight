"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Clean, high-converting category metadata
const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    subtitle: string;
    tag: string;
    imgUrl: string;
    bgGradient: string;
    borderColor: string;
    textColor: string;
    badgeBg: string;
  }
> = {
  vegetables: {
    title: "Vegetables",
    subtitle: "Farm Fresh Daily Harvest",
    tag: "Daily Fresh",
    imgUrl: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80",
    bgGradient: "bg-gradient-to-b from-emerald-50/90 to-green-50/40",
    borderColor: "border-emerald-200/80",
    textColor: "text-emerald-950",
    badgeBg: "bg-emerald-600 text-white",
  },
  fruits: {
    title: "Fruits",
    subtitle: "Juicy & Naturally Sweet",
    tag: "Sweet & Juicy",
    imgUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
    bgGradient: "bg-gradient-to-b from-amber-50/90 to-orange-50/40",
    borderColor: "border-amber-200/80",
    textColor: "text-amber-950",
    badgeBg: "bg-amber-600 text-white",
  },
  exotics: {
    title: "Exotics",
    subtitle: "Hydroponic & Gourmet Greens",
    tag: "Gourmet Fresh",
    imgUrl: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80",
    bgGradient: "bg-gradient-to-b from-purple-50/90 to-fuchsia-50/40",
    borderColor: "border-purple-200/80",
    textColor: "text-purple-950",
    badgeBg: "bg-purple-600 text-white",
  },
  "dairy & staples": {
    title: "Dairy & Staples",
    subtitle: "Pure Milk & Daily Essentials",
    tag: "100% Pure",
    imgUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    bgGradient: "bg-gradient-to-b from-blue-50/90 to-sky-50/40",
    borderColor: "border-blue-200/80",
    textColor: "text-blue-950",
    badgeBg: "bg-blue-600 text-white",
  },
  "ready-to-cook & cut produce": {
    title: "Cut Produce",
    subtitle: "Zero Prep & Washed",
    tag: "Zero Prep",
    imgUrl: "/categories/ready_to_cook.jpg",
    bgGradient: "bg-gradient-to-b from-teal-50/90 to-emerald-50/40",
    borderColor: "border-teal-200/80",
    textColor: "text-teal-950",
    badgeBg: "bg-teal-600 text-white",
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

  const count = activeCategories.length;

  return (
    <section className="w-full py-4 sm:py-7 bg-white font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>Shop by Category</span>
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition shrink-0"
          >
            <span>See All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 
          MOBILE UI: Clean 3-Column Touch Cards (Zepto/Blinkit Style)
          DESKTOP UI: Wide interactive 3-column banner cards
        */}
        <div className="grid grid-cols-3 md:grid-cols-3 max-w-5xl md:mx-auto gap-2.5 sm:gap-4 md:gap-6">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_MAP[rawKey] || {
              title: item.name,
              subtitle: "Fresh Harvested Produce",
              tag: "Farm Fresh",
              imgUrl: item.image || "/categories/vegetables.jpg",
              bgGradient: "bg-gradient-to-b from-gray-50 to-slate-50",
              borderColor: "border-gray-200",
              textColor: "text-gray-900",
              badgeBg: "bg-gray-800 text-white",
            };

            const imageSrc =
              item.image && (item.image.startsWith("/categories/") || item.image.startsWith("http"))
                ? item.image
                : config.imgUrl;

            return (
              <motion.div
                key={item._id || item.name || idx}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -4 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-2 sm:p-4 md:p-5 ${config.bgGradient} border ${config.borderColor} shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between select-none relative overflow-hidden`}
              >
                {/* Image Section */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <img
                    src={imageSrc}
                    alt={config.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl || "/categories/vegetables.jpg";
                    }}
                  />
                  {/* Subtle Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Text Content */}
                <div className="mt-2 sm:mt-3 text-center sm:text-left flex flex-col justify-between">
                  <div className="flex items-center justify-center sm:justify-between gap-1">
                    <h3 className={`font-black text-xs sm:text-base md:text-lg ${config.textColor} leading-tight tracking-tight`}>
                      {config.title}
                    </h3>
                    <div className="hidden sm:flex w-6 h-6 rounded-full bg-white/90 text-[#0c831f] items-center justify-center group-hover:bg-[#0c831f] group-hover:text-white transition-all shadow-2xs shrink-0">
                      <ChevronRight size={13} className="stroke-[3]" />
                    </div>
                  </div>

                  {/* Mobile Tag / Desktop Subtitle */}
                  <p className="text-[10px] text-gray-500 font-medium sm:hidden mt-0.5 truncate">
                    {config.tag}
                  </p>
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

