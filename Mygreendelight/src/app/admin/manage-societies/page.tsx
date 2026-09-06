"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Users,
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  MapPin,
  Percent,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import axios from "axios";

export default function ManageSocietiesPage() {
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    locality: "",
    landmark: "",
    pincode: "462001",
    targetOrders: 3,
    discountPercent: 5,
    keywords: "",
    isActive: true,
  });

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/societies");
      if (res.data.success) {
        setSocieties(res.data.societies || []);
      }
    } catch (error: any) {
      console.error(error);
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Failed to load societies",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: "",
      locality: "",
      landmark: "",
      pincode: "462001",
      targetOrders: 3,
      discountPercent: 5,
      keywords: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (soc: any) => {
    setEditingId(soc._id);
    setForm({
      name: soc.name,
      locality: soc.locality,
      landmark: soc.landmark || "",
      pincode: soc.pincode || "462001",
      targetOrders: soc.targetOrders || 3,
      discountPercent: soc.discountPercent || 5,
      keywords: Array.isArray(soc.keywords) ? soc.keywords.join(", ") : soc.keywords || "",
      isActive: soc.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const payload = {
        ...form,
        targetOrders: Number(form.targetOrders),
        discountPercent: Number(form.discountPercent),
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await axios.put(`/api/admin/societies/${editingId}`, payload);
        setMsg({ type: "success", text: "Society pool updated successfully!" });
      } else {
        await axios.post("/api/admin/societies", payload);
        setMsg({ type: "success", text: "New Bhopal society pool added successfully!" });
      }
      setIsModalOpen(false);
      fetchSocieties();
    } catch (error: any) {
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Failed to save society",
      });
    }
  };

  const handleToggleActive = async (soc: any) => {
    try {
      await axios.put(`/api/admin/societies/${soc._id}`, {
        isActive: !soc.isActive,
      });
      setSocieties((prev) =>
        prev.map((item) =>
          item._id === soc._id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } catch (error: any) {
      setMsg({
        type: "error",
        text: "Failed to update status",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`/api/admin/societies/${id}`);
      setMsg({ type: "success", text: "Society removed successfully." });
      setSocieties((prev) => prev.filter((s) => s._id !== id));
    } catch (error: any) {
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Failed to delete society",
      });
    }
  };

  const filtered = societies.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.locality.toLowerCase().includes(search.toLowerCase()) ||
      (s.landmark && s.landmark.toLowerCase().includes(search.toLowerCase())) ||
      (s.pincode && s.pincode.includes(search))
  );

  const totalActive = societies.filter((s) => s.isActive).length;
  const totalUnlocked = societies.filter((s) => s.isUnlocked).length;
  const totalOrdersPooled = societies.reduce((acc, s) => acc + (s.currentOrders || 0), 0);

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black">
                <Building2 size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Bhopal Society Pools & Group Discounts
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Real database-backed colony pools. When orders meet the target, 5% group savings unlock automatically.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Bhopal Society</span>
          </button>
        </div>

        {/* Status Alerts */}
        {msg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center justify-between gap-3 ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {msg.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{msg.text}</span>
            </div>
            <button
              onClick={() => setMsg(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 block mb-1">
              Registered Societies
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-gray-900">
                {societies.length}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Database Backed
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 block mb-1">
              Active Community Pools
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#0f8646]">
                {totalActive}
              </span>
              <span className="text-[10px] font-extrabold text-gray-500">
                Live on Home
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 block mb-1">
              Unlocked Pools (5% OFF)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">
                {totalUnlocked}
              </span>
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                Target Met
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 block mb-1">
              Live Orders Matched (48h)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-700">
                {totalOrdersPooled}
              </span>
              <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Real DB Orders
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs mb-6 flex items-center gap-3">
          <Search size={18} className="text-gray-400 shrink-0 ml-2" />
          <input
            type="text"
            placeholder="Search society name, locality (e.g. Arera, Kolar, MP Nagar, Minal)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-800 focus:outline-hidden"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold mr-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Societies Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-[#0f8646] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-bold">Loading Bhopal Society Database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <Building2 size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-black text-gray-700 text-sm mb-1">No Societies Found</h3>
            <p className="text-xs text-gray-400 mb-4">Click "Add Bhopal Society" to register your first colony pool.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#0f8646] text-white rounded-xl text-xs font-black shadow-sm"
            >
              Add Society
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((soc) => {
              const current = soc.currentOrders || 0;
              const target = soc.targetOrders || 3;
              const pct = Math.min(100, Math.round((current / target) * 100));

              return (
                <div
                  key={soc._id}
                  className={`bg-white rounded-3xl border p-5 shadow-2xs flex flex-col justify-between transition-all ${
                    soc.isActive ? "border-gray-200/90" : "border-gray-200 opacity-60 bg-gray-50/50"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          {soc.locality} • PIN {soc.pincode}
                        </span>
                        <h3 className="font-black text-base text-gray-900 leading-tight">
                          {soc.name}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                          soc.isUnlocked
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {soc.isUnlocked ? "🎉 5% Unlocked" : `${soc.ordersNeeded} Needed`}
                      </span>
                    </div>

                    {soc.landmark && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3.5">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        <span>{soc.landmark}</span>
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-4">
                      <div className="flex items-center justify-between text-xs font-black mb-1.5">
                        <span className="text-gray-600">Pool Progress</span>
                        <span className="text-[#0f8646]">
                          {current} / {target} Orders ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-[#0f8646] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Keywords tags */}
                    {soc.keywords && soc.keywords.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-gray-400 block mb-1">
                          Auto-Matching Keywords:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {soc.keywords.map((kw: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(soc)}
                      className={`text-[11px] font-black px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        soc.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {soc.isActive ? "Active (Live)" : "Inactive (Hidden)"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(soc)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-[#0f8646] transition cursor-pointer"
                        title="Edit Society"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(soc._id, soc.name)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition cursor-pointer"
                        title="Delete Society"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black">
                    <Building2 size={18} />
                  </div>
                  <h3 className="text-base font-black text-gray-900">
                    {editingId ? "Edit Society Pool" : "Add New Bhopal Society Pool"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">
                    Society / Colony Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Arera Colony (E1 - E7 & Green Meadows)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0f8646] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      Bhopal Locality / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.locality}
                      onChange={(e) => setForm({ ...form, locality: e.target.value })}
                      placeholder="e.g. Arera Colony"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0f8646] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="e.g. 462016"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0f8646] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">
                    Landmark / Proximity
                  </label>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    placeholder="e.g. Bittan Market / 10 No. Market"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0f8646] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      Target Orders to Unlock
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={form.targetOrders}
                      onChange={(e) => setForm({ ...form, targetOrders: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0f8646] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      Discount % Benefit
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={form.discountPercent}
                      onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0f8646] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">
                    Address Matching Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    placeholder="e.g. arera, bittan, e-1, e-2, 10 no"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0f8646] focus:bg-white"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Orders matching these keywords in their full address automatically count towards this pool.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0f8646] rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isActiveToggle" className="text-xs font-bold text-gray-700 cursor-pointer">
                    Enable this society pool immediately (Live on Home Page)
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-xl font-black text-xs shadow-md transition cursor-pointer"
                  >
                    {editingId ? "Update Society" : "Save Society to DB"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
