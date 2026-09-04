"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Crown, ChevronRight, Star } from "lucide-react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";

export default function FeaturedProduceSection({
  products = [],
}: {
  products: any[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-b from-amber-50/50 via-amber-50/20 to-white py-4 sm:py-6 border-y border-amber-100/60">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-2xs border border-amber-300">
              <Crown size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  Top Bestsellers & Featured Picks
                </h2>
                <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs hidden xs:inline-flex items-center gap-1">
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  <span>Customer Favorites</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block">
                Highest rated farm harvest & most frequently ordered in Bhopal
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-200/70 shadow-2xs shrink-0"
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
              className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[325px] sm:h-[345px]"
            >
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>
      </div>
    </div>
  );
}
