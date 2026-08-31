"use client";

import React from "react";

export default function TrustFeatureStrip() {
  const features = [
    {
      icon: "🛵",
      title: "10 Mins",
      subtitle: "Fast Delivery",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: "🏅",
      title: "Best Quality",
      subtitle: "Farm Fresh",
      iconBg: "bg-amber-100 text-amber-700",
    },
    {
      icon: "🏷️",
      title: "Great Offers",
      subtitle: "Save More",
      iconBg: "bg-rose-100 text-rose-700",
    },
    {
      icon: "🛡️",
      title: "Secure",
      subtitle: "100% Safe",
      iconBg: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="w-full bg-white py-1.5 sm:py-2">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        <div className="bg-white rounded-2xl border border-gray-100/90 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-3 sm:p-4 grid grid-cols-4 divide-x divide-gray-100">
          {features.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-1 sm:px-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl mb-1 sm:mb-1.5 shrink-0 bg-gray-50 shadow-2xs">
                {item.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-black text-gray-900 leading-tight">
                {item.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-tight mt-0.5">
                {item.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
