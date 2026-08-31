"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Milk, Users, Calendar, TrendingUp, CheckCircle2, PauseCircle, Clock } from "lucide-react";
import axios from "axios";

export default function ManageSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, active: 0, paused: 0, dailyRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get("/api/admin/subscriptions");
      if (res.data.success) {
        setSubscriptions(res.data.subscriptions || []);
        setStats(res.data.stats || { total: 0, active: 0, paused: 0, dailyRevenue: 0 });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchMsg, setDispatchMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDispatchMorning = async () => {
    if (!confirm("Are you sure you want to generate & dispatch today's 7:00 AM morning delivery orders to the delivery boy fleet?")) {
      return;
    }
    setIsDispatching(true);
    setDispatchMsg(null);
    try {
      const res = await axios.post("/api/admin/subscriptions/dispatch-morning");
      if (res.data.success) {
        setDispatchMsg({ type: "success", text: res.data.message });
        fetchSubscriptions();
      } else {
        setDispatchMsg({ type: "error", text: res.data.message });
      }
    } catch (error: any) {
      setDispatchMsg({ type: "error", text: error.response?.data?.message || "Dispatch failed." });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
              <Milk size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Morning 7:00 AM Subscription Dispatch Manager
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Live ledger of recurring daily milk & farm vegetable subscribers across Bhopal
              </p>
            </div>
          </div>

          <button
            onClick={handleDispatchMorning}
            disabled={isDispatching || stats.active === 0}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs transition shadow-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Clock size={15} />
            <span>{isDispatching ? "Dispatching Orders..." : "⚡ Generate & Dispatch Today's Orders"}</span>
          </button>
        </div>

        {dispatchMsg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2 ${
              dispatchMsg.type === "success"
                ? "bg-green-50 text-[#0f8646] border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            <CheckCircle2 size={16} />
            <span>{dispatchMsg.text}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Active Subscribers</span>
            <span className="text-2xl font-black text-[#0f8646]">{stats.active}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Paused Subscribers</span>
            <span className="text-2xl font-black text-amber-600">{stats.paused}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Total Subscribers</span>
            <span className="text-2xl font-black text-gray-900">{stats.total}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Daily Morning Revenue</span>
            <span className="text-2xl font-black text-blue-600">₹{stats.dailyRevenue}</span>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5">
          <h2 className="text-base font-black text-gray-900 mb-4">
            Tomorrow's 7:00 AM Morning Dispatch Schedule
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Subscriber</th>
                  <th className="py-3 px-3">Plan & Items</th>
                  <th className="py-3 px-3">Frequency</th>
                  <th className="py-3 px-3">Bhopal Address</th>
                  <th className="py-3 px-3">Daily Total</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      No morning subscriptions recorded yet.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900 block">{sub.deliveryAddress?.fullname || sub.user?.name}</span>
                        <span className="text-[11px] text-gray-500">{sub.deliveryAddress?.mobile || sub.user?.mobile}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900 block">{sub.planName}</span>
                        <span className="text-[11px] text-gray-500">
                          {sub.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 capitalize font-bold">{sub.frequency.replace("_", " ")}</td>
                      <td className="py-3 px-3 max-w-xs truncate">{sub.deliveryAddress?.fulladress}</td>
                      <td className="py-3 px-3 font-black text-[#0f8646]">₹{sub.totalPerDelivery}</td>
                      <td className="py-3 px-3 uppercase text-[10px] font-black text-gray-600">{sub.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            sub.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {sub.status === "active" ? "🟢 Active" : "⏸️ Paused"}
                        </span>
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
