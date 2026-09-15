"use client";

import React, { useState, useMemo, useEffect } from "react";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import {
  ChevronRight,
  LayoutGrid,
  List,
  ChevronDown,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TabConfig {
  id: string;
  label: string;
  hindi: string;
  imgUrl: string;
  count: number;
  badge: string;
  themeColor: string;
  activeBorder: string;
}

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
  // Default to vegetables tab
  const [activeTab, setActiveTab] = useState<string>("vegetables");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "rating">("default");

  useEffect(() => {
    setVisibleCount(8);
  }, [activeTab]);

  const { filteredList, tabs } = useMemo(() => {
    const list = Array.isArray(groceries) ? groceries : [];

    const vegItems = list.filter((g) =>
      (g.category || "").toLowerCase().includes("veg")
    );
    const fruitItems = list.filter((g) =>
      (g.category || "").toLowerCase().includes("fruit")
    );
    const exoticItems = list.filter(
      (g) =>
        (g.category || "").toLowerCase().includes("exotic") ||
        (g.category || "").toLowerCase().includes("hydroponic") ||
        (g.category || "").toLowerCase().includes("salad")
    );

    const tabList: TabConfig[] = [
      {
        id: "vegetables",
        label: "Vegetables",
        hindi: "ताज़ी सब्जियां",
        imgUrl: "/categories/vegetables_4k.jpg?v=4",
        count: vegItems.length,
        badge: "Daily Fresh",
        themeColor: "from-emerald-600 to-emerald-800",
        activeBorder: "border-[#0a3d24]",
      },
      {
        id: "fruits",
        label: "Fruits",
        hindi: "ताज़े मीठे फल",
        imgUrl: "/categories/fruits_4k.jpg?v=4",
        count: fruitItems.length,
        badge: "Sweet & Seasonal",
        themeColor: "from-amber-600 to-orange-600",
        activeBorder: "border-amber-600",
      },
      {
        id: "exotics",
        label: "Exotics & Salads",
        hindi: "विदेशी व सलाद",
        imgUrl: "/categories/exotics_4k.jpg?v=4",
        count: exoticItems.length,
        badge: "Hydroponic & Salads",
        themeColor: "from-emerald-700 to-[#0a3d24]",
        activeBorder: "border-[#0a3d24]",
      },
    ];

    let displayList = vegItems;
    if (activeTab === "vegetables") displayList = vegItems.length > 0 ? vegItems : list;
    else if (activeTab === "fruits") displayList = fruitItems;
    else if (activeTab === "exotics") displayList = exoticItems;

    // Apply sorting
    let sortedList = [...displayList];
    if (sortBy === "price_asc") {
      sortedList.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price_desc") {
      sortedList.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "rating") {
      sortedList.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    return { filteredList: sortedList, tabs: tabList };
  }, [groceries, activeTab, sortBy]);

  if (!groceries || groceries.length === 0) return null;

  const currentVisibleItems = filteredList.slice(0, visibleCount);
  const activeTabMeta = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="w-full py-4 sm:py-6 bg-[#f7f6f2] font-sans border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Leaf size={18} className="text-[#0a3d24] shrink-0" />
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading truncate">
                Fresh Farm Vegetables &amp; Fruits
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 ml-6.5 hidden sm:block">
              Handpicked daily from nearby farms &bull; Cleaned, sorted &amp; delivered in 10-15 mins
            </p>
          </div>

          {/* Controls: Grid/List Toggle & View All */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-stone-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  viewMode === "grid"
                    ? "bg-[#0a3d24] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  viewMode === "list"
                    ? "bg-[#0a3d24] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
                title="List View"
                aria-label="List View"
              >
                <List size={14} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Quick Link to Shop */}
            <Link
              href={
                activeTab === "vegetables"
                  ? "/shop?category=Vegetables"
                  : activeTab === "fruits"
                  ? "/shop?category=Fruits"
                  : "/shop?category=Exotics"
              }
              className="bg-white hover:bg-stone-50 text-[#0a3d24] border border-stone-200/90 hover:border-[#0a3d24]/40 font-bold text-xs px-3 sm:px-3.5 py-2 rounded-xl flex items-center gap-1 transition shadow-2xs shrink-0 group whitespace-nowrap"
            >
              <span>View All</span>
              <ChevronRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
              />
            </Link>
          </div>
        </div>

        {/* 
          3 DEDICATED PRODUCE CATEGORY TABS (Vegetables, Fruits, Exotics)
          Symmetrical 3-column cards with balanced photo, label, hindi text, and count badge
        */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6 sm:mb-8 select-none relative">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 cursor-pointer text-center sm:text-left overflow-hidden ${
                  isSelected
                    ? "text-[#0a3d24]"
                    : "text-stone-700 hover:text-stone-900"
                }`}
              >
                {/* Fluid Active Background Card Glider */}
                {isSelected ? (
                  <motion.div
                    layoutId="activeProduceTabGlider"
                    className="absolute inset-0 bg-white border border-[#0a3d24]/60 shadow-[0_8px_24px_rgba(10,61,36,0.12)] ring-2 ring-[#0a3d24]/15 rounded-2xl sm:rounded-3xl z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/70 hover:bg-white border border-stone-200/80 hover:border-stone-300 rounded-2xl sm:rounded-3xl shadow-2xs z-0 transition-colors" />
                )}

                {/* Produce Photo Thumbnail */}
                <div className="relative z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-stone-50 border border-stone-100 shadow-2xs">
                  <img
                    src={tab.imgUrl}
                    alt={tab.label}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#0a3d24]/10" />
                  )}
                </div>

                {/* Text Details */}
                <div className="relative z-10 flex flex-col items-center sm:items-start min-w-0 flex-1 w-full">
                  <span
                    className={`text-xs sm:text-sm md:text-base font-extrabold tracking-tight leading-tight truncate w-full ${
                      isSelected ? "text-[#0a3d24]" : "text-stone-900 group-hover:text-stone-950"
                    }`}
                  >
                    {tab.label}
                  </span>

                  <span
                    className={`text-[10px] sm:text-xs font-semibold leading-tight mt-0.5 truncate w-full ${
                      isSelected ? "text-[#0a3d24]/80 font-bold" : "text-stone-500"
                    }`}
                  >
                    {tab.hindi}
                  </span>

                  {/* Product Count Pill */}
                  <span
                    className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 sm:mt-1.5 inline-block transition-colors shrink-0 ${
                      isSelected
                        ? "bg-[#0a3d24] text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 group-hover:bg-stone-200/70"
                    }`}
                  >
                    {tab.count} Items
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Products Display: Grid OR List View with Smooth Staggered Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${viewMode}-${sortBy}`}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.035,
                  delayChildren: 0.02,
                },
              },
              exit: { opacity: 0, transition: { duration: 0.12 } },
            }}
          >
            {filteredList.length === 0 ? (
              <div className="py-14 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm font-bold text-gray-500">
                  No items found in this section right now.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("vegetables")}
                  className="mt-2 text-xs font-bold text-[#0a3d24] hover:underline cursor-pointer"
                >
                  View All Fresh Vegetables
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Mode: Relaxed breathing whitespace - 2 Cols Mobile / 3 sm / 4 md & lg */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
                {currentVisibleItems.map((item: any) => (
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, y: 12, scale: 0.98 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: "spring", stiffness: 350, damping: 25 },
                      },
                    }}
                  >
                    <Groceryitemcard item={item} />
                  </motion.div>
                ))}
              </div>
            ) : (
              /* List Mode: Full-width row cards (Shop style) */
              <div className="flex flex-col gap-3 sm:gap-4">
                {currentVisibleItems.map((item: any) => (
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 350, damping: 25 },
                      },
                    }}
                  >
                    <Groceryitemcard item={item} isList={true} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Load More / Explore Full Shop Button */}
        {filteredList.length > visibleCount && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="w-full sm:w-auto bg-white hover:bg-[#0a3d24] hover:text-white active:scale-95 text-[#0a3d24] border-1.5 border-[#0a3d24]/40 hover:border-[#0a3d24] px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-2xs transition inline-flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>
                Show More {activeTabMeta.label} (+{Math.min(8, filteredList.length - visibleCount)} more)
              </span>
              <ChevronDown
                size={16}
                className="group-hover:translate-y-0.5 transition-transform stroke-[2.5]"
              />
            </button>

            <Link
              href={
                activeTab === "vegetables"
                  ? "/shop?category=Vegetables"
                  : activeTab === "fruits"
                  ? "/shop?category=Fruits"
                  : "/shop?category=Exotics"
              }
              className="w-full sm:w-auto text-stone-600 hover:text-[#0a3d24] font-bold text-xs sm:text-sm px-4 py-2 text-center transition flex items-center justify-center gap-1"
            >
              <span>Explore All {filteredList.length} {activeTabMeta.label} in Shop</span>
              <ChevronRight size={14} className="stroke-[2.5]" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


