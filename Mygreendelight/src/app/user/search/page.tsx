"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Search,
  Sparkles,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Loader2,
  X,
  Mic,
  MicOff,
  History,
  TrendingUp,
  Zap,
  Flame,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Groceryitemcard from "@/components/Groceryitemcard";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";

const TRENDING_SEARCHES = [
  {
    name: "Tomato",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80",
    tag: "Daily Need",
  },
  {
    name: "Palak",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&auto=format&fit=crop&q=80",
    tag: "Harvest Special",
  },
  {
    name: "A2 Cow Milk",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80",
    tag: "Morning 7 AM",
  },
  {
    name: "Potato",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&auto=format&fit=crop&q=80",
    tag: "Top Seller",
  },
  {
    name: "Onion",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&auto=format&fit=crop&q=80",
    tag: "Mandi Fresh",
  },
  {
    name: "Paneer",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&auto=format&fit=crop&q=80",
    tag: "Organic",
  },
  {
    name: "Apple",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80",
    tag: "Kashmiri",
  },
  {
    name: "Coriander",
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=200&auto=format&fit=crop&q=80",
    tag: "Free with Veggies",
  },
];

const CATEGORY_IMAGES: Record<string, string> = {
  vegetables: "/categories/vegetables.jpg",
  fruits: "/categories/fruits.jpg",
  "dairy & staples": "/categories/dairy.jpg",
  "dairy & eggs": "/categories/dairy.jpg",
  dairy: "/categories/dairy.jpg",
  exotics: "/categories/exotic.jpg",
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
        if (res.data?.success && res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch real products from MongoDB
  useEffect(() => {
    axios
      .get("/api/groceries?limit=8&sort=newest")
      .then((res) => {
        if (res.data?.success && res.data.groceries) {
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

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
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
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-6 pb-36 sm:pb-16 w-full flex-1">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:text-[#0f8646] transition font-bold">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#0f8646] transition font-bold">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-black">Search</span>
        </div>

        {/* 1. Large Quick-Commerce Search Box */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/90 shadow-2xs mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>🔍</span>
                <span>Search Bhopal Mandi & Produce</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                10-15 Min Express Delivery • Sunrise Farm Direct
              </p>
            </div>
            <span className="bg-emerald-100 text-[#0f8646] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0">
              ⚡ 10 Min Dispatch
            </span>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-4 text-[#0f8646] pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search 'tamatar', 'palak', 'fresh milk', 'mango'..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-11 pr-24 sm:pr-32 py-3.5 rounded-2xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs sm:text-sm bg-gray-50/80 font-bold text-gray-900 shadow-inner transition"
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
                  className="absolute right-20 sm:right-28 p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`absolute right-12 sm:right-16 p-2 rounded-xl transition cursor-pointer ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-gray-500 hover:text-[#0f8646] hover:bg-gray-100"
                }`}
                title="Voice Search"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="absolute right-1.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs shadow-xs transition cursor-pointer active:scale-95"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* 2. IF QUERY IS EMPTY: Show Recent, Trending, Category Bubbles & Live Products */}
        {!query && (
          <div className="space-y-6">
            
            {/* Recent Searches (If Any) */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <History size={13} className="text-gray-400" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[11px] font-black text-red-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => executeSearch(s)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-[#0f8646] border border-gray-200/80 hover:border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>🕒</span>
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches in Bhopal with Real Product Photos */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs">
              <div className="flex items-center gap-1.5 mb-3 text-xs font-black uppercase text-gray-400 tracking-wider">
                <Flame size={14} className="text-orange-500" />
                <span>Trending Produce in Bhopal</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {TRENDING_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => executeSearch(item.name)}
                    className="bg-gray-50/80 hover:bg-emerald-50/80 border border-gray-200/80 hover:border-emerald-300 p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-2xs group-hover:scale-105 transition-transform">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80";
                          }}
                        />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] block truncate">
                          {item.name}
                        </span>
                        <span className="text-[9.5px] text-gray-400 font-bold block">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-gray-300 group-hover:text-[#0f8646] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live 100% Database Categories with Real HD Category Images */}
            {categories.length > 0 && (
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider block mb-3">
                  Explore Shopping Aisles
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-300 transition text-left group shadow-2xs"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-white shadow-2xs border border-gray-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        <img
                          src={getCategoryImage(cat.name)}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/categories/vegetables.jpg";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[9.5px] text-[#0f8646] font-bold block">
                          10m Express ➔
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Top Morning Bhopal Favorites (Direct MongoDB Produce) */}
            {topProduce.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-gray-900">
                        Popular Bhopal Farm Favorites
                      </h2>
                      <p className="text-[10.5px] text-gray-500 font-medium">
                        Live produce available right now in Bhopal store
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/shop"
                    className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs flex items-center gap-0.5 transition"
                  >
                    <span>View all</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {topProduce.map((item) => (
                    <Groceryitemcard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. IF QUERY EXISTS: Show Results or Empty State */}
        {query && (
          <div>
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-2xs">
                <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
                <p className="text-xs font-black text-gray-500">
                  Searching farm inventory for &ldquo;{query}&rdquo;...
                </p>
              </div>
            ) : results.length === 0 ? (
              /* Empty Search State with Quick Recommendations */
              <div className="bg-white rounded-3xl border border-gray-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-4">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner text-2xl">
                  🥬
                </div>
                <h2 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                  No produce matching &ldquo;{query}&rdquo;
                </h2>
                <p className="text-xs text-gray-500 mb-5 leading-relaxed font-medium">
                  We couldn&apos;t find an exact match in today&apos;s morning harvest. Try exploring our popular aisles or check our freshest categories!
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Link
                    href="/shop"
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore All Farm Produce</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-700">
                    Results for <span className="font-black text-gray-900">&ldquo;{query}&rdquo;</span>
                  </h2>
                  <span className="text-[11px] font-black text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {results.length} taaza items found
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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