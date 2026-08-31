"use client";

import React, { useState } from "react";
import { ChefHat, Plus, Check, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import { motion } from "framer-motion";
import Link from "next/link";

interface RecipeKit {
  id: string;
  name: string;
  hindiName: string;
  serves: string;
  cookTime: string;
  badge: string;
  price: number;
  mrp: number;
  image: string;
  ingredients: {
    name: string;
    qty: string;
    price: number;
    image: string;
  }[];
}

export default function RecipeKitsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const [addedKitId, setAddedKitId] = useState<string | null>(null);

  const kits: RecipeKit[] = [
    {
      id: "kit-palak-paneer",
      name: "Desi Palak Paneer Kit",
      hindiName: "देसी पालक पनीर किट",
      serves: "3-4 Persons",
      cookTime: "25 Mins",
      badge: "⭐ Chef's Favorite",
      price: 149,
      mrp: 199,
      image: "/categories/vegetables.jpg",
      ingredients: [
        { name: "Farm Fresh Spinach (Palak)", qty: "500g", price: 30, image: "/categories/vegetables.jpg" },
        { name: "Fresh Malai Paneer", qty: "200g", price: 85, image: "/categories/exotic.jpg" },
        { name: "Desi Ripe Tomatoes", qty: "250g", price: 15, image: "/categories/vegetables.jpg" },
        { name: "Ginger, Garlic & Green Chillies Combo", qty: "100g", price: 19, image: "/categories/vegetables.jpg" },
      ],
    },
    {
      id: "kit-pav-bhaji",
      name: "Street Style Pav Bhaji Basket",
      hindiName: "स्ट्रीट स्टाइल पाव भाजी किट",
      serves: "4 Persons",
      cookTime: "30 Mins",
      badge: "🔥 Weekend Special",
      price: 169,
      mrp: 220,
      image: "/categories/vegetables.jpg",
      ingredients: [
        { name: "Fresh Farm Potatoes (Aloo)", qty: "500g", price: 25, image: "/categories/vegetables.jpg" },
        { name: "Fresh Cauliflower (Gobhi)", qty: "500g", price: 35, image: "/categories/vegetables.jpg" },
        { name: "Green Bell Peppers (Capsicum)", qty: "250g", price: 29, image: "/categories/vegetables.jpg" },
        { name: "Fresh Green Peas (Matar)", qty: "250g", price: 40, image: "/categories/vegetables.jpg" },
        { name: "Fresh Coriander & Lemons", qty: "1 pack", price: 40, image: "/categories/vegetables.jpg" },
      ],
    },
    {
      id: "kit-healthy-salad",
      name: "Immunity Rainbow Salad Box",
      hindiName: "इम्यूनिटी फ्रेश सलाद बॉक्स",
      serves: "2 Persons",
      cookTime: "5 Mins (Ready)",
      badge: "🌿 100% Raw Detox",
      price: 119,
      mrp: 155,
      image: "/categories/fruits.jpg",
      ingredients: [
        { name: "Crispy English Cucumber", qty: "2 pcs", price: 30, image: "/categories/vegetables.jpg" },
        { name: "Sweet Beetroot (Chukandar)", qty: "250g", price: 25, image: "/categories/vegetables.jpg" },
        { name: "Juicy Farm Carrots (Gajar)", qty: "250g", price: 25, image: "/categories/vegetables.jpg" },
        { name: "Fresh Mint & Lemon Dressing", qty: "1 pack", price: 39, image: "/categories/vegetables.jpg" },
      ],
    },
  ];

  const handleAddKit = (kit: RecipeKit) => {
    // Add all ingredients of the kit to Redux cart in 1 shot
    kit.ingredients.forEach((ing, index) => {
      dispatch(
        addToCart({
          _id: `${kit.id}-ing-${index}` as any,
          name: `${ing.name} (${kit.name})`,
          price: ing.price,
          unit: ing.qty,
          image: ing.image,
          category: "Recipe Kit",
          stock: 50,
          quantity: 1,
          cartItemId: `${kit.id}-ing-${index}`,
        } as any)
      );
    });

    setAddedKitId(kit.id);
    setTimeout(() => setAddedKitId(null), 3000);
  };

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
          {kits.map((kit) => {
            const isAdded = addedKitId === kit.id;
            const discount = Math.round(((kit.mrp - kit.price) / kit.mrp) * 100);

            return (
              <motion.div
                key={kit.id}
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
                      {kit.ingredients.map((ing, idx) => (
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
