"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Upload,
  Loader2,
  PackagePlus,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  EyeOff,
  Star,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AddGrocery() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    rating: "4.8",
    isTopRated: false,
    isFeatured: false,
    status: "published" as "published" | "draft",
    category: "",
    unit: "kg",
    stock: "50",
    description: "",
    sourcing: "Direct from local Bhopal farms (Raisen / Sehore)",
    storage: "Store in a cool, dry place. Wash before consumption.",
    image: null as File | null,
  });

  const [variations, setVariations] = useState<
    { weight: string; price: string; stock: string }[]
  >([]);

  const addVariation = () => {
    setVariations([...variations, { weight: "", price: "", stock: "20" }]);
  };

  const updateVariation = (
    index: number,
    field: "weight" | "price" | "stock",
    value: string
  ) => {
    const newVars = [...variations];
    newVars[index][field] = value;
    setVariations(newVars);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/admin/category");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCats();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({
      ...formData,
      image: file,
    });

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmitWithStatus = async (statusOverride?: "published" | "draft") => {
    if (!formData.image) {
      alert("Please select a produce image.");
      return;
    }

    const currentStatus = statusOverride || formData.status;

    try {
      setLoading(true);
      setSuccessMsg("");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("mrp", formData.mrp);
      data.append("rating", formData.rating);
      data.append("isTopRated", String(formData.isTopRated));
      data.append("isFeatured", String(formData.isFeatured));
      data.append("status", currentStatus);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("unit", formData.unit);
      data.append("description", formData.description);
      data.append("sourcing", formData.sourcing);
      data.append("storage", formData.storage);
      data.append("image", formData.image);
      data.append("variations", JSON.stringify(variations));

      const res = await axios.post("/api/admin/addgrocery", data);

      if (res.status === 200 || res.status === 201) {
        const statusLabel = currentStatus === "draft" ? "(Saved as Hidden Draft 🟡)" : "(Published Live 🟢)";
        setSuccessMsg(`✓ "${formData.name}" added successfully ${statusLabel}!`);
        setFormData({
          name: "",
          price: "",
          mrp: "",
          rating: "4.8",
          isTopRated: false,
          isFeatured: false,
          status: "published",
          category: "",
          unit: "kg",
          stock: "50",
          description: "",
          sourcing: "Direct from local Bhopal farms (Raisen / Sehore)",
          storage: "Store in a cool, dry place. Wash before consumption.",
          image: null,
        });
        setImagePreview("");
        setVariations([]);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add grocery item.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithStatus();
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Add New Farm Produce
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Publish new vegetables, fruits, pack variations & inventory to Bhopal store
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/bulk-upload"
              className="bg-green-50 hover:bg-green-100 border border-green-300 text-[#0f8646] px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
            >
              <Upload size={14} />
              <span>Bulk CSV Upload</span>
            </Link>

            <Link
              href="/admin/viewgrocery"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>View Inventory</span>
            </Link>
          </div>
        </header>

        {/* Form Body */}
        <div className="p-3.5 sm:p-6 lg:p-8 max-w-4xl space-y-6 w-full">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-[#0f8646] px-5 py-4 rounded-2xl flex items-center gap-3 shadow-xs">
              <CheckCircle2 size={18} />
              <span className="font-bold text-xs sm:text-sm">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-4 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-5 text-xs font-bold text-gray-600">
              <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
                1. Basic Produce Information
              </h2>

              {/* Image Upload Area */}
              <div>
                <label className="block text-gray-700 uppercase tracking-wider mb-2">
                  Produce Image *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#0f8646] transition bg-gray-50/50">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon size={28} className="text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 hover:border-[#0f8646] hover:text-[#0f8646] px-4 py-2 rounded-xl cursor-pointer shadow-2xs transition"
                    >
                      <Upload size={14} />
                      <span>Select Image from Computer</span>
                    </label>
                    <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                      Recommended: High resolution PNG or JPG with clean transparent/white background.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Produce Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh Organic Spinach (Palak)"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-bold text-xs sm:text-sm"
                  >
                    <option value="">Select Category</option>
                    {(categories.length > 0
                      ? categories
                      : [
                          { _id: "1", name: "Vegetables" },
                          { _id: "2", name: "Fruits" },
                          { _id: "3", name: "Exotics" },
                          { _id: "4", name: "Dairy & Staples" },
                        ]
                    ).map((c) => (
                      <option key={c._id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selling Price, MRP Cut Price, Unit & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    MRP Cut Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 60 (for ~~₹60~~)"
                    value={formData.mrp}
                    onChange={(e) =>
                      setFormData({ ...formData, mrp: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs sm:text-sm"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 font-normal">Shows crossed discount badge</p>
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Standard Unit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 kg, 500g"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Star Rating & Top Rated Toggle */}
              <div className="grid sm:grid-cols-2 gap-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Customer Star Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-emerald-200 outline-none focus:border-[#0f8646] bg-white font-bold text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="top-rated-check"
                    checked={formData.isTopRated}
                    onChange={(e) =>
                      setFormData({ ...formData, isTopRated: e.target.checked })
                    }
                    className="w-5 h-5 accent-[#0f8646] rounded cursor-pointer"
                  />
                  <label htmlFor="top-rated-check" className="cursor-pointer text-gray-800 font-black text-xs">
                    🌟 Feature in &quot;Top Rated Farm Products&quot; on Homepage
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                  Produce Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe farm origin, taste, and freshness benefits..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 rounded-2xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs sm:text-sm resize-none"
                />
              </div>

              {/* Sourcing & Storage */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Farm Sourcing Info
                  </label>
                  <input
                    type="text"
                    value={formData.sourcing}
                    onChange={(e) =>
                      setFormData({ ...formData, sourcing: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Storage & Shelf Life
                  </label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) =>
                      setFormData({ ...formData, storage: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                  />
                </div>
              </div>

              {/* Pack Size Variations */}
              <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-gray-900 font-extrabold text-xs uppercase tracking-wider">
                      Pack Size Variations (Optional)
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      E.g. 500g for ₹25, 1 kg for ₹45, 2 kg for ₹85
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariation}
                    className="inline-flex items-center gap-1 text-xs text-[#0f8646] hover:underline"
                  >
                    <Plus size={14} /> Add Size
                  </button>
                </div>

                {variations.map((v, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2 flex-wrap sm:flex-nowrap">
                    <input
                      type="text"
                      placeholder="Size (e.g. 500g)"
                      value={v.weight}
                      onChange={(e) => updateVariation(idx, "weight", e.target.value)}
                      className="flex-1 min-w-[120px] p-2 rounded-xl border border-gray-200 text-xs bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={v.price}
                      onChange={(e) => updateVariation(idx, "price", e.target.value)}
                      className="w-20 sm:w-24 p-2 rounded-xl border border-gray-200 text-xs bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => updateVariation(idx, "stock", e.target.value)}
                      className="w-20 sm:w-24 p-2 rounded-xl border border-gray-200 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariation(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 ml-auto sm:ml-0 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Publishing Status & Featured Options Card */}
              <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5 font-extrabold">
                    Visibility & Publishing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "published" | "draft" })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#0f8646] bg-white font-bold text-xs sm:text-sm"
                  >
                    <option value="published">🟢 Published (Visible to all Customers)</option>
                    <option value="draft">🟡 Draft (Hidden from Website, saved in Admin)</option>
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1 font-normal">
                    Draft items won&apos;t show on Homepage, categories, search or Google.
                  </p>
                </div>

                <div className="flex flex-col justify-center space-y-2 pt-1 sm:pt-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured-check"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
                    />
                    <label htmlFor="featured-check" className="cursor-pointer text-gray-900 font-extrabold text-xs">
                      ⭐ Feature in &quot;Bhopal Top Picks &amp; Bestsellers&quot;
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-400 font-normal ml-8">
                    Featured produce shows a ⭐ FEATURED badge and priority ranking.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmitWithStatus("draft")}
                  className="flex-1 py-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
                >
                  <EyeOff size={16} />
                  <span>Save as Draft (Hide from Store) 🟡</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmitWithStatus("published")}
                  className="flex-1 py-4 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving Produce...</span>
                    </>
                  ) : (
                    <>
                      <PackagePlus size={18} />
                      <span>Publish Live to Store 🟢</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
);
}
