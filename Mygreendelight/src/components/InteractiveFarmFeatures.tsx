"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Salad, Gift, ChefHat, ArrowRight, Utensils, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function InteractiveFarmFeatures() {
  const features = [
    {
      icon: <Salad size={24} className="text-emerald-600" />,
      tag: "🥗 Health & Detox",
      title: "Custom Salad & Health Box Builder",
      desc: "Pick your favorite crispy lettuce, avocados, seeds & dressings to craft a personalized 100% fresh health bowl.",
      link: "/shop/custom-box",
      btnText: "Build Custom Box",
      badge: "Popular in Bhopal",
      gradient: "from-emerald-50 to-green-50/70 border-emerald-200/90",
      btnColor: "bg-[#0f8646] hover:bg-[#0c6a38] text-white",
    },
    {
      icon: <ChefHat size={24} className="text-amber-600" />,
      tag: "🍲 1-Click Cook",
      title: "Farm Fresh Recipe Ingredient Kits",
      desc: "Get pre-measured, washed produce & authentic spices delivered together to cook restaurant-grade dishes at home.",
      link: "/shop?category=Combos",
      btnText: "Explore Recipe Kits",
      badge: "Zero Wastage",
      gradient: "from-amber-50 to-orange-50/70 border-amber-200/90",
      btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      icon: <Gift size={24} className="text-pink-600" />,
      tag: "🎁 Eco Gifting",
      title: "Artisanal Fresh Fruit & Herb Hampers",
      desc: "Gift curated exotic fruit baskets, dry fruits & pure farm honey in handcrafted eco-packaging for special occasions.",
      link: "/shop/gift-basket",
      btnText: "Gift a Fresh Hamper",
      badge: "Custom Ribbon Note",
      gradient: "from-pink-50 to-rose-50/70 border-pink-200/90",
      btnColor: "bg-rose-600 hover:bg-rose-700 text-white",
    },
  ];

  return (
    <div className="w-full bg-[#fbfdfc] py-8 sm:py-12 font-sans border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
              <Sparkles size={12} /> Specialized Farm Experiences
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
              More Than Just Groceries
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Unique farm-to-table services crafted for Bhopal food lovers & health enthusiasts
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-6 border bg-gradient-to-br ${f.gradient} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-gray-100">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-700 bg-white/90 px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
                    {f.badge}
                  </span>
                </div>

                <span className="text-xs font-bold text-gray-500 block mb-1">
                  {f.tag}
                </span>

                <h3 className="font-black text-lg text-gray-900 leading-snug mb-2">
                  {f.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                  {f.desc}
                </p>
              </div>

              <Link href={f.link}>
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${f.btnColor}`}
                >
                  <span>{f.btnText}</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
