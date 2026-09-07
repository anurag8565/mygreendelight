"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Layers,
  Search,
  ArrowUpDown,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Percent,
  Coins,
  Package,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminMandiProfitAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"margin" | "profit" | "price">("profit");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard/mandi-analytics");
      if (res.data.success) {
        setData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs mt-8 text-center">
        <div className="w-8 h-8 border-3 border-[#0f8646] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500 font-bold">Calculating Kisan Procurement Costs & Net Margins...</p>
      </div>
    );
  }

  const items = data.items || [];
  const summary = data.summary || {};

  const filteredItems = items
    .filter((it: any) => {
      const matchSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === "all" || it.category?.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCat;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "margin") return b.marginPercent - a.marginPercent;
      if (sortBy === "profit") return b.totalItemProfit - a.totalItemProfit;
      if (sortBy === "price") return b.salePrice - a.salePrice;
      return 0;
    });

  const categories = ["all", ...Array.from(new Set(items.map((i: any) => i.category || "Produce")))];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs mt-8">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black shadow-xs">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Smart Farm Sourcing Margin & Profit Analytics
              </h2>
              <span className="bg-emerald-700 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Live Farm Margins
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Live purchase cost (Kisan se khareed daam) vs Customer sale price vs Daily net profit margin
            </p>
          </div>
        </div>
      </div>

      {/* 4 Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
        
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block mb-1">
            Total Sales Revenue
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
            ₹{summary.totalRevenueEst?.toLocaleString("en-IN") || 0}
          </h3>
          <span className="text-[10px] text-gray-500 font-medium mt-1 block">
            Across {summary.totalItemsCount} catalog produce items
          </span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-extrabold uppercase text-amber-800 tracking-wider block mb-1">
            Kisan Cost (Procurement Payout)
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
            ₹{summary.totalCostEst?.toLocaleString("en-IN") || 0}
          </h3>
          <span className="text-[10px] text-gray-500 font-medium mt-1 block">
            Wholesale sourcing purchase expenditure
          </span>
        </div>

        <div className="bg-green-50/80 border border-green-300 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-extrabold uppercase text-green-900 tracking-wider block mb-1">
            Net Estimated Profit
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0f8646]">
            +₹{summary.totalProfitEst?.toLocaleString("en-IN") || 0}
          </h3>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            Gross daily farm profit margin
          </span>
        </div>

        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-extrabold uppercase text-blue-800 tracking-wider block mb-1">
            Average Profit Margin
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-900">
            +{summary.avgMarginPercent}%
          </h3>
          <span className="text-[10px] text-blue-700 font-bold mt-1 block">
            Healthy quick-commerce farm spread
          </span>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search produce item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0f8646] transition"
          />
        </div>

        {/* Category Pills & Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold px-3 py-2 outline-none cursor-pointer"
            >
              <option value="profit">Highest Daily Profit (₹)</option>
              <option value="margin">Highest Margin (%)</option>
              <option value="price">Highest Selling Price</option>
            </select>
          </div>
        </div>

      </div>

      {/* Item-by-Item Mandi Margin Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-500 border-b border-gray-200">
              <th className="py-3 px-4">Produce Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Kisan Cost (Khareed)</th>
              <th className="py-3 px-4 text-right">Selling Price (Grahak)</th>
              <th className="py-3 px-4 text-center">Unit Margin (%)</th>
              <th className="py-3 px-4 text-center">Est. Daily Volume</th>
              <th className="py-3 px-4 text-right">Total Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.map((it: any) => (
              <tr key={it._id} className="hover:bg-gray-50/60 transition">
                
                {/* Produce & Image */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={it.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100"}
                      alt={it.name}
                      className="w-10 h-10 object-contain rounded-xl bg-gray-50 border border-gray-100 p-0.5 shrink-0"
                    />
                    <div>
                      <span className="font-extrabold text-gray-900 block leading-tight">
                        {it.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Pack: {it.unit}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {it.category}
                  </span>
                </td>

                {/* Kisan Purchase Cost */}
                <td className="py-3 px-4 text-right font-mono font-bold text-amber-900 bg-amber-50/30">
                  ₹{it.purchaseCost} <span className="text-[10px] text-gray-400">/{it.unit}</span>
                </td>

                {/* Selling Price */}
                <td className="py-3 px-4 text-right font-mono font-black text-gray-900">
                  ₹{it.salePrice} <span className="text-[10px] text-gray-400">/{it.unit}</span>
                </td>

                {/* Margin % */}
                <td className="py-3 px-4 text-center">
                  <span className="bg-green-100 text-green-900 font-black text-[10px] px-2.5 py-1 rounded-full border border-green-200">
                    +{it.marginPercent}% (+₹{it.unitProfit})
                  </span>
                </td>

                {/* Units Sold Today */}
                <td className="py-3 px-4 text-center font-bold text-gray-700">
                  {it.unitsSoldToday} packs
                </td>

                {/* Total Item Daily Profit */}
                <td className="py-3 px-4 text-right font-black text-sm text-[#0f8646]">
                  +₹{it.totalItemProfit}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
