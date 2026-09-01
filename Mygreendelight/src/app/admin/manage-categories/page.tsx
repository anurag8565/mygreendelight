"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FolderTree,
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

type Category = {
  _id: string;
  name: string;
  image: string;
};

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/category");
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      alert("Name and image are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("name", name);
      data.append("image", image);

      const res = await axios.post("/api/admin/category", data);
      if (res.data.success) {
        setName("");
        setImage(null);
        setPreview("");
        fetchCategories();
        alert("Category created successfully!");
      } else {
        alert(res.data.message || "Failed to create category");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      const res = await axios.delete(`/api/admin/category?id=${id}`);
      if (res.data.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      alert("Failed to delete category");
    }
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
              Produce Categories
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Organize store catalog with fresh vegetable & fruit aisles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCategories}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Create Category Form (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs">
              <h2 className="text-base font-black text-gray-900 mb-1">
                Add New Category
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Create a new produce group for your Bhopal store
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Green Leafy Vegetables"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Category Icon / Image *
                  </label>
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="cat-img"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="cat-img"
                        className="inline-block bg-white border border-gray-200 text-gray-800 hover:border-[#0f8646] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Choose Image
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Category...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Create Category</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Categories List (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs">
              <h2 className="text-base font-black text-gray-900 mb-1">
                Active Produce Categories ({categories.length})
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Categories visible on the customer home page and shop filters
              </p>

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Loader2 size={30} className="animate-spin text-[#0f8646] mb-2" />
                  <p className="text-xs font-bold text-gray-400">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-10">
                  No categories created yet.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-green-50/60 hover:border-green-200 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image || "/categories/vegetables.jpg"}
                          alt={cat.name}
                          className="w-11 h-11 object-cover rounded-xl border border-gray-200"
                        />
                        <span className="font-extrabold text-xs text-gray-900">
                          {cat.name}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);
}
