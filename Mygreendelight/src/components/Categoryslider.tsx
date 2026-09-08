"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// Clean, luxury category metadata with 4K assets
const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    subtitle: string;
    imgUrl: string;
  }
> = {
  vegetables: {
    title: "Fresh Vegetables",
    subtitle: "Daily Farm Harvest",
    imgUrl: "/categories/vegetables_4k.jpg",
  },
  vegetable: {
    title: "Fresh Vegetables",
    subtitle: "Daily Farm Harvest",
    imgUrl: "/categories/vegetables_4k.jpg",
  },
  fruits: {
    title: "Fresh Fruits",
    subtitle: "Sweet & Juicy",
    imgUrl: "/categories/fruits_4k.jpg",
  },
  fruit: {
    title: "Fresh Fruits",
    subtitle: "Sweet & Juicy",
    imgUrl: "/categories/fruits_4k.jpg",
  },
  exotics: {
    title: "Hydroponic Exotics",
    subtitle: "Gourmet Salads & Greens",
    imgUrl: "/categories/exotics_4k.jpg",
  },
  exotic: {
    title: "Hydroponic Exotics",
    subtitle: "Gourmet Salads & Greens",
    imgUrl: "/categories/exotics_4k.jpg",
  },
  dairy: {
    title: "Dairy & Essentials",
    subtitle: "100% Pure & Fresh",
    imgUrl: "/categories/dairy_4k.jpg",
  },
  "ready to cook": {
    title: "Ready to Cook",
    subtitle: "Pre-Cleaned & Cut",
    imgUrl: "/categories/ready_to_cook.jpg",
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
    <section className="w-full py-4 sm:py-7 bg-white font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0c831f]" />
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>See all</span>
            <ChevronRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Minimalist Premium Square Photo Cards Grid */}
        <div className="grid grid-cols-3 max-w-5xl md:mx-auto gap-2.5 sm:gap-4 md:gap-6">
          {activeCategories.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const matchedKey =
              Object.keys(CATEGORY_MAP).find((k) => rawKey.includes(k)) || "";
            const config = CATEGORY_MAP[matchedKey] || {
              title: item.name,
              subtitle: "Fresh Harvest",
              imgUrl: item.image || "/categories/vegetables_4k.jpg",
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
                className="group cursor-pointer bg-white hover:bg-[#fafdfa] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-gray-200/80 hover:border-emerald-400/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(12,131,31,0.09)] transition-all duration-300 select-none flex flex-col justify-between"
              >
                {/* Clean Photo Container (No Badges, Pure Studio 4K Photography) */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50/80 ring-1 ring-black/[0.04]">
                  <img
                    src={imageSrc}
                    alt={config.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    onError={(e: any) => {
                      e.target.src = config.imgUrl || "/categories/vegetables_4k.jpg";
                    }}
                  />
                </div>

                {/* Typography & Details */}
                <div className="mt-2.5 sm:mt-3.5 text-center flex flex-col items-center">
                  <h3 className="font-extrabold text-xs sm:text-base md:text-lg text-gray-900 group-hover:text-[#0c831f] transition-colors duration-200 leading-tight tracking-tight truncate w-full">
                    {config.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate mt-0.5 sm:mt-1 w-full">
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
