"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  ShoppingBag,
  Check,
  Flame,
  ArrowRight,
  Tag,
  Percent,
  ChevronLeft,
  ChevronRight,
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
      const scrollAmount = clientWidth * 0.75;
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
    <div className="w-full py-4 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shrink-0">
              <Percent size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                  Save-More Value Combos & Multipacks
                </h2>
                <span className="hidden sm:inline-block bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  Up to 25% Off
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                Curated kitchen produce packs with bundle savings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Left/Right Controls */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition shadow-2xs cursor-pointer"
                title="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition shadow-2xs cursor-pointer"
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <Link
              href="/shop"
              className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 transition ml-1"
            >
              <span>All Deals</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Combos Swipe Carousel on Mobile / Grid on Desktop */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3.5 sm:gap-5 pb-3 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-4 -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
        >
          {combos.map((c) => {
            const isAdded = addedIds[c._id];
            return (
              <motion.div
                key={c._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-[265px] xs:w-[295px] sm:w-auto shrink-0 snap-start bg-white rounded-3xl border border-gray-200/90 hover:border-amber-300 p-3.5 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-950 font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-xs border border-white/50">
                    {c.badge || `Save ${c.discountPercentage || 20}%`}
                  </span>
                </div>

                <div>
                  {/* Image */}
                  <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden bg-gray-50 mb-3 sm:mb-4 relative shadow-inner">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="font-black text-xs sm:text-sm text-gray-900 line-clamp-1 mb-1 group-hover:text-[#0f8646] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {c.subtitle}
                  </p>

                  {/* Bundled Items Pills */}
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {c.items?.map((item: any, i: number) => (
                      <span
                        key={i}
                        className="text-[9px] font-bold bg-green-50 text-[#0f8646] border border-green-200/80 px-1.5 py-0.2 rounded truncate max-w-full"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase">
                      Bundle Deal
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-xl font-black text-gray-900">
                        ₹{c.comboPrice}
                      </span>
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{c.originalPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddCombo(c)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-green-700 text-white"
                        : "bg-[#0f8646] hover:bg-[#0c6a38] text-white active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={12} /> <span>Added! 🎉</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={12} /> <span>Add Combo</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
