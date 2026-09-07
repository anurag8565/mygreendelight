'use client'

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Truck, CheckCircle2 } from "lucide-react";

interface Props {
  data: {
    day: string;
    deliveries: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-950/90 backdrop-blur-md border border-white/10 text-white px-3.5 py-2 rounded-2xl shadow-xl">
        <p className="text-[11px] text-gray-400 font-semibold uppercase">{label}</p>
        <p className="text-sm font-black text-blue-400 flex items-center gap-1 mt-0.5">
          <span>{payload[0].value} Deliveries</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function DeliveriesChart({ data }: Props) {
  const totalDeliveries = (data || []).reduce((acc, curr) => acc + (curr.deliveries || 0), 0);

  return (
    <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck size={14} />
            </div>
            <h3 className="text-base font-black text-gray-900">Trip Volume</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Orders completed in last 7 days</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase text-gray-400 block">Total Trips</span>
          <span className="text-base font-black text-blue-700">{totalDeliveries} Orders</span>
        </div>
      </div>

      <div className="h-[220px] sm:h-[260px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="deliveries"
              fill="#2563eb"
              radius={[8, 8, 4, 4]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
