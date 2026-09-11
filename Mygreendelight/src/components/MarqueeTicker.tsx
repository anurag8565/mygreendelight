"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Zap, Leaf, Truck, ShieldCheck, Star } from "lucide-react";

export default function MarqueeTicker() {
  const tickerItems = [
    {
      icon: <Zap size={13} className="text-amber-600 fill-amber-500" />,
      text: "10-15 Min Express Delivery Across Bhopal",
      href: "/shipping-policy",
    },
    {
      icon: <Leaf size={13} className="text-[#14532D]" />,
      text: "Harvested at 5:00 AM Sunrise • Direct MP Kisan",
      href: "/about",
    },
    {
      icon: <ShieldCheck size={13} className="text-teal-700" />,
      text: "Triple Quality Inspected • 100% Purity Guarantee",
      href: "/about",
    },
    {
      icon: <Truck size={13} className="text-emerald-700" />,
      text: "Zero Delivery Fee on Orders Above ₹149",
      href: "/offers",
    },
    {
      icon: <Sparkles size={13} className="text-amber-600" />,
      text: "Daily Lucky Scratch Card • Win Up to ₹100",
      href: "/offers",
    },
    {
      icon: <Star size={13} className="text-amber-500 fill-amber-400" />,
      text: "Rated 4.9/5 by 5,000+ Happy Bhopal Families",
      href: "/about",
    },
  ];

  // Repeat for continuous seamless loop
  const loopItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-[#F5EFE6] text-[#1C1917] py-2.5 sm:py-3 border-y border-[#E6DEC8] overflow-hidden relative select-none">
      {/* Soft fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#F5EFE6] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#F5EFE6] to-transparent z-10" />

      {/* Infinite scrolling track */}
      <div className="animate-marquee flex items-center gap-8 sm:gap-12">
        {loopItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-2.5 shrink-0 group hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded-full bg-white/90 border border-[#E6DEC8] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="text-xs sm:text-[12.5px] font-bold text-[#292524] tracking-wide whitespace-nowrap">
              {item.text}
            </span>
            <span className="text-[#A89F91] text-xs ml-4 select-none">
              ✦
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

