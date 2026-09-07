"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Truck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  ShoppingBag,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageDeliveryFee() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    deliveryFee: 30,
    freeDeliveryThreshold: 199,
    isFreeDeliveryActive: false,
    minOrderAmount: 0,
    expressDeliveryMins: "15-45 Mins",
    deliveryNotice: "",
  });

  const fetchSettings = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await axios.get("/api/admin/settings");
      if (res.data.success && res.data.setting) {
        const s = res.data.setting;
        setForm({
          deliveryFee: s.deliveryFee ?? 30,
          freeDeliveryThreshold: s.freeDeliveryThreshold ?? 199,
          isFreeDeliveryActive: Boolean(s.isFreeDeliveryActive),
          minOrderAmount: s.minOrderAmount ?? 0,
          expressDeliveryMins: s.expressDeliveryMins || "15-45 Mins",
          deliveryNotice: s.deliveryNotice || "",
        });
      }
    } catch (error: any) {
      console.error(error);
      setMsg({ type: "error", text: "Failed to load store delivery settings" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await axios.post("/api/admin/settings", {
        deliveryFee: Number(form.deliveryFee),
        freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
        isFreeDeliveryActive: form.isFreeDeliveryActive,
        minOrderAmount: Number(form.minOrderAmount),
        expressDeliveryMins: form.expressDeliveryMins,
        deliveryNotice: form.deliveryNotice,
      });

      if (res.data.success) {
        setMsg({ type: "success", text: "Delivery settings updated successfully!" });
      } else {
        setMsg({ type: "error", text: res.data.message || "Failed to update settings" });
      }
    } catch (error: any) {
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Error saving delivery fee settings",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin"
                className="text-xs font-bold text-gray-500 hover:text-[#0f8646] flex items-center gap-1 transition"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-md">
                <Truck size={22} />
              </span>
              <span>Manage Delivery Fee & Threshold</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Set base delivery charges, minimum free delivery limits, and store delivery rules in real time.
            </p>
          </div>

          <button
            onClick={fetchSettings}
            disabled={loading}
            className="self-start sm:self-auto bg-white border border-gray-200 text-gray-700 hover:text-[#0f8646] hover:border-[#0f8646] px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#0f8646]" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-200/80 shadow-xs flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-[#0f8646] animate-spin mb-3" />
            <p className="text-xs font-bold text-gray-500">Loading delivery fee settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Quick 1-Click Free Delivery Banner Toggle */}
            <div className="bg-gradient-to-r from-[#063319] via-[#094c25] to-[#0f8646] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative z-10 max-w-xl">
                <span className="bg-amber-400 text-gray-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md inline-block mb-2">
                  Special Promo Mode
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  1-Click FREE Delivery for ALL Orders
                </h3>
                <p className="text-xs text-green-100/90 mt-1 leading-relaxed">
                  Turn this ON to give 100% Free Delivery on every customer order across Bhopal, regardless of cart value.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, isFreeDeliveryActive: !form.isFreeDeliveryActive })
                }
                className={`relative z-10 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0 ${
                  form.isFreeDeliveryActive
                    ? "bg-amber-400 text-gray-950 hover:bg-amber-300"
                    : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                }`}
              >
                <Zap size={16} className={form.isFreeDeliveryActive ? "fill-current" : ""} />
                <span>
                  {form.isFreeDeliveryActive ? "ACTIVE: Free For Everyone" : "INACTIVE (Use Threshold)"}
                </span>
              </button>
            </div>

            {/* Main Delivery Rules Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Truck size={18} className="text-[#0f8646]" />
                <span>Base Delivery Rules & Pricing</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Standard Delivery Fee */}
                <div>
                  <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    Standard Delivery Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min={0}
                      required
                      value={form.deliveryFee}
                      onChange={(e) =>
                        setForm({ ...form, deliveryFee: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-black text-gray-900 outline-none focus:border-[#0f8646] transition"
                      placeholder="e.g. 30"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Charged when cart subtotal is below the free delivery limit.
                  </p>
                </div>

                {/* Free Delivery Threshold */}
                <div>
                  <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    Free Delivery Minimum Cart Value (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min={0}
                      required
                      value={form.freeDeliveryThreshold}
                      onChange={(e) =>
                        setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-black text-gray-900 outline-none focus:border-[#0f8646] transition"
                      placeholder="e.g. 199"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Orders at or above this cart value get 100% Free Delivery.
                  </p>
                </div>

                {/* Minimum Order Value */}
                <div>
                  <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    Minimum Order Value (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={form.minOrderAmount}
                      onChange={(e) =>
                        setForm({ ...form, minOrderAmount: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-black text-gray-900 outline-none focus:border-[#0f8646] transition"
                      placeholder="e.g. 0 or 50"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Set 0 for No Minimum Order constraint.
                  </p>
                </div>

                {/* Express Delivery Time Tag */}
                <div>
                  <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    Express Delivery Time Display
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={form.expressDeliveryMins}
                      onChange={(e) =>
                        setForm({ ...form, expressDeliveryMins: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-900 outline-none focus:border-[#0f8646] transition"
                      placeholder="e.g. 15-45 Mins"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Displayed on checkout and delivery ETA badge.
                  </p>
                </div>
              </div>

              {/* Delivery Notice / Announcement */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                  Optional Delivery Banner Notice (Cart & Checkout)
                </label>
                <input
                  type="text"
                  value={form.deliveryNotice}
                  onChange={(e) => setForm({ ...form, deliveryNotice: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-[#0f8646] transition"
                  placeholder="e.g. Monsoon express delivery active in Bhopal! 🌿"
                />
              </div>
            </div>

            {/* Live Customer Simulation Preview */}
            <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200 shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0f8646]" />
                <span>Live Customer Cart & Checkout Preview</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-800">
                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Scenario A: Cart ₹120 (Below Limit)
                  </span>
                  <div className="flex justify-between items-center py-1">
                    <span>Subtotal:</span>
                    <span className="font-black text-gray-900">₹120.00</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Delivery Charge:</span>
                    <span className={`font-black ${form.isFreeDeliveryActive || form.deliveryFee === 0 ? "text-[#0f8646]" : "text-gray-900"}`}>
                      {form.isFreeDeliveryActive || form.deliveryFee === 0
                        ? "FREE (Promo)"
                        : `₹${form.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-black text-sm text-gray-900">
                    <span>Customer Pays:</span>
                    <span className="text-[#0f8646]">
                      ₹{120 + (form.isFreeDeliveryActive ? 0 : form.deliveryFee)}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] font-black uppercase text-emerald-700 block mb-1">
                    Scenario B: Cart ₹{Math.max(200, form.freeDeliveryThreshold)} (Qualifies for Free Delivery)
                  </span>
                  <div className="flex justify-between items-center py-1">
                    <span>Subtotal:</span>
                    <span className="font-black text-gray-900">₹{Math.max(200, form.freeDeliveryThreshold)}.00</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Delivery Charge:</span>
                    <span className="font-black text-[#0f8646]">FREE (₹0)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-black text-sm text-gray-900">
                    <span>Customer Pays:</span>
                    <span className="text-[#0f8646]">
                      ₹{Math.max(200, form.freeDeliveryThreshold)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Save Delivery Settings</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
        </main>
      </div>
    </div>
  );
}
