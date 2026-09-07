"use client";

import React from "react";
import Link from "next/link";
import { Zap, MapPin, ChevronRight, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function DeliveryRadarStrip() {
  return (
    <div className="w-full bg-[#0a572c] text-white py-1.5 sm:py-2 px-3 sm:px-6 md:px-8 border-b border-green-800 shadow-inner overflow-hidden relative">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-green-600/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 relative z-10 text-xs sm:text-sm">
        
        {/* Left: Radar Indicator + Delivery Statement */}
        <div className="flex items-center gap-3">
          {/* Pulsing Radar Beacon */}
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <motion.span
              animate={{ scale: [1, 2.2, 1], opacity: [0.9, 0, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/80"
            />
          </div>

          <div className="flex items-center flex-wrap gap-1.5 font-medium">
            <span className="font-extrabold text-yellow-300 flex items-center gap-1">
              <Truck size={14} className="text-yellow-300" /> Same-Day Fresh Delivery Active:
            </span>
            <span className="text-green-100 hidden md:inline">
              Arera Colony • Kolar Road • MP Nagar • Bairagarh
            </span>
            <span className="text-green-100 md:hidden">
              Across all Bhopal Localities
            </span>
          </div>
        </div>

        {/* Right: Service Hubs Link */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 text-green-200 hover:text-white font-bold transition text-xs shrink-0 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs"
        >
          <MapPin size={12} />
          <span>View SubziQuick Store</span>
          <ChevronRight size={12} />
        </Link>

      </div>
    </div>
  );
}
