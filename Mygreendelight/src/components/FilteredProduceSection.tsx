"use client";

import React, { useState } from "react";
import QuickFilterChips, { filterChipsList } from "./QuickFilterChips";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <div className="w-full py-3 sm:py-5 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              🌱 Daily Fresh Farm Mandi
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block mt-0.5">
              1-Tap live filtered produce from local Bhopal contract farms
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[#0c831f] hover:text-[#096618] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>See All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 1-Tap Quick Filter Chips */}
        <div className="mb-2.5">
          <QuickFilterChips
            activeChip={activeChip}
            onSelectChip={(id) => setActiveChip(id)}
          />
        </div>

        {/* Filtered Produce Carousel */}
        {filteredItems.length > 0 ? (
          <ProductCarousel>
            {filteredItems.map((item: any) => (
              <div
                key={item._id}
                className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[320px] sm:h-[340px]"
              >
                <Groceryitemcard item={item} />
              </div>
            ))}
          </ProductCarousel>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              🌱 Is category ke liye agla sunrise batch jald live hone wala hai!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
