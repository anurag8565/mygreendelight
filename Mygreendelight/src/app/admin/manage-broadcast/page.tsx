"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Radio, CloudRain, AlertTriangle, Sparkles, Info, CheckCircle2, Save, Power, ArrowRight } from "lucide-react";
import axios from "axios";

export default function ManageBroadcastPage() {
  const [form, setForm] = useState({
    message: "🌧️ Heavy Rains in Bhopal: Deliveries might take 5-10 extra mins. Our riders are on the way safely!",
    type: "weather",
    isActive: true,
    linkText: "Check Tracking",
    linkUrl: "/user/myorder",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBroadcast();
  }, []);

  const fetchBroadcast = async () => {
    try {
      const res = await axios.get("/api/broadcast");
      if (res.data.success && res.data.broadcast) {
        setForm({
          message: res.data.broadcast.message || "",
          type: res.data.broadcast.type || "promo",
          isActive: res.data.broadcast.isActive !== undefined ? res.data.broadcast.isActive : true,
          linkText: res.data.broadcast.linkText || "",
          linkUrl: res.data.broadcast.linkUrl || "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) {
      alert("Please enter a broadcast announcement message.");
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await axios.post("/api/broadcast", form);
      if (res.data.success) {
        setMsg({ type: "success", text: res.data.message });
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to update broadcast" });
    } finally {
      setSaving(false);
    }
  };

  const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    weather: {
      label: "Bhopal Weather Alert (Rain / Heatwave)",
      icon: <CloudRain size={16} className="text-sky-400" />,
      color: "border-sky-500 bg-sky-50",
    },
    warning: {
      label: "Store / Operational Alert (High Demand / Delays)",
      icon: <AlertTriangle size={16} className="text-amber-500" />,
      color: "border-amber-500 bg-amber-50",
    },
    promo: {
      label: "Special Offer / Coupon Announcement",
      icon: <Sparkles size={16} className="text-emerald-500" />,
      color: "border-emerald-500 bg-emerald-50",
    },
    info: {
      label: "General Store Update / Timings",
      icon: <Info size={16} className="text-indigo-500" />,
      color: "border-indigo-500 bg-indigo-50",
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Top Announcement Broadcast Bar
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Display live emergency weather notices, rush alerts, or promo announcements across the entire customer store
              </p>
            </div>
          </div>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-green-50 text-[#0f8646] border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            <CheckCircle2 size={16} />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Live Preview Strip */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs mb-8">
          <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-3">
            Live Customer Store Preview
          </span>

          <div
            className={`p-3.5 rounded-2xl text-xs font-bold text-white shadow-md flex items-center justify-between gap-3 ${
              form.type === "weather"
                ? "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700"
                : form.type === "warning"
                ? "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600"
                : form.type === "info"
                ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                : "bg-gradient-to-r from-[#0f8646] via-emerald-600 to-teal-700"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {form.type === "weather" ? (
                <CloudRain size={16} className="animate-bounce shrink-0" />
              ) : form.type === "warning" ? (
                <AlertTriangle size={16} className="animate-pulse shrink-0" />
              ) : form.type === "info" ? (
                <Info size={16} className="shrink-0" />
              ) : (
                <Sparkles size={16} className="text-yellow-300 shrink-0" />
              )}

              <span className="uppercase text-[10px] font-black bg-white/20 px-2 py-0.5 rounded shrink-0">
                {form.type.toUpperCase()}
              </span>

              <p className="truncate font-bold text-xs">{form.message || "Announcement preview will appear here..."}</p>

              {form.linkText && (
                <span className="bg-white text-gray-900 px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 flex items-center gap-1 shadow-2xs">
                  <span>{form.linkText}</span>
                  <ArrowRight size={10} />
                </span>
              )}
            </div>

            <div className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/20 shrink-0">
              {form.isActive ? "🟢 Active on Store" : "🔴 Hidden"}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6">
          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <span className="text-sm font-extrabold text-gray-900 block">Broadcast Visibility</span>
              <span className="text-xs text-gray-500">Show or hide the announcement bar across all store pages</span>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                form.isActive ? "bg-[#0f8646] text-white shadow-xs" : "bg-gray-200 text-gray-600"
              }`}
            >
              <Power size={14} />
              <span>{form.isActive ? "Active (Broadcasting)" : "Disabled (Hidden)"}</span>
            </button>
          </div>

          {/* Type Selector */}
          <div>
            <label className="text-xs font-black text-gray-700 uppercase tracking-wider block mb-2">
              Announcement Category & Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(typeConfig).map(([key, item]) => (
                <div
                  key={key}
                  onClick={() => setForm({ ...form, type: key })}
                  className={`p-3.5 rounded-2xl border-2 transition flex items-center gap-3 cursor-pointer ${
                    form.type === key ? `${item.color} font-black` : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-800 font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Announcement Message */}
          <div>
            <label className="text-xs font-black text-gray-700 uppercase tracking-wider block mb-2">
              Broadcast Message Content
            </label>
            <textarea
              required
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="e.g. 🌧️ Bhopal Rain Update: 100% orders delivered with waterproof eco-bag seal..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs sm:text-sm font-medium text-gray-800 focus:bg-white focus:border-[#0f8646] outline-none transition resize-none"
            />
          </div>

          {/* Link Call to Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block mb-2">
                CTA Button Text (Optional)
              </label>
              <input
                type="text"
                value={form.linkText}
                onChange={(e) => setForm({ ...form, linkText: e.target.value })}
                placeholder="e.g. Track Order / View Offers"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-[#0f8646] outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block mb-2">
                CTA Target URL (Optional)
              </label>
              <input
                type="text"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                placeholder="e.g. /shop or /user/myorder"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-[#0f8646] outline-none transition"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-[#0f8646] hover:bg-[#0c6a38] text-white px-8 py-3 rounded-2xl font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save size={16} />
              <span>{saving ? "Publishing Broadcast..." : "Save & Publish Announcement"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
