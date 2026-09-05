"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  PlusCircle,
  Package,
  Tag,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Loader2,
  CloudRain,
  Radio,
  MapPin,
  Sparkles,
  Save,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

import { socket } from "@/lib/socket";
import { audioAlert } from "@/utils/audioAlert";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 📢 Live Broadcast Announcement State
  const [broadcastForm, setBroadcastForm] = useState({
    message: "🌧️ Bhopal Weather Alert: 10-minute deliveries active across all Bhopal pin codes!",
    type: "weather",
    isActive: true,
    linkText: "Shop Fresh",
    linkUrl: "/shop",
  });
  const [broadcastSaving, setBroadcastSaving] = useState(false);
  const [broadcastSavedMsg, setBroadcastSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/broadcast").then((res) => {
      if (res.data.success && res.data.broadcast) {
        setBroadcastForm(res.data.broadcast);
      }
    }).catch(() => {});
  }, []);

  const handleSaveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBroadcastSaving(true);
      const res = await axios.post("/api/broadcast", broadcastForm);
      if (res.data.success) {
        setBroadcastSavedMsg("✓ Live store broadcast updated successfully!");
        setTimeout(() => setBroadcastSavedMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update broadcast");
    } finally {
      setBroadcastSaving(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, ordersRes] = await Promise.all([
        axios.get("/api/admin/dashboard/summary"),
        axios.get("/api/admin/dashboard/recent-orders"),
      ]);
      setSummary(summaryRes.data);
      setRecentOrders(ordersRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    socket.connect();
    socket.on("new-order", () => {
      audioAlert.playNewOrderAlert();
      fetchDashboardData();
    });

    return () => {
      socket.off("new-order");
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-gray-900">
                Admin Overview
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Live store metrics, revenue & 10-min delivery fleet operations
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin text-[#0f8646]" : ""}
                />
                <span>Refresh</span>
              </button>

              <Link
                href="/admin/addgrocery"
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5"
              >
                <PlusCircle size={15} />
                <span>Add Produce</span>
              </Link>
            </div>
          </header>

          {/* Dashboard Body */}
          <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 w-full max-w-7xl mx-auto">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
                <p className="text-xs font-bold text-gray-500">
                  Loading SubziQuick Live Metrics...
                </p>
              </div>
            ) : (
              <>
                {/* Low Stock Alert Banner */}
                {summary?.lowStockCount > 0 && (
                  <div className="bg-amber-50/90 border border-amber-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-amber-950">
                          ⚠️ Low Stock Warning: {summary.lowStockCount} Produce Item(s) Running Low
                        </h3>
                        <p className="text-xs text-amber-800 mt-0.5">
                          {summary.lowStockItems?.map((i: any) => i.name).join(", ")}
                          {summary.lowStockCount > 5 ? ` +${summary.lowStockCount - 5} more` : ""} (under 10 units in stock)
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/admin/viewgrocery"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                    >
                      <Package size={14} />
                      <span>Quick Restock Produce</span>
                    </Link>
                  </div>
                )}

                {/* Metric Cards Grid - Fully Clickable */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {/* Total Revenue */}
                <Link
                  href="/admin/manageorder"
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-green-300 hover:scale-[1.02] transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase text-gray-400 tracking-wider group-hover:text-[#0f8646] transition">
                      Total Sales
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-green-50 text-[#0f8646] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900 block">
                      ₹{summary?.totalSales || 0}
                    </span>
                    <span className="text-[11px] text-green-700 font-bold mt-1 block">
                      ✓ View completed orders →
                    </span>
                  </div>
                </Link>

                {/* Total Orders */}
                <Link
                  href="/admin/manageorder"
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 hover:scale-[1.02] transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase text-gray-400 tracking-wider group-hover:text-blue-600 transition">
                      Total Orders
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900 block">
                      {summary?.totalOrders || 0}
                    </span>
                    <span className="text-[11px] text-blue-600 font-bold mt-1 block">
                      Manage all orders →
                    </span>
                  </div>
                </Link>

                {/* Active Customers */}
                <Link
                  href="/admin/manageinquiries"
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-purple-300 hover:scale-[1.02] transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase text-gray-400 tracking-wider group-hover:text-purple-600 transition">
                      Registered Customers
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900 block">
                      {summary?.totalCustomers || 0}
                    </span>
                    <span className="text-[11px] text-purple-600 font-bold mt-1 block">
                      View support & inquiries →
                    </span>
                  </div>
                </Link>

                {/* Delivery Fleet */}
                <Link
                  href="/admin/manageorder"
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-amber-300 hover:scale-[1.02] transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase text-gray-400 tracking-wider group-hover:text-amber-600 transition">
                      Delivery Fleet
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Truck size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900 block">
                      {summary?.totalDeliveryBoys || 0}
                    </span>
                    <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                      View active fleet dispatch →
                    </span>
                  </div>
                </Link>
              </div>

              {/* Order Status Breakdown Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/admin/manageorder"
                  className="bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-200/60 text-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-amber-800 font-bold block">
                        Pending / Unassigned
                      </span>
                      <span className="text-xl font-black text-amber-950">
                        {summary?.pendingOrders || 0} Orders
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-900 underline group-hover:no-underline">
                    Assign Rider →
                  </span>
                </Link>

                <Link
                  href="/admin/manageorder"
                  className="bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-200/60 text-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Truck size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-blue-800 font-bold block">
                        Out for Delivery
                      </span>
                      <span className="text-xl font-black text-blue-950">
                        {summary?.outForDeliveryOrders || 0} Orders
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-900 underline group-hover:no-underline">
                    Live GPS Map →
                  </span>
                </Link>

                <Link
                  href="/admin/manageorder"
                  className="bg-green-50/80 hover:bg-green-100/90 border border-green-200/80 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-200/60 text-[#0f8646] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-green-800 font-bold block">
                        Delivered & Completed
                      </span>
                      <span className="text-xl font-black text-green-950">
                        {summary?.deliveredOrders || 0} Orders
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#0f8646]">
                    ✓ Success History →
                  </span>
                </Link>
              </div>

              {/* 1. 📢 Store Announcement & Weather Alert Broadcast Center */}
              <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Radio size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-white">
                        Live Store Announcement & Weather Broadcast
                      </h3>
                      <p className="text-xs text-gray-400">
                        Publish instant weather warnings, emergency notices or sales banners across all customer devices
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {broadcastSavedMsg && (
                      <span className="text-xs font-black text-emerald-400 animate-fade-in">
                        {broadcastSavedMsg}
                      </span>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-800/80 px-3 py-1.5 rounded-xl border border-gray-700">
                      <span className="text-xs font-bold text-gray-300">
                        {broadcastForm.isActive ? "🟢 Active on Store" : "⚪ Disabled"}
                      </span>
                      <input
                        type="checkbox"
                        checked={broadcastForm.isActive}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-[#0f8646] cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                <form onSubmit={handleSaveBroadcast} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Announcement Message (Hindi / English)
                      </label>
                      <input
                        type="text"
                        required
                        value={broadcastForm.message}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                        placeholder="e.g. 🌧️ Bhopal Heavy Rain: Fleet is on the move, 10 min express delivery active!"
                        className="w-full bg-gray-800/90 border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-white outline-none focus:border-[#0f8646]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Alert Theme / Category
                      </label>
                      <select
                        value={broadcastForm.type}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value as any })}
                        className="w-full bg-gray-800/90 border border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#0f8646] cursor-pointer"
                      >
                        <option value="weather">🌧️ Weather Alert (Blue)</option>
                        <option value="promo">🎉 Promo / Harvest Offer (Green)</option>
                        <option value="warning">⚠️ Notice / Delay Alert (Orange)</option>
                        <option value="info">ℹ️ Store Update (Purple)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <input
                        type="text"
                        value={broadcastForm.linkText}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, linkText: e.target.value })}
                        placeholder="Button Text (e.g. Order Now)"
                        className="w-1/2 bg-gray-800/90 border border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      />
                      <input
                        type="text"
                        value={broadcastForm.linkUrl}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, linkUrl: e.target.value })}
                        placeholder="Target Link (e.g. /shop)"
                        className="w-1/2 bg-gray-800/90 border border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={broadcastSaving}
                      className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Save size={14} />
                      <span>{broadcastSaving ? "Broadcasting..." : "Save & Broadcast Live"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. 🗺️ Bhopal Delivery Locality Demand & Heatmap Breakdown */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center shadow-xs shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-gray-900">
                        Bhopal Locality Demand Breakdown & Order Heatmap
                      </h3>
                      <p className="text-xs text-gray-500">
                        Real-time order density from Amrai Store, Bagsewaniya (Daily 6 AM – 1 PM Dispatch)
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-black bg-green-50 text-[#0f8646] border border-green-200 px-3 py-1 rounded-xl">
                    🌿 Bagsewaniya Store (Amrai): Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {(summary?.bhopalLocalities || []).map((pocket: any, idx: number) => {
                    const totalOrdersCount = summary?.totalOrders || 1;
                    const percent = Math.min(100, Math.round((pocket.count / totalOrdersCount) * 100));
                    return (
                      <div
                        key={idx}
                        className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between gap-2 hover:bg-green-50/50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#0f8646]" />
                            {pocket.name}
                          </span>
                          <span className="text-[11px] font-extrabold text-[#0f8646]">
                            {pocket.count} Orders
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden my-1">
                          <div
                            className="bg-[#0f8646] h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(8, percent)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                          <span>Revenue: ₹{pocket.revenue}</span>
                          <span>{percent}% Bhopal Share</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
                <h3 className="font-extrabold text-sm text-gray-900 mb-4 uppercase tracking-wider">
                  Quick Management Shortcuts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link
                    href="/admin/manageorder"
                    className="p-4 rounded-2xl bg-gray-50/80 hover:bg-green-50 border border-gray-100 hover:border-green-200 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-[#0f8646] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <ShoppingBag size={20} />
                    </div>
                    <span className="font-bold text-xs text-gray-900">
                      Manage Orders
                    </span>
                  </Link>

                  <Link
                    href="/admin/viewgrocery"
                    className="p-4 rounded-2xl bg-gray-50/80 hover:bg-green-50 border border-gray-100 hover:border-green-200 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-[#0f8646] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <Package size={20} />
                    </div>
                    <span className="font-bold text-xs text-gray-900">
                      All Inventory
                    </span>
                  </Link>

                  <Link
                    href="/admin/managecoupons"
                    className="p-4 rounded-2xl bg-gray-50/80 hover:bg-green-50 border border-gray-100 hover:border-green-200 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-[#0f8646] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <Tag size={20} />
                    </div>
                    <span className="font-bold text-xs text-gray-900">
                      Coupons & Deals
                    </span>
                  </Link>

                  <Link
                    href="/admin/manageinquiries"
                    className="p-4 rounded-2xl bg-gray-50/80 hover:bg-green-50 border border-gray-100 hover:border-green-200 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-[#0f8646] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <MessageSquare size={20} />
                    </div>
                    <span className="font-bold text-xs text-gray-900">
                      Support Inquiries
                    </span>
                  </Link>
                </div>
              </div>

              {/* Recent Orders Live Table */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-black text-lg text-gray-900">
                      Recent Orders
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Newest incoming customer orders across Bhopal
                    </p>
                  </div>

                  <Link
                    href="/admin/manageorder"
                    className="text-xs font-extrabold text-[#0f8646] hover:text-[#0c6a38] flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold">No recent orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-[11px] font-black uppercase text-gray-400">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Items</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3 text-right">Total</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {recentOrders.slice(0, 8).map((order: any, idx: number) => {
                          const orderId = order._id || order.id || `ORD-${idx}`;
                          const displayCode = typeof orderId === "string" ? orderId.slice(-6).toUpperCase() : String(orderId);
                          const customerName = order.customer || order.address?.fullname || order.user?.name || "Customer";
                          const totalAmt = order.totalamount ?? order.amount ?? 0;
                          const paymentMode = order.paymentmethod || "COD";
                          const itemsCount = order.itemsCount || order.items?.length || 1;
                          const currentStatus = order.status || "pending";

                          return (
                            <tr
                              key={orderId || idx}
                              className="hover:bg-gray-50/60 transition"
                            >
                              <td className="py-3.5 font-extrabold text-gray-900">
                                #{displayCode}
                              </td>
                              <td className="py-3.5">
                                <span className="font-bold text-gray-900 block">
                                  {customerName}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {order.address?.city || "Bhopal"}
                                </span>
                              </td>
                              <td className="py-3.5 text-gray-600 font-medium">
                                {itemsCount} Produce item(s)
                              </td>
                              <td className="py-3.5">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    currentStatus === "delivered" || currentStatus === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : currentStatus === "out of delivery"
                                      ? "bg-blue-100 text-blue-800 animate-pulse"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {currentStatus}
                                </span>
                              </td>
                              <td className="py-3.5 uppercase font-bold text-gray-500">
                                {paymentMode}
                              </td>
                              <td className="py-3.5 text-right font-black text-[#0f8646]">
                                ₹{totalAmt}
                              </td>
                              <td className="py-3.5 text-right">
                                <Link
                                  href="/admin/manageorder"
                                  className="bg-gray-100 hover:bg-[#0f8646] hover:text-white px-3 py-1.5 rounded-lg font-extrabold text-[11px] transition inline-block"
                                >
                                  Manage
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  </div>
);
}
