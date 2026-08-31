"use client";

import React, { useState, useEffect } from "react";
import { ChefHat, Plus, Check, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
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

  if (!activeKits || activeKits.length === 0) return null;

  return (
    <div className="w-full py-5 sm:py-8 bg-gradient-to-b from-green-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <ChefHat size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                  Cook This Dish — 1-Click Recipe Kits
                </h2>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase hidden sm:inline-block">
                  Smart Combos
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Exact pre-measured farm ingredients delivered in 10 minutes
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 transition"
          >
            <span>Explore All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {activeKits.map((kit: any) => {
            const kitId = kit._id || kit.id;
            const isAdded = addedKitId === kitId;
            const discount = Math.round(((kit.mrp - kit.price) / kit.mrp) * 100);

            return (
              <motion.div
                key={kitId}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Header Banner */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-green-800 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-yellow-300 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {kit.badge}
                    </span>
                    <span className="text-white/80 text-[11px] font-bold">
                      ⏱️ {kit.cookTime} • {kit.serves}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {kit.name}
                  </h3>
                  <span className="text-xs text-green-200 font-bold block">
                    {kit.hindiName}
                  </span>
                </div>

                {/* Ingredients Checklist */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                      Included Farm Ingredients:
                    </span>
                    <div className="space-y-1.5">
                      {kit.ingredients?.map((ing: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs text-gray-700 bg-gray-50/80 px-2.5 py-1.5 rounded-xl border border-gray-100"
                        >
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0f8646]" />
                            {ing.name}
                          </span>
                          <span className="text-gray-400 font-black text-[11px]">
                            {ing.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg sm:text-xl font-black text-[#0f8646]">
                          ₹{kit.price}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{kit.mrp}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        Save {discount}% OFF
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddKit(kit)}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                          : "bg-[#0f8646] hover:bg-[#0c6a38] text-white hover:scale-103"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} className="stroke-[3]" />
                          <span>Kit Added! 🛒</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} className="stroke-[3]" />
                          <span>Add Whole Kit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
