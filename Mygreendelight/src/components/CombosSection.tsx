"use client";

import React, { useState } from "react";
import { Sparkles, ShoppingBag, Check, Flame, ArrowRight, Tag, Percent } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CombosSection({ initialCombos = [] }: { initialCombos?: any[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const [combos] = useState<any[]>(initialCombos);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

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

  return (
    <div className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              <Percent size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Save-More Value Combos & Multipacks
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Curated produce packs with up to 25% bundle savings
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-1 transition"
          >
            <span>All Deals</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {combos.map((c) => {
            const isAdded = addedIds[c._id];
            return (
              <motion.div
                key={c._id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border border-gray-200/90 hover:border-amber-300 p-5 shadow-2xs hover:shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md border border-white/50">
                    {c.badge || `Save ${c.discountPercentage}%`}
                  </span>
                </div>

                <div>
                  {/* Image */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-50 mb-4 relative shadow-inner">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="font-black text-sm text-gray-900 line-clamp-1 mb-1 group-hover:text-[#0f8646] transition-colors">{c.title}</h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {c.subtitle}
                  </p>

                  {/* Bundled Items Pills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {c.items?.map((item: any, i: number) => (
                      <span
                        key={i}
                        className="text-[9px] font-bold bg-green-50 text-[#0f8646] border border-green-200 px-2 py-0.5 rounded-md"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Bundle Deal</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-gray-900">₹{c.comboPrice}</span>
                      <span className="text-xs text-gray-400 line-through">₹{c.originalPrice}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddCombo(c)}
                    className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1 transition-all shadow-md cursor-pointer ${
                      isAdded
                        ? "bg-green-700 text-white"
                        : "bg-[#0f8646] hover:bg-[#0c6a38] text-white hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> <span>Added! 🎉</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> <span>Add Combo</span>
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
