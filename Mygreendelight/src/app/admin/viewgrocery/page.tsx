"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Edit,
  Search,
  Plus,
  Trash2,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  X,
  Check,
  Loader2,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  TrendingDown,
  Boxes,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

type Grocery = {
  _id: string;
  name: string;
  price: number;
  unit: string;
  category?: string;
  image?: string;
  stock?: number;
  isFeatured?: boolean;
  status?: "published" | "draft";
  isTopRated?: boolean;
  rating?: number;
  description?: string;
  sourcing?: string;
  storage?: string;
  variations?: { weight: string; price: number; stock: number }[];
};

export default function ViewGrocery() {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [filteredGroceries, setFilteredGroceries] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "featured">("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGrocery, setSelectedGrocery] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    price: 0,
    mrp: 0,
    rating: 4.8,
    isTopRated: false,
    isFeatured: false,
    status: "published" as "published" | "draft",
    stock: 0,
    unit: "",
    category: "",
    image: "",
    description: "",
    sourcing: "",
    storage: "",
  });

  const [editVariations, setEditVariations] = useState<
    { weight: string; price: number; stock: number }[]
  >([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  // Bulk Multi-Select & Modifier State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDiscountInput, setBulkDiscountInput] = useState("10");
  const [bulkRestockInput, setBulkRestockInput] = useState("25");
  const [bulkCategoryInput, setBulkCategoryInput] = useState("");

  // Wipe / Clean State
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [wipeConfirmText, setWipeConfirmText] = useState("");
  const [wipeCategoryTarget, setWipeCategoryTarget] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredGroceries.length && filteredGroceries.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredGroceries.map((g) => g._id));
    }
  };

  const selectAllInDatabase = () => {
    setSelectedIds(groceries.map((g) => g._id));
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedIds.length === 0) {
      alert("Please select at least one produce item first.");
      return;
    }

    if (
      action === "delete" &&
      !confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected produce item(s) from database?`)
    ) {
      return;
    }

    try {
      setBulkLoading(true);
      const res = await axios.post("/api/admin/bulk-update", {
        itemIds: selectedIds,
        action,
        value,
      });

      if (res.data.success) {
        alert(`✓ ${res.data.message}`);
        setSelectedIds([]);
        fetchGroceries();
      } else {
        alert(res.data.message || "Bulk action failed");
      }
    } catch (err: any) {
      console.error("Bulk update error:", err);
      alert(err.response?.data?.message || "Failed to execute bulk update.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExecuteWipe = async () => {
    if (wipeConfirmText.trim().toUpperCase() !== "DELETE") {
      alert('Please type "DELETE" to confirm wiping produce from database.');
      return;
    }

    try {
      setBulkLoading(true);
      const res = await axios.post("/api/admin/bulk-update", {
        action: wipeCategoryTarget ? "delete_category" : "wipe_all",
        value: wipeCategoryTarget,
      });

      if (res.data.success) {
        alert(`✓ ${res.data.message}`);
        setShowWipeModal(false);
        setWipeConfirmText("");
        setWipeCategoryTarget(null);
        setSelectedIds([]);
        fetchGroceries();
      } else {
        alert(res.data.message || "Wipe failed");
      }
    } catch (err: any) {
      console.error("Wipe error:", err);
      alert(err.response?.data?.message || "Failed to wipe produce from database.");
    } finally {
      setBulkLoading(false);
    }
  };

  const fetchGroceries = async () => {
    setLoading(true);
    try {
      const [gRes, cRes] = await Promise.all([
        axios.get("/api/admin/getgroceries"),
        axios.get("/api/admin/category"),
      ]);
      setGroceries(gRes.data || []);
      setFilteredGroceries(gRes.data || []);
      if (cRes.data.success) {
        setCategories(cRes.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching groceries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  const publishedCount = React.useMemo(
    () => groceries.filter((g) => g.status !== "draft").length,
    [groceries]
  );

  const draftCount = React.useMemo(
    () => groceries.filter((g) => g.status === "draft").length,
    [groceries]
  );

  const featuredCount = React.useMemo(
    () => groceries.filter((g) => Boolean(g.isFeatured)).length,
    [groceries]
  );

  // Filter produce according to active status tab so category counts reflect current view
  const statusScopedGroceries = React.useMemo(() => {
    if (statusFilter === "published") {
      return groceries.filter((g) => g.status !== "draft");
    } else if (statusFilter === "draft") {
      return groceries.filter((g) => g.status === "draft");
    } else if (statusFilter === "featured") {
      return groceries.filter((g) => Boolean(g.isFeatured));
    }
    return groceries;
  }, [groceries, statusFilter]);

  const distinctCategories = React.useMemo(() => {
    // Preserve all category names in list even if 0 count in current filter
    const allCatNames = new Set<string>();
    groceries.forEach((g) => {
      if (!g.category) return;
      const cat = g.category.trim();
      allCatNames.add(cat.charAt(0).toUpperCase() + cat.slice(1));
    });

    const map = new Map<string, number>();
    allCatNames.forEach((name) => map.set(name, 0));

    statusScopedGroceries.forEach((g) => {
      if (!g.category) return;
      const cat = g.category.trim();
      const capitalized = cat.charAt(0).toUpperCase() + cat.slice(1);
      map.set(capitalized, (map.get(capitalized) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [groceries, statusScopedGroceries]);

  const lowStockCount = React.useMemo(() => {
    return statusScopedGroceries.filter(
      (g) =>
        (g.stock || 0) < 10 ||
        g.variations?.some((v) => (v.stock || 0) < 10)
    ).length;
  }, [statusScopedGroceries]);

  const outOfStockCount = React.useMemo(() => {
    return statusScopedGroceries.filter(
      (g) =>
        (g.stock || 0) === 0 &&
        (!g.variations ||
          g.variations.length === 0 ||
          g.variations.every((v) => (v.stock || 0) === 0))
    ).length;
  }, [statusScopedGroceries]);

  // 1-Click Toggle Featured ⭐
  const toggleFeatured = async (item: Grocery) => {
    const newVal = !item.isFeatured;
    setGroceries((prev) =>
      prev.map((g) => (g._id === item._id ? { ...g, isFeatured: newVal } : g))
    );
    try {
      await axios.put(`/api/admin/grocery/${item._id}`, { isFeatured: newVal });
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      // rollback on error
      setGroceries((prev) =>
        prev.map((g) => (g._id === item._id ? { ...g, isFeatured: item.isFeatured } : g))
      );
    }
  };

  // 1-Click Toggle Status (Published 🟢 / Draft 🟡)
  const toggleStatus = async (item: Grocery) => {
    const newStatus: "published" | "draft" = item.status === "draft" ? "published" : "draft";
    setGroceries((prev) =>
      prev.map((g) => (g._id === item._id ? { ...g, status: newStatus } : g))
    );
    try {
      await axios.put(`/api/admin/grocery/${item._id}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to toggle status:", err);
      // rollback on error
      setGroceries((prev) =>
        prev.map((g) => (g._id === item._id ? { ...g, status: item.status } : g))
      );
    }
  };

  useEffect(() => {
    let result = groceries;

    // 1. Status / Featured Filter
    if (statusFilter === "published") {
      result = result.filter((g) => g.status !== "draft");
    } else if (statusFilter === "draft") {
      result = result.filter((g) => g.status === "draft");
    } else if (statusFilter === "featured") {
      result = result.filter((g) => g.isFeatured);
    }

    // 2. Category / Stock Filter
    if (selectedCategory === "low_stock") {
      result = result.filter(
        (item) =>
          (item.stock || 0) < 10 ||
          item.variations?.some((v) => (v.stock || 0) < 10)
      );
    } else if (selectedCategory === "out_of_stock") {
      result = result.filter(
        (item) =>
          (item.stock || 0) === 0 &&
          (!item.variations ||
            item.variations.length === 0 ||
            item.variations.every((v) => (v.stock || 0) === 0))
      );
    } else if (selectedCategory !== "all") {
      result = result.filter(
        (item) =>
          (item.category || "").trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase()
      );
    }

    // 3. Search Filter
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
    }

    setFilteredGroceries(result);
  }, [searchTerm, selectedCategory, statusFilter, groceries]);

  const quickRestock = async (item: Grocery, addAmount: number = 25) => {
    const newStock = (item.stock || 0) + addAmount;
    const newVariations = (item.variations || []).map((v) => ({
      ...v,
      stock: (v.stock || 0) + addAmount,
    }));

    try {
      const res = await axios.put(`/api/admin/grocery/${item._id}`, {
        name: item.name,
        price: item.price,
        unit: item.unit,
        category: item.category,
        image: item.image,
        description: item.description,
        sourcing: item.sourcing,
        storage: item.storage,
        stock: newStock,
        variations: newVariations,
      });

      if (res.data.grocery) {
        setGroceries((prev) =>
          prev.map((g) => (g._id === item._id ? res.data.grocery : g))
        );
      }
    } catch (error) {
      console.error("Quick restock error:", error);
      alert("Failed to restock item.");
    }
  };

  const openEdit = (item: Grocery) => {
    setSelectedGrocery(item);
    setEditForm({
      name: item.name,
      price: item.price,
      mrp: (item as any).mrp || 0,
      rating: (item as any).rating || 4.8,
      isTopRated: (item as any).isTopRated || false,
      isFeatured: Boolean(item.isFeatured),
      status: item.status || "published",
      stock: item.stock || 0,
      unit: item.unit || "",
      category: item.category || "",
      image: item.image || "",
      description: item.description || "",
      sourcing: item.sourcing || "",
      storage: item.storage || "",
    });
    setEditVariations(item.variations || []);
    setShowEditModal(true);
  };

  const updateGrocery = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(
        `/api/admin/grocery/${selectedGrocery._id}`,
        { ...editForm, variations: editVariations }
      );

      const updatedList = groceries.map((g) =>
        g._id === selectedGrocery._id ? res.data.grocery : g
      );
      setGroceries(updatedList);
      setShowEditModal(false);
      alert("Produce details updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Update failed. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteGrocery = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from inventory?`)) return;
    try {
      await axios.delete(`/api/admin/grocery/${id}`);
      setGroceries((prev) => prev.filter((g) => g._id !== id));
      alert(`"${name}" has been deleted.`);
    } catch (error) {
      console.error(error);
      alert("Failed to delete item.");
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
              Produce Inventory & Stock
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage live farm items, pricing, pack sizes & inventory counts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchGroceries}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            <Link
              href="/admin/bulk-upload"
              className="bg-green-50 hover:bg-green-100 border border-green-300 text-[#0f8646] px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5"
            >
              <FileSpreadsheet size={15} />
              <span>Bulk CSV Upload</span>
            </Link>

            <button
              onClick={() => {
                setWipeCategoryTarget(null);
                setWipeConfirmText("");
                setShowWipeModal(true);
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              title="Bulk Wipe & Clean Database"
            >
              <Trash2 size={14} />
              <span>Bulk Clean / Reset</span>
            </button>

            <Link
              href="/admin/addgrocery"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Add Produce</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Mandi Procurement Alert Banner */}
          {lowStockCount > 0 && (
            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                    Mandi Procurement & Restock Alert
                  </span>
                  <span className="text-xs font-black text-amber-950">
                    {lowStockCount} produce item(s) are running low in stock (&lt; 10 units). Prioritize in tomorrow&apos;s Mandi procurement batch.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(selectedCategory === "low_stock" ? "all" : "low_stock")}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-black transition shrink-0 cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <TrendingDown size={14} />
                <span>{selectedCategory === "low_stock" ? "Show All Produce" : `Filter Low Stock (${lowStockCount})`}</span>
              </button>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col gap-3">
            {/* Row 1: Status & Featured Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-100">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-gray-900 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Produce ({groceries.length})
              </button>

              <button
                onClick={() => setStatusFilter("published")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "published"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <Eye size={13} />
                <span>🟢 Published Live ({publishedCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "draft"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                <EyeOff size={13} />
                <span>🟡 Hidden Drafts ({draftCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter("featured")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "featured"
                    ? "bg-yellow-500 text-gray-950 shadow-xs"
                    : "bg-yellow-50 text-yellow-900 border border-yellow-200 hover:bg-yellow-100"
                }`}
              >
                <Star size={13} className="fill-yellow-500" />
                <span>⭐ Featured Picks ({featuredCount})</span>
              </button>
            </div>

            {/* Row 2: Category & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
              {/* Category & Stock Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-[#0f8646] text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All Categories ({statusScopedGroceries.length})
                </button>

                {/* Low Stock Mandi Filter Pill */}
                <button
                  onClick={() => setSelectedCategory("low_stock")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === "low_stock"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <AlertTriangle size={13} />
                  <span>Low Stock ({lowStockCount})</span>
                </button>

                {/* Out of Stock Filter Pill */}
                {outOfStockCount > 0 && (
                  <button
                    onClick={() => setSelectedCategory("out_of_stock")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === "out_of_stock"
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    }`}
                  >
                    <span>Out of Stock ({outOfStockCount})</span>
                  </button>
                )}

                {distinctCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? "bg-[#0f8646] text-white shadow-xs"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search produce by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-bold border border-gray-200 rounded-xl outline-none focus:border-[#0f8646] bg-gray-50/60"
                />
              </div>
            </div>
          </div>

          {/* Bulk Action Toolbar (Appears when 1+ items selected) */}
          {selectedIds.length > 0 && (
            <div className="bg-gray-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-gray-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fade-in sticky top-20 z-40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0f8646] text-white flex items-center justify-center font-black text-sm shrink-0">
                  {selectedIds.length}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    {selectedIds.length} Produce Item(s) Selected
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Publish/Draft, Feature picks, apply bulk discounts, restock or move category
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Bulk Publish / Draft */}
                <button
                  disabled={bulkLoading}
                  onClick={() => handleBulkAction("bulk_publish")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Make selected items live on website"
                >
                  <Eye size={13} />
                  <span>Publish 🟢</span>
                </button>

                <button
                  disabled={bulkLoading}
                  onClick={() => handleBulkAction("bulk_draft")}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Hide selected items from website"
                >
                  <EyeOff size={13} />
                  <span>Draft (Hide) 🟡</span>
                </button>

                {/* Bulk Feature / Unfeature */}
                <button
                  disabled={bulkLoading}
                  onClick={() => handleBulkAction("bulk_feature")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-950 text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Feature selected items on Homepage"
                >
                  <Star size={13} className="fill-current" />
                  <span>Feature ⭐</span>
                </button>

                <button
                  disabled={bulkLoading}
                  onClick={() => handleBulkAction("bulk_unfeature")}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-2.5 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                  title="Remove from featured picks"
                >
                  Unfeature
                </button>

                {/* 1. Bulk Discount */}
                <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-xl border border-gray-700">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={bulkDiscountInput}
                    onChange={(e) => setBulkDiscountInput(e.target.value)}
                    className="w-11 px-1.5 py-1 text-xs font-black text-white bg-gray-900 rounded-lg outline-none text-center"
                    placeholder="10"
                  />
                  <span className="text-[11px] font-bold text-gray-400">% OFF</span>
                  <button
                    disabled={bulkLoading}
                    onClick={() => handleBulkAction("discount", bulkDiscountInput)}
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white text-xs font-black px-2 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* 2. Bulk Restock */}
                <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-xl border border-gray-700">
                  <input
                    type="number"
                    min="1"
                    value={bulkRestockInput}
                    onChange={(e) => setBulkRestockInput(e.target.value)}
                    className="w-12 px-1.5 py-1 text-xs font-black text-white bg-gray-900 rounded-lg outline-none text-center"
                    placeholder="25"
                  />
                  <button
                    disabled={bulkLoading}
                    onClick={() => handleBulkAction("restock", bulkRestockInput)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-2 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    +Restock
                  </button>
                </div>

                {/* 3. Bulk Category Move */}
                <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-xl border border-gray-700">
                  <select
                    value={bulkCategoryInput}
                    onChange={(e) => setBulkCategoryInput(e.target.value)}
                    className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-lg outline-none max-w-[110px]"
                  >
                    <option value="">Move...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {bulkCategoryInput && (
                    <button
                      disabled={bulkLoading}
                      onClick={() => handleBulkAction("change_category", bulkCategoryInput)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-2 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      Go
                    </button>
                  )}
                </div>

                {/* 4. Bulk Delete */}
                <button
                  disabled={bulkLoading}
                  onClick={() => handleBulkAction("delete")}
                  className="bg-red-600/90 hover:bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  title="Bulk delete selected items"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>

                {/* Clear */}
                <button
                  onClick={() => setSelectedIds([])}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Groceries Table */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
              <p className="text-xs font-bold text-gray-500">Loading Produce Items...</p>
            </div>
          ) : filteredGroceries.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/80 shadow-xs max-w-md mx-auto">
              <Package size={36} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-900 mb-1">
                No produce items found
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Try searching for another name or add a new item to store.
              </p>
              <Link
                href="/admin/addgrocery"
                className="bg-[#0f8646] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                + Add Produce Item
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-black uppercase text-gray-400">
                      <th className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.length === filteredGroceries.length &&
                            filteredGroceries.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded text-[#0f8646] focus:ring-[#0f8646] cursor-pointer"
                          title="Select / Deselect All"
                        />
                      </th>
                      <th className="py-3.5 px-4">Produce</th>
                      <th className="py-3.5 px-3 text-center">⭐ Featured</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Selling Price</th>
                      <th className="py-3.5 px-4">Mandi Cost & Margin</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Variations</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredGroceries.map((item) => {
                      const stockCount = item.stock || 0;
                      const hasVars = item.variations && item.variations.length > 0;
                      const isSelected = selectedIds.includes(item._id);
                      const estimatedCost = Math.round(item.price * 0.68);
                      const marginPercent = Math.round(((item.price - estimatedCost) / item.price) * 100);
                      const isItemFeatured = Boolean(item.isFeatured);
                      const isDraft = item.status === "draft";

                      return (
                        <tr
                          key={item._id}
                          className={`hover:bg-gray-50/60 transition group ${
                            isSelected ? "bg-green-50/40" : ""
                          } ${isDraft ? "opacity-75 bg-amber-50/20" : ""}`}
                        >
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectItem(item._id)}
                              className="w-4 h-4 rounded text-[#0f8646] focus:ring-[#0f8646] cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || "/categories/vegetables.jpg"}
                                alt={item.name}
                                className="w-11 h-11 object-contain rounded-xl bg-gray-50 border border-gray-100 p-1 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm">
                                    {item.name}
                                  </h4>
                                  {isItemFeatured && (
                                    <span className="bg-yellow-400 text-gray-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-2xs">
                                      ⭐ FEATURED
                                    </span>
                                  )}
                                  {isDraft && (
                                    <span className="bg-amber-100 text-amber-900 font-black text-[9px] px-1.5 py-0.5 rounded border border-amber-200">
                                      DRAFT
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 truncate block">
                                  Pack: {item.unit || "1 kg"} • ID: {item._id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 1-Click Toggle Featured ⭐ */}
                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => toggleFeatured(item)}
                              className={`p-1.5 rounded-xl transition inline-flex items-center gap-1 text-[11px] font-black cursor-pointer border ${
                                isItemFeatured
                                  ? "bg-yellow-50 text-yellow-800 border-yellow-300 shadow-2xs hover:bg-yellow-100"
                                  : "bg-gray-50 text-gray-400 border-gray-200 hover:text-yellow-600 hover:border-yellow-200 hover:bg-yellow-50/50"
                              }`}
                              title={isItemFeatured ? "Click to unfeature" : "Click to mark as Featured Pick ⭐"}
                            >
                              <Star
                                size={14}
                                className={isItemFeatured ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}
                              />
                              <span>{isItemFeatured ? "Featured" : "Star"}</span>
                            </button>
                          </td>

                          {/* 1-Click Toggle Status (Published / Draft) */}
                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => toggleStatus(item)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition inline-flex items-center gap-1 cursor-pointer border ${
                                isDraft
                                  ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              }`}
                              title={isDraft ? "Click to Publish Live on Store" : "Click to Save as Draft (Hide from Store)"}
                            >
                              {isDraft ? (
                                <>
                                  <EyeOff size={11} />
                                  <span>🟡 Draft</span>
                                </>
                              ) : (
                                <>
                                  <Eye size={11} />
                                  <span>🟢 Live</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="bg-green-50 text-[#0f8646] font-bold text-[11px] px-2.5 py-1 rounded-lg border border-green-200">
                              {item.category || "General"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-black text-gray-900 text-sm">₹{item.price}</span>
                            <span className="text-[10px] text-gray-400 block">/{item.unit || "unit"}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-gray-600 font-bold">Cost: ₹{estimatedCost}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                                  +{marginPercent}% Margin
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  Wastage: ~2%
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1.5 items-start">
                              {stockCount <= 0 ? (
                                <span className="bg-red-100 text-red-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                                  Out of Stock
                                </span>
                              ) : stockCount < 10 ? (
                                <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                                  <AlertTriangle size={10} />
                                  <span>Low: {stockCount} left</span>
                                </span>
                              ) : (
                                <span className="bg-green-100 text-[#0f8646] font-extrabold text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                                  In Stock ({stockCount})
                                </span>
                              )}

                              {stockCount < 10 && (
                                <button
                                  onClick={() => quickRestock(item, 25)}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-[#0f8646] border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-black transition cursor-pointer flex items-center gap-1"
                                  title="Add +25 Mandi Fresh Units"
                                >
                                  <Plus size={10} />
                                  <span>+25 Restock</span>
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-gray-500 font-medium">
                            {hasVars ? (
                              <span className="text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                                {item.variations?.length} sizes
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">Single Pack</span>
                            )}
                          </td>

                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(item)}
                                className="p-2 rounded-xl bg-gray-100 hover:bg-[#0f8646] text-gray-600 hover:text-white transition"
                                title="Edit Item"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteGrocery(item._id, item.name)}
                                className="p-2 rounded-xl bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white transition"
                                title="Delete Item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        </main>
      </div>

      {/* Edit Produce Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-lg font-black text-gray-900">
                Edit Produce Details: {selectedGrocery?.name}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={updateGrocery} className="space-y-4 text-xs font-bold">
              {/* Status & Featured Banner in Edit Modal */}
              <div className="grid sm:grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-gray-700 mb-1 font-extrabold">Visibility & Publishing Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "published" | "draft" })}
                    className="w-full p-2 rounded-xl border border-gray-300 outline-none focus:border-[#0f8646] bg-white font-bold text-xs"
                  >
                    <option value="published">🟢 Published (Live on Storefront)</option>
                    <option value="draft">🟡 Draft (Hidden from Customers)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 pt-4">
                  <input
                    type="checkbox"
                    id="edit-featured-check"
                    checked={editForm.isFeatured}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
                  />
                  <label htmlFor="edit-featured-check" className="cursor-pointer text-gray-900 font-extrabold text-xs flex items-center gap-1">
                    <span>⭐ Mark as Featured Produce Pick</span>
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Produce Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Category *</label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">MRP Cut Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 60"
                    value={editForm.mrp}
                    onChange={(e) =>
                      setEditForm({ ...editForm, mrp: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Standard Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500g, 1 kg"
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={editForm.stock}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stock: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-bold"
                  />
                </div>
              </div>

              {/* Rating & Top Rated Toggle in Edit Modal */}
              <div className="grid sm:grid-cols-2 gap-4 bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100">
                <div>
                  <label className="block text-gray-700 mb-1">Customer Star Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editForm.rating}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rating: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-xl border border-emerald-200 outline-none focus:border-[#0f8646] bg-white font-bold"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-3">
                  <input
                    type="checkbox"
                    id="edit-top-rated-check"
                    checked={editForm.isTopRated}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isTopRated: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0f8646] rounded cursor-pointer"
                  />
                  <label htmlFor="edit-top-rated-check" className="cursor-pointer text-gray-800 font-extrabold text-xs">
                    🌟 Feature in &quot;Top Rated Farm Products&quot;
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 resize-none"
                />
              </div>

              {/* Weight Variations Manager */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-bold">
                    Pack Size Variations (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditVariations([
                        ...editVariations,
                        { weight: "1 kg", price: editForm.price, stock: 20 },
                      ])
                    }
                    className="text-xs text-[#0f8646] hover:underline"
                  >
                    + Add Size Variation
                  </button>
                </div>

                {editVariations.map((v, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input
                      type="text"
                      placeholder="Size (e.g. 500g)"
                      value={v.weight}
                      onChange={(e) => {
                        const copy = [...editVariations];
                        copy[i].weight = e.target.value;
                        setEditVariations(copy);
                      }}
                      className="flex-1 p-2 rounded-lg border text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) => {
                        const copy = [...editVariations];
                        copy[i].price = Number(e.target.value);
                        setEditVariations(copy);
                      }}
                      className="w-24 p-2 rounded-lg border text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => {
                        const copy = [...editVariations];
                        copy[i].stock = Number(e.target.value);
                        setEditVariations(copy);
                      }}
                      className="w-24 p-2 rounded-lg border text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditVariations(editVariations.filter((_, idx) => idx !== i))
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-extrabold shadow-md disabled:opacity-50"
                >
                  {updating ? "Saving Changes..." : "Save Produce Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🧹 BULK WIPE / RESET INVENTORY DANGER ZONE MODAL */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {wipeCategoryTarget
                    ? `Wipe All "${wipeCategoryTarget}" Produce`
                    : "Wipe Entire Produce Inventory"}
                </h3>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  ⚠️ Danger Zone • Permanent Action
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {wipeCategoryTarget ? (
                <>
                  This will permanently delete <strong>all produce items</strong> under category{" "}
                  <span className="font-bold text-gray-900">&quot;{wipeCategoryTarget}&quot;</span> from your
                  MongoDB database.
                </>
              ) : (
                <>
                  This will permanently delete <strong>all {groceries.length} produce items</strong> from your
                  live MongoDB database. This action cannot be undone. Use this when resetting inventory after
                  uploading test CSVs.
                </>
              )}
            </p>

            {/* Quick Category Wipe Select (If wiping by category) */}
            {!wipeCategoryTarget && categories.length > 0 && (
              <div className="mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <span className="text-[11px] font-black text-gray-700 block mb-1.5">
                  Or Wipe a Specific Category Only:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => setWipeCategoryTarget(c.name)}
                      className="px-2.5 py-1 bg-white hover:bg-red-50 text-gray-800 hover:text-red-700 border border-gray-200 hover:border-red-300 rounded-lg text-[11px] font-bold transition cursor-pointer"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wipeCategoryTarget && (
              <div className="mb-4 flex items-center justify-between bg-red-50 p-2.5 rounded-xl border border-red-200 text-xs font-bold text-red-800">
                <span>Targeting Category: <strong>{wipeCategoryTarget}</strong></span>
                <button
                  type="button"
                  onClick={() => setWipeCategoryTarget(null)}
                  className="text-[11px] text-red-600 hover:underline cursor-pointer"
                >
                  Switch to Wipe All
                </button>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-black text-gray-700">
                Type <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                placeholder="Type DELETE"
                value={wipeConfirmText}
                onChange={(e) => setWipeConfirmText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-red-200 focus:border-red-600 outline-none text-sm font-black text-red-700 tracking-wider font-mono bg-red-50/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowWipeModal(false);
                  setWipeConfirmText("");
                  setWipeCategoryTarget(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkLoading || wipeConfirmText.trim().toUpperCase() !== "DELETE"}
                onClick={handleExecuteWipe}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>{bulkLoading ? "Wiping Database..." : "Permanently Wipe from Database"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}