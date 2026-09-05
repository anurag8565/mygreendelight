"use client";

import React from "react";
import { LayoutGrid, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesBanner() {
  const features = [
    {
      icon: <LayoutGrid className="text-[#0f8646]" size={26} />,
      title: "Wide Range of Fresh Produce",
      desc: "500+ organic vegetables, farm fruits & daily pantry goods",
      bg: "hover:border-green-300 bg-green-50/40",
    },
    {
      icon: <ShieldCheck className="text-[#0f8646]" size={26} />,
      title: "100% Quality Checked",
      desc: "Direct farm sourcing with 3-tier hygiene standards",
      bg: "hover:border-emerald-300 bg-emerald-50/40",
    },
    {
      icon: <Truck className="text-[#0f8646]" size={26} />,
      title: "Same-Day Fresh Delivery",
      desc: "Daily morning & evening fresh produce dispatch across Bhopal",
      bg: "hover:border-teal-300 bg-teal-50/40",
    },
    {
      icon: <RefreshCcw className="text-[#0f8646]" size={26} />,
      title: "Instant Replacement Policy",
      desc: "Quality pasand na aaye toh instant return & refund",
      bg: "hover:border-green-300 bg-green-50/40",
    },
  ];

  return (
    <div className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-extrabold text-[#0f8646] uppercase tracking-wider bg-green-100/70 px-3 py-1 rounded-full">
            WHY CHOOSE US
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Why Bhopal Trusts SubziQuick
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col p-4 sm:p-6 border border-gray-200/80 rounded-2xl sm:rounded-3xl ${f.bg} shadow-2xs hover:shadow-md transition-all group`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-gray-100 mb-2.5 sm:mb-4 group-hover:scale-105 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-black text-xs sm:text-base text-gray-900 mb-1 leading-snug">
                {f.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-medium line-clamp-2">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
