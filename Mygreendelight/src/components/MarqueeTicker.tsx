"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Leaf,
  ShieldCheck,
  Clock,
  Gift,
  MapPin,
  Star,
  Truck,
} from "lucide-react";

export default function MarqueeTicker() {
  const tickerItems = [
    {
      icon: <Zap size={13} className="text-amber-300 fill-amber-300" />,
      tag: "SPEED",
      title: "10-15 Min Superfast Delivery",
      subtitle: "Across Bhopal",
      href: "/shipping-policy",
    },
    {
      icon: <Leaf size={13} className="text-emerald-300" />,
      tag: "5:00 AM HARVEST",
      title: "100% Farm Fresh Everyday",
      subtitle: "Direct MP Kisan",
      href: "/about",
    },
    {
      icon: <ShieldCheck size={13} className="text-emerald-400" />,
      tag: "GRADE-A",
      title: "Triple Quality Checked",
      subtitle: "Hand-Graded Purity",
      href: "/about",
    },
    {
      icon: <Truck size={13} className="text-amber-300" />,
      tag: "FREE SHIPPING",
      title: "Zero Delivery Fee",
      subtitle: "On Orders Above ₹149",
      href: "/offers",
    },
    {
      icon: <Gift size={13} className="text-pink-300" />,
      tag: "DAILY REWARDS",
      title: "Free Lucky Scratch Card",
      subtitle: "Win up to ₹100",
      href: "/offers",
    },
    {
      icon: <Clock size={13} className="text-cyan-300" />,
      tag: "DISPATCH",
      title: "6:00 AM – 10:00 PM",
      subtitle: "Daily Live Service",
      href: "/contact",
    },
    {
      icon: <MapPin size={13} className="text-emerald-300" />,
      tag: "BHOPAL",
      title: "Arera • MP Nagar • Kolar • Bagsewaniya",
      subtitle: "and 20+ Localities",
      href: "/shipping-policy",
    },
    {
      icon: <Star size={13} className="text-amber-300 fill-amber-300" />,
      tag: "4.9/5 RATED",
      title: "Loved by 5,000+ Happy Families",
      subtitle: "In Bhopal",
      href: "/about",
    },
  ];

  // Duplicate items to create an endless smooth loop
  const loopItems = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-gradient-to-r from-[#032313] via-[#0a4222] to-[#032313] text-white py-2.5 sm:py-3 border-y border-emerald-800/50 overflow-hidden relative select-none shadow-sm">
      {/* Left/Right Subtle Fade Masks for Premium Look */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#032313] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#032313] to-transparent z-10" />

      {/* Infinite Scrolling Track */}
      <div className="animate-marquee flex items-center gap-6 sm:gap-10">
        {loopItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 hover:opacity-90 transition-opacity"
          >
            {/* Icon Pill */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            {/* Tag Badge */}
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 shrink-0">
              {item.tag}
            </span>

            {/* Main Label */}
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-200 transition-colors whitespace-nowrap">
              {item.title}
            </span>

            {/* Subtitle / Context */}
            <span className="text-[11px] sm:text-xs text-emerald-200/60 font-medium whitespace-nowrap hidden sm:inline">
              ({item.subtitle})
            </span>

            {/* Separator Dot */}
            <span className="text-emerald-400/40 text-xs ml-2 sm:ml-4 select-none">
              ✦
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
