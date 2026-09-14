"use client";

import React, { useState, useRef } from "react";
import {
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  PackageOpen,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { triggerHaptic } from "@/utils/haptics";
import { AppDispatch, RootState } from "@/redux/store";
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
    triggerHaptic("medium");
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
    <section className="w-full py-6 sm:py-8 bg-white border-b border-stone-200/70 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <PackageOpen size={18} className="text-[#0a3d24] shrink-0" />
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading">
              Fresh Produce Combos
            </h2>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Value Packs
            </span>
          </div>

          <Link
            href="/shop"
            className="text-stone-500 hover:text-[#0a3d24] font-semibold text-xs sm:text-sm flex items-center gap-0.5 transition"
          >
            <span>See all</span>
            <ChevronRight size={14} className="stroke-[2]" />
          </Link>
        </div>

        {/* 1. DESKTOP / TABLET VIEW: Full Width 4-Column Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 sm:gap-5 w-full">
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
              <motion.div
                key={combo._id}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="w-full bg-stone-50/50 hover:bg-white rounded-2xl sm:rounded-3xl border border-stone-200/70 hover:border-stone-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-3 relative group"
              >
                <div>
                  {/* Clean HD Photo */}
                  <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-white mb-2.5 border border-stone-100">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#0a3d24] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Combo Title */}
                  <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-1 group-hover:text-[#0a3d24] transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-medium leading-tight">
                    {combo.subtitle || combo.description || "Curated fresh farm produce bundle"}
                  </p>
                </div>

                {/* Price & Add Button */}
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2 mt-2">
                  <div>
                    <span className="text-base font-extrabold text-stone-950">
                      ₹{combo.comboPrice}
                    </span>
                    {combo.originalPrice && combo.originalPrice > combo.comboPrice && (
                      <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                        ₹{combo.originalPrice}
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => handleAddCombo(combo)}
                    className={`h-[32px] px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                      isAdded
                        ? "bg-[#0a3d24] text-white shadow-2xs"
                        : "bg-white text-[#0a3d24] border border-[#0a3d24]/80 hover:bg-[#0a3d24] hover:text-white shadow-2xs"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={12} className="stroke-[3]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} className="stroke-[3]" />
                        <span>ADD</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 2. MOBILE VIEW: 1 Card Prominent Carousel with Left/Right Buttons */}
        <div className="block md:hidden relative">
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
                  className="w-[78vw] xs:w-[80vw] shrink-0 bg-stone-50/70 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between p-3 relative"
                >
                  <div>
                    {/* Clean Mobile Photo */}
                    <div className="relative w-full h-[140px] xs:h-[155px] rounded-xl overflow-hidden bg-white mb-2 border border-stone-100">
                      <img
                        src={combo.image}
                        alt={combo.title}
                        className="w-full h-full object-cover"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-[#0a3d24] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Combo Title */}
                    <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-1">
                      {combo.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-medium leading-tight">
                      {combo.subtitle || combo.description || "Curated farm bundle"}
                    </p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2 mt-2">
                    <div>
                      <span className="text-base font-extrabold text-stone-950">
                        ₹{combo.comboPrice}
                      </span>
                      {combo.originalPrice && combo.originalPrice > combo.comboPrice && (
                        <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                          ₹{combo.originalPrice}
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => handleAddCombo(combo)}
                      className={`h-[32px] px-3.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                        isAdded
                          ? "bg-[#0a3d24] text-white shadow-2xs"
                          : "bg-white text-[#0a3d24] border border-[#0a3d24]/80 hover:bg-[#0a3d24] hover:text-white shadow-2xs"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={12} className="stroke-[3]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus size={12} className="stroke-[3]" />
                          <span>ADD</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
