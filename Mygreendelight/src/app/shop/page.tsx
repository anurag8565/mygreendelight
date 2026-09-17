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
  Leaf,
  ShieldCheck,
  Clock,
} from "lucide-react";
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";

const CATEGORY_IMAGES: Record<string, string> = {
  all: "/hero_basket.jpg",
  vegetables: "/categories/vegetables_4k.jpg?v=4",
  vegetable: "/categories/vegetables_4k.jpg?v=4",
  fruits: "/categories/fruits_4k.jpg?v=4",
  fruit: "/categories/fruits_4k.jpg?v=4",
  exotics: "/categories/exotics_4k.jpg?v=4",
  exotic: "/categories/exotics_4k.jpg?v=4",
  combos: "/categories/combos_4k.jpg?v=4",
  combo: "/categories/combos_4k.jpg?v=4",
  dairy: "/categories/dairy_4k.jpg?v=4",
};

interface HeroMeta {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
}

const CATEGORY_HERO_DATA: Record<string, HeroMeta> = {
  all: {
    title: "Fresh Farm Harvest",
    subtitle: "Handpicked daily from trusted cultivators • 100% sorted, cleaned & delivered in 10-15 mins",
    badge: "Bhopal Express • 10-15 Min",
    image: "/banners/veggies_clean_4k.jpg",
  },
  vegetables: {
    title: "Farm Fresh Vegetables",
    subtitle: "Crisp leafy greens, root veggies & daily kitchen staples at direct farm prices",
    badge: "Harvested Today • 5:00 AM",
    image: "/banners/veggies_clean_4k.jpg",
  },
  fruits: {
    title: "Sweet Seasonal Fruits",
    subtitle: "Naturally tree-ripened, hand-selected orchard fruits packed with rich vitamins",
    badge: "100% Naturally Ripened",
    image: "/banners/fruits_clean_4k.jpg",
  },
  combos: {
    title: "Super Saver Kitchen Combos",
    subtitle: "All-in-one daily cooking bundles • Save up to 35% on Aloo, Pyaaz, Tamatar & essentials",
    badge: "Save Up to 35% OFF",
    image: "/banners/hero_combos.jpg",
  },
  exotics: {
    title: "Exotics & Gourmet Greens",
    subtitle: "Hydroponic lettuce, broccoli, cherry tomatoes & fresh culinary herbs",
    badge: "Hydroponic & Gourmet",
    image: "/banners/exotics_clean_4k.jpg",
  },
  dairy: {
    title: "Pure & Fresh Dairy",
    subtitle: "Farm-fresh milk, organic paneer, dahi & traditional daily essentials",
    badge: "Pure & Unadulterated",
    image: "/banners/dairy_clean_4k.jpg",
  },
};

function ShopContent() {
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
          const list = [...res.data.categories];
          if (!list.some((c) => (c.name || "").toLowerCase().includes("combo"))) {
            list.push({ _id: "combos-category-bundle", name: "Combos", image: "/categories/combos_4k.jpg?v=4" });
          }
          setCategories(list);
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
    triggerHaptic("selection");
    let newUrl = "/shop?";
    if (catName !== "all") newUrl += `category=${encodeURIComponent(catName)}&`;
    if (sortParam) newUrl += `sort=${sortParam}&`;
    if (searchParam) newUrl += `search=${encodeURIComponent(searchParam)}&`;
    router.push(newUrl);
    setIsMobileFilterOpen(false);
  };

  const handleSortChange = (newSort: string) => {
    triggerHaptic("light");
    let newUrl = "/shop?";
    if (categoryParam) newUrl += `category=${encodeURIComponent(categoryParam)}&`;
    if (newSort) newUrl += `sort=${newSort}&`;
    if (searchParam) newUrl += `search=${encodeURIComponent(searchParam)}&`;
    router.push(newUrl);
  };

  const resetAllFilters = () => {
    triggerHaptic("medium");
    setPriceRange(1500);
    setSelectedRating(null);
    setInStockOnly(false);
    setUnder50Only(false);
    setBigDiscountOnly(false);
    router.push("/shop");
    setIsMobileFilterOpen(false);
  };

  // Client-side filtering & sorting
  const filteredGroceries = useMemo(() => {
    let list = groceries.filter((item) => {
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

    if (sortParam === "rating") {
      list = [...list].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }
    return list;
  }, [groceries, priceRange, selectedRating, inStockOnly, under50Only, bigDiscountOnly, sortParam]);

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
    return CATEGORY_IMAGES[key] || fallbackImg || "/categories/vegetables_4k.jpg?v=4";
  };

  // Contextual Hero Meta
  const currentHeroMeta: HeroMeta = useMemo(() => {
    if (searchParam) {
      return {
        title: `Search: "${searchParam}"`,
        subtitle: `Showing matching fresh produce available for instant 10-15 min express delivery`,
        badge: "Live Search Results",
        image: "/banners/veggies_clean_4k.jpg",
      };
    }
    if (!categoryParam) return CATEGORY_HERO_DATA.all;
    const catLower = categoryParam.toLowerCase();
    if (catLower.includes("veg")) return CATEGORY_HERO_DATA.vegetables;
    if (catLower.includes("fruit")) return CATEGORY_HERO_DATA.fruits;
    if (catLower.includes("combo")) return CATEGORY_HERO_DATA.combos;
    if (catLower.includes("exotic") || catLower.includes("salad")) return CATEGORY_HERO_DATA.exotics;
    if (catLower.includes("dairy")) return CATEGORY_HERO_DATA.dairy;

    return {
      title: `Fresh ${categoryParam}`,
      subtitle: `Handpicked daily from nearby farms • 100% sorted, cleaned & delivered in 10-15 mins`,
      badge: "Farm Fresh Direct",
      image: CATEGORY_IMAGES[catLower] || "/banners/veggies_clean_4k.jpg",
    };
  }, [categoryParam, searchParam]);

  return (
    <div className="bg-[#faf9f5] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 pb-28 sm:pb-16 w-full">
        
        {/* 1. Sleek Micro-Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-500 mb-3 select-none">
          <Link href="/" className="hover:text-[#0a3d24] transition-colors font-medium">
            Home
          </Link>
          <ChevronRight size={11} className="text-stone-400 shrink-0" />
          <Link href="/shop" className="hover:text-[#0a3d24] transition-colors font-medium">
            Store
          </Link>
          {categoryParam && (
            <>
              <ChevronRight size={11} className="text-stone-400 shrink-0" />
              <span className="text-[#0a3d24] font-bold capitalize">{categoryParam}</span>
            </>
          )}
          {searchParam && (
            <>
              <ChevronRight size={11} className="text-stone-400 shrink-0" />
              <span className="text-stone-900 font-bold">&ldquo;{searchParam}&rdquo;</span>
            </>
          )}
        </nav>

        {/* 2. Contextual Editorial Mini-Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#062817] via-[#0a3d24] to-[#0f492b] text-white p-4 sm:p-7 mb-4 sm:mb-6 shadow-[0_8px_30px_rgba(10,61,36,0.12)] border border-emerald-800/40">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 w-80 h-80 sm:w-96 sm:h-96 bg-emerald-400/15 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 -top-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl">
              {/* Live Status Badge */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase bg-white/12 backdrop-blur-md text-emerald-200 border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentHeroMeta.badge}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Zap size={10} className="fill-amber-300" />
                  10-15 Min
                </span>
              </div>

              {/* Title & Description */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white font-heading">
                {currentHeroMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 font-normal mt-1 leading-relaxed max-w-lg">
                {currentHeroMeta.subtitle}
              </p>

              {/* Sub-bar / Stats */}
              <div className="flex items-center gap-3 mt-3 text-[11px] font-medium text-emerald-200/90">
                <span className="flex items-center gap-1">
                  <Check size={13} className="text-emerald-300 stroke-[3]" />
                  <span>{filteredGroceries.length} Products Available</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-emerald-400/50" />
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-300" />
                  <span>100% Quality Assurance</span>
                </span>
              </div>
            </div>

            {/* Desktop Right Side Visual Anchor */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <div className="relative w-44 h-28 lg:w-52 lg:h-32 rounded-2xl overflow-hidden border border-white/15 shadow-lg bg-black/20 group">
                <img
                  src={currentHeroMeta.image}
                  alt={currentHeroMeta.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="text-[10px] font-bold text-white/95 uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                    Farm Direct
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 4K Circular Produce Micro-Chips Ribbon */}
        <div className="mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 select-none">
            {/* "All Items" Chip */}
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCategoryClick("all")}
              className={`h-[40px] pl-1.5 pr-3.5 rounded-full font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap shadow-2xs border ${
                !categoryParam
                  ? "bg-[#0a3d24] text-white border-[#0a3d24] ring-2 ring-[#0a3d24]/20 shadow-xs"
                  : "bg-white text-stone-700 hover:text-stone-900 border-stone-200/90 hover:bg-stone-50"
              }`}
            >
              <div className={`w-7 h-7 rounded-full overflow-hidden shrink-0 border ${
                !categoryParam ? "border-emerald-300/40" : "border-stone-200"
              }`}>
                <img
                  src="/hero_basket.jpg"
                  alt="All Items"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>All Items</span>
            </motion.button>

            {/* Real MongoDB Categories */}
            {categories.map((cat) => {
              const isActive = categoryParam === cat.name;
              const catImg = getCategoryImage(cat.name, cat.image);

              return (
                <motion.button
                  key={cat._id}
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`h-[40px] pl-1.5 pr-3.5 rounded-full font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap shadow-2xs border ${
                    isActive
                      ? "bg-[#0a3d24] text-white border-[#0a3d24] ring-2 ring-[#0a3d24]/20 shadow-xs"
                      : "bg-white text-stone-700 hover:text-stone-900 border-stone-200/90 hover:bg-stone-50"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full overflow-hidden shrink-0 border ${
                    isActive ? "border-emerald-300/40" : "border-stone-200"
                  }`}>
                    <img
                      src={catImg}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/categories/vegetables_4k.jpg?v=4";
                      }}
                    />
                  </div>
                  <span>{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 4. Quick-Commerce Action Bar (Sticky Filters, Sort & View Mode) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-3 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 select-none">
          {/* Under ₹50 Quick Filter */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setUnder50Only(!under50Only);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border cursor-pointer ${
              under50Only
                ? "bg-[#0a3d24] text-white border-[#0a3d24] shadow-xs"
                : "bg-white text-stone-700 border-stone-200/90 hover:border-stone-300 shadow-2xs"
            }`}
          >
            <Zap size={11} className={under50Only ? "fill-white" : "text-amber-500 fill-amber-500"} />
            <span>Under ₹50</span>
            {under50Only && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* 20%+ OFF Steal Deals */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setBigDiscountOnly(!bigDiscountOnly);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border cursor-pointer ${
              bigDiscountOnly
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-white text-stone-700 border-stone-200/90 hover:border-stone-300 shadow-2xs"
            }`}
          >
            <Flame size={11} className={bigDiscountOnly ? "fill-white" : "text-rose-500 fill-rose-500"} />
            <span>20%+ OFF</span>
            {bigDiscountOnly && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* 4+ Star Rated */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setSelectedRating(selectedRating === 4 ? null : 4);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border cursor-pointer ${
              selectedRating === 4
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-white text-stone-700 border-stone-200/90 hover:border-stone-300 shadow-2xs"
            }`}
          >
            <Star size={11} className={selectedRating === 4 ? "fill-white" : "fill-amber-400 text-amber-400"} />
            <span>Top Rated (4★+)</span>
            {selectedRating === 4 && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* In Stock Only */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setInStockOnly(!inStockOnly);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
              inStockOnly
                ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                : "bg-white text-stone-700 border-stone-200/90 hover:border-stone-300 shadow-2xs"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${inStockOnly ? "bg-white" : "bg-emerald-500"}`} />
            <span>In Stock</span>
            {inStockOnly && <Check size={11} className="stroke-[3]" />}
          </button>

          {/* Reset Filters Pill (if any active) */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-1.5 rounded-full hover:bg-rose-100 transition shrink-0 cursor-pointer"
            >
              <RotateCcw size={10} />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}

          {/* Right Group: Sort & Mobile Filters Trigger */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {/* Mobile Filter Sheet Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition shrink-0"
            >
              <SlidersHorizontal size={12} />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
            </button>

            {/* Sort Pill Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-stone-200/90 rounded-full px-2.5 py-1.5 shadow-2xs shrink-0">
              <ArrowUpDown size={11} className="text-stone-400 shrink-0" />
              <select
                value={sortParam || "newest"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-[11px] font-bold text-stone-800 bg-transparent outline-none cursor-pointer pr-1"
              >
                <option value="newest">Featured &amp; New</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. Main Storefront Layout (Sidebar + Product Showcase) */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-4 sticky top-24">
            
            {/* Categories Filter Box */}
            <div className="bg-white rounded-2xl shadow-2xs border border-stone-200/80 p-4">
              <h3 className="font-bold text-stone-900 mb-2.5 text-xs uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <Leaf size={14} className="text-[#0a3d24]" />
                <span>Categories</span>
              </h3>
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategoryClick("all")}
                  className={`text-left text-xs font-bold p-2.5 rounded-xl flex justify-between items-center transition cursor-pointer ${
                    !categoryParam
                      ? "bg-emerald-50 text-[#0a3d24] border border-emerald-200"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <img src="/hero_basket.jpg" alt="All" className="w-full h-full object-cover" />
                    </span>
                    <span>All Items</span>
                  </span>
                  {!categoryParam && <Check size={14} className="stroke-[3]" />}
                </button>

                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`text-left text-xs font-bold p-2.5 rounded-xl flex justify-between items-center transition cursor-pointer ${
                      categoryParam === cat.name
                        ? "bg-emerald-50 text-[#0a3d24] border border-emerald-200"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="w-5 h-5 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <img
                          src={getCategoryImage(cat.name)}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/categories/vegetables_4k.jpg?v=4";
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

            {/* Price Budget Slider Box */}
            <div className="bg-white rounded-2xl shadow-2xs border border-stone-200/80 p-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider font-heading">
                  Price Budget
                </h3>
                {priceRange < 1500 && (
                  <button
                    type="button"
                    onClick={() => setPriceRange(1500)}
                    className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Slider */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-stone-500 font-medium">Max Limit:</span>
                  <span className="text-xs font-black text-[#0a3d24]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1500"
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0a3d24] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium mt-1">
                  <span>₹30</span>
                  <span>₹1500+</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  { label: "All Prices", val: 1500 },
                  { label: "Under ₹50", val: 50 },
                  { label: "Under ₹100", val: 100 },
                  { label: "Under ₹250", val: 250 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setPriceRange(preset.val)}
                    className={`py-1 px-2 rounded-lg text-[10px] font-bold border text-center transition cursor-pointer ${
                      priceRange === preset.val
                        ? "bg-emerald-50 text-[#0a3d24] border-emerald-300"
                        : "bg-stone-50 text-stone-600 border-stone-200/60 hover:bg-stone-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SubziQuick Assurance Badge Card */}
            <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 rounded-2xl border border-emerald-200/80 p-3.5 text-stone-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#0a3d24] text-white flex items-center justify-center shrink-0">
                  <Truck size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0a3d24] leading-tight font-heading">
                    Bhopal Express
                  </h4>
                  <p className="text-[10px] text-stone-500 font-medium">Direct to your kitchen</p>
                </div>
              </div>
              <ul className="text-[11px] text-stone-600 space-y-1.5 font-medium border-t border-emerald-200/60 pt-2.5">
                <li className="flex items-center gap-1.5">
                  <Clock size={11} className="text-[#0a3d24] shrink-0" />
                  <span>10-15 Min Express Delivery</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Leaf size={11} className="text-emerald-600 shrink-0" />
                  <span>Washed &amp; Hand-Sorted</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                  <span>100% Replacement Guarantee</span>
                </li>
              </ul>
            </div>

          </aside>

          {/* Right Product Showcase Section */}
          <section className="flex-1 flex flex-col min-w-0 w-full">
            
            {/* Header / View Switcher Bar */}
            <div className="flex flex-row justify-between items-center bg-white border border-stone-200/80 rounded-2xl px-3.5 sm:px-4 py-2 mb-3.5 gap-2 shadow-2xs">
              <p className="text-xs sm:text-sm text-stone-600 font-medium truncate">
                Showing <span className="font-bold text-stone-900">{filteredGroceries.length}</span> fresh items
              </p>

              <div className="flex items-center gap-2 shrink-0">
                {/* Grid / List Switcher */}
                <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setViewMode("grid");
                    }}
                    aria-label="Grid View"
                    className={`p-1.5 rounded-md transition cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-[#0a3d24] shadow-2xs"
                        : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setViewMode("list");
                    }}
                    aria-label="List View"
                    className={`p-1.5 rounded-md transition cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white text-[#0a3d24] shadow-2xs"
                        : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid Area & Skeleton Loader */}
            {loading && groceries.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-3 border border-stone-200/70 shadow-2xs flex flex-col animate-pulse"
                  >
                    <div className="w-full aspect-square bg-stone-100 rounded-xl mb-3" />
                    <div className="h-3.5 bg-stone-200/80 rounded-md w-3/4 mb-2" />
                    <div className="h-3 bg-stone-100 rounded-md w-1/2 mb-3" />
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="h-4 bg-stone-200/80 rounded w-12" />
                      <div className="h-7 bg-stone-200/80 rounded-lg w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredGroceries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-stone-200/80 shadow-2xs text-center max-w-md mx-auto w-full my-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0a3d24] flex items-center justify-center text-3xl mb-3 border border-emerald-100">
                  🥬
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 font-heading">
                  No matching produce found
                </h3>
                <p className="text-xs text-stone-500 mb-5 max-w-xs leading-relaxed">
                  Try adjusting your price filter, clearing active chips, or exploring our popular categories below.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("Vegetables")}
                    className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-lg border border-stone-200 transition"
                  >
                    Vegetables
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("Fruits")}
                    className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-lg border border-stone-200 transition"
                  >
                    Fresh Fruits
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("Combos")}
                    className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-lg border border-stone-200 transition"
                  >
                    Kitchen Combos
                  </button>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="bg-[#0a3d24] hover:bg-[#072817] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
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
              <div className="flex justify-center mt-8 mb-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={loadMore}
                  className="bg-white hover:bg-emerald-50 text-stone-900 hover:text-[#0a3d24] border border-stone-200 hover:border-[#0a3d24] font-bold text-xs px-6 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-[#0a3d24]" />
                      <span>Loading more produce...</span>
                    </>
                  ) : (
                    <span>Load More Items</span>
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
              className="bg-white rounded-t-3xl p-4 sm:p-5 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl cursor-default text-stone-900 pb-8"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3.5">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5 font-heading">
                  <SlidersHorizontal size={15} className="text-[#0a3d24]" />
                  <span>Filters &amp; Preferences</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Categories Grid */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase text-stone-400 block mb-2">
                  Select Category
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("all")}
                    className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between border ${
                      !categoryParam
                        ? "bg-emerald-50 text-[#0a3d24] border-emerald-300"
                        : "bg-stone-50 border-stone-200 text-stone-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full overflow-hidden bg-white border border-stone-200 shrink-0">
                        <img src="/hero_basket.jpg" alt="All" className="w-full h-full object-cover" />
                      </span>
                      <span>All Items</span>
                    </span>
                    {!categoryParam && <Check size={12} className="stroke-[3]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between border ${
                        categoryParam === cat.name
                          ? "bg-emerald-50 text-[#0a3d24] border-emerald-300"
                          : "bg-stone-50 border-stone-200 text-stone-700"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-full overflow-hidden bg-white border border-stone-200 shrink-0">
                          <img
                            src={getCategoryImage(cat.name)}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/categories/vegetables_4k.jpg?v=4";
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
                  <span className="text-[11px] font-bold uppercase text-stone-400">Max Price</span>
                  <span className="text-xs font-black text-[#0a3d24]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1500"
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0a3d24]"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {[50, 100, 250, 1500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPriceRange(val)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border text-center transition ${
                      priceRange === val
                        ? "bg-emerald-50 text-[#0a3d24] border-emerald-300"
                        : "bg-stone-50 text-stone-600 border-stone-200"
                    }`}
                  >
                    {val === 1500 ? "Any" : `≤ ₹${val}`}
                  </button>
                ))}
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-[#0a3d24] hover:bg-[#072817] text-white font-bold text-xs rounded-xl shadow-xs transition"
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

function ShopLoadingFallback() {
  return (
    <div className="bg-[#faf9f5] min-h-screen flex flex-col justify-between font-sans">
      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 pb-28 sm:pb-16 w-full">
        <div className="bg-gradient-to-r from-[#062817] to-[#0a3d24] p-6 rounded-3xl border border-emerald-800/40 text-white mb-4 animate-pulse">
          <div className="h-6 bg-white/20 rounded w-1/3 mb-2" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-stone-200/70 shadow-2xs animate-pulse">
              <div className="w-full aspect-square bg-stone-100 rounded-xl mb-3" />
              <div className="h-3.5 bg-stone-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/2 mb-3" />
              <div className="h-7 bg-stone-200 rounded-lg w-full" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense fallback={<ShopLoadingFallback />}>
      <ShopContent />
    </React.Suspense>
  );
}
