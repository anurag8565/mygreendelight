'use client'

import React from "react";
import {
  PackageCheck,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";

interface Props {
  totalDeliveries: number;
  todayDeliveries?: number;
  totalEarnings?: number;
  todayEarnings?: number;
  earningPerDelivery?: number;
  todayCodCash?: number;
  salaryType?: string;
}

export default function DeliveryDashboardStats({
  totalDeliveries,
  todayDeliveries = 0,
  todayCodCash = 0,
  salaryType = "Monthly Fixed Salary",
}: Props) {
  return (
    <div className="space-y-4 font-sans">
      {/* Bento Grid Top Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Today's Completed Deliveries */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white rounded-3xl p-5 shadow-lg shadow-emerald-900/10 border border-emerald-500/30 flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200/90 flex items-center gap-1.5">
              <Sparkles size={13} className="text-yellow-300 animate-pulse" />
              <span>Today's Deliveries</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <PackageCheck size={16} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {todayDeliveries} <span className="text-sm font-semibold text-emerald-200">Drops</span>
            </h3>
            <p className="text-[11px] text-emerald-200/80 font-semibold mt-0.5 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-emerald-300" />
              <span>Shift Progress Logged</span>
            </p>
          </div>
        </div>

        {/* Total Lifetime Completed Orders */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80 flex flex-col justify-between group hover:border-emerald-500/40 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
              Total Deliveries
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
              {totalDeliveries} <span className="text-sm font-semibold text-gray-400">Total</span>
            </h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
              100% Verified Handover Rate
            </p>
          </div>
        </div>

        {/* Fixed Monthly Staff Status */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80 flex flex-col justify-between group hover:border-emerald-500/40 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
              Compensation
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
              {salaryType}
            </h3>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">
              SubziQuick On-Payroll Fleet
            </p>
          </div>
        </div>
      </div>

      {/* Real COD Settlement Bar */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block">
            💵 COD Cash In Hand (To Deposit at Store)
          </span>
          <h4 className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
            ₹{todayCodCash.toLocaleString("en-IN")}
          </h4>
          <p className="text-[11px] font-semibold text-amber-800 mt-0.5">
            Total physical cash collected from customers today — please tally & hand over at the Bhopal Hub counter at end of shift.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-950 flex items-center justify-center font-black shrink-0 shadow-xs">
          <IndianRupee size={22} />
        </div>
      </div>
    </div>
  );
}
