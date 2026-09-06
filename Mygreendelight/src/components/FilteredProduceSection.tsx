"use client";

import React, { useState, useMemo } from "react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import { ChevronRight, Sparkles, LayoutGrid, Rows, Filter, Flame, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

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
      { id: "all", label: "🌱 All Mandi", hindi: "सभी फल-सब्जियां", count: list.length },
      { id: "vegetables", label: "🥬 Fresh Veggies", hindi: "सब्जियां", count: vegItems.length },
      { id: "fruits", label: "🍎 Sweet Fruits", hindi: "ताज़े फल", count: fruitItems.length },
      { id: "exotics", label: "🥑 Hydroponics & Exotics", hindi: "विदेशी व सलाद", count: exoticItems.length },
    ].filter((t) => t.id === "all" || t.count > 0);

    let baseList = list;
    if (activeTab === "vegetables") baseList = vegItems;
    else if (activeTab === "fruits") baseList = fruitItems;
    else if (activeTab === "exotics") baseList = exoticItems;

    // Apply secondary quick filter chips
    let finalList = baseList;
    if (quickFilter === "under50") {
      finalList = baseList.filter((item) => Number(item.price) <= 50);
    } else if (quickFilter === "discount") {
      finalList = baseList.filter((item) => {
        const mrp = (item as any).mrp || item.price * 1.25;
        return mrp > item.price;
      });
    } else if (quickFilter === "instock") {
      finalList = baseList.filter((item) => Number(item.stock) > 0);
    }

    return { filteredList: finalList, tabs: tabList };
  }, [groceries, activeTab, quickFilter]);

  if (!groceries || groceries.length === 0) return null;

  return (
    <div className="w-full py-4 sm:py-7 bg-white font-sans border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 sm:mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Daily Fresh Farm Mandi
              </h2>
              <span className="bg-emerald-100 text-[#0c831f] text-[10.5px] font-black px-2 py-0.5 rounded-full">
                {filteredList.length} items
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
              100% Ozone-Washed Vegetables, Naturally Ripened Fruits & Hydroponics • Direct Kisan Mandi Rates
            </p>
          </div>

          {/* Action Links & Grid / Carousel View Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {/* View Mode Toggle */}
            <div className="bg-gray-100/90 p-1 rounded-xl flex items-center gap-1 border border-gray-200/60">
              <button
                type="button"
                onClick={() => setViewMode("carousel")}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === "carousel"
                    ? "bg-white text-emerald-800 shadow-2xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                title="Carousel Swipe Mode"
              >
                <Rows size={14} />
                <span className="text-[10px] hidden xs:inline">Swipe</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-emerald-800 shadow-2xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                title="Expanded Grid Mode"
              >
                <LayoutGrid size={14} />
                <span className="text-[10px] hidden xs:inline">Grid</span>
              </button>
            </div>

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
              <span>Explore All</span>
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
              />
            </Link>
          </div>
        </div>

        {/* 1-Tap Category Filter Tabs */}
        {tabs.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 mb-2.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 select-none">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs border ${
                    isSelected
                      ? "bg-[#0c831f] text-white border-[#0c831f] shadow-sm scale-100 ring-2 ring-emerald-600/30"
                      : "bg-gray-50/90 text-gray-700 hover:bg-gray-100 border-gray-200/80 active:scale-95"
                  }`}
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span>{tab.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
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
        )}

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 mb-4 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 select-none text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setQuickFilter("all")}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer shrink-0 border ${
              quickFilter === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter(quickFilter === "under50" ? "all" : "under50")}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer shrink-0 border flex items-center gap-1 ${
              quickFilter === "under50"
                ? "bg-[#0c831f] text-white border-[#0c831f]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Zap size={12} className="text-amber-500 fill-amber-500" />
            <span>Under ₹50</span>
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter(quickFilter === "discount" ? "all" : "discount")}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer shrink-0 border flex items-center gap-1 ${
              quickFilter === "discount"
                ? "bg-[#0c831f] text-white border-[#0c831f]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Flame size={12} className="text-rose-500" />
            <span>Best Discounts</span>
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter(quickFilter === "instock" ? "all" : "instock")}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer shrink-0 border flex items-center gap-1 ${
              quickFilter === "instock"
                ? "bg-[#0c831f] text-white border-[#0c831f]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>📦 In Stock Only</span>
          </button>
        </div>

        {/* Fresh Produce Content: Carousel OR Grid View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${quickFilter}-${viewMode}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {filteredList.length === 0 ? (
              <div className="py-12 text-center bg-gray-50/60 rounded-3xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500">
                  No items matched your current filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setQuickFilter("all");
                  }}
                  className="mt-2 text-xs font-black text-[#0c831f] hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "carousel" ? (
              <ProductCarousel>
                {filteredList.map((item: any) => (
                  <div
                    key={item._id}
                    className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[320px] sm:h-[340px]"
                  >
                    <Groceryitemcard item={item} />
                  </div>
                ))}
              </ProductCarousel>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {filteredList.map((item: any) => (
                  <Groceryitemcard key={item._id} item={item} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

