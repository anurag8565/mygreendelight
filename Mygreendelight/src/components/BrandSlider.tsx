"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

export default function BrandSlider() {
  const brands = [
    {
      name: "Amul",
      tagline: "Dairy & Butter",
      discount: "Upto 20% OFF",
      initial: "A",
      theme: "border-blue-200 bg-blue-50/60 text-blue-800",
      pill: "bg-blue-600 text-white",
    },
    {
      name: "Mother Dairy",
      tagline: "Milk & Curd",
      discount: "Upto 15% OFF",
      initial: "MD",
      theme: "border-sky-200 bg-sky-50/60 text-sky-800",
      pill: "bg-sky-600 text-white",
    },
    {
      name: "Haldiram's",
      tagline: "Snacks & Sweets",
      discount: "Upto 25% OFF",
      initial: "H",
      theme: "border-amber-200 bg-amber-50/60 text-amber-800",
      pill: "bg-amber-600 text-white",
    },
    {
      name: "Fortune",
      tagline: "Oils & Grains",
      discount: "Upto 30% OFF",
      initial: "F",
      theme: "border-yellow-200 bg-yellow-50/60 text-yellow-800",
      pill: "bg-yellow-600 text-white",
    },
    {
      name: "Aashirvaad",
      tagline: "Atta & Spices",
      discount: "Upto 20% OFF",
      initial: "AV",
      theme: "border-orange-200 bg-orange-50/60 text-orange-800",
      pill: "bg-orange-600 text-white",
    },
    {
      name: "Tata Sampann",
      tagline: "Pulses & Poha",
      discount: "Upto 18% OFF",
      initial: "TS",
      theme: "border-emerald-200 bg-emerald-50/60 text-emerald-800",
      pill: "bg-emerald-600 text-white",
    },
    {
      name: "Dabur",
      tagline: "Honey & Juices",
      discount: "Upto 25% OFF",
      initial: "D",
      theme: "border-red-200 bg-red-50/60 text-red-800",
      pill: "bg-red-600 text-white",
    },
    {
      name: "Nestle",
      tagline: "Maggi & Coffee",
      discount: "Upto 15% OFF",
      initial: "N",
      theme: "border-rose-200 bg-rose-50/60 text-rose-800",
      pill: "bg-rose-600 text-white",
    },
  ];

  return (
    <div className="w-full py-10 bg-[#f9fbf9] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-[#0f8646]">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Top Grocery Brands
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Authentic products sourced directly from manufacturers
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs sm:text-sm flex items-center gap-1 group transition"
          >
            <span>All Brands</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {brands.map((brand, i) => (
            <Link
              key={i}
              href={`/shop?search=${encodeURIComponent(brand.name)}`}
              className={`p-4 rounded-2xl border ${brand.theme} shadow-2xs hover:shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-between group cursor-pointer bg-white`}
            >
              {/* Stylized Brand Initials Badge */}
              <div
                className={`w-12 h-12 rounded-2xl ${brand.pill} flex items-center justify-center font-black text-base shadow-sm mb-3 group-hover:scale-105 transition-transform`}
              >
                {brand.initial}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                  {brand.name}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{brand.tagline}</p>
              </div>

              <span className="mt-3 bg-green-50 text-[#0f8646] border border-green-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                {brand.discount}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
