"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Groceryitemcard from "@/components/Groceryitemcard";
import {
  Loader2,
  ChevronRight,
  LayoutGrid,
  List,
  Sparkles,
  Zap,
  Star,
  RotateCcw,
  SlidersHorizontal,
  X,
  Check,
  Search,
  Truck,
  Flame,
  Percent,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_IMAGES: Record<string, string> = {
  all: "/categories/vegetables.jpg",
  vegetables: "/categories/vegetables.jpg",
  fruits: "/categories/fruits.jpg",
  "dairy & staples": "/categories/dairy.jpg",
  "dairy & eggs": "/categories/dairy.jpg",
  dairy: "/categories/dairy.jpg",
  exotics: "/categories/exotic.jpg",
  combos: "/combo_banner.jpg",
  "salad mixes": "/categories/exotic.jpg",
  "ready-to-cook & cut produce": "/categories/ready_to_cook.jpg",
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "newest";

  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  const [categories, setCategories] = useState<{ _id: string; name: string; image?: string }[]>([]);
  const [groceries, setGroceries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter States
  const [priceRange, setPriceRange] = useState(1500);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [under50Only, setUnder50Only] = useState(false);
  const [bigDiscountOnly, setBigDiscountOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real categories from MongoDB
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/admin/category");
        if (res.data?.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCats();
  }, []);

  // Fetch groceries when URL params change
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setGroceries([]);
      setPage(1);
      setHasMore(true);

      try {
        let url = `/api/groceries?page=1&limit=24`;
        if (categoryParam) url += `&category=${encodeURIComponent(categoryParam)}`;
        if (sortParam) url += `&sort=${sortParam}`;
        if (searchParam) url += `&search=${encodeURIComponent(searchParam)}`;

        const res = await axios.get(url);
        if (res.data?.success) {
          setGroceries(res.data.groceries);
          if (res.data.groceries.length < 24) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching groceries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [categoryParam, sortParam, searchParam]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setLoading(true);

    try {
      let url = `/api/groceries?page=${nextPage}&limit=24`;
      if (categoryParam) url += `&category=${encodeURIComponent(categoryParam)}`;
      if (sortParam) url += `&sort=${sortParam}`;
      if (searchParam) url += `&search=${encodeURIComponent(searchParam)}`;

      const res = await axios.get(url);
      if (res.data?.success) {
        if (res.data.groceries.length === 0) {
          setHasMore(false);
        } else {
          setGroceries((prev) => [...prev, ...res.data.groceries]);
          setPage(nextPage);
          if (res.data.groceries.length < 24) {
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (catName: string) => {
    let newUrl = "/shop?";
    if (catName !== "all") newUrl += `category=${encodeURIComponent(catName)}&`;
    if (sortParam) newUrl += `sort=${sortParam}&`;
    if (searchParam) newUrl += `search=${encodeURIComponent(searchParam)}&`;
    router.push(newUrl);
    setIsMobileFilterOpen(false);
  };

  const handleSortChange = (newSort: string) => {
    let newUrl = "/shop?";
    if (categoryParam) newUrl += `category=${encodeURIComponent(categoryParam)}&`;
    if (newSort) newUrl += `sort=${newSort}&`;
    if (searchParam) newUrl += `search=${encodeURIComponent(searchParam)}&`;
    router.push(newUrl);
  };

  const resetAllFilters = () => {
    setPriceRange(1500);
    setSelectedRating(null);
    setInStockOnly(false);
    setUnder50Only(false);
    setBigDiscountOnly(false);
    router.push("/shop");
    setIsMobileFilterOpen(false);
  };

  // Client-side filtering
  const filteredGroceries = useMemo(() => {
    return groceries.filter((item) => {
      if (item.price > priceRange) return false;
      if (selectedRating && (item.rating || 0) < selectedRating) return false;
      if (inStockOnly && item.stock <= 0) return false;
      if (under50Only && item.price > 50) return false;
      if (bigDiscountOnly) {
        const mrp = item.mrp || Math.round(item.price * 1.25);
        const discount = Math.round(((mrp - item.price) / mrp) * 100);
        if (discount < 20) return false;
      }
      return true;
    });
  }, [groceries, priceRange, selectedRating, inStockOnly, under50Only, bigDiscountOnly]);

  const activeFilterCount =
    (categoryParam ? 1 : 0) +
    (selectedRating ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (under50Only ? 1 : 0) +
    (bigDiscountOnly ? 1 : 0) +
    (priceRange < 1500 ? 1 : 0);

  const getCategoryImage = (name: string, fallbackImg?: string) => {
    if (fallbackImg && (fallbackImg.startsWith("http") || fallbackImg.startsWith("/"))) {
      return fallbackImg;
    }
    const key = name.toLowerCase().trim();
    return CATEGORY_IMAGES[key] || fallbackImg || "/categories/vegetables.jpg";
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 pb-28 sm:pb-16 w-full">
        
        {/* 1. Clean Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#0c831f] transition font-semibold">
            Home
          </Link>
          <ChevronRight size={11} className="text-gray-400" />
          <Link href="/shop" className="hover:text-[#0c831f] transition font-semibold">
            Mandi Store
          </Link>
          {categoryParam && (
            <>
              <ChevronRight size={11} className="text-gray-400" />
              <span className="text-emerald-800 font-bold capitalize">{categoryParam}</span>
            </>
          )}
          {searchParam && (
            <>
              <ChevronRight size={11} className="text-gray-400" />
              <span className="text-gray-900 font-bold">&ldquo;{searchParam}&rdquo;</span>
            </>
          )}
        </div>

        {/* 2. Top Banner & Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                {searchParam
                  ? `Search: "${searchParam}"`
                  : categoryParam
                  ? categoryParam
                  : "All Mandi Fresh Produce"}
              </h1>
              <span className="text-[10px] font-black uppercase text-[#0c831f] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                ⚡ Same Day Dispatch
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
              Direct from Bhopal & Sehore contract farms • 100% Sorted & Ozone-Washed
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition"
              >
                <RotateCcw size={11} />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-gray-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition"
            >
              <SlidersHorizontal size={13} />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
            </button>
          </div>
        </div>

        {/* 3. Visual Category Carousel Ribbon (Mobile & Desktop App-Style) */}
        <div className="mb-3.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {/* "All Produce" Tab */}
            <button
              type="button"
              onClick={() => handleCategoryClick("all")}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shrink-0 transition-all font-black text-xs cursor-pointer shadow-2xs border ${
                !categoryParam
                  ? "bg-[#0c831f] text-white border-[#0c831f] shadow-xs scale-100 ring-2 ring-emerald-600/30"
                  : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg overflow-hidden bg-white/20 flex items-center justify-center shrink-0 border border-white/20">
                <img
                  src="/categories/vegetables.jpg"
                  alt="All"
                  className="w-full h-full object-cover"
                />
              </span>
              <span>All Produce</span>
            </button>

            {/* Real MongoDB Categories */}
            {categories.map((cat) => {
              const isActive = categoryParam === cat.name;
              const catImg = getCategoryImage(cat.name, cat.image);

              return (
                <button
                  type="button"
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shrink-0 transition-all font-black text-xs cursor-pointer shadow-2xs border ${
                    isActive
                      ? "bg-[#0c831f] text-white border-[#0c831f] shadow-xs scale-100 ring-2 ring-emerald-600/30"
                      : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-black/5">
                    <img
                      src={catImg}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/categories/vegetables.jpg";
                      }}
                    />
                  </span>
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Quick 1-Tap Filter Chips on Mobile & Desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-2.5 -mx-3 px-3 sm:mx-0 sm:px-0 select-none">
          {/* Under ₹50 Quick Filter */}
          <button
            type="button"
            onClick={() => setUnder50Only(!under50Only)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border cursor-pointer ${
              under50Only
                ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Zap size={11} className={under50Only ? "fill-white" : "text-amber-500"} />
            <span>Under ₹50</span>
            {under50Only && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* 20%+ OFF Steal Deals */}
          <button
            type="button"
            onClick={() => setBigDiscountOnly(!bigDiscountOnly)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border cursor-pointer ${
              bigDiscountOnly
                ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Flame size={11} className={bigDiscountOnly ? "fill-white" : "text-rose-500"} />
            <span>20%+ OFF</span>
            {bigDiscountOnly && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* 4+ Star Rated */}
          <button
            type="button"
            onClick={() => setSelectedRating(selectedRating === 4 ? null : 4)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border cursor-pointer ${
              selectedRating === 4
                ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Star size={11} className={selectedRating === 4 ? "fill-white" : "fill-amber-400 text-amber-400"} />
            <span>Top Rated (4★+)</span>
            {selectedRating === 4 && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* In Stock Only */}
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border cursor-pointer ${
              inStockOnly
                ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <span>In Stock Only</span>
            {inStockOnly && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* Sort Pill Dropdown for Mobile */}
          <div className="ml-auto shrink-0 flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 shadow-2xs">
            <ArrowUpDown size={11} className="text-gray-500" />
            <select
              value={sortParam || "newest"}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-[11px] font-bold text-gray-800 bg-transparent outline-none cursor-pointer pr-1"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 5. Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-4">
            
            {/* Categories Filter Box */}
            <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-4">
              <h3 className="font-black text-gray-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full overflow-hidden border border-black/10 inline-block shrink-0">
                  <img src="/categories/vegetables.jpg" alt="Produce" className="w-full h-full object-cover" />
                </span>
                <span>Categories</span>
              </h3>
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategoryClick("all")}
                  className={`text-left text-xs font-black p-2.5 rounded-xl flex justify-between items-center transition cursor-pointer ${
                    !categoryParam
                      ? "bg-emerald-50 text-[#0c831f] border border-emerald-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md overflow-hidden bg-white border border-gray-200 shrink-0">
                      <img src="/categories/vegetables.jpg" alt="All" className="w-full h-full object-cover" />
                    </span>
                    <span>All Products</span>
                  </span>
                  {!categoryParam && <Check size={14} className="stroke-[3]" />}
                </button>

                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`text-left text-xs font-black p-2.5 rounded-xl flex justify-between items-center transition cursor-pointer ${
                      categoryParam === cat.name
                        ? "bg-emerald-50 text-[#0c831f] border border-emerald-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="w-5 h-5 rounded-md overflow-hidden bg-white border border-gray-200 shrink-0">
                        <img
                          src={getCategoryImage(cat.name)}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/categories/vegetables.jpg";
                          }}
                        />
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    {categoryParam === cat.name && <Check size={14} className="stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Rating Box */}
            <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider">
                  Filter by Price
                </h3>
                {priceRange < 1500 && (
                  <button
                    type="button"
                    onClick={() => setPriceRange(1500)}
                    className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Range Slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-600">Max Budget:</span>
                  <span className="text-xs font-black text-[#0c831f]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1500"
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0c831f] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                  <span>₹30</span>
                  <span>₹1500+</span>
                </div>
              </div>
            </div>

          </aside>

          {/* Right Product Grid Section */}
          <section className="flex-1 flex flex-col min-w-0">
            
            {/* Results Count & View Mode Header */}
            <div className="flex flex-row justify-between items-center bg-white border border-gray-100 rounded-2xl px-3 sm:px-4 py-2 mb-3 gap-2 shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                Showing <span className="font-black text-gray-900">{filteredGroceries.length}</span> fresh items
              </p>

              <div className="flex items-center gap-2 shrink-0">
                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded-md transition cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-[#0c831f] shadow-2xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded-md transition cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white text-[#0c831f] shadow-2xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid Area */}
            {loading && groceries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-2xs">
                <Loader2 size={32} className="animate-spin text-[#0c831f] mb-2" />
                <p className="text-xs font-bold text-gray-500">Loading fresh harvest...</p>
              </div>
            ) : filteredGroceries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-4 bg-white rounded-3xl border border-gray-100 shadow-2xs text-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0c831f] flex items-center justify-center text-2xl mb-2.5">
                  🥬
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 mb-1">
                  No matching fresh produce found
                </h3>
                <p className="text-xs text-gray-500 mb-3.5 font-medium">
                  Try clearing some filter chips or searching another mandi category.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="bg-[#0c831f] hover:bg-[#0a6c1a] text-white px-4 py-2 rounded-xl font-black text-xs shadow-xs transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4"
                    : "flex flex-col space-y-2.5"
                }
              >
                {filteredGroceries.map((item) => (
                  <Groceryitemcard key={item._id} item={item} isList={viewMode === "list"} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && filteredGroceries.length > 0 && (
              <div className="flex justify-center mt-6 mb-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={loadMore}
                  className="bg-white hover:bg-emerald-50 text-gray-900 hover:text-[#0c831f] border border-gray-200 hover:border-[#0c831f] font-black text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-[#0c831f]" />
                      <span>Loading more...</span>
                    </>
                  ) : (
                    <span>Load More Produce</span>
                  )}
                </button>
              </div>
            )}

          </section>

        </div>

      </main>

      {/* Mobile Filters Slide-over Bottom Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/60 backdrop-blur-xs cursor-pointer lg:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl p-4 sm:p-5 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl cursor-default text-gray-900 pb-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3.5">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                  <SlidersHorizontal size={15} className="text-[#0c831f]" />
                  <span>Refine Produce Filters</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <span className="text-[11px] font-black uppercase text-gray-400 block mb-2">
                  Produce Categories
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("all")}
                    className={`p-2.5 rounded-xl text-xs font-black text-left flex items-center justify-between border ${
                      !categoryParam
                        ? "bg-emerald-50 text-[#0c831f] border-emerald-300"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full overflow-hidden bg-white border border-gray-200 shrink-0">
                        <img src="/categories/vegetables.jpg" alt="All" className="w-full h-full object-cover" />
                      </span>
                      <span>All Aisles</span>
                    </span>
                    {!categoryParam && <Check size={12} className="stroke-[3]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`p-2.5 rounded-xl text-xs font-black text-left flex items-center justify-between border ${
                        categoryParam === cat.name
                          ? "bg-emerald-50 text-[#0c831f] border-emerald-300"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="w-4 h-4 rounded-full overflow-hidden bg-white border border-gray-200 shrink-0">
                          <img
                            src={getCategoryImage(cat.name)}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/categories/vegetables.jpg";
                            }}
                          />
                        </span>
                        <span className="truncate">{cat.name}</span>
                      </span>
                      {categoryParam === cat.name && <Check size={12} className="stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-black uppercase text-gray-400">Max Budget</span>
                  <span className="text-xs font-black text-[#0c831f]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1500"
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0c831f]"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-[#0c831f] hover:bg-[#0a6c1a] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

