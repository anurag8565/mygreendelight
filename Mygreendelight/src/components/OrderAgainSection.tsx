"use client";

import React, { useRef } from "react";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCarousel, { ProductCarouselHandle } from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";
import Link from "next/link";

export default function OrderAgainSection({ items = [] }: { items: any[] }) {
  const carouselRef = useRef<ProductCarouselHandle>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full py-4 sm:py-6 bg-[#f7f6f2] border-b border-stone-200/70 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Header with Title & See All Link */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <RotateCcw size={18} className="text-[#0a3d24]" />
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading">
              Order Again
            </h2>
          </div>

          <Link
            href="/orders"
            className="text-stone-500 hover:text-[#0a3d24] font-semibold text-xs sm:text-sm flex items-center gap-0.5 px-2.5 py-1 rounded-full hover:bg-stone-200/50 transition"
          >
            <span>Past orders</span>
            <ChevronRight size={14} className="stroke-[2]" />
          </Link>
        </div>

        {/* Swipeable Carousel with Bottom Indicator Dots */}
        <ProductCarousel>
          {items.map((item: any) => (
            <div
              key={item._id}
              className="w-[155px] sm:w-[185px] md:w-[200px] snap-start shrink-0 flex flex-col h-[255px] sm:h-[275px]"
            >
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>
      </div>
    </div>
  );
}
