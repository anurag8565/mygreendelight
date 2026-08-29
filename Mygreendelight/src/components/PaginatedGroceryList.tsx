"use client";

import React, { useState, useEffect } from "react";
import Groceryitemcard from "./Groceryitemcard";
import { Loader2, ArrowRight } from "lucide-react";

export default function PaginatedGroceryList({ initialData }: { initialData: any[] }) {
  const [groceries, setGroceries] = useState(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length >= 20); // If initial was < 20, we don't have more

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/groceries?page=${nextPage}&limit=20`);
      const data = await res.json();
      
      if (data.success) {
        if (data.groceries.length === 0) {
          setHasMore(false);
        } else {
          setGroceries((prev) => [...prev, ...data.groceries]);
          setPage(nextPage);
          if (data.groceries.length < 20) {
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load more groceries:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 w-full">
        {groceries.map((item: any) => (
          <Groceryitemcard key={item._id?.toString()} item={item} />
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-6 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-md transition-all flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Loading..." : "Load More Products"}
        </button>
      )}
      
      {!hasMore && groceries.length > 0 && (
        <div className="mt-10 flex flex-col items-center">
          <p className="text-gray-500 text-sm mb-4">You have seen all fresh arrivals.</p>
          <a href="/shop" className="px-8 py-3 bg-[#3b5998] hover:bg-[#2d4373] text-white rounded-full font-bold shadow-md transition-all flex items-center gap-2">
             Explore Full Shop <ArrowRight size={18} />
          </a>
        </div>
      )}
    </div>
  );
}
