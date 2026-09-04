"use client";

import React, { useState, useRef } from "react";
import {
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CombosSection({
  initialCombos = [],
}: {
  initialCombos?: any[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [combos] = useState<any[]>(initialCombos);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!combos || combos.length === 0) return null;

  const handleAddCombo = (combo: any) => {
    dispatch(
      addToCart({
        _id: combo._id,
        name: `Combo: ${combo.title}`,
        price: combo.comboPrice,
        unit: "Value Bundle",
        image: combo.image,
        category: "Grocery Combos",
        stock: 50,
        quantity: 1,
        cartItemId: combo._id,
      } as any)
    );

    setAddedIds((prev) => ({ ...prev, [combo._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [combo._id]: false }));
    }, 2500);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? clientWidth * 0.7 : clientWidth * 0.86;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full py-5 sm:py-8 bg-[#f8f9fa] border-y border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              🎁 Value Combos & Multipacks
            </h2>
            <span className="bg-amber-50 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
              Up to 25% Off
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

        {/* 1. DESKTOP / TABLET VIEW: Full Width 4-Column Grid (Zero empty side space) */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 w-full">
          {combos.map((combo) => {
            const isAdded = addedIds[combo._id];
            const discount =
              combo.originalPrice && combo.originalPrice > combo.comboPrice
                ? Math.round(
                    ((combo.originalPrice - combo.comboPrice) /
                      combo.originalPrice) *
                      100
                  )
                : 0;

            return (
              <div
                key={combo._id}
                className="w-full bg-white rounded-3xl border border-gray-100 hover:border-emerald-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between p-3 relative group"
              >
                <div>
                  {/* Full-Bleed HD Produce Combo Photo */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-2.5">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#0c831f] text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Combo Title */}
                  <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1 group-hover:text-[#0c831f] transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 min-h-[32px] font-medium leading-tight">
                    {combo.subtitle || combo.description || "Curated fresh farm produce bundle"}
                  </p>
                </div>

                {/* Price & Add Button */}
                <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                  <div>
                    <span className="text-base font-black text-gray-950">
                      ₹{combo.comboPrice}
                    </span>
                    {combo.originalPrice && combo.originalPrice > combo.comboPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1.5 font-normal">
                        ₹{combo.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddCombo(combo)}
                    className={`h-[34px] px-3.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                      isAdded
                        ? "bg-[#0c831f] text-white"
                        : "bg-white text-[#0c831f] border border-[#0c831f] hover:bg-[#0c831f] hover:text-white shadow-2xs active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} className="stroke-[3]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} className="stroke-[3]" />
                        <span>ADD</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. MOBILE VIEW: 1 Card Prominent Carousel with Left/Right Buttons */}
        <div className="block md:hidden relative">
          {/* Mobile Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex absolute -left-1.5 top-[95px] -translate-y-1/2 z-20 bg-white/95 backdrop-blur-xs text-gray-900 w-7 h-7 rounded-full items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-gray-200/90 active:scale-90 cursor-pointer"
          >
            <ChevronLeft size={16} className="stroke-[2.5]" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-none py-1 -mx-3.5 px-3.5 overscroll-x-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {combos.map((combo) => {
              const isAdded = addedIds[combo._id];
              const discount =
                combo.originalPrice && combo.originalPrice > combo.comboPrice
                  ? Math.round(
                      ((combo.originalPrice - combo.comboPrice) /
                        combo.originalPrice) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={combo._id}
                  className="w-[86vw] xs:w-[88vw] shrink-0 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col justify-between p-3.5 relative"
                >
                  <div>
                    {/* Full-Bleed 1-Card Mobile Photo */}
                    <div className="relative w-full h-[155px] xs:h-[175px] rounded-2xl overflow-hidden bg-gray-100 mb-2.5">
                      <img
                        src={combo.image}
                        alt={combo.title}
                        className="w-full h-full object-cover"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-[#0c831f] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Combo Title */}
                    <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                      {combo.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[32px] font-medium leading-tight">
                      {combo.subtitle || combo.description || "Curated fresh farm produce bundle"}
                    </p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                    <div>
                      <span className="text-base font-black text-gray-950">
                        ₹{combo.comboPrice}
                      </span>
                      {combo.originalPrice && combo.originalPrice > combo.comboPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5 font-normal">
                          ₹{combo.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCombo(combo)}
                      className={`h-[36px] px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? "bg-[#0c831f] text-white"
                          : "bg-white text-[#0c831f] border border-[#0c831f] hover:bg-[#0c831f] hover:text-white shadow-2xs active:scale-95"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} className="stroke-[3]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} className="stroke-[3]" />
                          <span>ADD COMBO</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex absolute -right-1.5 top-[95px] -translate-y-1/2 z-20 bg-white/95 backdrop-blur-xs text-gray-900 w-7 h-7 rounded-full items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-gray-200/90 active:scale-90 cursor-pointer"
          >
            <ChevronRight size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
