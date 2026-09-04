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
    imgUrl: string;
  }
> = {
  vegetables: {
    displayName: "Daily Vegetables",
    subTitle: "Farm Harvested",
    badge: "Fresh Today",
    imgUrl: "/categories/vegetables.jpg",
  },
  fruits: {
    displayName: "Fresh Fruits",
    subTitle: "Sweet & Juicy",
    badge: "Seasonal",
    imgUrl: "/categories/fruits.jpg",
  },
  "dairy & staples": {
    displayName: "Dairy & Staples",
    subTitle: "Milk, Ghee & Atta",
    badge: "100% Pure",
    imgUrl: "/categories/dairy.jpg",
  },
  exotics: {
    displayName: "Exotics & Greens",
    subTitle: "Hydroponic Picks",
    badge: "Premium",
    imgUrl: "/categories/exotic.jpg",
  },
  "ready-to-cook & cut produce": {
    displayName: "Cut & Ready",
    subTitle: "Peeled & Chopped",
    badge: "Zero Prep",
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

  const organizeCategories = (list: any[]) => {
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

  return (
    <div className="w-full py-5 sm:py-8 bg-[#f8f9fa] border-y border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block mt-0.5">
              Farm-fresh morning picks, seasonal fruits & pure dairy staples
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>See All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Real HD Photo Category Swipeable Carousel on Mobile, 5-col Grid on Desktop */}
        <div
          className="flex md:grid md:grid-cols-5 gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto md:overflow-visible pb-2 pt-1 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 overscroll-x-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const config = CATEGORY_CONFIG[rawKey] || {
              displayName: item.name,
              subTitle: "Farm Fresh",
              badge: "Fresh",
              imgUrl: item.image || "/categories/vegetables.jpg",
            };

            const imageSrc = item.image && item.image.startsWith("/categories/") 
              ? item.image 
              : config.imgUrl;

            return (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className="group cursor-pointer rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 bg-white hover:border-emerald-300 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden w-[125px] xs:w-[135px] sm:w-[150px] md:w-auto shrink-0 snap-start"
              >
                {/* Upper Photo Window */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 mb-2">
                  <img
                    src={imageSrc}
                    alt={config.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl;
                    }}
                  />

                  {/* Floating Micro Badge */}
                  <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-xs bg-gray-900/80 backdrop-blur-xs text-white">
                    {config.badge}
                  </span>
                </div>

                {/* Card Title & Subtitle */}
                <div className="px-1 pb-0.5 text-center">
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight group-hover:text-[#0c831f] transition-colors truncate">
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
