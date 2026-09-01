"use client";

import React from "react";
import Link from "next/link";
import { Milk, Sparkles, ArrowRight, Clock, ShieldCheck, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function MorningSubscriptionBanner() {
  return (
    <div className="w-full py-3.5 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="bg-gradient-to-r from-[#071830] via-[#0b2f28] to-[#0d5930] rounded-3xl p-4 sm:p-6 text-white shadow-md border border-emerald-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Ambient Morning Sun Glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Icon & Pitch */}
          <div className="relative z-10 flex items-center gap-3.5 w-full md:w-auto">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Milk size={24} className="stroke-[2.5]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-yellow-300 text-gray-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  <Sun size={11} className="text-amber-700" />
                  <span>Subah 7:00 AM Guaranteed</span>
                </span>
                <span className="text-emerald-200 text-[10px] font-bold hidden xs:inline">
                  1-Click Pause Anytime
                </span>
              </div>

              <h3 className="text-sm sm:text-xl font-black text-white leading-tight">
                Taaza A2 Milk & Breakfast Essentials Delivered Daily at 7 AM
              </h3>

              <p className="text-[11px] sm:text-xs text-emerald-100/80 leading-relaxed font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">
                Pure A2 Cow Milk, Brown Bread, Desi Eggs & Morning Greens without daily reordering.
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="relative z-10 w-full md:w-auto shrink-0 flex items-center justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            <Link href="/user/subscriptions" className="w-full md:w-auto">
              <button
                type="button"
                className="w-full md:w-auto bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 hover:from-yellow-400 hover:to-amber-500 text-gray-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-200"
              >
                <Milk size={15} />
                <span>Start Daily 7 AM Plan</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
