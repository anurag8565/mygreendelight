"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CategorySlider() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/category");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const defaultCategories = [
    { _id: "1", name: "Vegetables", image: "/categories/vegetables.jpg" },
    { _id: "2", name: "Fresh Fruits", image: "/categories/fruits.jpg" },
    { _id: "3", name: "Dairy & Bakery", image: "/categories/exotic.jpg" },
    { _id: "4", name: "Staples & Atta", image: "/categories/vegetables.jpg" },
    { _id: "5", name: "Snacks & Munchies", image: "/categories/fruits.jpg" },
    { _id: "6", name: "Beverages", image: "/categories/exotic.jpg" },
    { _id: "7", name: "Household Care", image: "/categories/vegetables.jpg" },
  ];

  const activeCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="w-full py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fresh produce & pantry essentials sorted for you
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs sm:text-sm flex items-center gap-1 group transition"
          >
            <span>View All</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards with Smooth Motion Lift (4 columns on mobile, 7 on desktop) */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
          {activeCategories.slice(0, 8).map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/shop?category=${encodeURIComponent(item.name)}`)}
              className="flex flex-col items-center bg-white border border-gray-100 hover:border-[#0f8646] rounded-2xl p-2 sm:p-3 cursor-pointer shadow-2xs hover:shadow-md transition-all group text-center"
            >
              {/* Clean Frame */}
              <div className="w-full aspect-square rounded-xl bg-gray-50/90 border border-gray-100/80 overflow-hidden mb-1.5 sm:mb-2 p-1.5 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain rounded-lg group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[10px] sm:text-xs font-bold text-gray-800 text-center leading-tight group-hover:text-[#0f8646] transition-colors line-clamp-2">
                {item.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}