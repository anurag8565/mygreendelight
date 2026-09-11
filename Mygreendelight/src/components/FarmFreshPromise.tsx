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
  PhoneCall,
  Sparkles,
  MapPin,
  Clock,
  RotateCcw,
} from "lucide-react";

export default function FarmFreshPromise() {
  const steps = [
    {
      step: "01",
      icon: Tractor,
      title: "5:00 AM Harvest",
      desc: "Direct from Bhopal mandis & local farms before sunrise",
      tag: "Fresh Batch",
    },
    {
      step: "02",
      icon: CheckCircle2,
      title: "Hand-Graded Quality",
      desc: "Triple-layer quality check; zero wilted produce",
      tag: "100% Sorted",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Hygienic Bagging",
      desc: "Packed in breathable food-grade eco kraft bags",
      tag: "Safe & Clean",
    },
    {
      step: "04",
      icon: Truck,
      title: "15-25 Min Delivery",
      desc: "Dispatched direct from Bagsewaniya store to doorstep",
      tag: "Express Fleet",
    },
  ];

  return (
    <section className="w-full py-6 sm:py-8 bg-[#f8faf8] border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5">
          
          {/* Header Row: Title & Live Dispatch Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Leaf size={16} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 tracking-tight">
                  Farm to Kitchen Freshness Promise
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                  Direct Mandi wholesale pricing with 100% no-questions replacement
                </p>
              </div>
            </div>

            {/* Live Status Pill & WhatsApp Link */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0f8646] bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f8646] animate-pulse" />
                <span>Bhopal Fleet Active</span>
              </span>

              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick,%20I%20have%20a%20question%20about%20today's%20fresh%20harvest"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-gray-700 hover:text-[#0f8646] bg-gray-50 hover:bg-emerald-50/60 px-2.5 py-1 rounded-full border border-gray-200/70 transition flex items-center gap-1"
              >
                <span>Help Desk</span>
                <ArrowRight size={11} />
              </a>
            </div>
          </div>

          {/* 4 Steps Journey Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-emerald-200 transition-colors flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      {item.step}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 text-[#0f8646] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform mt-0.5">
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xs text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] sm:text-[10.5px] text-gray-500 leading-tight mt-0.5 font-medium line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust Micro-Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 font-medium">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-[#0f8646]" />
              <span>Fulfilled from SubziQuick Store, Amrai, Bagsewaniya (462043)</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              <RotateCcw size={11} />
              <span>100% Instant Replacement on damaged items</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
