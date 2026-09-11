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
        themeColor: "from-emerald-600 to-green-700",
        activeBorder: "border-[#0c831f]",
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
        themeColor: "from-purple-600 to-indigo-700",
        activeBorder: "border-purple-600",
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
    <section className="w-full py-6 sm:py-8 bg-[#f8f9fa] font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Leaf size={20} className="text-[#0c831f] shrink-0" />
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Fresh Farm Vegetables & Fruits
              </h2>
              <span className="bg-emerald-50 text-[#0c831f] border border-emerald-200/90 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 size={11} className="text-[#0c831f]" />
                <span>{filteredList.length} Items</span>
              </span>
            </div>
          </div>

          {/* Controls: Grid/List Toggle & View All */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-black ${
                  viewMode === "grid"
                    ? "bg-[#0c831f] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={14} />
                <span className="hidden xs:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-black ${
                  viewMode === "list"
                    ? "bg-[#0c831f] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
                title="List View"
                aria-label="List View"
              >
                <List size={14} />
                <span className="hidden xs:inline">List</span>
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
              className="bg-white hover:bg-emerald-50 text-[#0c831f] border border-emerald-200/80 hover:border-emerald-300 font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow-2xs shrink-0 group"
            >
              <span>View All</span>
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
              />
            </Link>
          </div>
        </div>

        {/* 
          🌟 3 DEDICATED PRODUCE CATEGORY TABS (Vegetables, Fruits, Exotics)
          Symmetrical 3-column cards with balanced photo, label, hindi text, and count badge
        */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mb-5 sm:mb-6 select-none">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 cursor-pointer border text-center sm:text-left overflow-hidden ${
                  isSelected
                    ? "bg-white border-[#0c831f] shadow-[0_6px_20px_rgba(12,131,31,0.12)] ring-2 ring-[#0c831f]/20"
                    : "bg-white hover:bg-[#fafdfa] border-gray-200/80 hover:border-emerald-300 shadow-2xs"
                }`}
              >
                {/* Active Indicator Top Accent */}
                {isSelected && (
                  <motion.div
                    layoutId="activeTabAccent"
                    className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0c831f] via-emerald-400 to-green-500"
                  />
                )}

                {/* Produce Photo Thumbnail */}
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100 shadow-2xs">
                  <img
                    src={tab.imgUrl}
                    alt={tab.label}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#0c831f]/10" />
                  )}
                </div>

                {/* Text Details */}
                <div className="flex flex-col items-center sm:items-start min-w-0 flex-1 w-full">
                  <span
                    className={`text-xs sm:text-sm md:text-base font-black tracking-tight leading-tight truncate w-full ${
                      isSelected ? "text-[#0c831f]" : "text-gray-900 group-hover:text-gray-950"
                    }`}
                  >
                    {tab.label}
                  </span>

                  <span
                    className={`text-[10px] sm:text-xs font-semibold leading-tight mt-0.5 truncate w-full ${
                      isSelected ? "text-emerald-700 font-bold" : "text-gray-500"
                    }`}
                  >
                    {tab.hindi}
                  </span>

                  {/* Product Count Pill */}
                  <span
                    className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black mt-1 sm:mt-1.5 inline-block transition-colors shrink-0 ${
                      isSelected
                        ? "bg-emerald-100 text-[#0c831f]"
                        : "bg-gray-100 text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                    }`}
                  >
                    {tab.count} Fresh Items
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Products Display: Grid OR List View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${viewMode}-${sortBy}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {filteredList.length === 0 ? (
              <div className="py-14 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm font-bold text-gray-500">
                  No items found in this section right now.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("vegetables")}
                  className="mt-2 text-xs font-black text-[#0c831f] hover:underline cursor-pointer"
                >
                  View All Fresh Vegetables
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Mode: 2 Columns on Mobile / 3 on sm / 4 on md / 5 on lg */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {currentVisibleItems.map((item: any) => (
                  <Groceryitemcard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              /* List Mode: Full-width row cards (Shop style) */
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {currentVisibleItems.map((item: any) => (
                  <Groceryitemcard key={item._id} item={item} isList={true} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Load More / Explore Full Shop Button */}
        {filteredList.length > visibleCount && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5 sm:mt-7">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="w-full sm:w-auto bg-white hover:bg-emerald-50 active:scale-95 text-[#0c831f] border-2 border-emerald-500/30 hover:border-emerald-500 px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-2xs transition inline-flex items-center justify-center gap-2 cursor-pointer group"
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
              className="w-full sm:w-auto text-gray-600 hover:text-[#0c831f] font-bold text-xs sm:text-sm px-4 py-2 text-center transition flex items-center justify-center gap-1"
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


