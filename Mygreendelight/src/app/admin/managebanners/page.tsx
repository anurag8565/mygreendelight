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
  ShieldCheck,
  Eye,
  Power,
  RotateCcw,
  Tag,
  ArrowRight,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "🌿 Sunrise Farm Harvest • 10-15 Min Express",
    offerPill: "FLAT ₹50 OFF • CODE: FRESH50",
    floatingStat: "🌱 5:00 AM Fresh Harvest",
    btnText: "Order Fresh Produce",
    link: "/shop",
    image: null as File | null,
    imageUrl: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    subtitle: "",
    badge: "",
    offerPill: "",
    floatingStat: "",
    btnText: "",
    link: "",
    image: "",
    isActive: true,
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

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        "Are you sure you want to load/reset the 4 official 8K luxury farm banners into the database? This will update your storefront hero carousel."
      )
    ) {
      return;
    }

    try {
      setSeeding(true);
      const res = await axios.post("/api/admin/banner/seed", { overwrite: true });
      if (res.data.success) {
        alert("✨ Successfully loaded 4 Official 8K Luxury Banners into Admin & Storefront!");
        fetchBanners();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to load default banners");
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleActive = async (banner: any) => {
    try {
      const updatedStatus = !banner.isActive;
      await axios.put(`/api/admin/banner/${banner._id}`, { isActive: updatedStatus });
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, isActive: updatedStatus } : b))
      );
    } catch (error) {
      alert("Failed to toggle banner status");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData({ ...formData, image: file, imageUrl: "" });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image && !formData.imageUrl) {
      return alert("Please select an image or provide an image path for the banner");
    }

    try {
      setAdding(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("badge", formData.badge);
      data.append("offerPill", formData.offerPill);
      data.append("floatingStat", formData.floatingStat);
      data.append("btnText", formData.btnText);
      data.append("link", formData.link);
      if (formData.image) {
        data.append("image", formData.image);
      } else if (formData.imageUrl) {
        data.append("imageUrl", formData.imageUrl);
      }

      const result = await axios.post("/api/admin/banner", data);
      alert(result.data.message || "Banner created successfully!");
      setFormData({
        title: "",
        subtitle: "",
        badge: "🌿 Sunrise Farm Harvest • 10-15 Min Express",
        offerPill: "FLAT ₹50 OFF • CODE: FRESH50",
        floatingStat: "🌱 5:00 AM Fresh Harvest",
        btnText: "Order Fresh Produce",
        link: "/shop",
        image: null,
        imageUrl: "",
      });
      setImagePreview("");
      fetchBanners();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add banner");
    } finally {
      setAdding(false);
    }
  };

  const handleOpenEdit = (banner: any) => {
    setSelectedBanner(banner);
    setEditForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      badge: banner.badge || "🌿 Sunrise Farm Harvest • 10-15 Min Express",
      offerPill: banner.offerPill || "",
      floatingStat: banner.floatingStat || "🌱 100% Farm Fresh",
      btnText: banner.btnText || "Shop Now",
      link: banner.link || "/shop",
      image: banner.image || "",
      isActive: banner.isActive !== false,
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
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Hero & Promo Banners Manager
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  {banners.length} Active Banners
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage and customize the homepage hero showcase slider directly in real-time
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                title="Restore 4 official high-res 8K farm banners into database"
              >
                {seeding ? (
                  <Loader2 size={14} className="animate-spin text-[#0f8646]" />
                ) : (
                  <Sparkles size={14} className="text-emerald-600 fill-emerald-600" />
                )}
                <span>Reset 4 Official 8K Banners</span>
              </button>

              <button
                onClick={fetchBanners}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </header>

          {/* Content Body */}
          <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 flex-1 w-full">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Create Banner Form (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-7 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-black text-gray-900">
                    Add New Promo Banner
                  </h2>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                    Storefront Hero
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  Upload an 8K/HD image with customizable tagline, badge, and CTA link
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Banner Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Direct From Local Bhopal & Sehore Farms"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Subtitle / Description *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. 100% Ozone-Washed, Handpicked Vegetables & Fruits Delivered Fresh."
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                        Top Micro Badge
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        placeholder="e.g. 🌿 Sunrise Farm Harvest"
                        onChange={(e) =>
                          setFormData({ ...formData, badge: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                        Offer Pill (Yellow)
                      </label>
                      <input
                        type="text"
                        value={formData.offerPill}
                        placeholder="e.g. FLAT ₹50 OFF"
                        onChange={(e) =>
                          setFormData({ ...formData, offerPill: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                        Button Target Link
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
                      Floating Trust Badge
                    </label>
                    <input
                      type="text"
                      value={formData.floatingStat}
                      placeholder="e.g. 🌱 5:00 AM Fresh Harvest"
                      onChange={(e) =>
                        setFormData({ ...formData, floatingStat: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Banner Image (Upload File or Enter Local Path) *
                    </label>
                    <div className="flex items-center gap-4 p-3.5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                      <div className="w-20 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        {imagePreview || formData.imageUrl ? (
                          <img
                            src={imagePreview || formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
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
                        <input
                          type="text"
                          placeholder="Or path: /hero_fresh_farm.jpg"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, image: null })}
                          className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] font-normal"
                        />
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
                        <span>Publishing Banner...</span>
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
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-black text-gray-900">
                    Active Live Banners ({banners.length})
                  </h2>
                  <span className="text-xs text-gray-400 font-bold">
                    Order of appearance on homepage
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  These banners rotate automatically on the home page hero carousel
                </p>

                {loading ? (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <Loader2 size={30} className="animate-spin text-[#0f8646] mb-2" />
                    <p className="text-xs font-bold text-gray-400">Loading banners...</p>
                  </div>
                ) : banners.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 text-xs text-gray-500 space-y-3">
                    <p>No banners found in database.</p>
                    <button
                      onClick={handleSeedDefaults}
                      className="bg-[#0f8646] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-[#0c6a38] transition cursor-pointer"
                    >
                      ✨ Load 4 Official 8K Banners Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {banners.map((b, idx) => (
                      <div
                        key={b._id}
                        className={`relative rounded-2xl overflow-hidden border ${
                          b.isActive !== false ? "border-gray-200" : "border-red-200 opacity-60"
                        } group shadow-xs bg-gray-950`}
                      >
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-44 object-cover opacity-85"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent/40 p-4 sm:p-5 flex flex-col justify-between text-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="bg-white/20 backdrop-blur-md text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/30">
                                {b.badge || "🌿 Farm Fresh"}
                              </span>
                              {b.offerPill && (
                                <span className="bg-amber-400 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                                  {b.offerPill}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="bg-black/60 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                #{idx + 1}
                              </span>
                              <button
                                onClick={() => handleToggleActive(b)}
                                className={`p-1.5 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 ${
                                  b.isActive !== false
                                    ? "bg-emerald-500/80 text-white"
                                    : "bg-gray-700 text-gray-300"
                                }`}
                                title="Toggle Active/Inactive"
                              >
                                <Power size={11} />
                                <span>{b.isActive !== false ? "LIVE" : "HIDDEN"}</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-black text-sm sm:text-base leading-snug text-white line-clamp-1">
                              {b.title}
                            </h4>
                            <p className="text-xs text-emerald-300 mt-0.5 font-medium line-clamp-1">
                              {b.subtitle}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-[10.5px] bg-white/15 px-2.5 py-1 rounded-lg font-mono text-emerald-200">
                                CTA: {b.btnText || "Shop Now"} ➔ {b.link || "/shop"}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEdit(b)}
                                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/95 text-gray-900 hover:bg-[#0f8646] hover:text-white transition shadow-sm cursor-pointer text-xs font-bold flex items-center gap-1"
                                  title="Edit Banner"
                                >
                                  <Edit2 size={12} />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(b._id)}
                                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/95 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm cursor-pointer text-xs font-bold flex items-center gap-1"
                                  title="Delete Banner"
                                >
                                  <Trash2 size={12} />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
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
            className="cursor-default bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setEditing(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-gray-900 mb-1">
              Edit Store Banner
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Update headline, subtitle, badge tag, CTA button and image path
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
                <textarea
                  rows={2}
                  required
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Micro Badge</label>
                  <input
                    type="text"
                    value={editForm.badge}
                    onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Offer Pill</label>
                  <input
                    type="text"
                    value={editForm.offerPill}
                    onChange={(e) => setEditForm({ ...editForm, offerPill: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                  />
                </div>
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

              <div>
                <label className="block text-gray-700 uppercase mb-1">Image URL / Path</label>
                <input
                  type="text"
                  required
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 uppercase mb-1">Floating Trust Stat</label>
                <input
                  type="text"
                  value={editForm.floatingStat}
                  onChange={(e) => setEditForm({ ...editForm, floatingStat: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0f8646] font-medium"
                />
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
