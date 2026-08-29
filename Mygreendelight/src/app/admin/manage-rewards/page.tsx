"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Gift,
  Save,
  CheckCircle2,
  Sparkles,
  Loader2,
  Power,
  RefreshCw,
  TrendingUp,
  Percent,
  Coins,
  Ticket,
  User,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageRewards() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [stats, setStats] = useState({
    totalIssued: 0,
    totalScratched: 0,
    totalUnscratched: 0,
  });
  const [recentRewards, setRecentRewards] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    minCashback: 15,
    maxCashback: 50,
    minOrderValue: 199,
    expiryDays: 7,
    isActive: true,
    couponPrefix: "LUCKY",
  });

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/rewards");
      if (res.data.success) {
        if (res.data.config) {
          setFormData({
            minCashback: res.data.config.minCashback || 15,
            maxCashback: res.data.config.maxCashback || 50,
            minOrderValue: res.data.config.minOrderValue || 199,
            expiryDays: res.data.config.expiryDays || 7,
            isActive: res.data.config.isActive !== undefined ? res.data.config.isActive : true,
            couponPrefix: res.data.config.couponPrefix || "LUCKY",
          });
        }
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (res.data.recentRewards) {
          setRecentRewards(res.data.recentRewards);
        }
      }
    } catch (error) {
      console.error("Error fetching rewards config", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(formData.minCashback) > Number(formData.maxCashback)) {
      return alert("Min Cashback cannot be greater than Max Cashback");
    }

    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await axios.post("/api/admin/rewards", formData);
      if (res.data.success) {
        setSuccessMsg("✓ Scratch Card Rules & Limits Updated Live!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update rewards config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Gift size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Digital Scratch Card & Rewards Manager
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Control order completion cashback pools, minimum order requirements, and coupon activation rules.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchConfig}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#0f8646]" : ""} />
            <span>Reload</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                Total Cards Issued
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Ticket size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.totalIssued}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Generated upon customer checkout</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                Scratched / Claimed
              </span>
              <div className="w-8 h-8 rounded-xl bg-green-50 text-[#0f8646] flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.totalScratched}</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
              {stats.totalIssued > 0
                ? `${Math.round((stats.totalScratched / stats.totalIssued) * 100)}% claim rate`
                : "Active user participation"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                Cashback Win Range
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Coins size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              ₹{formData.minCashback} - ₹{formData.maxCashback}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Per qualifying customer order</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xs">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <Loader2 size={32} className="animate-spin text-[#0f8646] mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-600">Loading Rewards Settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Configuration Form (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-black text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <span>Rewards Configuration</span>
              </h2>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                        formData.isActive ? "bg-purple-100 text-purple-700" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Power size={18} />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-gray-900 block">
                        Scratch Cards System
                      </span>
                      <span className="text-xs text-gray-500">
                        {formData.isActive ? "Active (Rewards given on checkout)" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f8646]"></div>
                  </label>
                </div>

                {/* Min and Max Cashback */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-gray-700 tracking-wider block mb-2">
                      Min Cashback (₹)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="500"
                      value={formData.minCashback}
                      onChange={(e) => setFormData({ ...formData, minCashback: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-gray-700 tracking-wider block mb-2">
                      Max Cashback (₹)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={formData.maxCashback}
                      onChange={(e) => setFormData({ ...formData, maxCashback: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                {/* Min Order Value & Expiry Days */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-gray-700 tracking-wider block mb-2">
                      Min Order to Apply (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-gray-700 tracking-wider block mb-2">
                      Coupon Validity (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={formData.expiryDays}
                      onChange={(e) => setFormData({ ...formData, expiryDays: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                {/* Coupon Code Prefix */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-700 tracking-wider block mb-2">
                    Coupon Code Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.couponPrefix}
                    onChange={(e) => setFormData({ ...formData, couponPrefix: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition uppercase"
                    placeholder="e.g. LUCKY, GREEN, BHOPAL"
                    required
                  />
                  <p className="text-[11px] text-gray-400 font-medium mt-1">
                    Generated codes will look like: <strong>{formData.couponPrefix || "LUCKY"}25-9K4E</strong>
                  </p>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Reward Rules</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Recent Scratch Cards Table (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs flex flex-col">
              <h2 className="text-lg font-black text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Ticket size={18} className="text-purple-600" />
                <span>Recent Customer Rewards</span>
              </h2>

              {recentRewards.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-bold">
                  No scratch cards issued yet. Place an order to see real live rewards here!
                </div>
              ) : (
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-black uppercase">
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Prize</th>
                        <th className="pb-3">Code</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {recentRewards.map((r: any) => (
                        <tr key={r._id} className="hover:bg-gray-50/80 transition">
                          <td className="py-3">
                            <span className="font-bold text-gray-900 block truncate max-w-[120px]">
                              {r.user?.name || "Customer"}
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              {r.user?.mobile || r.user?.email || ""}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="font-extrabold text-[#0f8646]">
                              ₹{r.discountAmount}
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold text-gray-900">
                            {r.couponCode}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                r.isScratched
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {r.isScratched ? "Scratched" : "Unclaimed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
