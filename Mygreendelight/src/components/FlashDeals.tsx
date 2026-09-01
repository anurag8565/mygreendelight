"use client";

import React from "react";
import Link from "next/link";
import { Flame, ChevronRight, Zap, Sparkles } from "lucide-react";
import ProductCarousel from "./ProductCarousel";
import Groceryitemcard from "./Groceryitemcard";

export default function FlashDeals({ products = [] }: { products: any[] }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-4 sm:py-6 bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Flash Deals Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Flame size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                  Daily Flash Harvest Deals
                </h2>
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                  🔥 UP TO 35% OFF
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                Limited daily farm-direct harvest discounts for Bhopal households
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition shrink-0"
          >
            <span>See all</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </Link>
        </div>

        {/* Product Carousel */}
        <ProductCarousel>
          {products.map((item: any) => (
            <div
              key={item._id}
              className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[300px] sm:h-[320px]"
            >
              <Groceryitemcard item={item} />
            </div>
          ))}
        </ProductCarousel>

      </div>
    </div>
  );
}
