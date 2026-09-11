"use client";

import React from "react";
import { Zap, Clock, ShieldCheck, RefreshCw, Leaf, Sparkles } from "lucide-react";

export default function TrustRibbon() {
  const highlights = [
    {
      icon: <Zap size={14} className="text-amber-500 fill-amber-500" />,
      title: "10-15 Min Delivery",
      subtitle: "Express in Bhopal",
      bg: "bg-amber-50/70 border-amber-200/60 text-amber-950",
    },
    {
      icon: <Clock size={14} className="text-emerald-600" />,
      title: "5:00 AM Mandi Fresh",
      subtitle: "Daily Morning Harvest",
      bg: "bg-emerald-50/70 border-emerald-200/60 text-emerald-950",
    },
    {
      icon: <ShieldCheck size={14} className="text-teal-600" />,
      title: "100% Hand-Graded",
      subtitle: "A-Grade Freshness",
      bg: "bg-teal-50/70 border-teal-200/60 text-teal-950",
    },
    {
      icon: <RefreshCw size={14} className="text-blue-600" />,
      title: "Instant Replacement",
      subtitle: "No Questions Asked",
      bg: "bg-blue-50/70 border-blue-200/60 text-blue-950",
    },
    {
      icon: <Leaf size={14} className="text-[#0c831f]" />,
      title: "Direct Kisan Sourced",
      subtitle: "Zero Middleman Markup",
      bg: "bg-green-50/70 border-green-200/60 text-green-950",
    },
    {
      icon: <Sparkles size={14} className="text-purple-600" />,
      title: "Eco Kraft Packaging",
      subtitle: "Breathable Freshness",
      bg: "bg-purple-50/70 border-purple-200/60 text-purple-950",
    },
  ];

  return (
    <div className="w-full bg-white py-2.5 sm:py-3 font-sans border-b border-gray-100 overflow-hidden relative select-none">
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
