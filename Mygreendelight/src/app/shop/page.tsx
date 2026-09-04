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
  Search,
  Truck,
  Tag,
  Flame,
  ShoppingBag,
} from "lucide-react";
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_ICONS: Record<string, string> = {
  all: "🌿",
  vegetables: "🥬",
  fruits: "🍎",
  "dairy & staples": "🥛",
  "dairy & eggs": "🥛",
  dairy: "🥛",
  exotics: "🥑",
  combos: "🍲",
  "salad mixes": "🥗",
  "oils & ghee": "🍯",
  "wholesome snacks": "🍪",
  "fresh juices": "🧃",
};

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
        if (res.data.success && res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error(error);
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
    setUnder50Only(false);
    setBigDiscountOnly(false);
    router.push("/shop");
  };

  // Client-side filtering
  const filteredGroceries = groceries.filter((item) => {
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

  const activeFilterCount =
    (categoryParam ? 1 : 0) +
    (selectedRating ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (under50Only ? 1 : 0) +
    (bigDiscountOnly ? 1 : 0) +
    (priceRange < 1500 ? 1 : 0);

  const getCategoryIcon = (name: string) => {
    const key = name.toLowerCase();
    return CATEGORY_ICONS[key] || "🌱";
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-6 pb-36 sm:pb-16 w-full">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2.5">
          <Link href="/" className="hover:text-[#0f8646] transition font-bold">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-black">Shop Produce</span>
          {categoryParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-bold">{categoryParam}</span>
            </>
          )}
          {searchParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-bold">&ldquo;{searchParam}&rdquo;</span>
            </>
          )}
        </div>

        {/* Top Header Row with Active Title & Mobile Filter Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {searchParam
                  ? `Results for "${searchParam}"`
                  : categoryParam
                  ? categoryParam
                  : "All Fresh Groceries"}
              </h1>
              <span className="text-[10px] font-black uppercase text-[#0f8646] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Bhopal Farm Direct
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
              Sunrise farm-harvested veggies, fruits & daily staples delivered in 10-15 mins
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-1.5 bg-white border border-gray-200/90 px-3.5 py-2 rounded-2xl text-xs font-black text-gray-800 shadow-2xs hover:border-[#0f8646] shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <SlidersHorizontal size={14} className="text-[#0f8646]" />
            <span>Refine Filters ({activeFilterCount})</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-4">
            
            {/* Categories Filter Box */}
            <div className="bg-white rounded-3xl shadow-2xs border border-gray-200/90 p-5">
              <h3 className="font-black text-gray-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span>🥬</span>
                <span>Categories</span>
              </h3>
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategoryClick("all")}
                  className={`text-left text-xs font-black p-2.5 rounded-xl flex justify-between items-center transition cursor-pointer ${
                    !categoryParam
                      ? "bg-emerald-50 text-[#0f8646] border border-emerald-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🌿</span> All Products
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
                        ? "bg-emerald-50 text-[#0f8646] border border-emerald-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{getCategoryIcon(cat.name)}</span> {cat.name}
                    </span>
                    {categoryParam === cat.name && <Check size={14} className="stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Rating Box */}
            <div className="bg-white rounded-3xl shadow-2xs border border-gray-200/90 p-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider">
                  Refine By
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-black text-red-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                )}
              </div>

              {/* Price Range Slider */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-gray-700">Max Price:</span>
                  <span className="text-xs font-black text-[#0f8646]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1500"
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0f8646] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                  <span>₹30</span>
                  <span>₹1500+</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <span className="text-xs font-bold text-gray-700 block mb-2">Customer Rating</span>
                {[4, 3].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs mb-1.5 transition font-bold cursor-pointer ${
                      selectedRating === star
                        ? "bg-amber-50 text-amber-900 border border-amber-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span>& above</span>
                    </span>
                    {selectedRating === star && <Check size={13} className="stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Product Grid Section */}
          <section className="flex-1 flex flex-col min-w-0">
            
            {/* Express Delivery Banner */}
            <div className="w-full bg-gradient-to-r from-[#032412] via-[#073b1d] to-[#0f8646] text-white rounded-3xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10 text-center sm:text-left">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner border border-white/20">
                  <Truck size={22} className="text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    ⚡ 10-15 Min Express Delivery in Bhopal
                  </h3>
                  <p className="text-[11px] sm:text-xs text-green-100 font-medium mt-0.5">
                    100% Ozone-Washed sunrise harvest produce straight to your doorstep
                  </p>
                </div>
              </div>

              <span className="relative z-10 bg-white text-[#0f8646] text-xs font-black px-4 py-2 rounded-xl shrink-0 shadow-xs uppercase tracking-wider">
                FREE Delivery &gt; ₹199
              </span>
            </div>

            {/* Results Count & Sorting Toolbar */}
            <div className="flex flex-row justify-between items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 mb-5 gap-3 shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-700 font-bold truncate">
                Showing <span className="font-black text-gray-900">{filteredGroceries.length}</span> items
              </p>

              <div className="flex items-center gap-2.5 shrink-0">
                {/* Sort Dropdown */}
                <select
                  value={sortParam || "newest"}
                  onChange={handleSortChange}
                  className="border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-black outline-none focus:border-[#0f8646] bg-gray-50 text-gray-800 cursor-pointer shadow-2xs"
                >
                  <option value="newest">🌿 Newest Harvest</option>
                  <option value="price_asc">💰 Price: Low to High</option>
                  <option value="price_desc">💎 Price: High to Low</option>
                </select>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-[#0f8646] shadow-2xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white text-[#0f8646] shadow-2xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid Area */}
            {loading && groceries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-2xs">
                <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
                <p className="text-xs font-black text-gray-500">Loading fresh farm produce...</p>
              </div>
            ) : filteredGroceries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-gray-200/90 shadow-2xs text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-green-50 text-[#0f8646] flex items-center justify-center text-2xl mb-3 shadow-inner">
                  🥬
                </div>
                <h3 className="text-base font-black text-gray-900 mb-1">
                  No matching fresh produce found
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-medium">
                  Try adjusting your filters or price range to discover other sunrise veggies.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                    : "flex flex-col space-y-3"
                }
              >
                {filteredGroceries.map((item) => (
                  <Groceryitemcard key={item._id} item={item} isList={viewMode === "list"} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && filteredGroceries.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  disabled={loading}
                  onClick={loadMore}
                  className="bg-white hover:bg-green-50 text-gray-900 hover:text-[#0f8646] border border-gray-200 hover:border-[#0f8646] font-black text-xs px-6 py-3 rounded-2xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-[#0f8646]" />
                      <span>Harvesting more items...</span>
                    </>
                  ) : (
                    <span>Load More Fresh Produce</span>
                  )}
                </button>
              </div>
            )}

          </section>

        </div>

      </main>

      {/* Mobile Filters Slide-over Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs cursor-pointer lg:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl cursor-default text-gray-900"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                  <SlidersHorizontal size={16} className="text-[#0f8646]" />
                  <span>Refine Produce Filters</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-5">
                <span className="text-xs font-black uppercase text-gray-400 block mb-2">
                  Categories
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("all")}
                    className={`p-2.5 rounded-xl text-xs font-black text-left flex items-center justify-between border ${
                      !categoryParam
                        ? "bg-emerald-50 text-[#0f8646] border-emerald-300"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <span>🌿 All Aisles</span>
                    {!categoryParam && <Check size={12} className="stroke-[3]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`p-2.5 rounded-xl text-xs font-black text-left flex items-center justify-between border ${
                        categoryParam === cat.name
                          ? "bg-emerald-50 text-[#0f8646] border-emerald-300"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <span className="truncate">{getCategoryIcon(cat.name)} {cat.name}</span>
                      {categoryParam === cat.name && <Check size={12} className="stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-black uppercase text-gray-400">Max Price</span>
                  <span className="text-xs font-black text-[#0f8646]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1500"
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0f8646]"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs rounded-xl transition"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-xs rounded-xl shadow-md transition"
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
