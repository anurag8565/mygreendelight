"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Bell, Users, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import axios from "axios";

export default function ManageStockAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("/api/admin/stock-alerts");
      if (res.data.success) {
        setAlerts(res.data.alerts || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAlerts = async (groceryId: string) => {
    try {
      const res = await axios.post("/api/admin/stock-alerts", { groceryId });
      if (res.data.success) {
        setMsg({ type: "success", text: res.data.message });
        fetchAlerts();
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to send alerts" });
    }
  };

  // Group alerts by grocery
  const grouped: Record<string, { grocery: any; list: any[] }> = {};
  alerts.forEach((a) => {
    const id = a.grocery?._id || a.groceryName;
    if (!grouped[id]) {
      grouped[id] = { grocery: a.grocery || { name: a.groceryName }, list: [] };
    }
    grouped[id].list.push(a);
  });

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Harvest Restock & Back-in-Stock Alerts Manager
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Customers waiting for out-of-stock farm produce to be harvested & restocked
            </p>
          </div>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {msg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center text-gray-400 text-xs">
              No pending harvest restock requests. All items in stock!
            </div>
          ) : (
            Object.entries(grouped).map(([key, group]) => (
              <div
                key={key}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {group.grocery?.image && (
                    <img
                      src={group.grocery.image}
                      alt={group.grocery.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-black text-sm text-gray-900">{group.grocery?.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      <span className="font-bold text-amber-700">{group.list.length} customer(s)</span> waiting
                      for morning restock
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                      <span>Mobiles:</span>
                      <span className="font-mono text-gray-600">
                        {group.list.map((l) => l.mobile).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendAlerts(group.grocery._id)}
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send Restock WhatsApp/SMS</span>
                </button>
              </div>
            ))
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
