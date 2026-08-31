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
      icon: <Tractor className="text-[#0f8646]" size={28} />,
      title: "4:00 AM Fresh Harvest",
      desc: "Seedha Bhopal ke paas ke kisano se har subah taaza todi gayi sabziyan.",
      badge: "Local Sourced",
      bg: "bg-emerald-50/60 border-emerald-100",
    },
    {
      step: "02",
      icon: <Sparkles className="text-[#0f8646]" size={28} />,
      title: "Ozone Wash & Sort",
      desc: "Zero chemical, natural cleaning aur 3-layer quality check standard.",
      badge: "100% Safe",
      bg: "bg-green-50/60 border-green-100",
    },
    {
      step: "03",
      icon: <ShieldCheck className="text-[#0f8646]" size={28} />,
      title: "Hygienic Eco-Pack",
      desc: "Breathable, hygienic packaging jo freshness ko 48 ghante tak lock rakhti hai.",
      badge: "No Plastic",
      bg: "bg-teal-50/60 border-teal-100",
    },
    {
      step: "04",
      icon: <Truck className="text-[#0f8646]" size={28} />,
      title: "Express 10-Min Delivery",
      desc: "Nearest Bhopal hub se aapke kitchen tak direct superfast delivery.",
      badge: "Bhopal Hubs",
      bg: "bg-emerald-50/60 border-emerald-100",
    },
  ];

  return (
    <div className="w-full py-12 bg-gradient-to-b from-green-50/40 via-white to-green-50/30 border-y border-green-100/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-green-100 text-[#0f8646] text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Leaf size={14} />
              <span>FARM TO FORK PROMISE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              Kisan Se Seedha Aapke Kitchen Tak
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
              MyGreenDelight ka waada: Har sabzi aur fruit 100% fresh, natural aur local farmers se directly sourced.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs sm:text-sm group self-start md:self-auto"
          >
            <span>Hamari Story Jaanein</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border ${item.bg} shadow-xs hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-3xl font-black text-green-200/50 select-none">
                {item.step}
              </div>

              <div>
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-green-100 flex items-center justify-center mb-2.5 sm:mb-4 shadow-xs">
                  {item.icon}
                </div>

                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase bg-white border border-green-200 text-[#0f8646] px-2 py-0.5 rounded-full inline-block mb-1.5">
                  {item.badge}
                </span>

                <h3 className="font-black text-xs sm:text-base text-gray-900 mb-1 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-medium line-clamp-3">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="bg-[#0f8646] text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <HeartHandshake size={22} className="text-green-100" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">
                100% Quality & Freshness Guarantee
              </h4>
              <p className="text-xs text-green-100 mt-0.5">
                Quality pasand na aaye toh delivery boy ko turant return karein — Instant Replacement / Full Refund!
              </p>
            </div>
          </div>

          <Link href="/shop">
            <button className="bg-white text-[#0f8646] hover:bg-green-50 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition shrink-0">
              Shop Fresh Harvest
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
