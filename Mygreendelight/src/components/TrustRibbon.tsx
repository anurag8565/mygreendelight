"use client";

import React from "react";
import { Zap, Clock, ShieldCheck, RefreshCw } from "lucide-react";

export default function TrustRibbon() {
  const highlights = [
    {
      icon: <Zap size={14} className="text-amber-600 fill-amber-500" />,
      title: "10-15 Min Express",
      subtitle: "Doorstep in Bhopal",
      bg: "bg-[#FFFDF9] border-[#EAE4D9] text-[#1C1917]",
      accent: "bg-amber-100/70 text-amber-800",
    },
    {
      icon: <Clock size={14} className="text-[#14532D]" />,
      title: "5:00 AM Sunrise Pick",
      subtitle: "Daily Farm Harvest",
      bg: "bg-[#FFFDF9] border-[#EAE4D9] text-[#1C1917]",
      accent: "bg-emerald-100/70 text-[#14532D]",
    },
    {
      icon: <ShieldCheck size={14} className="text-teal-700" />,
      title: "100% Hand-Graded",
      subtitle: "Zero Bruised Produce",
      bg: "bg-[#FFFDF9] border-[#EAE4D9] text-[#1C1917]",
      accent: "bg-teal-100/70 text-teal-800",
    },
    {
      icon: <RefreshCw size={14} className="text-emerald-800" />,
      title: "Purity Guarantee",
      subtitle: "Instant Replacement",
      bg: "bg-[#FFFDF9] border-[#EAE4D9] text-[#1C1917]",
      accent: "bg-emerald-100/70 text-emerald-900",
    },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] py-2.5 sm:py-3.5 font-sans border-b border-[#EAE4D9]/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto scrollbar-none py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {highlights.map((h, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border ${h.bg} shadow-[0_2px_10px_rgba(26,38,20,0.03)] hover:shadow-[0_4px_16px_rgba(26,38,20,0.07)] hover:-translate-y-0.5 transition-all duration-300 shrink-0 select-none min-w-[145px] sm:min-w-0 sm:flex-1 cursor-default`}
            >
              <div className={`w-7 h-7 rounded-xl ${h.accent} flex items-center justify-center shrink-0 shadow-2xs`}>
                {h.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11.5px] sm:text-xs font-black tracking-tight text-[#1C1917] leading-tight truncate">
                  {h.title}
                </p>
                <p className="text-[9.5px] sm:text-[10.5px] text-[#78716C] font-medium leading-tight truncate mt-0.5">
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
