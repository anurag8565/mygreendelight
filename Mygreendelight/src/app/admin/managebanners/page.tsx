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
  Edit2,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    btnText: "Shop Fresh Produce",
    link: "/shop",
    image: null as File | null,
  });

  const [editForm, setEditForm] = useState({
    title: "",
    subtitle: "",
    btnText: "",
    link: "",
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
        btnText: "Shop Fresh Produce",
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

  const handleOpenEdit = (banner: any) => {
    setSelectedBanner(banner);
    setEditForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      btnText: banner.btnText || "Shop Now",
      link: banner.link || "/shop",
    });
    setEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;

    try {
      setAdding(true);
      const res = await axios.put(`/api/admin/banner/${selectedBanner._id}`, editForm);
      if (res.data.success) {
        alert("Banner updated successfully!");
        setEditing(false);
        setSelectedBanner(null);
        fetchBanners();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update banner");
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
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Hero & Promo Banners Manager
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize live storefront promo cards, titles, discounts & links
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
          <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 flex-1 w-full">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Create Banner Form (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-7 border border-gray-200/80 shadow-xs">
                <h2 className="text-base font-black text-gray-900 mb-1">
                  Upload New Promo Banner
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  Add high quality banner with custom headline and action link
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Banner Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunrise Farm Fresh Produce"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Subtitle / Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 100% Pesticide-Free Bhopal & Sehore Farms"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
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
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
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
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Banner Image *
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
                          className="inline-block bg-white border border-gray-200 text-gray-800 hover:border-[#0f8646] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer shadow-2xs"
                        >
                          Choose File
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
                        <span>Publish Banner to Store</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Banners List (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs">
                <h2 className="text-base font-black text-gray-900 mb-1">
                  Active Store Banners ({banners.length})
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  Live promotional banners displayed on the home page
                </p>

                {loading ? (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <Loader2 size={30} className="animate-spin text-[#0f8646] mb-2" />
                    <p className="text-xs font-bold text-gray-400">Loading banners...</p>
                  </div>
                ) : banners.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 text-xs text-gray-500">
                    No custom banners uploaded. Store is displaying default authentic banners.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {banners.map((b) => (
                      <div
                        key={b._id}
                        className="relative rounded-2xl overflow-hidden border border-gray-200 group shadow-2xs bg-gray-950"
                      >
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-36 object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end text-white">
                          <h4 className="font-black text-sm leading-tight text-white">
                            {b.title}
                          </h4>
                          <p className="text-xs text-emerald-300 mt-0.5 font-bold">
                            {b.subtitle}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">
                              Btn: {b.btnText || "Shop Now"} ➔ {b.link || "/shop"}
                            </span>
                          </div>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="p-2 rounded-xl bg-white/95 text-gray-800 hover:bg-[#0f8646] hover:text-white transition shadow-sm cursor-pointer"
                            title="Edit Banner Text"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-2 rounded-xl bg-white/95 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm cursor-pointer"
                            title="Delete Banner"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Edit Banner Modal */}
      {editing && selectedBanner && (
        <div
          onClick={() => setEditing(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="cursor-default bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 relative"
          >
            <button
              onClick={() => setEditing(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-gray-900 mb-1">
              Edit Store Banner Text
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Update headline, tagline and link without re-uploading image
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block text-gray-700 uppercase mb-1">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 uppercase mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  required
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Button Text</label>
                  <input
                    type="text"
                    value={editForm.btnText}
                    onChange={(e) => setEditForm({ ...editForm, btnText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Action Link</label>
                  <input
                    type="text"
                    value={editForm.link}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="w-1/2 py-2.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {adding ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
