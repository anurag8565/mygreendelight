"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, Sparkles, ArrowRight, Tag, ShieldCheck, Zap, Truck } from "lucide-react";
import axios from "axios";

export default function PromoBanners({ banners = [] }: { banners?: any[] }) {
  const sanitizeText = (txt: string, fallback: string) => {
    if (!txt) return fallback;
    if (txt.includes("BHOPAL20") || txt.includes("Use Code")) return fallback;
    return txt;
  };

  const rawB1 = banners[0];
  const rawB2 = banners[1];

  const b1 = {
    title: sanitizeText(rawB1?.title, "Sunrise Farm Fresh Produce"),
    subtitle: sanitizeText(rawB1?.subtitle, "100% Pesticide-Free Local Bhopal Farms"),
    image: rawB1?.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=85",
    btnText: sanitizeText(rawB1?.btnText, "Shop Fresh Produce"),
    link: rawB1?.link || "/shop",
  };

  const b2 = {
    title: sanitizeText(rawB2?.title, "Same-Day Mandi Fresh Delivery"),
    subtitle: sanitizeText(rawB2?.subtitle, "Freshly Harvested To Your Doorstep"),
    image: rawB2?.image || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=85",
    btnText: sanitizeText(rawB2?.btnText, "Order Fresh Now"),
    link: rawB2?.link || "/shop",
  };

  return (
    <div className="w-full py-8 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Banner 1: Farm Fresh Produce */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#042412] via-[#094723] to-[#0f8646] min-h-[200px] sm:min-h-[220px] flex items-center justify-between shadow-md hover:shadow-lg transition-all group p-5 sm:p-8 border border-emerald-500/20">
          <div className="relative z-10 flex flex-col items-start max-w-xs">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-green-100 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2.5 border border-white/20">
              <Sparkles size={12} className="text-yellow-300" /> Bhopal Farm Produce
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5">
              {b1.title} <br />
              <span className="text-emerald-200 text-base sm:text-lg font-extrabold">{b1.subtitle}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-100/85 mb-4 leading-relaxed font-medium">
              Handpicked directly from local Bhopal & Sehore farmers. 100% pure guarantee.
            </p>
            <Link href={b1.link}>
              <button className="bg-white hover:bg-emerald-50 text-[#0f8646] font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                <span>{b1.btnText}</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          <div className="relative z-10 shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30 hidden sm:flex items-center justify-center bg-white/10 backdrop-blur-xs">
            <img
              src={b1.image}
              alt={b1.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Banner 2: Same-Day Mandi Fresh Delivery Guarantee */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/80 min-h-[200px] sm:min-h-[220px] flex items-center justify-between shadow-md hover:shadow-lg transition-all border border-amber-200/80 group p-5 sm:p-8">
          <div className="relative z-10 flex flex-col items-start max-w-xs">
            <span className="inline-flex items-center gap-1 bg-amber-200/80 text-amber-900 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2.5 border border-amber-300">
              <Truck size={12} className="text-amber-700" /> Same-Day Bhopal Delivery
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-1.5">
              {b2.title} <br />
              <span className="text-orange-600 text-base sm:text-lg font-extrabold">{b2.subtitle}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-600 mb-4 leading-relaxed font-medium">
              Arera Colony • Kolar Road • MP Nagar • Bawadiya Kalan & across Bhopal with live rider GPS tracking.
            </p>

            <Link href={b2.link}>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                <span>{b2.btnText}</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          <div className="relative z-10 shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 hidden sm:flex items-center justify-center bg-white/40">
            <img
              src={b2.image}
              alt="Express Delivery"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
