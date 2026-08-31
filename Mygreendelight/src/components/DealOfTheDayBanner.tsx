"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function DealOfTheDayBanner() {
  return (
    <div className="w-full bg-white py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        <Link href="/shop">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-50/90 via-green-50 to-emerald-100/70 border border-emerald-200/80 p-3 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            {/* Left: 3D Produce Basket Preview */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white border border-emerald-100 p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80"
                  alt="Deal of the Day"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              {/* Center Text */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-base font-black text-emerald-950">
                    Deal of the Day
                  </h3>
                  <span>🔥</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                  Don't miss today's special farm offers
                </p>
              </div>
            </div>

            {/* Right: CTA Pill Button */}
            <button
              type="button"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3.5 sm:px-5 py-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>View Deals</span>
              <ArrowRight size={13} />
            </button>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
