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
    <div className="w-full py-3.5 sm:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 p-3.5 sm:p-5 md:p-6 border border-emerald-200/80 shadow-[0_4px_24px_rgba(15,134,70,0.06)] relative overflow-hidden">
          {/* Subtle Decorative Emerald Glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center font-black shadow-sm shadow-emerald-600/30 border border-emerald-400">
                <Sparkles size={18} className="text-yellow-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  Daily Fresh Farm Mandi
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block mt-0.5">
                  1-Tap live filtered produce from local Bhopal contract farms
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs shrink-0"
            >
              <span>See All</span>
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
              />
            </Link>
          </div>

          {/* 1-Tap Quick Filter Chips */}
          <div className="relative z-10 mb-3">
            <QuickFilterChips
              activeChip={activeChip}
              onSelectChip={(id) => setActiveChip(id)}
            />
          </div>

          {/* Filtered Produce Carousel */}
          <div className="relative z-10">
            {filteredItems.length > 0 ? (
              <ProductCarousel>
                {filteredItems.map((item: any) => (
                  <div
                    key={item._id}
                    className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[325px] sm:h-[345px]"
                  >
                    <Groceryitemcard item={item} />
                  </div>
                ))}
              </ProductCarousel>
            ) : (
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-8 text-center border border-emerald-200/60 shadow-2xs">
                <p className="text-xs sm:text-sm text-gray-600 font-bold">
                  🌱 Is category ke liye agla sunrise batch jald live hone wala hai!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
