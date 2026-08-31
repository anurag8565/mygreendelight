"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const defaultCategories = [
  { _id: "1", name: "Vegetables", image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=85", color: "bg-emerald-50 border-emerald-200" },
  { _id: "2", name: "Fruits", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=85", color: "bg-amber-50 border-amber-200" },
  { _id: "3", name: "Dairy & Staples", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=85", color: "bg-blue-50 border-blue-200" },
  { _id: "4", name: "Exotics", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=85", color: "bg-purple-50 border-purple-200" },
];

export default function CategorySlider({ categories = [] }: { categories?: any[] }) {
  const router = useRouter();
  const [loadedCategories, setLoadedCategories] = useState<any[]>(categories.length > 0 ? categories : []);

  useEffect(() => {
    if (categories.length > 0) {
      setLoadedCategories(categories);
      return;
    }

    // Client fallback only if not provided by server
    fetch("/api/admin/category")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setLoadedCategories(data.categories);
        } else {
          setLoadedCategories(defaultCategories);
        }
      })
      .catch(() => {
        setLoadedCategories(defaultCategories);
      });
  }, [categories]);

  const activeCategories = loadedCategories.length > 0 ? loadedCategories : defaultCategories;

  return (
    <div className="w-full py-3.5 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-green-100 text-[#0f8646] flex items-center justify-center font-black">
              🌿
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Sunrise farm-harvested veggies & pantry essentials
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>Explore All</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (Mobile: 4 per row or horizontal scroll, Desktop: 7-8 per row) */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3.5">
          {activeCategories.slice(0, 8).map((item, idx) => (
            <motion.div
              key={item._id || idx}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/shop?category=${encodeURIComponent(item.name)}`)}
              className="flex flex-col items-center bg-gray-50/70 hover:bg-green-50/60 border border-gray-200/80 hover:border-[#0f8646] rounded-2xl p-2 sm:p-3 cursor-pointer shadow-2xs hover:shadow-sm transition-all group text-center"
            >
              {/* Image Frame */}
              <div className="w-14 h-14 sm:w-20 sm:h-20 aspect-square rounded-xl bg-white border border-gray-100/90 overflow-hidden mb-1.5 p-1.5 flex items-center justify-center shadow-2xs">
                <img
                  src={item.image || "/categories/vegetables.jpg"}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="text-[11px] sm:text-xs font-black text-gray-800 leading-tight group-hover:text-[#0f8646] transition-colors line-clamp-1">
                {item.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
