"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  ChefHat,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import axios from "axios";

interface Ingredient {
  name: string;
  qty: string;
  price: number;
  image?: string;
}

export default function ManageRecipesPage() {
  const [kits, setKits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    hindiName: "",
    serves: "3-4 Persons",
    cookTime: "25 Mins",
    badge: "⭐ Chef's Favorite",
    price: 149,
    mrp: 199,
    image: "/categories/vegetables.jpg",
    ingredients: [
      { name: "Farm Fresh Spinach (Palak)", qty: "500g", price: 30, image: "/categories/vegetables.jpg" },
      { name: "Fresh Malai Paneer", qty: "200g", price: 85, image: "/categories/exotic.jpg" },
    ] as Ingredient[],
  });

  const fetchKits = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/recipe-kits");
      if (res.data.success) {
        setKits(res.data.kits);
      }
    } catch (error) {
      console.error("Error fetching recipe kits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  const handleAddIngredientRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: "", qty: "250g", price: 20, image: "/categories/vegetables.jpg" },
      ],
    }));
  };

  const handleRemoveIngredientRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.ingredients];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ingredients: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await axios.put(`/api/recipe-kits/${editingId}`, formData);
        if (res.data.success) {
          alert("Recipe kit updated successfully!");
        }
      } else {
        const res = await axios.post("/api/recipe-kits", formData);
        if (res.data.success) {
          alert("Recipe kit created in database!");
        }
      }
      setIsFormOpen(false);
      setEditingId(null);
      fetchKits();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save recipe kit");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe kit from database?")) return;
    try {
      const res = await axios.delete(`/api/recipe-kits/${id}`);
      if (res.data.success) {
        setKits((prev) => prev.filter((k) => k._id !== id));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete kit");
    }
  };

  const handleToggleActive = async (kit: any) => {
    try {
      const updatedStatus = !kit.isActive;
      await axios.put(`/api/recipe-kits/${kit._id}`, { isActive: updatedStatus });
      setKits((prev) =>
        prev.map((k) => (k._id === kit._id ? { ...k, isActive: updatedStatus } : k))
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleEditClick = (kit: any) => {
    setEditingId(kit._id);
    setFormData({
      name: kit.name,
      hindiName: kit.hindiName || "",
      serves: kit.serves || "3-4 Persons",
      cookTime: kit.cookTime || "25 Mins",
      badge: kit.badge || "⭐ Chef's Favorite",
      price: kit.price,
      mrp: kit.mrp,
      image: kit.image || "/categories/vegetables.jpg",
      ingredients: kit.ingredients || [],
    });
    setIsFormOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <ChefHat size={22} />
              </span>
              <h1 className="text-2xl font-black text-gray-900">
                Manage 1-Click Recipe Ingredient Kits
              </h1>
            </div>
            <p className="text-xs text-gray-500">
              Curate dish combos (e.g. Palak Paneer, Pav Bhaji) that add all farm ingredients to cart in 1 shot
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchKits}
              className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition"
              title="Refresh"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  hindiName: "",
                  serves: "3-4 Persons",
                  cookTime: "25 Mins",
                  badge: "⭐ Special Combo",
                  price: 149,
                  mrp: 199,
                  image: "/categories/vegetables.jpg",
                  ingredients: [
                    { name: "", qty: "500g", price: 30, image: "/categories/vegetables.jpg" },
                  ],
                });
                setIsFormOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
            >
              <Plus size={16} />
              <span>Add New Recipe Kit</span>
            </button>
          </div>
        </div>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#0f8646]/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Sparkles className="text-orange-500" size={18} />
                <span>{editingId ? "Edit Recipe Kit" : "Create New Recipe Kit"}</span>
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Dish Name (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Desi Palak Paneer Kit"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Hindi Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. देसी पालक पनीर किट"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. ⭐ Chef's Favorite"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Cook Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 25 Mins"
                    value={formData.cookTime}
                    onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Serves</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-4 Persons"
                    value={formData.serves}
                    onChange={(e) => setFormData({ ...formData, serves: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Combo Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-[#0f8646]"
                  />
                </div>
              </div>

              {/* Dynamic Ingredients Checklist */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Included Farm Ingredients ({formData.ingredients.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddIngredientRow}
                    className="text-xs font-bold text-[#0f8646] hover:text-[#0c6a38] flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add Item Row</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-200/80"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Ingredient Name (e.g. Farm Palak)"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                        className="flex-1 w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Qty (e.g. 500g)"
                        value={ing.qty}
                        onChange={(e) => handleIngredientChange(idx, "qty", e.target.value)}
                        className="w-full sm:w-28 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900"
                      />
                      <input
                        type="number"
                        required
                        placeholder="Price ₹"
                        value={ing.price}
                        onChange={(e) =>
                          handleIngredientChange(idx, "price", Number(e.target.value))
                        }
                        className="w-full sm:w-24 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900"
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredientRow(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? "Saving to Database..." : editingId ? "Update Kit" : "Save Recipe Kit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Kits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <div
              key={kit._id}
              className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 bg-gradient-to-r from-emerald-950 to-green-900 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-yellow-300 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {kit.badge}
                  </span>
                  <button
                    onClick={() => handleToggleActive(kit)}
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      kit.isActive
                        ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/40"
                        : "bg-red-500/30 text-red-300 border border-red-400/40"
                    }`}
                  >
                    {kit.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>{kit.isActive ? "Active on Store" : "Hidden"}</span>
                  </button>
                </div>

                <h3 className="text-base font-black">{kit.name}</h3>
                <span className="text-xs text-green-200 font-bold">{kit.hindiName}</span>
                <p className="text-[11px] text-green-300/80 mt-1">
                  ⏱️ {kit.cookTime} • {kit.serves}
                </p>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    Ingredients ({kit.ingredients?.length || 0}):
                  </span>
                  {kit.ingredients?.map((ing: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded-xl"
                    >
                      <span className="font-bold">{ing.name}</span>
                      <span className="text-gray-500 font-black text-[11px]">
                        {ing.qty} (₹{ing.price})
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-black text-[#0f8646]">₹{kit.price}</span>
                    <span className="text-xs text-gray-400 line-through ml-1.5">₹{kit.mrp}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(kit)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(kit._id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
  );
}
