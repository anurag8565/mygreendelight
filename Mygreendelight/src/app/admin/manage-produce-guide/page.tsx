"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { BookOpen, Plus, Edit2, X, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function ManageProduceGuidePage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: "",
    icon: "🥬",
    idealStorage: "",
    temperature: "4°C - 8°C",
    shelfLifeDays: 5,
    ripenessTips: "",
    kitchenHacks: "",
    washingAdvice: "100% Ozone washed before delivery. Rinse gently under cold running water before cooking.",
  });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await axios.get("/api/produce-guide");
      if (res.data.success) {
        setGuides(res.data.guides || []);
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
        await axios.put("/api/produce-guide", { id: editingId, ...form });
        setMsg({ type: "success", text: "Storage guide updated successfully!" });
      } else {
        await axios.post("/api/produce-guide", form);
        setMsg({ type: "success", text: "New storage guide added!" });
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchGuides();
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to save guide" });
    }
  };

  const handleEdit = (g: any) => {
    setEditingId(g._id);
    setForm({
      category: g.category,
      icon: g.icon,
      idealStorage: g.idealStorage,
      temperature: g.temperature,
      shelfLifeDays: g.shelfLifeDays,
      ripenessTips: g.ripenessTips,
      kitchenHacks: g.kitchenHacks,
      washingAdvice: g.washingAdvice,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-8 pt-18 sm:pt-20 lg:pt-8 max-w-6xl mx-auto overflow-x-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-black">
                <BookOpen size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Produce Ripeness & Kitchen Storage Guide Manager
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Manage Indian kitchen storage hacks, shelf life days, and ripeness tips displayed across produce items.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                category: "",
                icon: "🥬",
                idealStorage: "",
                temperature: "4°C - 8°C",
                shelfLifeDays: 5,
                ripenessTips: "",
                kitchenHacks: "",
                washingAdvice: "100% Ozone washed before delivery.",
              });
              setIsModalOpen(true);
            }}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Storage Guide</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((g) => (
            <div
              key={g._id}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{g.icon}</span>
                    <h3 className="font-black text-sm text-gray-900">{g.category}</h3>
                  </div>
                  <button
                    onClick={() => handleEdit(g)}
                    className="text-gray-600 hover:text-[#0f8646] p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <Edit2 size={15} />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <p>
                    <strong className="text-gray-900">Storage:</strong> {g.idealStorage}
                  </p>
                  <p>
                    <strong className="text-gray-900">Shelf Life:</strong> ~{g.shelfLifeDays} Days ({g.temperature})
                  </p>
                  <p>
                    <strong className="text-gray-900">Desi Hack:</strong> {g.kitchenHacks}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-gray-900">
                  {editingId ? "Edit Storage Guide" : "Add Storage Guide"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-700 block mb-1">Icon</label>
                    <input
                      type="text"
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-center"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-bold text-gray-700 block mb-1">Category Title</label>
                    <input
                      required
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Ideal Temperature</label>
                    <input
                      required
                      type="text"
                      value={form.temperature}
                      onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Shelf Life (Days)</label>
                    <input
                      required
                      type="number"
                      value={form.shelfLifeDays}
                      onChange={(e) => setForm({ ...form, shelfLifeDays: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">How to Store</label>
                  <textarea
                    required
                    rows={2}
                    value={form.idealStorage}
                    onChange={(e) => setForm({ ...form, idealStorage: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Desi Kitchen Hack</label>
                  <textarea
                    required
                    rows={2}
                    value={form.kitchenHacks}
                    onChange={(e) => setForm({ ...form, kitchenHacks: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Ripeness & Quality Check</label>
                  <textarea
                    required
                    rows={2}
                    value={form.ripenessTips}
                    onChange={(e) => setForm({ ...form, ripenessTips: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0f8646] text-white px-5 py-2 text-xs font-black rounded-xl shadow-sm"
                  >
                    Save Guide
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
