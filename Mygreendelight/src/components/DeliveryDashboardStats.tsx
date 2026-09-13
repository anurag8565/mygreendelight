'use client'

import React from "react";
import {
  Wallet,
  TrendingUp,
  PackageCheck,
  Zap,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";

interface Props {
  totalDeliveries: number;
  totalEarnings: number;
  todayEarnings: number;
  earningPerDelivery: number;
  todayCodCash?: number;
  todayBagsCollected?: number;
}

export default function DeliveryDashboardStats({
  totalDeliveries,
  totalEarnings,
  todayEarnings,
  earningPerDelivery,
  todayCodCash = 0,
  todayBagsCollected = 0,
}: Props) {
  return (
    <div className="space-y-4 font-sans">
      {/* Bento Grid Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Today's Earnings */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white rounded-3xl p-5 shadow-lg shadow-emerald-900/10 border border-emerald-500/30 flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200/90 flex items-center gap-1.5">
              <Sparkles size={13} className="text-yellow-300 animate-pulse" />
              <span>Today's Payout</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <IndianRupee size={16} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ₹{todayEarnings.toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] text-emerald-200/80 font-semibold mt-0.5 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-emerald-300" />
              <span>Instant Payout Ready</span>
            </p>
          </div>
        </div>

        {/* Total Lifetime Earnings */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80 flex flex-col justify-between group hover:border-emerald-500/40 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
              Total Earnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
              ₹{totalEarnings.toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
              Direct Bank Deposit
            </p>
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80 flex flex-col justify-between group hover:border-emerald-500/40 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
              Fulfilled Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
              {totalDeliveries}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              100% on-time delivery rate
            </p>
          </div>
        </div>

        {/* Per Order Rate & Perks */}
        <div className="bg-gradient-to-br from-gray-900 to-zinc-800 text-white rounded-3xl p-5 shadow-lg shadow-black/5 flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap size={13} className="text-emerald-400 fill-emerald-400" />
              <span>Base Rate</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ₹{earningPerDelivery}
              <span className="text-xs text-gray-400 font-medium ml-1">/ trip</span>
            </h3>
            <p className="text-[11px] text-emerald-300 font-semibold mt-0.5 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>+₹10 per eco-bag bonus</span>
            </p>
          </div>
        </div>
      </div>

      {/* Real COD Settlement & Green Bag Return Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 block">
              💵 COD Cash In Hand
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-amber-950 mt-1">
              ₹{todayCodCash.toLocaleString("en-IN")}
            </h4>
            <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
              Cash collected today — to deposit at hub counter
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-black shrink-0">
            <IndianRupee size={18} />
          </div>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block">
              ♻️ Eco-Bags Collected
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
              {todayBagsCollected} Bag{todayBagsCollected === 1 ? '' : 's'}
            </h4>
            <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              +₹{todayBagsCollected * 10} extra bonus earned today
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-200/80 text-emerald-900 flex items-center justify-center font-black shrink-0">
            <ShieldCheck size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
