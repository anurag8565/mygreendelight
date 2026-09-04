"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, ArrowRight } from "lucide-react";
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
    <div className="w-full bg-[#f8f9fa] border-y border-gray-100 py-2 px-3.5 sm:px-6 md:px-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Left Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-white border border-gray-200 text-gray-800 px-2.5 py-1 rounded-full font-bold text-[10.5px]">
          <TrendingDown size={13} className="text-[#0c831f]" />
          <span>Live Mandi Rates</span>
        </div>

        {/* Scrolling Ticker Items */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-0.5">
          {rates.map((item, idx) => (
            <Link
              key={item._id || idx}
              href="/shop"
              className="shrink-0 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-gray-100 hover:border-gray-300 transition-all text-[11px] group"
            >
              <span className="font-semibold text-gray-700 group-hover:text-black">
                {item.itemName}
              </span>
              <span className="font-bold text-[#0c831f]">
                ₹{item.currentRate}/{item.unit}
              </span>
              {item.percentageChange > 0 && item.priceChange === "down" && (
                <span className="bg-emerald-50 text-[#0c831f] text-[9.5px] font-bold px-1 rounded">
                  ↓{item.percentageChange}%
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-1 text-[11px] font-bold text-[#0c831f] hover:text-[#096618] shrink-0"
        >
          <span>Shop Mandi</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
