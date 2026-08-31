"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function MandiPriceTicker({ initialRates = [] }: { initialRates?: any[] }) {
  const [rates, setRates] = useState<any[]>(initialRates);

  useEffect(() => {
    if (initialRates && initialRates.length > 0) {
      setRates(initialRates);
      return;
    }
    axios
      .get("/api/mandi")
      .then((res) => {
        if (res.data?.success && res.data.rates) {
          setRates(res.data.rates);
        }
      })
      .catch(() => {});
  }, [initialRates]);

  if (!rates || rates.length === 0) return null;

  return (
    <div className="w-full bg-[#f4faf6] border-y border-emerald-100 py-2 px-3 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Left Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-emerald-700 text-white px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wider shadow-2xs">
          <TrendingDown size={12} />
          <span>Bhopal Mandi Update</span>
        </div>

        {/* Scrolling Ticker Items */}
        <div className="flex-1 flex items-center gap-4 overflow-x-auto scrollbar-none py-0.5">
          {rates.map((item, idx) => (
            <Link
              key={item._id || idx}
              href="/shop"
              className="shrink-0 flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-emerald-200/80 hover:border-[#0f8646] transition-colors shadow-2xs group"
            >
              <span className="font-bold text-gray-900 group-hover:text-[#0f8646] transition-colors">
                {item.itemName}
              </span>
              <span className="font-black text-[#0f8646]">
                ₹{item.currentRate}/{item.unit}
              </span>
              {item.percentageChange > 0 && item.priceChange === "down" && (
                <span className="bg-green-100 text-green-800 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  ↓ {item.percentageChange}% OFF
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-1 text-[11px] font-black text-[#0f8646] hover:text-[#0c6a38] shrink-0"
        >
          <span>Shop Mandi Rates</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
