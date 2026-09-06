"use client";

import React, { useState, useMemo } from "react";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import { ChevronRight, LayoutGrid, List, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
  // Default to vegetables tab
  const [activeTab, setActiveTab] = useState<string>("vegetables");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

    const tabList = [
      { id: "vegetables", label: "Vegetables", hindi: "ताज़ी सब्जियां", emoji: "🥬", count: vegItems.length },
      { id: "fruits", label: "Fruits", hindi: "ताज़े फल", emoji: "🍎", count: fruitItems.length },
      { id: "exotics", label: "Exotics", hindi: "विदेशी व सलाद", emoji: "🥑", count: exoticItems.length },
      { id: "all", label: "All Harvest", hindi: "सभी उपज", emoji: "🌱", count: list.length },
    ];

    let displayList = vegItems;
    if (activeTab === "vegetables") displayList = vegItems.length > 0 ? vegItems : list;
    else if (activeTab === "fruits") displayList = fruitItems;
    else if (activeTab === "exotics") displayList = exoticItems;
    else if (activeTab === "all") displayList = list;

    return { filteredList: displayList, tabs: tabList };
  }, [groceries, activeTab]);

  if (!groceries || groceries.length === 0) return null;

  return (
    <section className="w-full py-5 sm:py-8 bg-white font-sans border-b border-gray-100/90">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
                Daily Fresh Mandi Harvest
              </h2>
              <span className="bg-emerald-100 text-[#0c831f] text-xs font-black px-2.5 py-0.5 rounded-full">
                {filteredList.length} Items
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              100% Ozone-Washed & Hand-Sorted • Sourced 5:00 AM from Bhopal Mandi
            </p>
          </div>

          {/* View Switcher Controls (Shop Style Grid vs List) & Explore All Link */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  viewMode === "grid"
                    ? "bg-white text-[#0c831f] shadow-xs font-bold"
                    : "text-gray-400 hover:text-gray-700"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={16} />
                <span className="text-[11px] hidden xs:inline font-bold">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-white text-[#0c831f] shadow-xs font-bold"
                    : "text-gray-400 hover:text-gray-700"
                }`}
                title="List View"
                aria-label="List View"
              >
                <List size={16} />
                <span className="text-[11px] hidden xs:inline font-bold">List</span>
              </button>
            </div>

            {/* Link to Shop page with current category */}
            <Link
              href={
                activeTab === "vegetables"
                  ? "/shop?category=Vegetables"
                  : activeTab === "fruits"
                  ? "/shop?category=Fruits"
                  : activeTab === "exotics"
                  ? "/shop?category=Exotics"
                  : "/shop"
              }
              className="text-[#0c831f] hover:text-[#096618] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition shrink-0"
            >
              <span>See All</span>
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
              />
            </Link>
          </div>
        </div>

        {/* 3 Prominent Produce Category Tabs (Vegetables, Fruits, Exotics) */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-3 mb-5 select-none">
          {tabs
            .filter((t) => t.id !== "all")
            .map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-2.5 sm:px-5 sm:py-3 rounded-2xl font-black transition-all flex flex-col sm:flex-row items-center sm:gap-2.5 justify-center cursor-pointer border text-center ${
                    isSelected
                      ? "bg-[#0c831f] text-white border-[#0c831f] shadow-md scale-[1.02] ring-2 ring-emerald-600/30"
                      : "bg-gray-50/90 text-gray-700 hover:bg-gray-100 border-gray-200/90 active:scale-95"
                  }`}
                >
                  <span className="text-xl sm:text-2xl mb-1 sm:mb-0">{tab.emoji}</span>
                  <div className="flex flex-col sm:items-start text-center sm:text-left leading-tight">
                    <span className="text-xs sm:text-sm font-black">{tab.label}</span>
                    <span
                      className={`text-[9.5px] sm:text-[11px] font-bold ${
                        isSelected ? "text-emerald-100" : "text-gray-400"
                      }`}
                    >
                      {tab.hindi}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold mt-1 sm:mt-0 sm:ml-auto ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-gray-200/80 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Dynamic Products Display: Grid OR List View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${viewMode}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {filteredList.length === 0 ? (
              <div className="py-12 text-center bg-gray-50/60 rounded-3xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500">
                  No products found in this category.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("vegetables")}
                  className="mt-2 text-xs font-black text-[#0c831f] hover:underline cursor-pointer"
                >
                  View Vegetables
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Mode: 2 Columns on Mobile / 3 on sm / 4 on md / 5 on lg */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {filteredList.map((item: any) => (
                  <Groceryitemcard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              /* List Mode: Full-width row cards (Shop style) */
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {filteredList.map((item: any) => (
                  <Groceryitemcard key={item._id} item={item} isList={true} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

