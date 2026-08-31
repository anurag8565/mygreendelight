"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Gift, Plus, Edit2, X, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function ManageGiftBasketsPage() {
  const [baskets, setBaskets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    occasion: "Festive & Celebrations",
    description: "",
    contents: "Kashmiri Royal Apples, Nagpur Oranges, Grapes, Almonds",
    price: 499,
    originalPrice: 650,
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
    ribbonColor: "Gold Ribbon",
    isPopular: true,
    isActive: true,
  });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBaskets();
  }, []);

  const fetchBaskets = async () => {
    try {
      const res = await axios.get("/api/gift-baskets");
      if (res.data.success) {
        setBaskets(res.data.baskets || []);
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
      const payload = {
        ...form,
        contents: form.contents.split(",").map((s) => s.trim()),
      };

      if (editingId) {
        await axios.put("/api/gift-baskets", { id: editingId, ...payload });
        setMsg({ type: "success", text: "Gift hamper updated successfully!" });
      } else {
        await axios.post("/api/gift-baskets", payload);
        setMsg({ type: "success", text: "New gift hamper created!" });
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchBaskets();
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to save hamper" });
    }
  };

  const handleEdit = (b: any) => {
    setEditingId(b._id);
    setForm({
      title: b.title,
      occasion: b.occasion,
      description: b.description,
      contents: b.contents?.join(", ") || "",
      price: b.price,
      originalPrice: b.originalPrice,
      image: b.image,
      ribbonColor: b.ribbonColor,
      isPopular: b.isPopular,
      isActive: b.isActive,
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
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-black">
                <Gift size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Gift Hamper & Farm Basket Manager
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Manage curated fruit & produce hampers with custom greeting cards and ribbon packaging.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                occasion: "Festive & Celebrations",
                description: "",
                contents: "Kashmiri Royal Apples, Nagpur Oranges, Grapes, Almonds",
                price: 499,
                originalPrice: 650,
                image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
                ribbonColor: "Gold Ribbon",
                isPopular: true,
                isActive: true,
              });
              setIsModalOpen(true);
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Gift Hamper</span>
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
          {baskets.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <img src={b.image} alt={b.title} className="w-full h-36 rounded-xl object-cover mb-3" />
                <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md inline-block mb-1">
                  {b.occasion}
                </span>
                <h3 className="font-black text-sm text-gray-900 line-clamp-1">{b.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{b.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-[#0f8646]">₹{b.price}</span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">₹{b.originalPrice}</span>
                </div>

                <button
                  onClick={() => handleEdit(b)}
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
                  {editingId ? "Edit Gift Hamper" : "Add New Gift Hamper"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Hamper Title</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Occasion Tag</label>
                  <input
                    required
                    type="text"
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Contents (Comma separated)</label>
                  <input
                    required
                    type="text"
                    value={form.contents}
                    onChange={(e) => setForm({ ...form, contents: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">MRP Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
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
                    className="bg-pink-600 text-white px-5 py-2 text-xs font-black rounded-xl shadow-sm"
                  >
                    Save Hamper
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
