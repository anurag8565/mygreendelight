"use client";

import React, { useState, useEffect } from "react";
import { Users, Sparkles, Check, ArrowRight, Building2, ShieldCheck, MapPin } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SocietyGroupOrderWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/society-pool")
      .then((res) => {
        if (res.data.success) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data || !data.societies || data.societies.length === 0) return null;

  return (
    <div className="w-full py-8 sm:py-10 bg-[#f8fcf9]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Bhopal Society & Colony Group Pools
                </h2>
                <span className="bg-emerald-700 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  5% Community OFF
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Jab aapki society me 3+ orders sath aate hain, sabhi ko milta hai extra 5% discount!
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-1 transition self-start sm:self-auto"
          >
            <span>Order with Society</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Societies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.societies.map((soc: any) => {
            const isUnlocked = soc.isUnlocked;
            return (
              <motion.div
                key={soc.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? "bg-white border-emerald-300 shadow-md shadow-emerald-900/5 ring-1 ring-emerald-500/20"
                    : "bg-white border-gray-200/80 shadow-2xs hover:border-emerald-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Building2 size={16} className="text-emerald-700 shrink-0" />
                      <h3 className="font-extrabold text-sm text-gray-900 truncate">
                        {soc.name}
                      </h3>
                    </div>
                    {isUnlocked ? (
                      <span className="bg-emerald-100 text-[#0f8646] text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
                        🎉 5% OFF UNLOCKED
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
                        {soc.ordersNeeded} Order Needed
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin size={11} className="text-gray-400 shrink-0" />
                    <span>{soc.landmark}</span>
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? "bg-[#0f8646]" : "bg-amber-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (soc.currentOrders / soc.targetOrders) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold mb-3">
                    <span>
                      {soc.currentOrders} of {soc.targetOrders} orders pooled today
                    </span>
                    <span className={isUnlocked ? "text-[#0f8646]" : "text-amber-700"}>
                      {isUnlocked ? "Discount Active" : `${soc.ordersNeeded} to unlock`}
                    </span>
                  </div>
                </div>

                <Link
                  href="/shop"
                  className={`w-full py-2 rounded-xl text-xs font-black transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    isUnlocked
                      ? "bg-[#0f8646] hover:bg-[#0c6a38] text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <Users size={13} />
                  <span>{isUnlocked ? "Order & Claim 5% Discount" : "Join Society Pool ➔"}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
