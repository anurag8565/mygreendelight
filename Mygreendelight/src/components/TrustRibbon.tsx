"use client";

import React from "react";
import { Zap, Sparkles, ShieldCheck, RefreshCw } from "lucide-react";

export default function TrustRibbon() {
  const highlights = [
    {
      icon: <Zap size={15} className="text-amber-500 fill-amber-500" />,
      title: "10-15 Min Delivery",
      subtitle: "Express in Bhopal",
      bg: "bg-amber-50/70 border-amber-200/60 text-amber-950",
    },
    {
      icon: <Sparkles size={15} className="text-emerald-600 fill-emerald-600" />,
      title: "5:00 AM Harvested",
      subtitle: "Direct Kisan Mandi",
      bg: "bg-emerald-50/70 border-emerald-200/60 text-emerald-950",
    },
    {
      icon: <ShieldCheck size={15} className="text-teal-600" />,
      title: "100% Ozone Washed",
      subtitle: "Pesticide & Dirt Free",
      bg: "bg-teal-50/70 border-teal-200/60 text-teal-950",
    },
    {
      icon: <RefreshCw size={15} className="text-blue-600" />,
      title: "Zero-Risk Return",
      subtitle: "Instant Replacement",
      bg: "bg-blue-50/70 border-blue-200/60 text-blue-950",
    },
  ];

  return (
    <div className="w-full bg-white py-2 sm:py-3 font-sans border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {highlights.map((h, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border ${h.bg} shadow-2xs shrink-0 select-none min-w-[135px] sm:min-w-0 sm:flex-1`}
            >
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
                {h.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-black leading-tight truncate">
                  {h.title}
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight truncate">
                  {h.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
