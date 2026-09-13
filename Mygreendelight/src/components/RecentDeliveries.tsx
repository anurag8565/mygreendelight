'use client'

import React from "react";
import {
  PackageCheck,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

interface Props {
  deliveries: {
    _id: string;
    totalamount: number;
    createdAt: string;
    status: string;
  }[];
}

export default function RecentDeliveries({ deliveries }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black">
            <PackageCheck size={18} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Recent Completed Trips</h3>
            <p className="text-xs text-gray-400 font-medium">Bhopal doorstep delivery history</p>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {deliveries?.length || 0} Total
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {!deliveries || deliveries.length === 0 ? (
          <div className="text-center py-12 text-gray-400 space-y-2">
            <Clock size={32} className="mx-auto text-gray-300" />
            <p className="text-xs font-bold text-gray-500">No completed deliveries yet today</p>
            <p className="text-[11px] text-gray-400">Completed orders will automatically log here.</p>
          </div>
        ) : (
          deliveries.map((order) => {
            const shortId = String(order._id || "").slice(-6).toUpperCase();
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recent";

            return (
              <div
                key={order._id}
                className="py-3.5 flex items-center justify-between hover:bg-gray-50/80 px-2 rounded-2xl transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-[#0f8646] flex items-center justify-center font-black shrink-0 text-xs">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-gray-900">
                        #{shortId}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.status || "delivered"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5 font-medium">
                      <Calendar size={11} />
                      <span suppressHydrationWarning>{dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-gray-900">
                    ₹{order.totalamount}
                  </div>
                  <div className="text-[11px] font-extrabold text-[#0f8646]">
                    +₹{(order as any).payout || 35} Payout
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
