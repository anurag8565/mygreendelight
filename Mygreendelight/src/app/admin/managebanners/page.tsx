"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    btnText: "Shop Now",
    link: "/shop",
    image: null as File | null,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/banner");
      if (res.data.success) {
        setBanners(res.data.banners || []);
      }
    } catch (error) {
      console.error("Error fetching banners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("Please select an image for banner");

    try {
      setAdding(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("btnText", formData.btnText);
      data.append("link", formData.link);
      data.append("image", formData.image);

      const result = await axios.post("/api/admin/banner", data);
      alert(result.data.message || "Banner created!");
      setFormData({
        title: "",
        subtitle: "",
        btnText: "Shop Now",
        link: "/shop",
        image: null,
      });
      setImagePreview("");
      fetchBanners();
    } catch (error) {
      console.error(error);
      alert("Failed to add banner");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`/api/admin/banner/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id));
      alert("Banner deleted");
    } catch (error) {
      console.error(error);
      alert("Failed to delete banner");
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex">
      <AdminSidebar />

      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Hero & Promo Banners
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Customize home page promotional sliders & seasonal harvest banners
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBanners}
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
            {/* Create Banner Form (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs">
              <h2 className="text-base font-black text-gray-900 mb-1">
                Upload New Banner
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Add high quality banner with custom action link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% Organic Winter Harvest"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fresh spinach, radish & carrots at ₹19"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.btnText}
                      onChange={(e) =>
                        setFormData({ ...formData, btnText: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Banner Background Image *
                  </label>
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <div className="w-20 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
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
                        id="banner-img"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="banner-img"
                        className="inline-block bg-white border border-gray-200 text-gray-800 hover:border-[#0f8646] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Choose Image
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adding}
                  className="w-full py-3.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
                >
                  {adding ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Uploading Banner...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Upload Banner</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Banners List (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs">
              <h2 className="text-base font-black text-gray-900 mb-1">
                Active Banners ({banners.length})
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Banners displayed across the store home page
              </p>

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Loader2 size={30} className="animate-spin text-[#0f8646] mb-2" />
                  <p className="text-xs font-bold text-gray-400">Loading banners...</p>
                </div>
              ) : banners.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-10">
                  No custom banners uploaded. Store is using default banners.
                </p>
              ) : (
                <div className="space-y-4">
                  {banners.map((b) => (
                    <div
                      key={b._id}
                      className="relative rounded-2xl overflow-hidden border border-gray-200 group shadow-2xs"
                    >
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                        <h4 className="font-extrabold text-sm leading-tight">
                          {b.title}
                        </h4>
                        <p className="text-xs text-green-200 mt-0.5">{b.subtitle}</p>
                      </div>

                      <button
                        onClick={() => handleDelete(b._id)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
                        title="Delete Banner"
                      >
                        <Trash2 size={14} />
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
  );
}
