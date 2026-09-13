"use client";

import React from "react";
import { Zap, Clock, ShieldCheck, RefreshCw, Leaf, Sparkles } from "lucide-react";

export default function TrustRibbon() {
  const highlights = [
    {
      icon: <Zap size={14} className="text-emerald-700" />,
      title: "10-15 Min Delivery",
      subtitle: "Express in Bhopal",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
    {
      icon: <Clock size={14} className="text-emerald-700" />,
      title: "5:00 AM Mandi Fresh",
      subtitle: "Daily Morning Harvest",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
    {
      icon: <ShieldCheck size={14} className="text-emerald-700" />,
      title: "100% Hand-Graded",
      subtitle: "A-Grade Freshness",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
    {
      icon: <RefreshCw size={14} className="text-emerald-700" />,
      title: "Instant Replacement",
      subtitle: "No Questions Asked",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
    {
      icon: <Leaf size={14} className="text-[#0c831f]" />,
      title: "Direct Kisan Sourced",
      subtitle: "Zero Middleman Markup",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
    {
      icon: <Sparkles size={14} className="text-emerald-700" />,
      title: "Eco Kraft Packaging",
      subtitle: "Breathable Freshness",
      bg: "bg-emerald-50/80 border-emerald-200/70 text-emerald-950",
    },
  ];

  return (
    <div className="w-full bg-[#f5f6f5] py-2.5 sm:py-3 font-sans border-b border-gray-200/60 overflow-hidden relative select-none">
      {/* Subtle edge fades for luxury aesthetic */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#f5f6f5] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#f5f6f5] to-transparent z-10 pointer-events-none" />

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
