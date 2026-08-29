"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Flame,
  Clock,
  Save,
  CheckCircle2,
  Calendar,
  Zap,
  Loader2,
  Eye,
  Power,
  RefreshCw,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageFlashDeals() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    endTime: "",
    badgeText: "FLAT 25% - 40% OFF",
    isActive: true,
  });

  const [previewTimer, setPreviewTimer] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/flash-deal");
      if (res.data.success && res.data.setting) {
        const s = res.data.setting;
        // Format ISO date to local input datetime-local string (YYYY-MM-DDTHH:MM)
        const dateObj = new Date(s.endTime);
        const pad = (n: number) => String(n).padStart(2, "0");
        const formattedDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
          dateObj.getDate()
        )}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;

        setFormData({
          endTime: formattedDate,
          badgeText: s.badgeText || "FLAT 25% - 40% OFF",
          isActive: s.isActive !== undefined ? s.isActive : true,
        });
      }
    } catch (error) {
      console.error("Error fetching flash deal settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update live preview countdown
  useEffect(() => {
    const updatePreview = () => {
      if (!formData.endTime) return;
      const target = new Date(formData.endTime).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setPreviewTimer({ hours: "00", minutes: "00", seconds: "00", isExpired: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setPreviewTimer({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        isExpired: false,
      });
    };

    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [formData.endTime]);

  const applyPreset = (type: "2h" | "6h" | "tonight" | "tomorrow" | "3days") => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");

    let targetDate = new Date();
    if (type === "2h") {
      targetDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    } else if (type === "6h") {
      targetDate = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    } else if (type === "tonight") {
      targetDate.setHours(23, 59, 0, 0);
    } else if (type === "tomorrow") {
      targetDate.setDate(targetDate.getDate() + 1);
      targetDate.setHours(23, 59, 0, 0);
    } else if (type === "3days") {
      targetDate.setDate(targetDate.getDate() + 3);
      targetDate.setHours(23, 59, 0, 0);
    }

    const formatted = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(
      targetDate.getDate()
    )}T${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;

    setFormData((prev) => ({ ...prev, endTime: formatted }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.endTime) return alert("Please select an end date and time");

    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await axios.post("/api/admin/flash-deal", {
        endTime: new Date(formData.endTime).toISOString(),
        badgeText: formData.badgeText,
        isActive: formData.isActive,
      });

      if (res.data.success) {
        setSuccessMsg("✓ Flash Deals Timer & Settings Updated Live!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans">
      <AdminSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Flame size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Flash Deals & Timer Manager
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Control the homepage Flash Deals reverse countdown clock, badge banner, and active schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSettings}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#0f8646]" : ""} />
            <span>Reload</span>
          </button>
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
            <p className="text-sm font-bold text-gray-600">Loading Flash Deal Settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Settings Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleSave} className="space-y-6">
                {/* 1. Toggle Active State */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                        formData.isActive ? "bg-green-100 text-[#0f8646]" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Power size={18} />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-gray-900 block">
                        Flash Deals Status
                      </span>
                      <span className="text-xs text-gray-500">
                        {formData.isActive ? "Section & countdown is active on home page" : "Flash deals section is disabled"}
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

                {/* 2. End Date & Time Picker */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5 mb-2">
                    <Calendar size={14} className="text-[#0f8646]" />
                    <span>Flash Deal End Date & Time (Target)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition"
                    required
                  />
                  <p className="text-[11px] text-gray-400 font-medium mt-1">
                    When this time is reached, the countdown clock on the home page will end.
                  </p>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-2">
                    Quick Timer Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset("2h")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      ⏱️ 2 Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("6h")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      ⏱️ 6 Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("tonight")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-green-50 hover:text-[#0f8646] hover:border-green-200 border border-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      🌙 Tonight (11:59 PM)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("tomorrow")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-green-50 hover:text-[#0f8646] hover:border-green-200 border border-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      ☀️ Tomorrow Midnight
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("3days")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      📅 3 Days Sale
                    </button>
                  </div>
                </div>

                {/* 3. Badge Text */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5 mb-2">
                    <Zap size={14} className="text-yellow-500" />
                    <span>Special Promo / Discount Text</span>
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="e.g. FLAT 25% - 40% OFF or TODAY'S SPECIAL"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition"
                  />
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
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save & Publish Live Timer</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Live Customer Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs">
                <h3 className="font-extrabold text-sm text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <Eye size={16} className="text-[#0f8646]" />
                  <span>Customer Live Preview</span>
                </h3>

                {/* Preview Box */}
                <div className="bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-white rounded-2xl p-4 border border-orange-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded block w-fit mb-3">
                    Homepage Header Bar Preview
                  </span>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Flame size={18} className="animate-bounce" />
                      </div>
                      <h4 className="text-base font-black text-gray-900">
                        Flash Deals
                      </h4>
                    </div>

                    {/* Timer Pill */}
                    <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-lg text-xs font-black shadow-2xs">
                      <Clock size={13} />
                      <span>
                        {previewTimer.isExpired
                          ? "Deal Expired"
                          : `Ends in: ${previewTimer.hours}:${previewTimer.minutes}:${previewTimer.seconds}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-orange-100/80 flex items-center justify-between text-xs text-gray-500">
                    <span>Badge Promo:</span>
                    <span className="font-extrabold text-[#0f8646]">{formData.badgeText}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-xs text-gray-500 space-y-1">
                  <p className="font-bold text-gray-700">💡 How it works:</p>
                  <p>• Save karne par home page par clock real-time reverse countdown karegi.</p>
                  <p>• Target time khatam hone par timer automatically end show karega.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
