"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

// Clean, luxury category metadata with 4K assets and cache buster
// Strictly the 3 core categories: Vegetables, Fruits, Exotics
const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    subtitle: string;
    imgUrl: string;
    path: string;
  }
> = {
  vegetables: {
    title: "Vegetables",
    subtitle: "Farm Fresh",
    imgUrl: "/categories/vegetables_4k.jpg?v=4",
    path: "Vegetables",
  },
  vegetable: {
    title: "Vegetables",
    subtitle: "Farm Fresh",
    imgUrl: "/categories/vegetables_4k.jpg?v=4",
    path: "Vegetables",
  },
  fruits: {
    title: "Fruits",
    subtitle: "Fresh & Juicy",
    imgUrl: "/categories/fruits_4k.jpg?v=4",
    path: "Fruits",
  },
  fruit: {
    title: "Fruits",
    subtitle: "Fresh & Juicy",
    imgUrl: "/categories/fruits_4k.jpg?v=4",
    path: "Fruits",
  },
  exotics: {
    title: "Exotics & Salads",
    subtitle: "Hydroponics",
    imgUrl: "/categories/exotics_4k.jpg?v=4",
    path: "Exotics",
  },
  exotic: {
    title: "Exotics & Salads",
    subtitle: "Hydroponics",
    imgUrl: "/categories/exotics_4k.jpg?v=4",
    path: "Exotics",
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
            filterAndSet(data.categories);
          }
        })
        .catch(console.error);
    } else {
      filterAndSet(list);
    }
  }, [categories]);

  const filterAndSet = (list: any[]) => {
    // Filter strictly to the 3 core categories (Vegetables, Fruits, Exotics)
    const valid = list.filter((item) => {
      const name = (item.name || "").toLowerCase().trim();
      return PRIORITY.some((p) => name.includes(p));
    });

    const sorted = [...(valid.length > 0 ? valid : list)].sort((a, b) => {
      const nameA = (a.name || "").toLowerCase().trim();
      const nameB = (b.name || "").toLowerCase().trim();

      const idxA = PRIORITY.findIndex((p) => nameA.includes(p));
      const idxB = PRIORITY.findIndex((p) => nameB.includes(p));

      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    // If DB has no categories or fewer than 3, fallback to the 3 core ones
    if (sorted.length === 0) {
      setActiveCategories([
        { name: "Vegetables" },
        { name: "Fruits" },
        { name: "Exotics" },
      ]);
    } else {
      setActiveCategories(sorted.slice(0, 3));
    }
  };

  const displayList =
    activeCategories.length > 0
      ? activeCategories
      : [
          { name: "Vegetables" },
          { name: "Fruits" },
          { name: "Exotics" },
        ];

  return (
    <section className="w-full py-4 sm:py-6 bg-white font-sans border-b border-stone-200/70 select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-[#0a3d24] shrink-0" />
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-stone-900 tracking-tight font-heading">
              Explore Fresh Categories
            </h2>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 hidden xs:inline">
              Daily Mandi Harvest
            </span>
          </div>

          <Link
            href="/shop"
            className="text-[#0a3d24] hover:text-[#072a18] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>View All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Circular Stories-Style Avatar Grid (Responsive & Fluid) */}
        <div className="grid grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 max-w-2xl mx-auto">
          {displayList.map((item, idx) => {
            const rawKey = (item.name || "").toLowerCase().trim();
            const matchedKey =
              Object.keys(CATEGORY_MAP).find((k) => rawKey.includes(k)) || "";
            const config = CATEGORY_MAP[matchedKey] || {
              title: item.name || "Produce",
              subtitle: "Fresh Harvest",
              imgUrl: item.image || "/categories/vegetables_4k.jpg?v=4",
              path: item.name || "Vegetables",
            };

            const imageSrc = config.imgUrl || item.image || "/categories/vegetables_4k.jpg?v=4";

            return (
              <motion.div
                key={item._id || item.name || idx}
                whileTap={{ scale: 0.92 }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(config.path)}`)
                }
                className="group cursor-pointer flex flex-col items-center text-center select-none"
              >
                {/* Glowing Circular Avatar with Double Ring & Ambient Shadow */}
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#0a3d24] via-emerald-500 to-amber-400 shadow-[0_6px_22px_rgba(10,61,36,0.18)] group-hover:shadow-[0_12px_32px_rgba(10,61,36,0.3)] transition-all duration-300">
                  {/* Outer White Border Ring */}
                  <div className="w-21 h-21 xs:w-25 xs:h-25 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white p-1 ring-2 ring-white">
                    <div className="w-full h-full rounded-full overflow-hidden bg-stone-50 relative">
                      <img
                        src={imageSrc}
                        alt={config.title}
                        className="w-full h-full object-cover group-hover:scale-115 group-hover:rotate-2 transition-transform duration-500 ease-out"
                        onError={(e: any) => {
                          e.target.src = "/categories/vegetables_4k.jpg?v=4";
                        }}
                      />
                      {/* Gentle inner overlay on hover */}
                      <div className="absolute inset-0 bg-[#0a3d24]/0 group-hover:bg-[#0a3d24]/10 transition-colors duration-300 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Typography with Subtitle Pill */}
                <div className="mt-2.5 sm:mt-3 flex flex-col items-center">
                  <span className="font-black text-xs sm:text-sm md:text-base text-stone-900 group-hover:text-[#0a3d24] transition-colors duration-200 tracking-tight leading-tight">
                    {config.title}
                  </span>
                  <span className="text-[9.5px] sm:text-[11px] text-[#0a3d24] bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-bold mt-1 shadow-2xs group-hover:bg-emerald-100 transition-colors whitespace-nowrap">
                    {config.subtitle}
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
