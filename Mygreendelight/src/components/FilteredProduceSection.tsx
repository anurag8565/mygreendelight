"use client";

import React, { useState, useMemo, useEffect } from "react";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import {
  ChevronRight,
  LayoutGrid,
  List,
  ChevronDown,
  Leaf,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";

interface TabConfig {
  id: string;
  label: string;
  hindi: string;
  count: number;
  imgUrl: string;
}

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");
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
    const comboItems = list.filter((g) =>
      (g.category || "").toLowerCase().includes("combo")
    );

    const tabList: TabConfig[] = [
      {
        id: "all",
        label: "All Items",
        hindi: "सभी उत्पाद",
        count: list.length,
        imgUrl: "/hero_basket.jpg",
      },
      {
        id: "vegetables",
        label: "Vegetables",
        hindi: "ताज़ी सब्जियां",
        count: vegItems.length,
        imgUrl: "/categories/vegetables_4k.jpg?v=4",
      },
      {
        id: "fruits",
        label: "Fresh Fruits",
        hindi: "ताज़े फल",
        count: fruitItems.length,
        imgUrl: "/categories/fruits_4k.jpg?v=4",
      },
      {
        id: "exotics",
        label: "Exotics & Salads",
        hindi: "विदेशी व सलाद",
        count: exoticItems.length,
        imgUrl: "/categories/exotics_4k.jpg?v=4",
      },
      {
        id: "combos",
        label: "Value Combos",
        hindi: "बचत कॉम्बो",
        count: comboItems.length,
        imgUrl: "/categories/combos_4k.jpg?v=4",
      },
    ];

    let displayList = list;
    if (activeTab === "vegetables") displayList = vegItems.length > 0 ? vegItems : list;
    else if (activeTab === "fruits") displayList = fruitItems;
    else if (activeTab === "exotics") displayList = exoticItems;
    else if (activeTab === "combos") displayList = comboItems.length > 0 ? comboItems : list;

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

  const handleTabChange = (tabId: string) => {
    triggerHaptic("medium");
    setActiveTab(tabId);
  };

  return (
    <section className="w-full py-3.5 sm:py-5 bg-[#faf9f5] font-sans border-b border-stone-200/70 select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Clean Balanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Leaf size={17} className="text-[#0a3d24] shrink-0" />
              <h2 className="text-[16px] sm:text-lg md:text-xl font-black text-stone-900 tracking-tight font-heading">
                Fresh Farm Harvest
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-400 font-medium mt-0.5">
              Daily mandi harvest &bull; Delivered in 10-15 mins
            </p>
          </div>

          {/* Clean Unified Controls Row */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Sort Pill */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-full border border-stone-200/90 shadow-2xs outline-none focus:border-[#0a3d24] cursor-pointer transition-colors"
              >
                <option value="default">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>

              {/* Grid / List Switcher */}
              <div className="flex items-center bg-white p-0.5 rounded-full border border-stone-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    setViewMode("grid");
                  }}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#0a3d24] text-white shadow-xs"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    setViewMode("list");
                  }}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#0a3d24] text-white shadow-xs"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                  title="List View"
                  aria-label="List View"
                >
                  <List size={13} />
                </button>
              </div>

              {/* See All in Shop */}
              <Link
                href={
                  activeTab === "vegetables"
                    ? "/shop?category=Vegetables"
                    : activeTab === "fruits"
                    ? "/shop?category=Fruits"
                    : activeTab === "exotics"
                    ? "/shop?category=Exotics"
                    : activeTab === "combos"
                    ? "/shop?category=Combos"
                    : "/shop"
                }
                className="text-[#0a3d24] hover:text-[#072a18] font-bold text-xs px-2.5 py-1.5 rounded-full bg-emerald-50/70 hover:bg-emerald-100/70 transition flex items-center gap-0.5 group border border-emerald-200/60"
              >
                <span>See All</span>
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
              </Link>
            </div>
        </div>

        {/* 
          🌟 REAL PRODUCE PHOTO CHIPS (Clean & Fluid Zepto/Blinkit Style)
          - Real 4K circular photo thumbnails
          - Smooth physical spring glider
          - Haptic feedback
        */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1.5 mb-4 sm:mb-5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                type="button"
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange(tab.id)}
                className={`group relative h-[40px] sm:h-[42px] pl-1.5 pr-3 sm:pr-3.5 rounded-full font-bold text-xs sm:text-[13px] transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 select-none ${
                  isSelected
                    ? "text-white shadow-[0_3px_12px_rgba(10,61,36,0.2)]"
                    : "bg-white text-stone-700 hover:text-stone-900 border border-stone-200/80 hover:bg-stone-50/90 shadow-2xs"
                }`}
              >
                {/* Fluid Spring Glider */}
                {isSelected && (
                  <motion.div
                    layoutId="realPhotoPillGlider"
                    className="absolute inset-0 bg-[#0a3d24] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}

                {/* Real Produce 4K Photo Avatar */}
                <div className="relative z-10 w-7 h-7 rounded-full overflow-hidden shrink-0 bg-stone-100 p-0.5 border border-stone-200/60 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={tab.imgUrl}
                    alt={tab.label}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>

                {/* Category Label */}
                <span className="relative z-10 tracking-tight font-extrabold text-[12px] sm:text-[13px]">
                  {tab.label}
                </span>

                {/* Item Count Chip */}
                <span
                  className={`relative z-10 text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                    isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {tab.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Products Display with Stagger Animation */}
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
                  staggerChildren: 0.03,
                  delayChildren: 0.01,
                },
              },
              exit: { opacity: 0, transition: { duration: 0.12 } },
            }}
          >
            {filteredList.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-stone-200">
                <p className="text-xs sm:text-sm font-bold text-stone-500">
                  No items found in this section right now.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className="mt-2 text-xs font-bold text-[#0a3d24] hover:underline cursor-pointer"
                >
                  View All Produce
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Mode: 2 Cols Mobile / 3 sm / 4 md & lg */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {currentVisibleItems.map((item: any) => (
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.98 },
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
              /* List Mode */
              <div className="flex flex-col gap-3">
                {currentVisibleItems.map((item: any) => (
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
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

        {/* Show More Items Button */}
        {filteredList.length > visibleCount && (
          <div className="flex items-center justify-center mt-6 sm:mt-7">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="bg-white hover:bg-[#0a3d24] text-stone-700 hover:text-white border border-stone-200/90 hover:border-[#0a3d24] px-5 py-2.5 rounded-full font-bold text-xs sm:text-[13px] shadow-2xs hover:shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 group"
            >
              <span>
                Show More {activeTabMeta.label} (+{Math.min(8, filteredList.length - visibleCount)})
              </span>
              <ChevronDown
                size={14}
                className="group-hover:translate-y-0.5 transition-transform stroke-[2.5]"
              />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
