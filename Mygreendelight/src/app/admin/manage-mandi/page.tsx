"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { TrendingDown, Plus, Trash2, Edit2, Save, X, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function ManageMandiPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    itemName: "",
    currentRate: 20,
    unit: "1 kg",
    priceChange: "down",
    percentageChange: 20,
    isActive: true,
  });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await axios.get("/api/mandi");
      if (res.data.success) {
        setRates(res.data.rates || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      if (editingId) {
        await axios.put("/api/mandi", { id: editingId, ...form });
        setMsg({ type: "success", text: "Mandi rate updated successfully!" });
      } else {
        await axios.post("/api/mandi", form);
        setMsg({ type: "success", text: "New Mandi item added successfully!" });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setForm({ itemName: "", currentRate: 20, unit: "1 kg", priceChange: "down", percentageChange: 20, isActive: true });
      fetchRates();
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to save rate" });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      itemName: item.itemName,
      currentRate: item.currentRate,
      unit: item.unit,
      priceChange: item.priceChange,
      percentageChange: item.percentageChange,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from Mandi database?`)) return;
    try {
      const res = await axios.delete(`/api/mandi?id=${id}`);
      if (res.data.success) {
        setMsg({ type: "success", text: `"${name}" permanently removed from database!` });
        fetchRates();
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to delete item" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-8 pt-18 sm:pt-20 lg:pt-8 max-w-6xl mx-auto overflow-x-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <TrendingDown size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Bhopal Mandi Live Rates & Price Drops
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Update today's mandi vegetable rates & price drop badges shown on the homepage ticker.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({ itemName: "", currentRate: 20, unit: "1 kg", priceChange: "down", percentageChange: 20, isActive: true });
              setIsModalOpen(true);
            }}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Mandi Item</span>
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

        {/* Rates Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Item Name</th>
                  <th className="py-3 px-3">Current Mandi Rate</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3">Price Trend</th>
                  <th className="py-3 px-3">Discount %</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {rates.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-3 font-bold text-gray-900">{item.itemName}</td>
                    <td className="py-3 px-3 font-black text-[#0f8646]">₹{item.currentRate}</td>
                    <td className="py-3 px-3">{item.unit}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          item.priceChange === "down"
                            ? "bg-green-100 text-green-800"
                            : item.priceChange === "up"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.priceChange === "down" ? "↓ Price Drop" : item.priceChange === "up" ? "↑ Increased" : "Stable"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-green-700">
                      {item.percentageChange > 0 ? `${item.percentageChange}% OFF` : "—"}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold ${item.isActive ? "text-green-600" : "text-gray-400"}`}>
                        {item.isActive ? "🟢 Active" : "⚪ Hidden"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-gray-600 hover:text-[#0f8646] p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                          title="Edit Rate"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.itemName)}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Delete Rate"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-gray-900">
                  {editingId ? "Edit Mandi Rate" : "Add New Mandi Item"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Item Name</label>
                  <input
                    required
                    type="text"
                    value={form.itemName}
                    onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                    placeholder="e.g. Desi Tamatar"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Rate (₹)</label>
                    <input
                      required
                      type="number"
                      value={form.currentRate}
                      onChange={(e) => setForm({ ...form, currentRate: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Unit</label>
                    <input
                      type="text"
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      placeholder="e.g. 1 kg"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Trend</label>
                    <select
                      value={form.priceChange}
                      onChange={(e: any) => setForm({ ...form, priceChange: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646]"
                    >
                      <option value="down">Price Drop (Discount)</option>
                      <option value="stable">Stable Rate</option>
                      <option value="up">Increased</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Discount % Drop</label>
                    <input
                      type="number"
                      value={form.percentageChange}
                      onChange={(e) => setForm({ ...form, percentageChange: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="activeToggle"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#0f8646]"
                  />
                  <label htmlFor="activeToggle" className="text-xs font-bold text-gray-700 cursor-pointer">
                    Show on Homepage Mandi Ticker
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2 rounded-xl text-xs font-black shadow-sm cursor-pointer"
                  >
                    {editingId ? "Update Rate" : "Save Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
