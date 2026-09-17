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
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

const PRESET_BANNERS = [
  {
    name: "Farm Vegetables",
    image: "/banners/hero1.jpg",
    title: "Fresh Farm Vegetables",
    subtitle: "Cleaned, sorted & delivered daily to your doorstep.",
    badge: "Daily Farm Harvest • 10-15 Min",
    btnText: "Shop Vegetables",
    link: "/shop?category=Vegetables",
  },
  {
    name: "Seasonal Fruits",
    image: "/banners/hero_fruits.jpg",
    title: "Sweet Seasonal Fruits",
    subtitle: "Handpicked crisp apples, ripe mangoes & berries.",
    badge: "Naturally Sweet • Zero Cold Storage",
    btnText: "Shop Fruits",
    link: "/shop?category=Fruits",
  },
  {
    name: "Kitchen Combos",
    image: "/banners/hero_combos.jpg",
    title: "Daily Kitchen Combos",
    subtitle: "Fresh Aloo, Pyaaz, Tamatar & kitchen essentials.",
    badge: "Super Saver Packs • Up to 35% OFF",
    btnText: "View Combos",
    link: "/shop?category=Combos",
  },
  {
    name: "Scratch & Win",
    image: "/banners/daily_scratch_banner.jpg",
    title: "Daily Scratch & Save",
    subtitle: "Scratch today's card & win up to ₹50 cashback.",
    badge: "Daily Scratch & Save",
    btnText: "Claim Cashback",
    link: "/#rewards",
  },
];

export default function ManageBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "Daily Farm Harvest • 10-15 Min",
    offerPill: "FLAT ₹50 OFF",
    floatingStat: "100% Farm Fresh",
    btnText: "Shop Now",
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
      const res = await axios.get(`/api/admin/banner?_t=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
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

  const handleApplyPreset = (preset: (typeof PRESET_BANNERS)[0]) => {
    setFormData({
      ...formData,
      title: preset.title,
      subtitle: preset.subtitle,
      badge: preset.badge,
      btnText: preset.btnText,
      link: preset.link,
      image: null,
      imageUrl: preset.image,
    });
    setImagePreview(preset.image);
  };

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        "Are you sure you want to load/reset the 3 official farm banners into the database? This will sync your storefront hero carousel."
      )
    ) {
      return;
    }

    try {
      setSeeding(true);
      const res = await axios.post("/api/admin/banner/seed", { overwrite: true });
      if (res.data.success) {
        alert("✨ Successfully loaded Official Farm Fresh Banners into Admin & Storefront!");
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

  const handleMoveOrder = async (banner: any, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b._id === banner._id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;

    const currentBanner = banners[idx];
    const targetBanner = banners[targetIdx];

    const currentOrder = currentBanner.order || idx + 1;
    const targetOrder = targetBanner.order || targetIdx + 1;

    try {
      await Promise.all([
        axios.put(`/api/admin/banner/${currentBanner._id}`, { order: targetOrder }),
        axios.put(`/api/admin/banner/${targetBanner._id}`, { order: currentOrder }),
      ]);
      fetchBanners();
    } catch (err) {
      alert("Failed to update banner order");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData({ ...formData, image: file, imageUrl: "" });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image && !formData.imageUrl) {
      return alert("Please select an image file or choose a preset banner");
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
      alert(result.data.message || "Banner published successfully!");
      setFormData({
        title: "",
        subtitle: "",
        badge: "Daily Farm Harvest • 10-15 Min",
        offerPill: "FLAT ₹50 OFF",
        floatingStat: "100% Farm Fresh",
        btnText: "Shop Now",
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
      badge: banner.badge || "Daily Farm Harvest • 10-15 Min",
      offerPill: banner.offerPill || "",
      floatingStat: banner.floatingStat || "100% Farm Fresh",
      btnText: banner.btnText || "Shop Now",
      link: banner.link || "/shop",
      image: banner.image || "",
      isActive: banner.isActive !== false,
    });
    setEditImagePreview(banner.image || "");
    setEditImageFile(null);
    setEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;

    try {
      setAdding(true);
      let res;
      if (editImageFile) {
        const data = new FormData();
        data.append("title", editForm.title);
        data.append("subtitle", editForm.subtitle);
        data.append("badge", editForm.badge);
        data.append("offerPill", editForm.offerPill);
        data.append("floatingStat", editForm.floatingStat);
        data.append("btnText", editForm.btnText);
        data.append("link", editForm.link);
        data.append("isActive", String(editForm.isActive));
        data.append("image", editImageFile);
        res = await axios.put(`/api/admin/banner/${selectedBanner._id}`, data);
      } else {
        res = await axios.put(`/api/admin/banner/${selectedBanner._id}`, editForm);
      }

      if (res.data.success) {
        alert("Banner updated successfully!");
        setEditing(false);
        setSelectedBanner(null);
        setEditImageFile(null);
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

  const previewImage = imagePreview || formData.imageUrl || "/banners/hero1.jpg";

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
                  Hero &amp; Promo Banners Manager
                </h1>
                <span className="bg-emerald-100 text-[#0a3d24] text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  {banners.length} Active Banners
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload 4K banners, customize headlines, tags, links and control live storefront carousel order
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#0a3d24] border border-emerald-300/80 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                title="Restore 3 official 4K produce banners into database"
              >
                {seeding ? (
                  <Loader2 size={14} className="animate-spin text-[#0a3d24]" />
                ) : (
                  <Sparkles size={14} className="text-emerald-700 fill-emerald-700" />
                )}
                <span>Reset 4K Official Banners</span>
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
            
            {/* Live Storefront Preview Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-[#0a3d24]" />
                  <span className="text-xs font-black uppercase tracking-wider text-gray-700">
                    Live Storefront Preview
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  Real-time preview of your hero banner exactly as customers see it
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-sm h-[140px] xs:h-[160px] sm:h-[190px] md:h-[220px]">
                <img
                  src={previewImage}
                  alt="Live Preview"
                  className="w-full h-full object-cover object-right sm:object-center contrast-[1.04] saturate-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 via-48% sm:via-36% to-transparent pointer-events-none" />

                <div className="relative z-10 h-full p-3.5 xs:p-4 sm:p-6 flex flex-col justify-between max-w-[65%] xs:max-w-[62%] sm:max-w-md">
                  <div>
                    <div className="inline-flex items-center gap-1 bg-emerald-50/95 border border-emerald-200/80 text-[#0a3d24] text-[9.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full mb-1 sm:mb-2 shadow-2xs">
                      <Clock size={11} className="text-[#0a3d24] stroke-[2.2]" />
                      <span className="truncate">
                        {formData.badge || "Daily Farm Harvest • 10-15 Min"}
                      </span>
                    </div>

                    <h2 className="text-[15px] xs:text-[17px] sm:text-2xl font-extrabold text-stone-900 tracking-tight leading-tight line-clamp-2">
                      {formData.title || "Fresh Farm Vegetables"}
                    </h2>

                    <p className="text-[11px] sm:text-xs text-stone-600 font-medium leading-snug line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1">
                      {formData.subtitle || "Cleaned, sorted & delivered daily to your doorstep."}
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-[#0a3d24] text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-[11px] sm:text-xs shadow-xs">
                      <span>{formData.btnText || "Shop Now"}</span>
                      <ArrowRight size={13} className="stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid: Form (5 Cols) + Banners List (7 Cols) */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Create Banner Form (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-7 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-black text-gray-900">
                    Upload New Banner
                  </h2>
                  <span className="text-[10px] font-bold text-[#0a3d24] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Storefront Hero
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Upload an image from device or choose a 1-click 4K studio preset
                </p>

                {/* 1-Click Preset Selector */}
                <div className="mb-5 p-3 rounded-2xl bg-gray-50 border border-gray-200/70">
                  <span className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2">
                    Quick 1-Click 4K Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_BANNERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#0a3d24] hover:bg-emerald-50/40 text-left transition flex items-center gap-2 cursor-pointer group"
                      >
                        <img
                          src={preset.image}
                          alt={preset.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[11px] font-bold text-gray-900 truncate group-hover:text-[#0a3d24]">
                            {preset.name}
                          </span>
                          <span className="block text-[9px] text-gray-400 truncate">
                            Preset 4K
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                  {/* File Upload / Image Picker */}
                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Banner Image (Upload File or Enter URL) *
                    </label>
                    <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#0a3d24] bg-gray-50/50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                          {imagePreview || formData.imageUrl ? (
                            <img
                              src={imagePreview || formData.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={22} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            id="banner-img"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="banner-img"
                            className="inline-flex items-center gap-1.5 bg-[#0a3d24] text-white hover:bg-[#072416] px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow-xs transition active:scale-95"
                          >
                            <Upload size={13} />
                            <span>Choose Image File</span>
                          </label>

                          <input
                            type="text"
                            placeholder="Or enter path / URL: /banners/hero1.jpg"
                            value={formData.imageUrl}
                            onChange={(e) => {
                              setFormData({ ...formData, imageUrl: e.target.value, image: null });
                              setImagePreview(e.target.value);
                            }}
                            className="w-full p-2 rounded-xl border border-gray-200 text-[11px] font-normal outline-none focus:border-[#0a3d24] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Banner Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fresh Farm Vegetables"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0a3d24] bg-gray-50/60 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Subtitle / Tagline *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Cleaned, sorted & delivered daily to your doorstep."
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0a3d24] bg-gray-50/60 font-medium text-xs"
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
                        placeholder="e.g. Daily Farm Harvest • 10-15 Min"
                        onChange={(e) =>
                          setFormData({ ...formData, badge: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0a3d24] bg-gray-50/60 font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                        Offer Tag
                      </label>
                      <input
                        type="text"
                        value={formData.offerPill}
                        placeholder="e.g. UP TO 35% OFF"
                        onChange={(e) =>
                          setFormData({ ...formData, offerPill: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0a3d24] bg-gray-50/60 font-medium text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={formData.btnText}
                        placeholder="Shop Vegetables"
                        onChange={(e) =>
                          setFormData({ ...formData, btnText: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0a3d24] bg-gray-50/60 font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={formData.link}
                        placeholder="/shop?category=Vegetables"
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0a3d24] bg-gray-50/60 font-medium text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={adding}
                    className="w-full py-3.5 bg-[#0a3d24] hover:bg-[#072817] text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
                  >
                    {adding ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Publishing Banner...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Publish Banner to Storefront</span>
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
                    <Loader2 size={30} className="animate-spin text-[#0a3d24] mb-2" />
                    <p className="text-xs font-bold text-gray-400">Loading banners...</p>
                  </div>
                ) : banners.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 text-xs text-gray-500 space-y-3">
                    <p>No banners found in database.</p>
                    <button
                      onClick={handleSeedDefaults}
                      className="bg-[#0a3d24] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-[#072817] transition cursor-pointer"
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
                              {/* Order & Reorder Arrows */}
                              <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-white/10">
                                <button
                                  type="button"
                                  onClick={() => handleMoveOrder(b, "up")}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-white/20 rounded text-white disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <span className="text-[10.5px] font-bold px-1.5">
                                  #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleMoveOrder(b, "down")}
                                  disabled={idx === banners.length - 1}
                                  className="p-1 hover:bg-white/20 rounded text-white disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown size={12} />
                                </button>
                              </div>

                              <button
                                onClick={() => handleToggleActive(b)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 ${
                                  b.isActive !== false
                                    ? "bg-emerald-600 text-white"
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
                              <span className="text-[10px] bg-white/15 px-2.5 py-1 rounded-lg font-mono text-emerald-200 truncate max-w-[200px]">
                                {b.btnText || "Shop"} ➔ {b.link || "/shop"}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEdit(b)}
                                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white text-gray-900 hover:bg-[#0a3d24] hover:text-white transition shadow-sm cursor-pointer text-xs font-bold flex items-center gap-1"
                                  title="Edit Banner"
                                >
                                  <Edit2 size={12} />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(b._id)}
                                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm cursor-pointer text-xs font-bold flex items-center gap-1"
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

      {/* Edit Banner Modal with Image File Upload */}
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
              Update headline, subtitle, badge tag, CTA button and upload replacement image
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs font-bold">
              {/* Image Upload in Edit */}
              <div>
                <label className="block text-gray-700 uppercase mb-1">
                  Banner Image (Upload File or Path)
                </label>
                <div className="p-3 rounded-2xl border border-gray-200 bg-gray-50 flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0">
                    <img
                      src={editImagePreview || editForm.image}
                      alt="Edit Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      id="edit-banner-img"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-banner-img"
                      className="inline-flex items-center gap-1 bg-[#0a3d24] text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer hover:bg-[#072416] transition"
                    >
                      <Upload size={12} />
                      <span>Change Image File</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.image}
                      onChange={(e) => {
                        setEditForm({ ...editForm, image: e.target.value });
                        setEditImagePreview(e.target.value);
                        setEditImageFile(null);
                      }}
                      placeholder="Or image path: /banners/hero1.jpg"
                      className="w-full p-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-normal"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 uppercase mb-1">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0a3d24] font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 uppercase mb-1">Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  required
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0a3d24] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Micro Badge</label>
                  <input
                    type="text"
                    value={editForm.badge}
                    onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0a3d24] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Offer Tag</label>
                  <input
                    type="text"
                    value={editForm.offerPill}
                    onChange={(e) => setEditForm({ ...editForm, offerPill: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0a3d24] font-medium"
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
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0a3d24] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Action Link</label>
                  <input
                    type="text"
                    value={editForm.link}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0a3d24] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 uppercase mb-1">Floating Trust Stat</label>
                <input
                  type="text"
                  value={editForm.floatingStat}
                  onChange={(e) => setEditForm({ ...editForm, floatingStat: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#0a3d24] font-medium"
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
                  className="w-1/2 py-2.5 bg-[#0a3d24] hover:bg-[#072817] text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
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
