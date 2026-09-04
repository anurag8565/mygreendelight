"use client";

import React from "react";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";

export default function FeaturedProduceSection({
  products = [],
}: {
  products: any[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full py-5 sm:py-8 bg-[#f8f9fa] border-y border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              👑 Bhopal Bestsellers
            </h2>
            <span className="bg-amber-50 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Star size={10} className="fill-amber-500 text-amber-500" />
              <span>4.8+ Rated</span>
            </span>
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

        {/* Swipeable Carousel */}
        <ProductCarousel>
          {products.map((item: any) => (
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
