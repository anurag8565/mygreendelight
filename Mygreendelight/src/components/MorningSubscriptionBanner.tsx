"use client";

import React from "react";
import Link from "next/link";
import { Milk, Sparkles, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function MorningSubscriptionBanner() {
  return (
    <div className="w-full py-4 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0f8646] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 flex flex-col items-start max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-blue-100 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2.5 border border-white/20">
              <Clock size={12} className="text-yellow-300" />
              <span>Subah 7:00 AM Guaranteed Delivery</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2">
              Never Run Out of Fresh Milk & Veggies! <br className="hidden sm:inline" />
              <span className="text-yellow-300">Daily Morning 7 AM Subscription</span>
            </h3>

            <p className="text-xs sm:text-sm text-blue-100/90 mb-4 leading-relaxed font-medium">
              Roz subah bina order kiye taaza A2 Cow Milk, Brown Bread, Desi Eggs aur Palak aapke darwaze par delivered. 1-Click me kabhi bhi pause ya resume karein!
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-green-200">
              <span className="flex items-center gap-1">✓ Zero Packaging Fee</span>
              <span className="flex items-center gap-1">✓ 1-Click Pause Anytime</span>
              <span className="flex items-center gap-1">✓ 100% Farm Fresh</span>
            </div>
          </div>

          {/* Right Action */}
          <div className="relative z-10 shrink-0">
            <Link href="/user/subscriptions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-950 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer border-2 border-yellow-200"
              >
                <Milk size={18} />
                <span>Start Daily 7 AM Plan</span>
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
