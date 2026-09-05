"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChefHat,
  Plus,
  Check,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

export default function RecipeKitsSection({ kits = [] }: { kits?: any[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const [activeKits, setActiveKits] = useState<any[]>(kits);
  const [addedKitId, setAddedKitId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (kits && kits.length > 0) {
      setActiveKits(kits);
      return;
    }
    axios
      .get("/api/recipe-kits")
      .then((res) => {
        if (res.data.success && res.data.kits && res.data.kits.length > 0) {
          setActiveKits(res.data.kits);
        }
      })
      .catch(() => {});
  }, [kits]);

  const handleAddKit = (kit: any) => {
    const kitId = kit._id || kit.id;
    // Add all ingredients of the kit to Redux cart in 1 shot
    kit.ingredients.forEach((ing: any, index: number) => {
      dispatch(
        addToCart({
          _id: (ing.groceryId || `${kitId}-ing-${index}`) as any,
          name: `${ing.name} (${kit.name})`,
          price: ing.price,
          unit: ing.qty,
          image: ing.image || "/categories/vegetables.jpg",
          category: "Recipe Kit",
          stock: 50,
          quantity: 1,
          cartItemId: `${kitId}-ing-${index}`,
        } as any)
      );
    });

    setAddedKitId(kitId);
    setTimeout(() => setAddedKitId(null), 3000);
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

  if (!activeKits || activeKits.length === 0) return null;

  return (
    <div className="w-full py-4 sm:py-8 bg-gradient-to-b from-green-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <ChefHat size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                  Cook This Dish — 1-Click Recipe Kits
                </h2>
                <span className="bg-orange-100 text-orange-800 text-[9px] font-black px-1.5 py-0.2 rounded uppercase hidden sm:inline-block">
                  Smart Combos
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                Exact pre-measured fresh Mandi ingredients delivered right to your doorstep
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 transition ml-1"
          >
            <span>Explore All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel Container with Side Floating Arrows */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-8 h-8 sm:w-11 sm:h-11 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-gray-200 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>

          {/* True Sliding Carousel (1 card on mobile, 2-3 cards on desktop) */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-3.5 sm:gap-6 pb-3 snap-x snap-mandatory scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 scroll-smooth"
          >
            {activeKits.map((kit: any) => {
              const kitId = kit._id || kit.id;
              const isAdded = addedKitId === kitId;
              const discount = Math.round(
                ((kit.mrp - kit.price) / kit.mrp) * 100
              );

              return (
                <motion.div
                  key={kitId}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="w-[84vw] xs:w-[295px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-center md:snap-start bg-white rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Header Banner */}
                  <div className="p-3.5 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-800 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between gap-1.5 flex-wrap mb-2">
                      <span className="bg-yellow-300 text-gray-950 text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs shrink-0">
                        {kit.badge}
                      </span>
                      <span className="text-emerald-100 text-[10px] font-bold shrink-0">
                        ⏱️ {kit.cookTime} • {kit.serves}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-base font-black text-white leading-snug truncate">
                      {kit.name}
                    </h3>
                    <span className="text-[11px] text-green-200 font-bold block truncate">
                      {kit.hindiName}
                    </span>
                  </div>

                  {/* Ingredients Checklist */}
                  <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5 mb-3.5">
                      <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                        Included Farm Ingredients:
                      </span>
                      <div className="space-y-1">
                        {kit.ingredients?.map((ing: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-gray-700 bg-gray-50/90 px-2 py-1.5 rounded-xl border border-gray-100"
                          >
                            <span className="font-bold flex items-center gap-1.5 truncate text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0f8646] shrink-0" />
                              <span className="truncate">{ing.name}</span>
                            </span>
                            <span className="text-gray-400 font-black text-[10px] shrink-0 ml-1.5">
                              {ing.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-xl font-black text-[#0f8646]">
                            ₹{kit.price}
                          </span>
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{kit.mrp}
                          </span>
                        </div>
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                          Save {discount}% OFF
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddKit(kit)}
                        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          isAdded
                            ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                            : "bg-[#0f8646] hover:bg-[#0c6a38] text-white active:scale-95"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={13} className="stroke-[3]" />
                            <span>Added! 🛒</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} className="stroke-[3]" />
                            <span>Add Kit</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-8 h-8 sm:w-11 sm:h-11 rounded-full items-center justify-center transition-all shadow-md hover:shadow-xl border border-gray-200 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
