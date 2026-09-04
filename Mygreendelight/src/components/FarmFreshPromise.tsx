"use client";

import React from "react";
import Link from "next/link";
import {
  Tractor,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";

export default function FarmFreshPromise() {
  const steps = [
    {
      step: "01",
      icon: <Tractor className="text-[#0f8646]" size={24} />,
      title: "4:00 AM Fresh Harvest",
      desc: "Seedha Bhopal ke paas ke kisano se har subah taaza todi gayi sabziyan.",
      badge: "Local Sourced",
      bg: "bg-emerald-50/60 border-emerald-100",
    },
    {
      step: "02",
      icon: <Sparkles className="text-[#0f8646]" size={24} />,
      title: "Ozone Wash & Sort",
      desc: "Zero chemical, natural cleaning aur 3-layer quality check standard.",
      badge: "100% Safe",
      bg: "bg-green-50/60 border-green-100",
    },
    {
      step: "03",
      icon: <ShieldCheck className="text-[#0f8646]" size={24} />,
      title: "Hygienic Eco-Pack",
      desc: "Breathable, hygienic packaging jo freshness ko 48 ghante tak lock rakhti hai.",
      badge: "No Plastic",
      bg: "bg-teal-50/60 border-teal-100",
    },
    {
      step: "04",
      icon: <Truck className="text-[#0f8646]" size={24} />,
      title: "Express 10-Min Delivery",
      desc: "Nearest Bhopal hub se aapke kitchen tak direct superfast delivery.",
      badge: "Bhopal Hubs",
      bg: "bg-emerald-50/60 border-emerald-100",
    },
  ];

  return (
    <div className="w-full py-8 sm:py-12 bg-gradient-to-b from-emerald-50/40 via-white to-green-50/30 border-y border-emerald-100/60 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-[#0f8646] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full mb-2 border border-emerald-200/60 shadow-2xs">
              <Leaf size={12} />
              <span>FARM TO FORK PROMISE</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
              Kisan Se Seedha Aapke Kitchen Tak
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 max-w-xl font-medium">
              MyGreenDelight ka waada: Har sabzi aur fruit 100% fresh, natural aur local farmers se directly sourced.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm group self-start md:self-auto bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-200/70 shadow-2xs"
          >
            <span>Hamari Story Jaanein</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </Link>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 sm:p-5 rounded-2xl sm:rounded-3xl border ${item.bg} shadow-2xs hover:shadow-xs transition-all relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-lg sm:text-2xl font-black text-green-200/50 select-none">
                {item.step}
              </div>

              <div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white border border-green-100 flex items-center justify-center mb-2 sm:mb-3 shadow-2xs">
                  {item.icon}
                </div>

                <span className="text-[9px] sm:text-[10px] font-black uppercase bg-white border border-green-200 text-[#0f8646] px-2 py-0.5 rounded-md inline-block mb-1">
                  {item.badge}
                </span>

                <h3 className="font-black text-xs sm:text-sm text-gray-900 mb-0.5 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[10px] sm:text-[11px] text-gray-600 leading-relaxed font-medium line-clamp-3">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="bg-gradient-to-r from-emerald-800 via-[#0f8646] to-green-800 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <HeartHandshake size={20} className="text-green-100" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-base">
                100% Quality & Freshness Guarantee
              </h4>
              <p className="text-[11px] sm:text-xs text-green-100/90 mt-0.5 leading-tight">
                Quality pasand na aaye toh delivery rider ko turant return karein — Instant Replacement / Full Refund!
              </p>
            </div>
          </div>

          <Link href="/shop" className="w-full sm:w-auto shrink-0">
            <button className="w-full sm:w-auto bg-white text-[#0f8646] hover:bg-green-50 font-black px-5 py-2 rounded-xl text-xs shadow-xs transition cursor-pointer">
              Shop Fresh Harvest
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
