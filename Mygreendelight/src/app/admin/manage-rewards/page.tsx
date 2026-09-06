"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Gift, Trophy, Plus, Trash2, Save, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function ManageRewardsPage() {
  const [config, setConfig] = useState<any>(null);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [totalClaims, setTotalClaims] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      const res = await axios.get("/api/admin/rewards");
      if (res.data.success) {
        setConfig(res.data.config);
        setRecentClaims(res.data.recentClaims || []);
        setTotalClaims(res.data.totalClaims || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRewardOption = () => {
    setConfig({
      ...config,
      availableRewards: [
        ...config.availableRewards,
        {
          title: "New Farm Discount",
          discountType: "fixed",
          discountValue: 20,
          couponPrefix: "FARM20",
          minOrderValue: 199,
          description: "Special Daily Farm Discount",
        },
      ],
    });
  };

  const handleRemoveRewardOption = (index: number) => {
    const updated = config.availableRewards.filter((_: any, i: number) => i !== index);
    setConfig({ ...config, availableRewards: updated });
  };

  const handleRewardChange = (index: number, field: string, value: any) => {
    const updated = [...config.availableRewards];
    updated[index][field] = value;
    setConfig({ ...config, availableRewards: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await axios.put("/api/admin/rewards", config);
      if (res.data.success) {
        setMsg({ type: "success", text: "Rewards configuration saved successfully!" });
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to save configuration" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                <Gift size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Daily Scratch & Rewards Manager
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Configure daily scratch card coupons, discount values & view customer claims.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
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

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Status</span>
            <div className="flex items-center justify-between">
              <span className={`text-base font-black ${config?.isActive ? "text-[#0f8646]" : "text-gray-400"}`}>
                {config?.isActive ? "🟢 Active on App" : "⚪ Disabled"}
              </span>
              <input
                type="checkbox"
                checked={config?.isActive || false}
                onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
                className="w-5 h-5 accent-[#0f8646] cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Total Rewards Claimed</span>
            <span className="text-2xl font-black text-gray-900">{totalClaims}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Active Reward Options</span>
            <span className="text-2xl font-black text-orange-600">
              {config?.availableRewards?.length || 0}
            </span>
          </div>
        </div>

        {/* Configured Rewards Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <span>Available Scratch Reward Cards</span>
            </h2>
            <button
              onClick={handleAddRewardOption}
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-black text-xs px-3 py-1.5 rounded-lg border border-orange-200 flex items-center gap-1 cursor-pointer transition"
            >
              <Plus size={14} />
              <span>Add Reward Option</span>
            </button>
          </div>

          <div className="space-y-3">
            {config?.availableRewards?.map((reward: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Title */}
                <div className="sm:col-span-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Reward Title</label>
                  <input
                    type="text"
                    value={reward.title}
                    onChange={(e) => handleRewardChange(idx, "title", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Type */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Type</label>
                  <select
                    value={reward.discountType}
                    onChange={(e) => handleRewardChange(idx, "discountType", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-800"
                  >
                    <option value="fixed">Flat ₹ OFF</option>
                    <option value="percent">Percentage %</option>
                    <option value="free_delivery">Free Delivery</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Value (₹ / %)</label>
                  <input
                    type="number"
                    value={reward.discountValue}
                    onChange={(e) => handleRewardChange(idx, "discountValue", Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Min Order */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Min Order (₹)</label>
                  <input
                    type="number"
                    value={reward.minOrderValue}
                    onChange={(e) => handleRewardChange(idx, "minOrderValue", Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Coupon Prefix */}
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Prefix</label>
                  <input
                    type="text"
                    value={reward.couponPrefix}
                    onChange={(e) => handleRewardChange(idx, "couponPrefix", e.target.value.toUpperCase())}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-900 uppercase"
                  />
                </div>

                {/* Delete */}
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    onClick={() => handleRemoveRewardOption(idx)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title="Remove Reward"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customer Claims Log */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5">
          <h2 className="text-sm sm:text-base font-black text-gray-900 mb-3">
            Recent Customer Claims (Live MongoDB Ledger)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Reward Won</th>
                  <th className="py-2.5 px-3">Generated Coupon</th>
                  <th className="py-2.5 px-3">User / Guest</th>
                  <th className="py-2.5 px-3">Expires At</th>
                  <th className="py-2.5 px-3">Claimed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {recentClaims.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No rewards claimed yet today.
                    </td>
                  </tr>
                ) : (
                  recentClaims.map((claim: any) => (
                    <tr key={claim._id} className="hover:bg-gray-50/80 transition">
                      <td className="py-2.5 px-3 font-bold text-gray-900">{claim.rewardTitle}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-orange-600">{claim.couponCode}</td>
                      <td className="py-2.5 px-3">{claim.user?.name || claim.guestId || "Guest"}</td>
                      <td className="py-2.5 px-3">{new Date(claim.expiresAt).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3">{new Date(claim.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
