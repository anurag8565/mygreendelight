"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Heart, Users, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function FarmerGratitudePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalFund: 0, totalTippedOrders: 0, avgTip: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/farmer-gratitude")
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.tippedOrders || []);
          setStats(res.data.stats || { totalFund: 0, totalTippedOrders: 0, avgTip: 0 });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
            <Heart size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Kisan Direct Gratitude Bonus Fund (Sehore & Raisen)
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              100% customer gratitude bonus collected to directly support local vegetable farmers
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Total Kisan Fund</span>
            <span className="text-3xl font-black text-orange-600">₹{stats.totalFund}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Total Tipped Orders</span>
            <span className="text-3xl font-black text-gray-900">{stats.totalTippedOrders}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Avg Tip per Order</span>
            <span className="text-3xl font-black text-[#0f8646]">₹{stats.avgTip}</span>
          </div>
        </div>

        {/* Tipped Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5">
          <h2 className="text-base font-black text-gray-900 mb-4">Customer Kisan Tips Ledger</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Order Total</th>
                  <th className="py-3 px-3">Kisan Tip</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      No customer tips recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">
                        #{o._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-900">
                        {o.address?.fullname || o.user?.name}
                      </td>
                      <td className="py-3 px-3 font-bold">₹{o.totalamount}</td>
                      <td className="py-3 px-3 font-black text-orange-600">
                        +₹{o.farmerTip}
                      </td>
                      <td className="py-3 px-3 text-gray-400">
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
