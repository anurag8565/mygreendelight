"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Groceryitemcard from "@/components/Groceryitemcard";
import {
  Loader2,
  Filter,
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
} from "lucide-react";
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "newest";

  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [groceries, setGroceries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter States
  const [priceRange, setPriceRange] = useState(1500);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<string>("WELCOME20");

  // Fetch featured active coupon from database
  useEffect(() => {
    axios
      .get("/api/coupons/featured")
      .then((res) => {
        if (res.data?.success && res.data.coupon?.code) {
          setActiveCoupon(res.data.coupon.code);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/admin/category");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCats();
  }, []);

  // Fetch initial groceries when URL params change
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
        if (res.data.success) {
          setGroceries(res.data.groceries);
          if (res.data.groceries.length < 24) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error(error);
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
      if (res.data.success) {
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let newUrl = "/shop?";
    if (categoryParam) newUrl += `category=${encodeURIComponent(categoryParam)}&`;
    if (val) newUrl += `sort=${val}&`;
    if (searchParam) newUrl += `search=${encodeURIComponent(searchParam)}&`;
    router.push(newUrl);
  };

  const resetAllFilters = () => {
    setPriceRange(1500);
    setSelectedRating(null);
    setInStockOnly(false);
    router.push("/shop");
  };

  // Client-side filtering
  const filteredGroceries = groceries.filter((item) => {
    if (item.price > priceRange) return false;
    if (selectedRating && (item.rating || 0) < selectedRating) return false;
    if (inStockOnly && item.stock <= 0) return false;
    return true;
  });

  const activeFilterCount =
    (categoryParam ? 1 : 0) +
    (selectedRating ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceRange < 1500 ? 1 : 0);

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        {/* Breadcrumbs & Title */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:text-[#0f8646] transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-extrabold">Shop Produce</span>
          {categoryParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-bold">{categoryParam}</span>
            </>
          )}
        </div>

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {searchParam
                ? `Results for "${searchParam}"`
                : categoryParam
                ? categoryParam
                : "All Fresh Groceries"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Farm-picked fresh vegetables, fruits & daily essentials in Bhopal
            </p>
          </div>

          {/* Quick Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden self-start flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 shadow-xs hover:border-[#0f8646]"
          >
            <SlidersHorizontal size={14} className="text-[#0f8646]" />
            <span>Filters ({activeFilterCount})</span>
          </button>
        </div>

        {/* Horizontal Category Quick-Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              !categoryParam
                ? "bg-[#0f8646] text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50/50"
            }`}
          >
            All Aisles
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                categoryParam === cat.name
                  ? "bg-[#0f8646] text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar (Desktop Filters) */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-5">
            {/* Category Filter Box */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5">
              <h3 className="font-extrabold text-gray-900 mb-4 text-xs uppercase tracking-wider">
                Categories
              </h3>
              <div className="flex flex-col space-y-1.5">
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={`text-left text-xs font-bold p-2 rounded-xl flex justify-between items-center transition ${
                    !categoryParam
                      ? "bg-green-50 text-[#0f8646]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>All Products</span>
                  {!categoryParam && <Check size={14} />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`text-left text-xs font-bold p-2 rounded-xl flex justify-between items-center transition ${
                      categoryParam === cat.name
                        ? "bg-green-50 text-[#0f8646]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {categoryParam === cat.name && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Controls Box */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                  Refine By
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                )}
              </div>

              {/* In Stock Only Toggle */}
              <div className="mb-5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#0f8646] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Price Range Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-800">Max Price:</span>
                  <span className="text-xs font-extrabold text-[#0f8646]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0f8646] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                  <span>₹50</span>
                  <span>₹1500+</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-2">
                <span className="text-xs font-bold text-gray-800 block mb-2.5">Rating</span>
                {[4, 3, 2].map((star) => (
                  <label
                    key={star}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs mb-1.5 transition ${
                      selectedRating === star
                        ? "bg-green-50 font-bold text-[#0f8646]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="rating"
                        className="accent-[#0f8646]"
                        checked={selectedRating === star}
                        onChange={() => setSelectedRating(selectedRating === star ? null : star)}
                      />
                      <span className="flex items-center text-amber-500 font-bold">
                        {star} <Star size={12} className="fill-amber-500 ml-0.5 inline" /> & above
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <section className="flex-1 flex flex-col">
            {/* Promo Strip */}
            <div className="w-full bg-gradient-to-r from-emerald-700 via-[#0f8646] to-green-700 text-white rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    FREE 10-Minute Delivery &gt; ₹499
                  </h3>
                  <p className="text-xs text-green-100 mt-0.5">
                    100% farm-fresh produce delivered directly to your Bhopal kitchen
                  </p>
                </div>
              </div>
              <span className="bg-white text-[#0f8646] text-xs font-black px-3.5 py-1.5 rounded-xl shrink-0 shadow-xs uppercase tracking-wider">
                Code: {activeCoupon}
              </span>
            </div>

            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-200/80 rounded-2xl px-4 py-3 mb-6 gap-4 shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Showing <span className="font-black text-gray-900">{filteredGroceries.length}</span>{" "}
                fresh items {categoryParam ? `in ${categoryParam}` : ""}
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-bold hidden sm:inline">Sort:</span>
                  <select
                    value={sortParam || "newest"}
                    onChange={handleSortChange}
                    className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-[#0f8646] bg-gray-50 cursor-pointer"
                  >
                    <option value="newest">Newest Harvest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                {/* Grid / List Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "grid"
                        ? "bg-white text-[#0f8646] shadow-xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "list"
                        ? "bg-white text-[#0f8646] shadow-xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-gray-400 font-bold">Active Filters:</span>
                {categoryParam && (
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-[#0f8646] text-xs font-bold px-2.5 py-1 rounded-lg">
                    {categoryParam}
                    <X size={12} className="cursor-pointer" onClick={() => handleCategoryClick("all")} />
                  </span>
                )}
                {selectedRating && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {selectedRating}★ & above
                    <X size={12} className="cursor-pointer" onClick={() => setSelectedRating(null)} />
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    In Stock Only
                    <X size={12} className="cursor-pointer" onClick={() => setInStockOnly(false)} />
                  </span>
                )}
                {priceRange < 1500 && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                    Under ₹{priceRange}
                    <X size={12} className="cursor-pointer" onClick={() => setPriceRange(1500)} />
                  </span>
                )}
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-red-600 font-bold hover:underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid / List */}
            {loading && page === 1 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="animate-spin text-[#0f8646] w-10 h-10" />
                <p className="text-xs font-bold text-gray-500">Loading fresh farm produce...</p>
              </div>
            ) : filteredGroceries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-green-50 text-[#0f8646] flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                  No products match your criteria
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                  Try adjusting your price slider, rating filter or choosing another aisle.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="bg-[#0f8646] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-[#0c6a38] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
                      : "flex flex-col gap-4 w-full"
                  }
                >
                  {filteredGroceries.map((item) => (
                    <Groceryitemcard
                      key={item._id}
                      item={item}
                      isList={viewMode === "list"}
                    />
                  ))}
                </div>

                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="mt-10 px-8 py-3 bg-white border border-gray-300 hover:border-[#0f8646] text-gray-800 hover:text-[#0f8646] rounded-xl font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-[#0f8646]" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <span>Load More Fresh Produce</span>
                    )}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-3xl p-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <h3 className="font-extrabold text-base text-gray-900">Filter & Refine</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase text-gray-400 tracking-wider block mb-3">
                  Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryClick("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      !categoryParam
                        ? "bg-[#0f8646] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    All Aisles
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        categoryParam === cat.name
                          ? "bg-[#0f8646] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <label className="flex items-center justify-between cursor-pointer bg-gray-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-gray-800">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#0f8646] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-800">Max Price:</span>
                  <span className="text-xs font-extrabold text-[#0f8646]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0f8646]"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#0f8646] text-white font-extrabold text-xs shadow-md"
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
