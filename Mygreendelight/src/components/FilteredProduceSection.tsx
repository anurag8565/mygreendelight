"use client";

import React, { useState, useMemo } from "react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");

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
      { id: "all", label: "🌱 All Mandi", count: list.length },
      { id: "vegetables", label: "🥬 Vegetables", count: vegItems.length },
      { id: "fruits", label: "🍎 Fruits", count: fruitItems.length },
      { id: "exotics", label: "🥑 Exotics", count: exoticItems.length },
    ].filter((t) => t.id === "all" || t.count > 0);

    let displayList = list;
    if (activeTab === "vegetables") displayList = vegItems;
    else if (activeTab === "fruits") displayList = fruitItems;
    else if (activeTab === "exotics") displayList = exoticItems;

    return { filteredList: displayList, tabs: tabList };
  }, [groceries, activeTab]);

  if (!groceries || groceries.length === 0) return null;

  return (
    <div className="w-full py-4 sm:py-7 bg-white font-sans border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>🌱 Daily Fresh Farm Mandi</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden sm:block mt-0.5">
              Fresh daily harvest sourced directly from local Bhopal contract farms
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition shrink-0"
          >
            <span>See All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 1-Tap Category Filter Tabs (Quick Commerce Mobile & Desktop) */}
        {tabs.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 mb-3.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 select-none">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs ${
                    isSelected
                      ? "bg-[#0c831f] text-white shadow-sm scale-100 ring-2 ring-emerald-600/30"
                      : "bg-gray-100/90 text-gray-700 hover:bg-gray-200/90 active:scale-95"
                  }`}
                >
                  <span>{tab.label}</span>
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

        {/* Fresh Produce Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

