"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Groceryitemcard from "@/components/Groceryitemcard";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const POPULAR_SEARCHES = [
  "Fresh Tomato",
  "Pahadi Potato",
  "Nashik Onion",
  "Fresh Coriander",
  "Palak Spinach",
  "Button Mushroom",
  "Green Chilli",
  "Ginger",
  "Shimla Apple",
  "Robusta Banana",
  "Broccoli",
];

const CANONICAL_CATEGORIES = [
  {
    name: "Daily Vegetables",
    hindi: "ताज़ी सब्ज़ियाँ",
    subtitle: "Farm Fresh Daily",
    image: "/categories/vegetables_4k.jpg?v=4",
    link: "/shop?category=Vegetables",
  },
  {
    name: "Seasonal Fruits",
    hindi: "मीठे ताज़े फल",
    subtitle: "Sweet & Naturally Ripe",
    image: "/categories/fruits_4k.jpg?v=4",
    link: "/shop?category=Fruits",
  },
  {
    name: "Exotic & Hydroponic",
    hindi: "विदेशी सब्जियां",
    subtitle: "Hydroponic & Salads",
    image: "/categories/exotics_4k.jpg?v=4",
    link: "/shop?category=Exotics",
  },
];

function SearchContent() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("query") || "";

  const [inputQuery, setInputQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);
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

  // Live search effect on query param change
  useEffect(() => {
    setInputQuery(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/user/search?query=${encodeURIComponent(query.trim())}`
        );
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
          const res = await axios.get(
            `/api/user/search?query=${encodeURIComponent(inputQuery.trim())}`
          );
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
    const updated = [
      trimmed,
      ...recentSearches.filter(
        (s) => s.toLowerCase() !== trimmed.toLowerCase()
      ),
    ].slice(0, 6);
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
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

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

  return (
    <div className="bg-[#f8faf8] min-h-screen flex flex-col justify-between font-sans selection:bg-green-100 selection:text-green-900">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 pb-28 sm:pb-16 w-full flex-1 space-y-4">
        {/* Minimalist Top Breadcrumb */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Link href="/" className="hover:text-gray-700 transition">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/shop" className="hover:text-gray-700 transition">
              Store
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#0f8646] font-bold">Search</span>
          </div>

          <span className="text-[11px] font-bold text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Live Mandi Stock
          </span>
        </div>

        {/* Minimalist Clean Search Input Box */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
            <Search
              size={17}
              className="absolute left-3.5 text-gray-400 pointer-events-none"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search vegetables, fruits, herbs..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-24 sm:pr-28 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white outline-none text-xs sm:text-sm bg-gray-50/80 font-semibold text-gray-900 transition placeholder:text-gray-400 placeholder:font-normal"
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
                className="absolute right-16 sm:right-22 p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                title="Clear"
              >
                <X size={14} />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`absolute right-9 sm:right-13 p-1.5 rounded-lg transition cursor-pointer ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "text-gray-400 hover:text-[#0f8646] hover:bg-gray-100"
              }`}
              title="Voice Search"
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="absolute right-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3 sm:px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* IF QUERY IS EMPTY: Show Recent, Popular, and 3 Core Categories */}
        {!query && (
          <div className="space-y-4">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History size={12} />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => executeSearch(s)}
                      className="px-2.5 py-1 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#0f8646] border border-gray-200/70 hover:border-emerald-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
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

            {/* Popular Searches */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Popular Searches
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {POPULAR_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => executeSearch(item)}
                    className="px-2.5 py-1 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#0f8646] border border-gray-200/70 hover:border-emerald-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Core Clean Category Cards (Real 4K Images) */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
                Shop by Category
              </span>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                {CANONICAL_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.link}
                    className="group p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-200/70 hover:border-emerald-200 transition text-center flex flex-col items-center"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden mb-2 bg-white border border-gray-100 shadow-2xs group-hover:scale-105 transition-transform">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold text-xs text-gray-900 group-hover:text-[#0f8646] transition">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium hidden sm:block mt-0.5">
                      {cat.subtitle}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Farm Fresh Items */}
            {topProduce.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-900">
                    Fresh Farm Harvest
                  </h2>
                  <Link
                    href="/shop"
                    className="text-[#0f8646] hover:underline font-bold text-xs flex items-center gap-0.5"
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

        {/* IF QUERY EXISTS: Results or Clean Empty State */}
        {query && (
          <div>
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
                <Loader2 size={24} className="animate-spin text-[#0f8646] mb-2" />
                <p className="text-xs font-semibold text-gray-500">
                  Searching for &ldquo;{query}&rdquo;...
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-sm mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.03)] my-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <Search size={20} />
                </div>
                <h2 className="text-sm font-bold text-gray-900 mb-1">
                  No items found for &ldquo;{query}&rdquo;
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  Check the spelling or try searching another vegetable or fruit.
                </p>
                <Link
                  href="/shop"
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Store</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3 bg-white px-3.5 py-2 rounded-xl border border-gray-100">
                  <h2 className="text-xs font-medium text-gray-600">
                    Results for <span className="font-bold text-gray-900">&ldquo;{query}&rdquo;</span>
                  </h2>
                  <span className="text-[11px] font-bold text-[#0f8646] bg-emerald-50 px-2 py-0.5 rounded-md">
                    {results.length} items
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#0f8646] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-gray-500">Searching fresh produce...</span>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
