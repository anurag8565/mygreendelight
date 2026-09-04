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
    <div className="w-full py-3.5 sm:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-emerald-500/10 p-3.5 sm:p-5 md:p-6 border border-amber-200/80 shadow-[0_4px_24px_rgba(245,158,11,0.06)] relative overflow-hidden">
          {/* Subtle Decorative Golden Glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5 relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-gray-950 flex items-center justify-center font-black shrink-0 shadow-sm shadow-amber-400/30 border border-yellow-200">
                <Crown size={19} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Top Bestsellers & Featured Picks
                  </h2>
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-950 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs inline-flex items-center gap-1">
                    <Star size={10} className="fill-gray-950" />
                    <span>★ 4.8+ Rated</span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden xs:block mt-0.5">
                  Most frequently ordered sunrise produce by families across Bhopal
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

          {/* Swipeable Carousel */}
          <div className="relative z-10">
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
      </div>
    </div>
  );
}
