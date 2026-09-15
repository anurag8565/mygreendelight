"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";

// Gentle synthesized luxury UI tap sound
const playTapSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore audio permission or hardware limits safely
  }
};

interface CategoryConfig {
  id: string;
  title: string;
  hindi: string;
  tag: string;
  tagBg: string;
  cardBg: string;
  borderHover: string;
  imgUrl: string;
  path: string;
}

const CATEGORY_CARDS: CategoryConfig[] = [
  {
    id: "vegetables",
    title: "Vegetables",
    hindi: "ताज़ी सब्जियां",
    tag: "Daily Farm Fresh",
    tagBg: "bg-emerald-100 text-[#0a3d24]",
    cardBg: "from-emerald-50/90 via-emerald-50/40 to-stone-50 border-emerald-200/90",
    borderHover: "hover:border-[#0a3d24] hover:shadow-[0_8px_24px_rgba(10,61,36,0.12)]",
    imgUrl: "/categories/vegetables_4k.jpg?v=4",
    path: "Vegetables",
  },
  {
    id: "fruits",
    title: "Fresh Fruits",
    hindi: "मीठे रसीले फल",
    tag: "Sweet & Juicy",
    tagBg: "bg-amber-100 text-amber-900",
    cardBg: "from-amber-50/90 via-amber-50/40 to-stone-50 border-amber-200/90",
    borderHover: "hover:border-amber-500 hover:shadow-[0_8px_24px_rgba(245,158,11,0.14)]",
    imgUrl: "/categories/fruits_4k.jpg?v=4",
    path: "Fruits",
  },
  {
    id: "exotics",
    title: "Exotics & Salads",
    hindi: "विदेशी व सलाद",
    tag: "Hydroponic & Clean",
    tagBg: "bg-teal-100 text-teal-900",
    cardBg: "from-teal-50/90 via-teal-50/40 to-stone-50 border-teal-200/90",
    borderHover: "hover:border-teal-600 hover:shadow-[0_8px_24px_rgba(13,148,136,0.12)]",
    imgUrl: "/categories/exotics_4k.jpg?v=4",
    path: "Exotics",
  },
  {
    id: "combos",
    title: "Value Combos",
    hindi: "सुपर सेवर कॉम्बो",
    tag: "Save Up to 25%",
    tagBg: "bg-yellow-100 text-yellow-900",
    cardBg: "from-yellow-50/90 via-amber-50/40 to-stone-50 border-yellow-300/90",
    borderHover: "hover:border-amber-600 hover:shadow-[0_8px_24px_rgba(217,119,6,0.14)]",
    imgUrl: "/categories/combos_4k.jpg?v=4",
    path: "Combos",
  },
];

export default function CategorySlider({
  categories = [],
}: {
  categories?: any[];
}) {
  const router = useRouter();
  const [tappedKey, setTappedKey] = useState<string | null>(null);

  const handleCategoryTap = (id: string, path: string) => {
    setTappedKey(id);
    triggerHaptic("medium");
    playTapSound();

    setTimeout(() => {
      router.push(`/shop?category=${encodeURIComponent(path)}`);
    }, 130);
  };

  return (
    <section className="w-full py-4 sm:py-6 bg-white font-sans border-b border-stone-200/70 select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-[#0a3d24] shrink-0" />
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-stone-900 tracking-tight font-heading">
              Explore Fresh Categories
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-[#0a3d24] hover:text-[#072a18] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition"
          >
            <span>View All</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]"
            />
          </Link>
        </div>

        {/* 🖥️ DESKTOP & TABLET: 4 Full-Width Premium Category Banner Cards (Fills 100% Width Perfectly) */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-5 w-full">
          {CATEGORY_CARDS.map((cat, idx) => {
            const isTapped = tappedKey === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCategoryTap(cat.id, cat.path)}
                className={`group cursor-pointer rounded-2xl lg:rounded-3xl p-4 bg-gradient-to-br ${cat.cardBg} border transition-all duration-300 flex items-center justify-between gap-3 shadow-2xs ${cat.borderHover} ${
                  isTapped ? "scale-95 ring-2 ring-[#0a3d24]" : ""
                }`}
              >
                {/* Left: Metadata & Typography */}
                <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <span
                      className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5 ${cat.tagBg}`}
                    >
                      {cat.tag}
                    </span>
                    <h3 className="font-extrabold text-sm lg:text-base text-stone-900 tracking-tight leading-tight group-hover:text-[#0a3d24] transition-colors font-heading truncate">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-semibold leading-tight mt-0.5 truncate">
                      {cat.hindi}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0a3d24] group-hover:translate-x-1 transition-transform">
                    <span>Shop Now</span>
                    <ArrowRight size={11} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* Right: High-Resolution 4K Image Container */}
                <div className="relative shrink-0 w-18 h-18 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-white/80 p-1 border border-white shadow-2xs group-hover:shadow-md transition-all">
                  <img
                    src={cat.imgUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e: any) => {
                      e.target.src = "/categories/vegetables_4k.jpg?v=4";
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 📱 MOBILE: 4 Evenly-Distributed Story Circles (Edge-to-Edge Balanced Across Screen) */}
        <div className="grid grid-cols-4 gap-1.5 xs:gap-2.5 w-full justify-items-center md:hidden">
          {CATEGORY_CARDS.map((cat, idx) => {
            const isTapped = tappedKey === cat.id;

            return (
              <motion.div
                key={`mobile-${cat.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: isTapped ? 0.92 : 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => handleCategoryTap(cat.id, cat.path)}
                className="group cursor-pointer flex flex-col items-center text-center select-none w-full max-w-[84px] relative"
              >
                {/* Glowing Avatar Ring */}
                <div
                  className={`relative p-0.5 rounded-full transition-all duration-300 ${
                    isTapped
                      ? "ring-3 ring-emerald-500 ring-offset-2 ring-offset-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105 bg-emerald-500"
                      : cat.id === "combos"
                      ? "bg-gradient-to-tr from-amber-500 via-emerald-500 to-[#0a3d24] shadow-[0_4px_16px_rgba(217,119,6,0.2)]"
                      : "bg-gradient-to-tr from-[#0a3d24] via-emerald-500 to-amber-400 shadow-[0_4px_16px_rgba(10,61,36,0.15)]"
                  }`}
                >
                  <div className="w-15 h-15 xs:w-17 xs:h-17 rounded-full overflow-hidden bg-white p-0.5 ring-1 ring-white">
                    <div className="w-full h-full rounded-full overflow-hidden bg-stone-50 relative">
                      <img
                        src={cat.imgUrl}
                        alt={cat.title}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isTapped ? "scale-115" : "group-hover:scale-108"
                        }`}
                        loading="lazy"
                        onError={(e: any) => {
                          e.target.src = "/categories/vegetables_4k.jpg?v=4";
                        }}
                      />
                    </div>
                  </div>

                  {isTapped && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-md border border-white"
                    >
                      <Sparkles size={9} className="stroke-[3]" />
                    </motion.div>
                  )}
                </div>

                {/* Typography: Category Name */}
                <div className="mt-1.5 flex flex-col items-center w-full px-0.5">
                  <span
                    className={`font-extrabold text-[10.5px] xs:text-[11.5px] tracking-tight leading-tight truncate w-full transition-colors ${
                      isTapped
                        ? "text-emerald-700 font-black"
                        : "text-stone-900 group-hover:text-[#0a3d24]"
                    }`}
                  >
                    {cat.title}
                  </span>
                  <span className="text-[9px] text-stone-500 font-semibold tracking-tight mt-0.5 truncate w-full hidden xs:block">
                    {cat.hindi}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
