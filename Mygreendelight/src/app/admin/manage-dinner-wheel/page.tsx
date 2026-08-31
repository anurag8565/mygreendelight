"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Utensils, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import axios from "axios";

export default function ManageDinnerWheelPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    prepTime: "15 mins",
    servings: "2-3 Persons",
    image: "",
    comboPrice: 149,
    mrp: 199,
    sliceColor: "#0f8646",
    isActive: true,
    ingredients: [
      { name: "Desi Palak", qty: "500 g", price: 35 },
      { name: "Farm Paneer", qty: "200 g", price: 85 },
    ],
  });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("/api/dinner-wheel");
      if (res.data.success) {
        setRecipes(res.data.recipes || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, { name: "", qty: "100 g", price: 20 }],
    });
  };

  const handleRemoveIngredient = (idx: number) => {
    setForm({
      ...form,
      ingredients: form.ingredients.filter((_: any, i: number) => i !== idx),
    });
  };

  const handleIngredientChange = (idx: number, field: string, value: any) => {
    const updated = [...form.ingredients];
    updated[idx][field] = value;
    setForm({ ...form, ingredients: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      if (editingId) {
        await axios.put("/api/dinner-wheel", { id: editingId, ...form });
        setMsg({ type: "success", text: "Dinner recipe updated successfully!" });
      } else {
        await axios.post("/api/dinner-wheel", form);
        setMsg({ type: "success", text: "New dinner recipe added to wheel!" });
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchRecipes();
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to save recipe" });
    }
  };

  const handleEdit = (recipe: any) => {
    setEditingId(recipe._id);
    setForm({
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      image: recipe.image,
      comboPrice: recipe.comboPrice,
      mrp: recipe.mrp,
      sliceColor: recipe.sliceColor || "#0f8646",
      isActive: recipe.isActive,
      ingredients: recipe.ingredients || [],
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
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                <Utensils size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                "Aaj Kya Banayein?" Dinner Decider Wheel Manager
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add and manage recipes, slice colors & farm ingredient kits loaded when the customer spins the wheel.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                description: "",
                prepTime: "15 mins",
                servings: "2-3 Persons",
                image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=85",
                comboPrice: 149,
                mrp: 199,
                sliceColor: "#0f8646",
                isActive: true,
                ingredients: [{ name: "Fresh Produce Item", qty: "250 g", price: 30 }],
              });
              setIsModalOpen(true);
            }}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Recipe to Wheel</span>
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

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-40 w-full">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div
                  className="absolute top-3 left-3 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: recipe.sliceColor || "#0f8646" }}
                  title="Wheel Slice Color"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs font-black text-[10px] px-2.5 py-1 rounded-full text-gray-900 shadow-xs">
                  {recipe.prepTime}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-base text-gray-900 mb-1">{recipe.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{recipe.description}</p>

                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-3">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                      {recipe.ingredients?.length || 0} Farm Ingredients
                    </span>
                    <span className="bg-green-100 text-[#0f8646] px-2 py-0.5 rounded-md">
                      ₹{recipe.comboPrice} (MRP ₹{recipe.mrp})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`text-[10px] font-bold ${recipe.isActive ? "text-green-600" : "text-gray-400"}`}>
                    {recipe.isActive ? "🟢 Active on Wheel" : "⚪ Inactive"}
                  </span>
                  <button
                    onClick={() => handleEdit(recipe)}
                    className="text-gray-700 hover:text-[#0f8646] p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
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
                  {editingId ? "Edit Wheel Recipe" : "Add New Wheel Recipe"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Recipe Title</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Image URL</label>
                  <input
                    required
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Prep Time</label>
                    <input
                      type="text"
                      value={form.prepTime}
                      onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Combo Price (₹)</label>
                    <input
                      type="number"
                      value={form.comboPrice}
                      onChange={(e) => setForm({ ...form, comboPrice: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={form.mrp}
                      onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Slice Color Picker */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Wheel Slice Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.sliceColor}
                      onChange={(e) => setForm({ ...form, sliceColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono font-bold text-gray-600">{form.sliceColor}</span>
                  </div>
                </div>

                {/* Dynamic Ingredients */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase">Sub-Ingredients</label>
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="text-xs font-bold text-[#0f8646] hover:underline"
                    >
                      + Add Ingredient
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.ingredients.map((ing: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                        <input
                          type="text"
                          placeholder="Name"
                          value={ing.name}
                          onChange={(e) => handleIngredientChange(i, "name", e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Qty"
                          value={ing.qty}
                          onChange={(e) => handleIngredientChange(i, "qty", e.target.value)}
                          className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="number"
                          placeholder="₹"
                          value={ing.price}
                          onChange={(e) => handleIngredientChange(i, "price", Number(e.target.value))}
                          className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(i)}
                          className="text-red-500 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
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
                    Save Recipe
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
