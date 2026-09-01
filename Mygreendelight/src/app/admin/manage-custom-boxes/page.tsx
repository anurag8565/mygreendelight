"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Salad, Plus, Trash2, Edit2, X, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import axios from "axios";

export default function ManageCustomBoxesPage() {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "base",
    price: 25,
    calories: 20,
    protein: 1.5,
    image: "",
    isAvailable: true,
  });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get("/api/custom-box");
      if (res.data.success) {
        setIngredients(res.data.ingredients || []);
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
        await axios.put("/api/custom-box", { id: editingId, ...form });
        setMsg({ type: "success", text: "Ingredient updated successfully!" });
      } else {
        await axios.post("/api/custom-box", form);
        setMsg({ type: "success", text: "New ingredient added to custom box!" });
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchIngredients();
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to save ingredient" });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      calories: item.calories,
      protein: item.protein,
      image: item.image,
      isAvailable: item.isAvailable,
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
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <Salad size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Custom Salad & Detox Box Ingredients Manager
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Manage base greens, toppings, superfoods, dressings, prices & calorie counts for the custom bowl builder.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                category: "base",
                price: 25,
                calories: 20,
                protein: 1.5,
                image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=300&q=80",
                isAvailable: true,
              });
              setIsModalOpen(true);
            }}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Box Ingredient</span>
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

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs flex items-center justify-between gap-3"
            >
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
                  {item.category.replace("_", " ")}
                </span>
                <h3 className="font-black text-xs text-gray-900 truncate">{item.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium mt-0.5">
                  <span className="font-black text-[#0f8646]">₹{item.price}</span>
                  <span>•</span>
                  <span>{item.calories} kcal</span>
                  <span>•</span>
                  <span>{item.protein}g P</span>
                </div>
              </div>

              <button
                onClick={() => handleEdit(item)}
                className="text-gray-600 hover:text-[#0f8646] p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <Edit2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-gray-900">
                  {editingId ? "Edit Box Ingredient" : "Add New Box Ingredient"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Ingredient Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      <option value="base">Base Greens</option>
                      <option value="veggie">Farm Veggies</option>
                      <option value="protein_crunch">Protein & Superfoods</option>
                      <option value="dressing">Dressing / Herbs</option>
                    </select>
                  </div>
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
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={form.calories}
                      onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.protein}
                      onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })}
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
                    className="bg-[#0f8646] text-white px-5 py-2 text-xs font-black rounded-xl shadow-sm"
                  >
                    Save Ingredient
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
