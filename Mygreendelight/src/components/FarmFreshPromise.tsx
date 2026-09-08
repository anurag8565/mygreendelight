"use client";

import React from "react";
import Link from "next/link";
import {
  Tractor,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export default function FarmFreshPromise() {
  const steps = [
    {
      step: "01",
      icon: <Tractor className="text-[#0c831f]" size={18} />,
      title: "4:00 AM Harvest",
      desc: "Seedha Mandi & Kisan farm se fresh",
      badge: "Local",
    },
    {
      step: "02",
      icon: <CheckCircle2 className="text-[#0c831f]" size={18} />,
      title: "Ozone Cleaned",
      desc: "Zero chemical 3-layer purity sort",
      badge: "Pure",
    },
    {
      step: "03",
      icon: <ShieldCheck className="text-[#0c831f]" size={18} />,
      title: "Hygienic Pack",
      desc: "Breathable freshness lock packaging",
      badge: "Safe",
    },
    {
      step: "04",
      icon: <Truck className="text-[#0c831f]" size={18} />,
      title: "10-15 Min Express",
      desc: "Bagsewaniya hub se direct aapke ghar",
      badge: "Express",
    },
  ];

  return (
    <div className="w-full py-5 sm:py-8 bg-[#f8f9fa] border-y border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-[#0c831f] flex items-center justify-center shrink-0">
              <Leaf size={14} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight leading-tight">
                Farm to Fork Quality Promise
              </h2>
              <p className="text-[10.5px] sm:text-xs text-gray-500 font-medium">
                100% Organic & Bhopal Kisan Sourced
              </p>
            </div>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-[#0c831f] hover:text-[#096618] font-bold text-xs group self-start sm:self-auto bg-white px-3 py-1 rounded-full border border-gray-200/80 shadow-2xs hover:border-[#0c831f] transition"
          >
            <span>Our Story</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Compact Micro-Pill Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-white border border-gray-100/90 shadow-2xs hover:shadow-xs transition-all flex items-start gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0c831f] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-bold text-xs text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <span className="text-[8.5px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100/80">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-gray-500 leading-tight mt-0.5 font-normal truncate sm:whitespace-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

