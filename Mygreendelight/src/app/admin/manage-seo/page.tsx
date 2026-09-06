"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Search,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Smartphone,
  Monitor,
  Save,
  RefreshCw,
  Zap,
  Tag,
  Link2,
  FileText,
  ShieldCheck,
  Star,
  ExternalLink,
  Layers,
  MapPin,
  Check,
  Sliders,
} from "lucide-react";

export default function ManageSEOPage() {
  const [activeTab, setActiveTab] = useState<"products" | "global" | "bulk">("products");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bulkOptimizing, setBulkOptimizing] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");

  // Product Form State
  const [productForm, setProductForm] = useState({
    productId: "",
    name: "",
    category: "",
    price: 0,
    unit: "kg",
    image: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    focusKeyword: "",
    canonicalUrl: "",
  });

  // Global SEO Form State
  const [globalSeo, setGlobalSeo] = useState({
    siteName: "SubziQuick Bhopal",
    defaultTitle: "SubziQuick Bhopal | Mandi Fresh Daily Vegetables & Fruits Online Delivery",
    defaultDescription:
      "Order farm-fresh vegetables, seasonal fruits & groceries online in Bhopal at wholesale Mandi rates. 100% ozone-washed, pesticide-safe with same-day doorstep delivery across Bhopal.",
    primaryKeywords:
      "vegetable delivery bhopal, fresh vegetables bhopal, buy vegetables online bhopal, karond mandi bhopal, subziquick",
    canonicalBase: "https://subziquick.in",
    googleSiteVerification: "",
    googleAnalyticsId: "",
    ogImageUrl: "https://subziquick.in/og-image.png",
    twitterHandle: "@SubziQuick",
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/seo");
      if (res.data.success) {
        setGlobalSeo(res.data.globalSeo || globalSeo);
        const prods = res.data.products || [];
        setProducts(prods);
        if (prods.length > 0 && !selectedProductId) {
          selectProduct(prods[0]);
        }
      }
    } catch (err: any) {
      showToast("Failed to load SEO data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, []);

  const selectProduct = (prod: any) => {
    setSelectedProductId(prod._id);
    setProductForm({
      productId: prod._id,
      name: prod.name || "",
      category: prod.category || "Vegetables",
      price: prod.price || 0,
      unit: prod.unit || "kg",
      image: prod.image || "",
      slug: prod.slug || "",
      metaTitle: prod.metaTitle || `${prod.name} (₹${prod.price}/${prod.unit || "kg"}) | SubziQuick Bhopal`,
      metaDescription:
        prod.metaDescription ||
        `Order farm fresh ${prod.name} online in Bhopal at Karond Mandi rates. 100% ozone-washed with same-day home delivery across Bhopal.`,
      metaKeywords: prod.metaKeywords || `${prod.name.toLowerCase()}, ${prod.name.toLowerCase()} delivery bhopal, fresh vegetables bhopal`,
      focusKeyword: prod.focusKeyword || `${prod.name.toLowerCase()} bhopal`,
      canonicalUrl: prod.canonicalUrl || `https://subziquick.in/product/${prod._id}`,
    });
  };

  // Smart Auto-Generator for single product
  const handleSmartGenerate = () => {
    const rawName = productForm.name || "Fresh Produce";
    const cleanName = rawName.split("/")[0].trim();
    const hindiName = rawName.includes("/") ? rawName.split("/")[1].trim() : "";
    const priceStr = productForm.price ? `₹${productForm.price}/${productForm.unit || "kg"}` : "Mandi Rate";
    const cat = productForm.category || "Vegetables";

    const smartTitle = `${rawName} (${priceStr}) | Mandi Fresh Bhopal - SubziQuick`;
    const smartDesc = `Buy farm-fresh ${cleanName}${
      hindiName ? ` (${hindiName})` : ""
    } online in Bhopal at wholesale Karond Mandi rates. 100% ozone-washed, pesticide-safe. Same-day delivery across Bhopal on SubziQuick.`;
    
    const smartKeywords = [
      cleanName.toLowerCase(),
      hindiName ? hindiName.toLowerCase() : "",
      `${cleanName.toLowerCase()} price bhopal`,
      `${cleanName.toLowerCase()} delivery bhopal`,
      `buy ${cleanName.toLowerCase()} online bhopal`,
      `karond mandi ${cleanName.toLowerCase()}`,
      `fresh ${cat.toLowerCase()} bhopal`,
      "subziquick bhopal",
    ]
      .filter(Boolean)
      .join(", ");

    const smartSlug = `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${cat.toLowerCase()}-bhopal`;

    setProductForm({
      ...productForm,
      slug: smartSlug,
      metaTitle: smartTitle,
      metaDescription: smartDesc,
      metaKeywords: smartKeywords,
      focusKeyword: `${cleanName.toLowerCase()} delivery bhopal`,
      canonicalUrl: `https://subziquick.in/product/${productForm.productId}`,
    });

    showToast("⚡ Smart Bhopal SEO tags generated!");
  };

  // Save Product SEO
  const handleSaveProductSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.productId) return;
    setSaving(true);

    try {
      const res = await axios.post("/api/admin/seo", {
        action: "update-product",
        productSeo: productForm,
      });

      if (res.data.success) {
        showToast(res.data.message || "Product SEO saved successfully!");
        setProducts((prev) =>
          prev.map((p) => (p._id === productForm.productId ? { ...p, ...productForm } : p))
        );
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to save product SEO", "error");
    } finally {
      setSaving(false);
    }
  };

  // Save Global SEO
  const handleSaveGlobalSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await axios.post("/api/admin/seo", {
        action: "update-global",
        globalSeo,
      });

      if (res.data.success) {
        showToast("Global SEO settings saved successfully!");
      }
    } catch (err: any) {
      showToast("Failed to save global SEO", "error");
    } finally {
      setSaving(false);
    }
  };

  // Run Bulk Optimizer
  const handleRunBulkOptimize = async (forceOverwrite: boolean = false) => {
    setBulkOptimizing(true);
    try {
      const res = await axios.post("/api/admin/seo/bulk-optimize", { forceOverwrite });
      if (res.data.success) {
        showToast(res.data.message);
        fetchSeoData();
      }
    } catch (err: any) {
      showToast("Bulk optimization failed", "error");
    } finally {
      setBulkOptimizing(false);
    }
  };

  // Calculate SEO Health Score (0 - 100%)
  const calculateScore = () => {
    let score = 0;
    if (productForm.metaTitle.length >= 30 && productForm.metaTitle.length <= 65) score += 25;
    else if (productForm.metaTitle.length > 0) score += 10;

    if (productForm.metaDescription.length >= 100 && productForm.metaDescription.length <= 160) score += 30;
    else if (productForm.metaDescription.length > 0) score += 15;

    if (productForm.metaKeywords.includes("bhopal")) score += 15;
    if (productForm.slug.length > 3) score += 15;
    if (productForm.focusKeyword.length > 2) score += 15;

    return Math.min(100, score);
  };

  const seoScore = calculateScore();
  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchFilter.toLowerCase())
  );
  const optimizedCount = products.filter((p) => p.metaTitle && p.metaDescription).length;
  const optimizedPercent = products.length > 0 ? Math.round((optimizedCount / products.length) * 100) : 0;

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main SEO Center */}
      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div
            className={`fixed top-18 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in border ${
              toastMsg.type === "success"
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-red-600 text-white border-red-500"
            }`}
          >
            {toastMsg.type === "success" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} />}
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black">
                <Globe size={18} />
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-gray-900">
                SEO & Google Search Ranking Suite
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
              Live SERP Simulator, Schema.org Markup, Slugs & Local Bhopal Keyword Manager
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => handleRunBulkOptimize(false)}
              disabled={bulkOptimizing}
              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#0f8646] px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Zap size={14} className="text-[#0f8646]" />
              <span>{bulkOptimizing ? "Optimizing..." : "1-Click Bulk SEO"}</span>
            </button>

            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search Console</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Top Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Catalog Products
                </span>
                <span className="text-2xl font-black text-gray-900 mt-1 block">
                  {products.length} Items
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center">
                <Layers size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  SEO Optimized
                </span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">
                  {optimizedPercent}% <span className="text-xs text-gray-400 font-semibold">({optimizedCount}/{products.length})</span>
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Google Index Status
                </span>
                <span className="text-sm font-black text-green-700 bg-green-100 px-2.5 py-1 rounded-lg mt-1 inline-block">
                  ✓ LIVE INDEXED
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Bhopal Target Area
                </span>
                <span className="text-sm font-black text-gray-800 mt-1 block">
                  19 Localities (Karond Mandi Hub)
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin size={20} />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeTab === "products"
                  ? "bg-[#0f8646] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <FileText size={15} />
              <span>Product SEO & Live SERP</span>
            </button>

            <button
              onClick={() => setActiveTab("global")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeTab === "global"
                  ? "bg-[#0f8646] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Globe size={15} />
              <span>Global Store SEO & Webmaster</span>
            </button>

            <button
              onClick={() => setActiveTab("bulk")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeTab === "bulk"
                  ? "bg-[#0f8646] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Zap size={15} />
              <span>Bulk Auto-Optimizer</span>
            </button>
          </div>

          {/* ================= TAB 1: PRODUCT SEO & LIVE SERP SIMULATOR ================= */}
          {activeTab === "products" && (
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Product Selection & Search (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200/90 p-5 shadow-xs space-y-4">
                <div>
                  <h3 className="font-black text-sm text-gray-900">Select Produce Item</h3>
                  <p className="text-[11px] text-gray-400">Choose a vegetable or fruit to manage SEO tags</p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search produce name..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-[#0f8646]"
                  />
                </div>

                {/* Produce List */}
                <div className="max-h-[220px] sm:max-h-[580px] overflow-y-auto space-y-2 pr-1">
                  {filteredProducts.map((prod) => {
                    const isSelected = selectedProductId === prod._id;
                    const hasCustomSeo = Boolean(prod.metaTitle && prod.metaDescription);

                    return (
                      <div
                        key={prod._id}
                        onClick={() => selectProduct(prod)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-emerald-50/70 border-[#0f8646] shadow-xs"
                            : "bg-white border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {prod.image && (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-9 h-9 rounded-xl object-contain bg-gray-50 border border-gray-200 p-0.5 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-xs text-gray-900 truncate">
                              {prod.name}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-medium">
                              ₹{prod.price}/{prod.unit || "kg"} • {prod.category}
                            </span>
                          </div>
                        </div>

                        <div>
                          {hasCustomSeo ? (
                            <span className="text-[9px] font-black uppercase bg-green-100 text-green-800 px-2 py-0.5 rounded-md shrink-0">
                              ✓ SEO Set
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                              Auto
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: SERP Simulator & Form (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 🌟 1. LIVE GOOGLE SERP SIMULATOR CARD */}
                <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-[#0f8646]" />
                      <h3 className="font-black text-sm text-gray-900">
                        Live Google Search (SERP) Simulator
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setDevicePreview("desktop")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          devicePreview === "desktop"
                            ? "bg-white text-gray-900 shadow-2xs"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        <Monitor size={13} />
                        <span>Desktop</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDevicePreview("mobile")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          devicePreview === "mobile"
                            ? "bg-white text-gray-900 shadow-2xs"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        <Smartphone size={13} />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Google Snippet Container */}
                  <div
                    className={`bg-white rounded-2xl border border-gray-200 p-4 font-sans ${
                      devicePreview === "mobile" ? "max-w-md mx-auto shadow-md" : ""
                    }`}
                  >
                    {/* URL Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                        S
                      </div>
                      <div className="leading-none text-[12px] truncate">
                        <span className="font-medium text-gray-800">subziquick.in</span>
                        <span className="text-gray-400"> › product › {productForm.slug || "fresh-produce"}</span>
                      </div>
                    </div>

                    {/* Google Blue Link Title */}
                    <h4 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                      {productForm.metaTitle || `${productForm.name} | SubziQuick Bhopal`}
                    </h4>

                    {/* Star Ratings & Rich Snippet */}
                    <div className="flex items-center gap-2 text-[12px] text-gray-600 my-1">
                      <div className="flex text-amber-500 text-xs">
                        {"★".repeat(5)}
                      </div>
                      <span className="font-bold text-gray-700">Rating: 4.8</span>
                      <span>·</span>
                      <span>89 reviews</span>
                      <span>·</span>
                      <span className="font-bold text-emerald-800">₹{productForm.price}.00</span>
                      <span>·</span>
                      <span className="text-gray-500">In stock (Bhopal)</span>
                    </div>

                    {/* Meta Description Snippet */}
                    <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                      {productForm.metaDescription ||
                        `Order farm-fresh ${productForm.name} online in Bhopal at wholesale Karond Mandi rates. 100% ozone-washed, pesticide-safe with same-day doorstep delivery.`}
                    </p>
                  </div>

                  {/* SEO Health Bar */}
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">SEO Health Score:</span>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          seoScore >= 80
                            ? "bg-green-100 text-green-900"
                            : seoScore >= 50
                            ? "bg-amber-100 text-amber-900"
                            : "bg-red-100 text-red-900"
                        }`}
                      >
                        {seoScore} / 100
                      </span>
                    </div>

                    <div className="w-36 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          seoScore >= 80 ? "bg-emerald-500" : seoScore >= 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${seoScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* ✍️ 2. PRODUCT SEO METADATA FORM */}
                <form onSubmit={handleSaveProductSEO} className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-black text-base text-gray-900">
                        Edit SEO Meta Tags: <span className="text-[#0f8646]">{productForm.name}</span>
                      </h3>
                      <p className="text-[11px] text-gray-400">Optimize search appearance for this specific produce item</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSmartGenerate}
                      className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <Sparkles size={13} className="text-purple-700" />
                      <span>Smart Auto-Fill</span>
                    </button>
                  </div>

                  {/* URL Slug */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <Link2 size={13} className="text-[#0f8646]" />
                        <span>URL Slug *</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        subziquick.in/product/{productForm.slug || "slug-here"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      placeholder="e.g. fresh-desi-tamatar-bhopal"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646]"
                    />
                  </div>

                  {/* Meta Title */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-700">Google Meta Title *</label>
                      <span className={`text-[10px] font-bold ${
                        productForm.metaTitle.length > 60 ? "text-red-500" : "text-gray-400"
                      }`}>
                        {productForm.metaTitle.length} / 60 chars (Recommended)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={productForm.metaTitle}
                      onChange={(e) => setProductForm({ ...productForm, metaTitle: e.target.value })}
                      placeholder="e.g. Fresh Tomato / देशी टमाटर (₹30/kg) | SubziQuick Bhopal"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646]"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-700">SERP Meta Description *</label>
                      <span className={`text-[10px] font-bold ${
                        productForm.metaDescription.length > 160 ? "text-red-500" : "text-gray-400"
                      }`}>
                        {productForm.metaDescription.length} / 160 chars (Recommended)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={productForm.metaDescription}
                      onChange={(e) => setProductForm({ ...productForm, metaDescription: e.target.value })}
                      placeholder="Describe the produce, Bhopal delivery time, and Karond Mandi freshness guarantee..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646] resize-none"
                    />
                  </div>

                  {/* Meta Keywords & Focus Keyword */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={productForm.focusKeyword}
                        onChange={(e) => setProductForm({ ...productForm, focusKeyword: e.target.value })}
                        placeholder="e.g. tomato delivery bhopal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Bhopal Meta Keywords (Comma separated)</label>
                      <input
                        type="text"
                        value={productForm.metaKeywords}
                        onChange={(e) => setProductForm({ ...productForm, metaKeywords: e.target.value })}
                        placeholder="e.g. tomato price bhopal, karond mandi, sabzi"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646]"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Save size={15} />
                      <span>{saving ? "Saving SEO..." : "Save Product SEO Tags"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 2: GLOBAL STORE SEO & WEBMASTER ================= */}
          {activeTab === "global" && (
            <form onSubmit={handleSaveGlobalSEO} className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl">
              <div>
                <h3 className="font-black text-base sm:text-lg text-gray-900">
                  Global Website SEO & Search Console Configuration
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Default homepage meta tags, social sharing image, and Google verification tags
                </p>
              </div>

              {/* Site Name & Canonical Base */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Brand / Site Name</label>
                  <input
                    type="text"
                    value={globalSeo.siteName}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, siteName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Canonical Base URL</label>
                  <input
                    type="text"
                    value={globalSeo.canonicalBase}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, canonicalBase: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-[#0f8646]"
                  />
                </div>
              </div>

              {/* Default Homepage Meta Title */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700">Homepage Meta Title</label>
                  <span className="text-[10px] text-gray-400 font-bold">{globalSeo.defaultTitle.length} chars</span>
                </div>
                <input
                  type="text"
                  value={globalSeo.defaultTitle}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, defaultTitle: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-[#0f8646]"
                />
              </div>

              {/* Default Homepage Meta Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700">Homepage Meta Description</label>
                  <span className="text-[10px] text-gray-400 font-bold">{globalSeo.defaultDescription.length} chars</span>
                </div>
                <textarea
                  rows={3}
                  value={globalSeo.defaultDescription}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, defaultDescription: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#0f8646] resize-none"
                />
              </div>

              {/* Primary Keywords */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Bhopal Store Keywords</label>
                <input
                  type="text"
                  value={globalSeo.primaryKeywords}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, primaryKeywords: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-[#0f8646]"
                />
              </div>

              {/* Google Verification & Analytics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Google Search Console Verification Tag</label>
                  <input
                    type="text"
                    value={globalSeo.googleSiteVerification}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, googleSiteVerification: e.target.value })}
                    placeholder="e.g. google-site-verification code"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-[#0f8646]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Google Analytics (GA4) Measurement ID</label>
                  <input
                    type="text"
                    value={globalSeo.googleAnalyticsId}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, googleAnalyticsId: e.target.value })}
                    placeholder="e.g. G-XXXXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-[#0f8646]"
                  />
                </div>
              </div>

              {/* Social OpenGraph Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">OpenGraph Social Share Image URL</label>
                <input
                  type="text"
                  value={globalSeo.ogImageUrl}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, ogImageUrl: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-[#0f8646]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-7 py-3 rounded-2xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>{saving ? "Saving Global SEO..." : "Save Global Store SEO"}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 3: BULK AUTO-OPTIMIZER ================= */}
          {activeTab === "bulk" && (
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
              <div>
                <h3 className="font-black text-base sm:text-lg text-gray-900">
                  1-Click Bhopal SEO Auto-Optimizer
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically scans your entire product catalog and crafts high-ranking Meta Titles, Slugs, SERP Descriptions, and Local Bhopal Keywords.
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2 text-xs text-emerald-950">
                <span className="font-black uppercase tracking-wider text-[10px] text-[#0f8646] block">
                  WHAT THE AUTO-OPTIMIZER DOES:
                </span>
                <ul className="space-y-1.5 list-disc pl-4 text-gray-700">
                  <li>Creates clean SEO slugs (e.g., <code className="bg-white px-1 rounded border">fresh-tomato-vegetables-bhopal</code>).</li>
                  <li>Adds bilingual Hindi & English names for maximum Google search reach.</li>
                  <li>Injects Karond Mandi, pesticide-safe, and Bhopal localities into SERP descriptions.</li>
                  <li>Generates high-intent long-tail keywords (e.g., <em>&quot;potato delivery bhopal&quot;</em>, <em>&quot;onion mandi rate bhopal&quot;</em>).</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleRunBulkOptimize(false)}
                  disabled={bulkOptimizing}
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50 flex-1"
                >
                  <Zap size={16} />
                  <span>{bulkOptimizing ? "Optimizing Catalog..." : "Optimize Missing Products (Safe Mode)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRunBulkOptimize(true)}
                  disabled={bulkOptimizing}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={16} />
                  <span>Force Re-Optimize All ({products.length})</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
