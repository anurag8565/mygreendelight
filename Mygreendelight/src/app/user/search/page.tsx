"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Search,
  ChevronRight,
  Loader2,
  X,
  Mic,
  MicOff,
  History,
  TrendingUp,
  Zap,
  Flame,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Groceryitemcard from "@/components/Groceryitemcard";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";

const TRENDING_QUERIES = [
  { name: "Tomato", icon: "🍅", tag: "Daily Need" },
  { name: "Palak", icon: "🥬", tag: "Farm Harvest" },
  { name: "Potato", icon: "🥔", tag: "Daily Need" },
  { name: "Onion", icon: "🧅", tag: "Mandi Fresh" },
  { name: "Apple", icon: "🍎", tag: "Sweet & Fresh" },
  { name: "A2 Milk", icon: "🥛", tag: "Morning 7 AM" },
  { name: "Coriander", icon: "🌿", tag: "Fresh Greens" },
  { name: "Ginger", icon: "🫚", tag: "Spices" },
];

const CATEGORY_IMAGES: Record<string, string> = {
  vegetables: "/categories/vegetables.jpg",
  fruits: "/categories/fruits.jpg",
  exotics: "/categories/exotic.jpg",
  "dairy & staples": "/categories/dairy.jpg",
  "ready-to-cook & cut produce": "/categories/ready_to_cook.jpg",
};

export default function SearchPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("query") || "";

  const [inputQuery, setInputQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [topProduce, setTopProduce] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load Recent Searches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mgd_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  // Fetch real categories from MongoDB
  useEffect(() => {
    axios
      .get("/api/admin/category")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch popular products from MongoDB
  useEffect(() => {
    axios
      .get("/api/groceries?limit=8&sort=newest")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.groceries)) {
          setTopProduce(res.data.groceries);
        }
      })
      .catch(() => {});
  }, []);

  // Live search effect
  useEffect(() => {
    setInputQuery(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/user/search?query=${encodeURIComponent(query.trim())}`);
        setResults(res.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Live debounce search while typing
  useEffect(() => {
    if (!inputQuery.trim()) {
      if (!query) setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      if (inputQuery.trim() !== query.trim()) {
        try {
          setLoading(true);
          const res = await axios.get(`/api/user/search?query=${encodeURIComponent(inputQuery.trim())}`);
          setResults(res.data || []);
        } catch (err) {
          console.error("Live search error:", err);
        } finally {
          setLoading(false);
        }
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [inputQuery, query]);

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("mgd_recent_searches", JSON.stringify(updated));
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== item);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("mgd_recent_searches", JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mgd_recent_searches");
    }
  };

  const executeSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    router.push(`/user/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(inputQuery);
  };

  const toggleVoiceSearch = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice Search is not supported on this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          executeSearch(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const getCategoryImage = (name: string) => {
    const key = name.toLowerCase().trim();
    return CATEGORY_IMAGES[key] || "/categories/vegetables.jpg";
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 pb-28 sm:pb-16 w-full flex-1">
        
        {/* Breadcrumb Navigation & Mobile Back */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mb-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="sm:hidden p-1.5 rounded-full bg-white border border-gray-200 text-gray-700 active:scale-90 mr-1 cursor-pointer shadow-2xs"
            title="Go Back"
          >
            <ArrowLeft size={13} />
          </button>
          <Link href="/" className="hover:text-[#0c831f] transition font-semibold">
            Home
          </Link>
          <ChevronRight size={11} className="text-gray-400" />
          <Link href="/shop" className="hover:text-[#0c831f] transition font-semibold">
            Mandi Store
          </Link>
          <ChevronRight size={11} className="text-gray-400" />
          <span className="text-[#0c831f] font-bold">Live Search</span>
        </div>

        {/* 1. Quick Commerce Search Input Box */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-gray-100 shadow-xs mb-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              <Search
                size={17}
                className="absolute left-3.5 text-[#0c831f] pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search 'Tamatar', 'Palak', 'Desi A2 Milk', 'Apple'..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-20 sm:pr-28 py-3 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-[#0c831f] outline-none text-xs sm:text-sm bg-gray-50/70 font-bold text-gray-900 shadow-inner transition"
              />

              {/* Clear (X) Button */}
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setInputQuery("");
                    router.push("/user/search");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-16 sm:right-24 p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`absolute right-10 sm:right-16 p-1.5 rounded-lg transition cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-gray-400 hover:text-[#0c831f] hover:bg-gray-100"
                }`}
                title="Voice Search"
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="absolute right-1 bg-[#0c831f] hover:bg-[#0a6c1a] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* 2. IF QUERY IS EMPTY: Show Recent, Trending, Category Aisles & Popular Mandi Produce */}
        {!query && (
          <div className="space-y-4">
            
            {/* Recent Searches (If Any) */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-gray-100 shadow-2xs">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <History size={12} className="text-gray-400" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => executeSearch(s)}
                      className="px-2.5 py-1 bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-[#0c831f] border border-gray-200 hover:border-emerald-300 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>{s}</span>
                      <span
                        onClick={(e) => removeRecentSearch(e, s)}
                        className="text-gray-400 hover:text-rose-500 text-[10px]"
                      >
                        ✕
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Quick Search Chips */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-gray-100 shadow-2xs">
              <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                <Flame size={13} className="text-orange-500" />
                <span>Popular Searches in Bhopal</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-2 px-2 sm:mx-0 sm:px-0 flex-wrap">
                {TRENDING_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => executeSearch(item.name)}
                    className="bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-left transition cursor-pointer shadow-2xs active:scale-95 shrink-0"
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs font-bold text-gray-800">{item.name}</span>
                    <span className="text-[9px] text-gray-400 font-medium hidden sm:inline">
                      • {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Database Categories with Clean Cards */}
            {categories.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-gray-100 shadow-2xs">
                <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block mb-2.5">
                  Browse by Category
                </span>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="flex flex-col items-center text-center p-2 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/70 transition group select-none shadow-2xs"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white shadow-2xs border border-gray-100 overflow-hidden mb-1.5 group-hover:scale-105 transition-transform">
                        <img
                          src={getCategoryImage(cat.name)}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/categories/vegetables.jpg";
                          }}
                        />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight truncate w-full">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Bhopal Farm Favorites */}
            {topProduce.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">⚡</span>
                    <h2 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight">
                      Today&apos;s Mandi Harvest
                    </h2>
                  </div>
                  <Link
                    href="/shop"
                    className="text-[#0c831f] hover:text-[#0a6c1a] font-bold text-xs flex items-center gap-0.5"
                  >
                    <span>View All</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {topProduce.map((item) => (
                    <Groceryitemcard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. IF QUERY EXISTS: Show Results or Clean Empty State */}
        {query && (
          <div>
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-2xs">
                <Loader2 size={30} className="animate-spin text-[#0c831f] mb-2" />
                <p className="text-xs font-bold text-gray-500">
                  Searching live inventory for &ldquo;{query}&rdquo;...
                </p>
              </div>
            ) : results.length === 0 ? (
              /* Empty Search State */
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 text-center max-w-md mx-auto shadow-xs my-3">
                <div className="w-14 h-14 bg-emerald-50 text-[#0c831f] rounded-full flex items-center justify-center mx-auto mb-2.5 text-2xl">
                  🥬
                </div>
                <h2 className="text-sm sm:text-base font-black text-gray-900 mb-1">
                  No produce matching &ldquo;{query}&rdquo;
                </h2>
                <p className="text-xs text-gray-500 mb-4 font-medium">
                  We couldn&apos;t find an exact match in today&apos;s morning stock. Try checking another name or browse our fresh aisles.
                </p>
                <Link
                  href="/shop"
                  className="bg-[#0c831f] hover:bg-[#0a6c1a] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore All Produce</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3 bg-white px-3.5 py-2 rounded-2xl border border-gray-100 shadow-2xs">
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-700">
                    Results for <span className="font-black text-gray-900">&ldquo;{query}&rdquo;</span>
                  </h2>
                  <span className="text-[10px] font-bold text-[#0c831f] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {results.length} fresh items found
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {results.map((item) => (
                    <Groceryitemcard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}