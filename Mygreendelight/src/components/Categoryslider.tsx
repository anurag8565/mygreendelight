"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const defaultCategories = [
  {
    _id: "1",
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "2",
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "3",
    name: "Dairy & Eggs",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=85",
  },
  {
    _id: "4",
    name: "Exotics",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=85",
  },
];

// Aesthetic Pastel Tint Palette matching the reference design
const PASTEL_THEMES = [
  { bg: "bg-[#eafaf6]", border: "border-[#a4ede0]", hoverBg: "hover:bg-[#daf6f0]", hoverBorder: "hover:border-[#6fe2cc]" }, // Soft Cyan / Spices
  { bg: "bg-[#fdf0ec]", border: "border-[#fcd3c7]", hoverBg: "hover:bg-[#fde2d9]", hoverBorder: "hover:border-[#fab8a2]" }, // Soft Peach / Dry Fruits
  { bg: "bg-[#edf5fe]", border: "border-[#c0dcfd]", hoverBg: "hover:bg-[#dbeafd]", hoverBorder: "hover:border-[#96c3fd]" }, // Soft Sky Blue / Veggies
  { bg: "bg-[#fef0f4]", border: "border-[#fccad7]", hoverBg: "hover:bg-[#fde1e9]", hoverBorder: "hover:border-[#faaec3]" }, // Soft Blush Pink / Exotics
  { bg: "bg-[#eaf8f0]", border: "border-[#b4eed0]", hoverBg: "hover:bg-[#d6f5e1]", hoverBorder: "hover:border-[#8ae4b3]" }, // Soft Mint Green / Dals
  { bg: "bg-[#f6effe]", border: "border-[#e0c5fd]", hoverBg: "hover:bg-[#ebd8fe]", hoverBorder: "hover:border-[#c99efd]" }, // Soft Lavender / Ghee & Oils
  { bg: "bg-[#fef6e9]", border: "border-[#fde1b5]", hoverBg: "hover:bg-[#fdedd0]", hoverBorder: "hover:border-[#fccb86]" }, // Soft Honey / Dehydrated
  { bg: "bg-[#fef4ec]", border: "border-[#fdd8c0]", hoverBg: "hover:bg-[#fde7d7]", hoverBorder: "hover:border-[#fbb98e]" }, // Soft Apricot / Snacks
  { bg: "bg-[#fef0f2]", border: "border-[#fccad3]", hoverBg: "hover:bg-[#fde0e5]", hoverBorder: "hover:border-[#fbadbb]" }, // Soft Rose / Dairy
  { bg: "bg-[#f8f0fe]", border: "border-[#e9c7fd]", hoverBg: "hover:bg-[#f2dbfd]", hoverBorder: "hover:border-[#d99efd]" }, // Soft Violet / Sweeteners
  { bg: "bg-[#f4f9eb]", border: "border-[#d8eebc]", hoverBg: "hover:bg-[#e7f5d5]", hoverBorder: "hover:border-[#bde393]" }, // Soft Olive / Grains
  { bg: "bg-[#f0f2fe]", border: "border-[#c9d1fd]", hoverBg: "hover:bg-[#dee3fd]", hoverBorder: "hover:border-[#a3b1fc]" }, // Soft Periwinkle / Ready to cook
];

export default function CategorySlider({
  categories = [],
}: {
  categories?: any[];
}) {
  const router = useRouter();
  const [loadedCategories, setLoadedCategories] = useState<any[]>(
    categories.length > 0 ? categories : []
  );

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

  const activeCategories =
    loadedCategories.length > 0 ? loadedCategories : defaultCategories;

  return (
    <div className="w-full py-3 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-green-100 text-[#0f8646] flex items-center justify-center font-black text-xs">
              🌿
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                Sunrise farm-harvested veggies, fruits & daily staples
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>Explore All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* Categories Pastel Squircle Grid (Matching Reference Screenshot) */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {activeCategories.map((item, idx) => {
            const theme = PASTEL_THEMES[idx % PASTEL_THEMES.length];

            return (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(item.name)}`)
                }
                className={`flex flex-col items-center justify-between ${theme.bg} ${theme.border} ${theme.hoverBg} ${theme.hoverBorder} border-1.5 rounded-[22px] sm:rounded-3xl p-2.5 sm:p-4 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-300 group text-center aspect-[4/4.7] sm:aspect-[4/4.8]`}
              >
                {/* Clean Floating Image */}
                <div className="w-full flex-1 flex items-center justify-center pt-1">
                  <img
                    src={item.image || "/categories/vegetables.jpg"}
                    alt={item.name}
                    className="w-13 h-13 xs:w-15 xs:h-15 sm:w-18 sm:h-18 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Clean Bold Title */}
                <div className="w-full pt-1.5">
                  <h3 className="text-[10.5px] xs:text-[11px] sm:text-xs font-black text-gray-900 leading-tight group-hover:text-black transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
