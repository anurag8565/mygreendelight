"use client";

import React from "react";
import Link from "next/link";
import {
  Tractor,
  ShieldCheck,
  Truck,
  Leaf,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PackageCheck,
  SunMedium,
} from "lucide-react";

export default function FarmFreshPromise() {
  const steps = [
    {
      step: "01",
      title: "Direct Kisan Farms",
      subtitle: "Ethical Local Sourcing",
      desc: "Cultivated with natural care on verified contract farms in Sehore, Raisen & Bhopal rural belts.",
      icon: <Tractor size={18} className="text-[#14532D]" />,
      pill: "MP Kisan Network",
    },
    {
      step: "02",
      title: "5:00 AM Sunrise Pick",
      subtitle: "Peak Morning Freshness",
      desc: "Harvested in early dawn hours when crispness, natural sweetness, and moisture are at their peak.",
      icon: <SunMedium size={18} className="text-amber-700" />,
      pill: "Daily Sunrise",
    },
    {
      step: "03",
      title: "Triple Hand-Graded",
      subtitle: "Zero Bruised Produce",
      desc: "Every vegetable & fruit is hand-inspected piece by piece. Only Grade-A produce makes the cut.",
      icon: <CheckCircle2 size={18} className="text-emerald-800" />,
      pill: "Grade-A Handpicked",
    },
    {
      step: "04",
      title: "Breathable Hygiene Pack",
      subtitle: "Safe Food-Grade Storage",
      desc: "Hygienically sorted and packed into micro-vented freshness locks to prevent moisture build-up.",
      icon: <PackageCheck size={18} className="text-teal-800" />,
      pill: "100% Food-Grade",
    },
    {
      step: "05",
      title: "10-15 Min Doorstep",
      subtitle: "Express Bhopal Dispatch",
      desc: "Direct to your door with a 100% freshness guarantee. Inspect before you accept.",
      icon: <Truck size={18} className="text-[#14532D]" />,
      pill: "Bhopal Hyperlocal",
    },
  ];

  return (
    <section className="w-full py-10 sm:py-14 bg-[#FAF8F5] border-t border-[#EAE4D9] font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100/70 text-[#14532D] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2.5 border border-emerald-200/60 shadow-2xs">
              <Sparkles size={11} className="text-amber-600 fill-amber-600" />
              <span>The SubziQuick Quality Promise</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1C1917] tracking-tight leading-tight">
              From Local Bhopal Farms to Your Family Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] font-medium mt-1.5 leading-relaxed">
              Every item we deliver follows a disciplined morning journey — valuing natural freshness, farmer dignity, and zero compromises on what feeds your family.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F9F7F2] text-[#14532D] border border-[#EAE4D9] hover:border-[#14532D]/40 px-4 py-2.5 rounded-full font-black text-xs shadow-2xs transition group self-start md:self-auto"
          >
            <span>Read Our Full Story</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </Link>
        </div>

        {/* 5-Step Storytelling Journey Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#EAE4D9] shadow-[0_4px_16px_rgba(26,38,20,0.03)] hover:shadow-[0_8px_24px_rgba(26,38,20,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Subtle Step Index Watermark */}
              <span className="absolute top-2 right-3 text-3xl sm:text-4xl font-black text-[#F2ECE1] select-none pointer-events-none group-hover:text-emerald-100/70 transition-colors">
                {item.step}
              </span>

              <div>
                {/* Icon Circle */}
                <div className="w-10 h-10 rounded-2xl bg-[#F7F4EE] group-hover:bg-emerald-50 text-[#14532D] flex items-center justify-center mb-3 shadow-2xs transition-colors border border-[#EAE4D9]/60">
                  {item.icon}
                </div>

                <span className="inline-block text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 mb-1.5">
                  {item.pill}
                </span>

                <h3 className="font-black text-xs sm:text-sm text-[#1C1917] group-hover:text-[#14532D] transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10.5px] sm:text-[11px] font-semibold text-emerald-900/70 mt-0.5 mb-2">
                  {item.subtitle}
                </p>

                <p className="text-[11px] text-[#78716C] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Micro Check */}
              <div className="mt-3.5 pt-2.5 border-t border-[#F2ECE1] flex items-center gap-1.5 text-[10px] font-black text-[#14532D]">
                <CheckCircle2 size={12} className="text-emerald-700 shrink-0" />
                <span>Verified Fresh</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Purity Trust Strip */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-[#EAE4D9] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-[#14532D] flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-[#1C1917]">
                Doorstep Quality Inspection Guarantee
              </p>
              <p className="text-[10.5px] text-[#78716C]">
                Check every piece when the delivery partner arrives. Instant UPI refund or exchange if anything is bruised.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#14532D] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full shrink-0">
            ✓ 100% Purity Guaranteed
          </span>
        </div>

      </div>
    </section>
  );
}

