"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

// Clean, luxury category metadata with 4K assets and cache buster
// 4 core categories: Vegetables, Fruits, Exotics, and Value Combos
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
  combos: {
    title: "Value Combos",
    subtitle: "Curated Packs",
    imgUrl: "/combo_banner.jpg",
    path: "Combos",
  },
  combo: {
    title: "Value Combos",
    subtitle: "Curated Packs",
    imgUrl: "/combo_banner.jpg",
    path: "Combos",
  },
};

const PRIORITY = ["vegetables", "fruits", "exotics", "combos"];

export default function CategorySlider({
  categories = [],
}: {
  categories?: any[];
}) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState<any[]>([]);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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
    // Filter to core categories
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

    // Ensure Combos is included in categories
    const hasCombo = sorted.some((c) =>
      (c.name || "").toLowerCase().includes("combo")
    );
    const listWithCombos = hasCombo ? sorted : [...sorted, { name: "Combos" }];

    // If DB has no categories or fewer, fallback to the 4 core ones
    if (sorted.length === 0) {
      setActiveCategories([
        { name: "Vegetables" },
        { name: "Fruits" },
        { name: "Exotics" },
        { name: "Combos" },
      ]);
    } else {
      setActiveCategories(listWithCombos.slice(0, 4));
    }
  };

  const displayList =
    activeCategories.length > 0
      ? activeCategories
      : [
          { name: "Vegetables" },
          { name: "Fruits" },
          { name: "Exotics" },
          { name: "Combos" },
        ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const amount = 220;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

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
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        {/* Animated Stories-Style Carousel Container */}
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex items-center justify-start sm:justify-center gap-3.5 xs:gap-5 sm:gap-8 md:gap-10 overflow-x-auto scrollbar-none py-2 px-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 overscroll-x-contain snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
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
              const isCombo = matchedKey.includes("combo");

              return (
                <motion.div
                  key={item._id || item.name || idx}
                  initial={{ opacity: 0, y: 14, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.07,
                    ease: "easeOut",
                  }}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ y: -5 }}
                  onClick={() =>
                    router.push(`/shop?category=${encodeURIComponent(config.path)}`)
                  }
                  className="group cursor-pointer flex flex-col items-center text-center select-none shrink-0 w-[76px] xs:w-[86px] sm:w-28 md:w-32 snap-center"
                >
                  {/* Glowing Circular Stories Avatar */}
                  <div
                    className={`relative p-0.5 sm:p-1 rounded-full transition-all duration-300 ${
                      isCombo
                        ? "bg-gradient-to-tr from-amber-500 via-emerald-500 to-[#0a3d24] shadow-[0_5px_20px_rgba(217,119,6,0.22)] group-hover:shadow-[0_10px_28px_rgba(217,119,6,0.35)]"
                        : "bg-gradient-to-tr from-[#0a3d24] via-emerald-500 to-amber-400 shadow-[0_5px_20px_rgba(10,61,36,0.16)] group-hover:shadow-[0_10px_28px_rgba(10,61,36,0.28)]"
                    }`}
                  >
                    {/* Outer White Border Ring */}
                    <div className="w-[66px] h-[66px] xs:w-[74px] xs:h-[74px] sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white p-0.5 sm:p-1 ring-2 ring-white">
                      <div className="w-full h-full rounded-full overflow-hidden bg-stone-50 relative">
                        <img
                          src={imageSrc}
                          alt={config.title}
                          className="w-full h-full object-cover group-hover:scale-112 group-hover:rotate-1 transition-transform duration-500 ease-out"
                          onError={(e: any) => {
                            e.target.src = "/categories/vegetables_4k.jpg?v=4";
                          }}
                        />
                        {/* Gentle inner overlay on hover */}
                        <div className="absolute inset-0 bg-[#0a3d24]/0 group-hover:bg-[#0a3d24]/10 transition-colors duration-300 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Typography: Category Name */}
                  <div className="mt-2 sm:mt-2.5 flex flex-col items-center">
                    <span className="font-extrabold text-[11px] xs:text-xs sm:text-sm md:text-base text-stone-900 group-hover:text-[#0a3d24] transition-colors duration-200 tracking-tight leading-tight line-clamp-1">
                      {config.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-tight mt-0.5 hidden xs:block">
                      {config.subtitle}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
