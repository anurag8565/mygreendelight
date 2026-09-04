"use client";

import React from "react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FilteredProduceSection({
  groceries = [],
}: {
  groceries: any[];
}) {
  if (!groceries || groceries.length === 0) return null;

  return (
    <div className="w-full py-5 sm:py-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              🌱 Daily Fresh Farm Mandi
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block mt-0.5">
              Fresh daily harvest sourced directly from local Bhopal contract farms
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

        {/* Fresh Produce Carousel */}
        <ProductCarousel>
          {groceries.map((item: any) => (
            <div
              key={item._id}
              className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[320px] sm:h-[340px]"
            >
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>
      </div>
    </div>
  );
}
