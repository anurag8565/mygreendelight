"use client";

import React, { useState, useMemo, useEffect } from "react";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import {
  ChevronRight,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowUpDown,
  Leaf,
  Sparkles,
  Flame,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";

interface TabConfig {
  id: string;
  label: string;
  hindi: string;
  count: number;
  icon: string;
}

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
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
    const comboItems = list.filter((g) =>
      (g.category || "").toLowerCase().includes("combo")
    );

    const tabList: TabConfig[] = [
      {
        id: "vegetables",
        label: "Vegetables",
        hindi: "ताज़ी सब्जियां",
        count: vegItems.length,
        icon: "🥦",
      },
      {
        id: "fruits",
        label: "Fruits",
        hindi: "ताज़े फल",
        count: fruitItems.length,
        icon: "🍎",
      },
      {
        id: "exotics",
        label: "Exotics & Salads",
        hindi: "विदेशी व सलाद",
        count: exoticItems.length,
        icon: "🥑",
      },
      {
        id: "combos",
        label: "Value Combos",
        hindi: "कॉम्बो",
        count: comboItems.length,
        icon: "🛍️",
      },
    ];

    let displayList = vegItems;
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
    triggerHaptic("selection");
    setActiveTab(tabId);
  };

  return (
    <section className="w-full py-4 sm:py-6 bg-[#faf9f5] font-sans border-b border-stone-200/70 select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header: Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Leaf size={18} className="text-[#0a3d24] shrink-0" />
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading truncate">
                Fresh Farm Harvest
              </h2>
              <span className="bg-emerald-100/90 text-[#0a3d24] text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-300/60">
                10-15 Min Express
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
              Triple-checked &bull; Harvested fresh daily &bull; Zero cold storage
            </p>
          </div>

          {/* Controls: Sort Dropdown, Grid/List Switcher, View All */}
          <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto flex-wrap">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold py-1.5 pl-2.5 pr-6 rounded-xl border border-stone-200/90 shadow-2xs outline-none focus:border-[#0a3d24] cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-0.5 rounded-xl border border-stone-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#0a3d24] text-white shadow-xs"
                    : "text-stone-400 hover:text-stone-800"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#0a3d24] text-white shadow-xs"
                    : "text-stone-400 hover:text-stone-800"
                }`}
                title="List View"
                aria-label="List View"
              >
                <List size={14} />
              </button>
            </div>

            {/* View All in Shop */}
            <Link
              href={
                activeTab === "vegetables"
                  ? "/shop?category=Vegetables"
                  : activeTab === "fruits"
                  ? "/shop?category=Fruits"
                  : activeTab === "exotics"
                  ? "/shop?category=Exotics"
                  : "/shop?category=Combos"
              }
              className="text-[#0a3d24] hover:text-[#072a18] font-bold text-xs px-2.5 py-1.5 rounded-xl transition flex items-center gap-0.5 group"
            >
              <span>View All</span>
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* 
          🌟 MODERN SLEEK FLOATING PILL TABS
          Horizontal scrollable on mobile, left-aligned on desktop with smooth glider
        */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? "text-white shadow-sm"
                    : "bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 hover:bg-stone-50"
                }`}
              >
                {/* Active Glider */}
                {isSelected && (
                  <motion.div
                    layoutId="activeProducePillGlider"
                    className="absolute inset-0 bg-[#0a3d24] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}

                {/* Tab Content */}
                <span className="relative z-10 text-sm sm:text-base leading-none">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>

                {/* Item Count Chip */}
                <span
                  className={`relative z-10 text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                    isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid / List */}
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
                  onClick={() => setActiveTab("vegetables")}
                  className="mt-2 text-xs font-bold text-[#0a3d24] hover:underline cursor-pointer"
                >
                  View All Fresh Vegetables
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Mode: Compact Clean Cards */
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
              className="bg-white hover:bg-stone-50 text-[#0a3d24] border border-stone-200 hover:border-[#0a3d24] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-2xs transition inline-flex items-center gap-1.5 cursor-pointer active:scale-95 group"
            >
              <span>
                Show More {activeTabMeta.label} (+{Math.min(8, filteredList.length - visibleCount)})
              </span>
              <ChevronDown
                size={15}
                className="group-hover:translate-y-0.5 transition-transform stroke-[2.5]"
              />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
