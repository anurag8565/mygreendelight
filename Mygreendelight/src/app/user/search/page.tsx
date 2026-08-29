"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, ChevronRight, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Groceryitemcard from "@/components/Groceryitemcard";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function SearchPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("query") || "";

  const [inputQuery, setInputQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputQuery(query);
    if (!query) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/user/search?query=${encodeURIComponent(query)}`);
        setResults(res.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      router.push(`/user/search?query=${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  const quickPills = ["Tomato", "Spinach", "Potato", "Apple", "Banana", "Onion", "Ginger", "Mango"];

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#0f8646] transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#0f8646] transition">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-extrabold">Search</span>
        </div>

        {/* Search Header & Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Search Fresh Farm Harvest
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Find daily fresh vegetables, organic fruits, and kitchen essentials in Bhopal
          </p>

          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by vegetable, fruit, or brand..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs sm:text-sm bg-gray-50/60 font-bold"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2 rounded-xl font-extrabold text-xs transition cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
            <span className="text-gray-400 font-bold flex items-center gap-1 text-[11px]">
              <Sparkles size={13} className="text-[#0f8646]" /> Popular:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  setInputQuery(pill);
                  router.push(`/user/search?query=${encodeURIComponent(pill)}`);
                }}
                className={`px-3 py-1 rounded-xl font-bold transition text-xs cursor-pointer ${
                  query.toLowerCase() === pill.toLowerCase()
                    ? "bg-[#0f8646] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-[#0f8646]"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
            <p className="text-xs font-bold text-gray-500">
              Searching fresh inventory for "{query}"...
            </p>
          </div>
        ) : query && results.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-md mx-auto shadow-xs my-8">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">
              No produce matching "{query}"
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              We couldn't find any items matching your search. Try checking your spelling or explore our fresh aisles!
            </p>
            <Link
              href="/shop"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-7 py-3 rounded-2xl font-black text-xs shadow-md transition inline-flex items-center gap-2"
            >
              <span>Explore All Produce</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div>
            {query && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-gray-900">
                  Showing results for <span className="text-[#0f8646]">"{query}"</span>
                </h2>
                <span className="text-xs font-bold text-gray-500">
                  {results.length} item{results.length !== 1 ? "s" : ""} found
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((item) => (
                <Groceryitemcard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}