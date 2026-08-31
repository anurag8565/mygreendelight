"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Percent, Plus, Edit2, X, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import axios from "axios";

export default function ManageCombosPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    badge: "Save 20%",
    originalPrice: 150,
    comboPrice: 120,
    discountPercentage: 20,
    image: "",
    isActive: true,
  });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const res = await axios.get("/api/combos");
      if (res.data.success) {
        setCombos(res.data.combos || []);
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
        await axios.put("/api/combos", { id: editingId, ...form });
        setMsg({ type: "success", text: "Combo bundle updated successfully!" });
      } else {
        await axios.post("/api/combos", form);
        setMsg({ type: "success", text: "New combo bundle created!" });
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchCombos();
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to save combo" });
    }
  };

  const handleEdit = (c: any) => {
    setEditingId(c._id);
    setForm({
      title: c.title,
      subtitle: c.subtitle,
      badge: c.badge,
      originalPrice: c.originalPrice,
      comboPrice: c.comboPrice,
      discountPercentage: c.discountPercentage,
      image: c.image,
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                <Percent size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Save-More Value Combos & Multipacks Manager
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Create, edit and manage discounted grocery bundles, multipacks & value packs.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                subtitle: "",
                badge: "Save 20%",
                originalPrice: 150,
                comboPrice: 120,
                discountPercentage: 20,
                image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=400&q=80",
                isActive: true,
              });
              setIsModalOpen(true);
            }}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Combo Bundle</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {combos.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <img src={c.image} alt={c.title} className="w-full h-36 rounded-xl object-cover mb-3" />
                <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mb-1">
                  {c.badge}
                </span>
                <h3 className="font-black text-sm text-gray-900 line-clamp-1">{c.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{c.subtitle}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-[#0f8646]">₹{c.comboPrice}</span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">₹{c.originalPrice}</span>
                </div>

                <button
                  onClick={() => handleEdit(c)}
                  className="text-gray-600 hover:text-[#0f8646] p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-gray-900">
                  {editingId ? "Edit Combo Bundle" : "Add New Combo Bundle"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Combo Title</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Items Subtitle</label>
                  <input
                    required
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Original Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Combo Discount Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={form.comboPrice}
                      onChange={(e) => setForm({ ...form, comboPrice: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Image URL</label>
                    <input
                      required
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
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
                    Save Combo
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
