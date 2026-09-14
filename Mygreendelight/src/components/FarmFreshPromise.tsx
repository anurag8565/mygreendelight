"use client";

import React from "react";
import {
  Tractor,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function FarmFreshPromise() {
  const steps = [
    {
      icon: Tractor,
      title: "5:00 AM Harvest",
      desc: "Direct from Bhopal mandis & local farms before sunrise. Zero cold storage.",
      tag: "Fresh Harvest",
    },
    {
      icon: CheckCircle2,
      title: "Hand-Graded Quality",
      desc: "Triple-layer inspection; 100% sorted, unblemished, and fresh greens.",
      tag: "Handpicked",
    },
    {
      icon: ShieldCheck,
      title: "Hygienic Bagging",
      desc: "Packed in breathable food-grade eco kraft bags. Zero single-use plastic.",
      tag: "Eco Safe",
    },
    {
      icon: Truck,
      title: "15-25 Min Delivery",
      desc: "Dispatched direct from Bagsewaniya dark store straight to your doorstep.",
      tag: "Fast Fleet",
    },
  ];

  return (
    <section className="w-full py-6 sm:py-8 bg-[#faf9f5] border-b border-stone-200/70 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          {/* Header Row: Title & Live Dispatch Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-800 mb-1.5">
                <Leaf size={11} className="text-emerald-700" />
                <span>Our Quality Guarantee</span>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-stone-900 tracking-tight font-heading">
                Farm to Kitchen Freshness Promise
              </h2>
              <p className="text-xs text-stone-500 font-normal mt-0.5">
                Direct Mandi wholesale pricing with 100% no-questions replacement across Bhopal
              </p>
            </div>

            {/* Live Status Pill & WhatsApp Link */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200/80 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Bhopal Fleet Active</span>
              </span>

              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick,%20I%20have%20a%20question%20about%20today's%20fresh%20harvest"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-50 px-3 py-1 rounded-full border border-stone-200/90 transition flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <FaWhatsapp className="text-[#25D366] text-xs shrink-0" />
                <span>Help Desk</span>
              </a>
            </div>
          </div>

          {/* 4 Steps Journey Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 my-4 sm:my-5">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-stone-50/50 border border-stone-200/70 hover:border-stone-300 hover:bg-white transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-stone-200/80 text-[#0a3d24] flex items-center justify-center shadow-2xs">
                      <Icon size={15} />
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-stone-900">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed mt-1 font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust Micro-Bar */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500 font-normal">
            <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
              <RotateCcw size={13} className="text-emerald-700 shrink-0" />
              <span>
                <strong>100% Instant Replacement:</strong> Not satisfied with any item? Instant replacement or refund, no questions asked.
              </span>
            </div>
            <div className="flex items-center gap-1 text-stone-400 text-[11px]">
              <MapPin size={12} className="text-stone-400 shrink-0" />
              <span>Fulfilled from Bagsewaniya Hub, Bhopal (462043)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
