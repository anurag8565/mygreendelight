'use client'

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { TrendingUp, IndianRupee } from "lucide-react";

interface Props {
  data: {
    day: string;
    earnings: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-950/90 backdrop-blur-md border border-white/10 text-white px-3.5 py-2 rounded-2xl shadow-xl">
        <p className="text-[11px] text-gray-400 font-semibold uppercase">{label}</p>
        <p className="text-sm font-black text-emerald-400 flex items-center gap-0.5 mt-0.5">
          <span>₹{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function EarningsChart({ data }: Props) {
  const totalInChart = (data || []).reduce((acc, curr) => acc + (curr.earnings || 0), 0);

  return (
    <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp size={14} />
            </div>
            <h3 className="text-base font-black text-gray-900">Earnings Trend</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Daily income over last 7 days</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase text-gray-400 block">7-Day Total</span>
          <span className="text-base font-black text-emerald-700">₹{totalInChart}</span>
        </div>
      </div>

      <div className="h-[220px] sm:h-[260px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f8646" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#0f8646" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#0f8646"
              strokeWidth={3}
              fill="url(#earningsGradient)"
              activeDot={{ r: 6, fill: "#0f8646", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
