"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const sampleCategories = [
  {
    _id: "cat-veg",
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🍃",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    _id: "cat-fruit",
    name: "Fruits",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🍏",
    badgeBg: "bg-green-100 text-green-700",
  },
  {
    _id: "cat-dairy",
    name: "Dairy & Staples",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🥛",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  {
    _id: "cat-exotic",
    name: "Exotics",
    image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🌿",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    _id: "cat-bev",
    name: "Beverages",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🍹",
    badgeBg: "bg-orange-100 text-orange-700",
  },
  {
    _id: "cat-snack",
    name: "Snacks & Branded",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🥨",
    badgeBg: "bg-rose-100 text-rose-700",
  },
  {
    _id: "cat-care",
    name: "Personal Care",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🧴",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  {
    _id: "cat-house",
    name: "Household",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80",
    badgeIcon: "🏠",
    badgeBg: "bg-amber-100 text-amber-700",
  },
];

export default function CategorySlider({ categories = [] }: { categories?: any[] }) {
  const router = useRouter();
  const [loadedCategories, setLoadedCategories] = useState<any[]>(
    categories.length > 0 ? categories : sampleCategories
  );

  useEffect(() => {
    if (categories.length > 0) {
      setLoadedCategories(categories);
      return;
    }

    fetch("/api/admin/category")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setLoadedCategories(data.categories);
        } else {
          setLoadedCategories(sampleCategories);
        }
      })
      .catch(() => {
        setLoadedCategories(sampleCategories);
      });
  }, [categories]);

  const activeCategories = loadedCategories.length >= 4 ? loadedCategories : sampleCategories;

  return (
    <div className="w-full py-2.5 sm:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
            Shop by Category
          </h2>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>View all</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </Link>
        </div>

        {/* 8 Categories Grid: Exactly 4 columns per row on mobile & tablet, 8 on desktop */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3.5">
          {activeCategories.slice(0, 8).map((item, idx) => {
            const fallbackMeta = sampleCategories[idx % sampleCategories.length];
            const badgeIcon = item.badgeIcon || fallbackMeta.badgeIcon || "🍃";
            const badgeBg = item.badgeBg || fallbackMeta.badgeBg || "bg-emerald-100 text-emerald-700";

            return (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/shop?category=${encodeURIComponent(item.name)}`)}
                className="flex flex-col items-center bg-[#f8f9fa] hover:bg-white border border-gray-100 hover:border-[#0f8646] rounded-2xl p-2 sm:p-3 cursor-pointer shadow-2xs hover:shadow-md transition-all group text-center"
              >
                {/* Image Container with Floating Bottom Badge */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-1.5 flex items-center justify-center p-1 bg-white/60">
                  <img
                    src={item.image || fallbackMeta.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                  {/* Floating Icon Badge at Bottom Center */}
                  <div
                    className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full ${badgeBg} border-2 border-white flex items-center justify-center text-[10px] sm:text-xs shadow-xs`}
                  >
                    {badgeIcon}
                  </div>
                </div>

                {/* Category Name */}
                <h3 className="text-[10.5px] sm:text-xs font-black text-gray-800 leading-tight group-hover:text-[#0f8646] transition-colors line-clamp-1 mt-0.5">
                  {item.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
