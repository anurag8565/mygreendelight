"use client";

import React from "react";
import { Zap, Clock, ShieldCheck, RotateCcw, Leaf, Sparkles } from "lucide-react";

export default function TrustRibbon() {
  const highlights = [
    {
      icon: <Zap size={14} className="text-amber-700 stroke-[2.2]" />,
      title: "10-15 Min Delivery",
      subtitle: "To your doorstep in Bhopal",
      bg: "bg-amber-50/80 border-amber-200/70 text-amber-950",
    },
    {
      icon: <Clock size={14} className="text-[#0a3d24] stroke-[2.2]" />,
      title: "Harvested Daily",
      subtitle: "Direct from local farms",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
    {
      icon: <ShieldCheck size={14} className="text-[#0a3d24] stroke-[2.2]" />,
      title: "Handpicked Quality",
      subtitle: "Triple-checked & cleaned",
      bg: "bg-stone-50 border-stone-200/80 text-stone-900",
    },
    {
      icon: <RotateCcw size={14} className="text-amber-700 stroke-[2.2]" />,
      title: "100% Fresh Guarantee",
      subtitle: "Instant return or replace",
      bg: "bg-amber-50/80 border-amber-200/70 text-amber-950",
    },
    {
      icon: <Leaf size={14} className="text-[#0a3d24] stroke-[2.2]" />,
      title: "Best Store Prices",
      subtitle: "Zero middleman markup",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
    {
      icon: <Sparkles size={14} className="text-[#0a3d24] stroke-[2.2]" />,
      title: "Safe & Clean Packing",
      subtitle: "Hygienic eco kraft bags",
      bg: "bg-stone-50 border-stone-200/80 text-stone-900",
    },
  ];

  return (
    <div className="w-full bg-white py-3 font-sans border-b border-stone-200/70 overflow-hidden relative select-none">
      {/* Subtle edge fades for luxury aesthetic */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Smooth Continuous Marquee Row */}
      <div className="animate-marquee flex items-center gap-3 sm:gap-4 py-0.5">
        {/* Set 1 */}
        {highlights.map((h, i) => (
          <div
            key={`h1-${i}`}
            className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl border ${h.bg} shadow-2xs shrink-0 cursor-default transition-transform hover:scale-102`}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              {h.icon}
            </div>
            <div className="whitespace-nowrap">
              <span className="text-[11px] sm:text-xs font-black block leading-tight">
                {h.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium block leading-tight">
                {h.subtitle}
              </span>
            </div>
          </div>
        ))}

        {/* Set 2 (Duplicate for Seamless Loop) */}
        {highlights.map((h, i) => (
          <div
            key={`h2-${i}`}
            className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl border ${h.bg} shadow-2xs shrink-0 cursor-default transition-transform hover:scale-102`}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              {h.icon}
            </div>
            <div className="whitespace-nowrap">
              <span className="text-[11px] sm:text-xs font-black block leading-tight">
                {h.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium block leading-tight">
                {h.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
