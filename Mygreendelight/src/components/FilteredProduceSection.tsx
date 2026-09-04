"use client";

import React, { useState } from "react";
import QuickFilterChips, { filterChipsList } from "./QuickFilterChips";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import { Flame, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
  const [activeChip, setActiveChip] = useState("all");

  const currentChipObj =
    filterChipsList.find((c) => c.id === activeChip) || filterChipsList[0];

  const filteredItems = groceries.filter(currentChipObj.filterFn);

  return (
    <div className="w-full bg-white py-3 sm:py-6">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#0f8646] font-black">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                🥬 Daily Fresh Farm Mandi
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                1-Tap live filtered produce from local Bhopal contract farms
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>View all</span>
            <ChevronRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 1-Tap Quick Filter Chips */}
        <QuickFilterChips
          activeChip={activeChip}
          onSelectChip={(id) => setActiveChip(id)}
        />

        {/* Filtered Produce Carousel */}
        {filteredItems.length > 0 ? (
          <ProductCarousel>
            {filteredItems.map((item: any) => (
              <div
                key={item._id}
                className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[300px] sm:h-[320px]"
              >
                <Groceryitemcard item={item} />
              </div>
            ))}
          </ProductCarousel>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 font-bold">
              Is filter ke liye taaza batch jald aane wala hai!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
