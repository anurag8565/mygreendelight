"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Groceryitemcard from "@/components/Groceryitemcard";
import { Heart, ShoppingBag, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import useGetMe from "@/hooks/useGetMe";

export default function WishlistPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.wishlist);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
          <span className="text-[#0f8646] font-extrabold">My Wishlist</span>
        </div>

        {/* Heading Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-xs">
              <Heart className="fill-current w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                My Saved Produce
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {items.length} farm-fresh item{items.length !== 1 ? "s" : ""} saved for later
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-sm transition"
            >
              <ShoppingBag size={14} />
              <span>Explore More Harvest</span>
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-md mx-auto shadow-xs my-8">
            <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart size={36} className="fill-red-100 text-red-400" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Explore our freshly harvested vegetables and seasonal fruits to save your favorites!
            </p>
            <Link
              href="/shop"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-md transition inline-flex items-center gap-2"
            >
              <ShoppingBag size={15} />
              <span>Start Shopping Fresh</span>
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <Groceryitemcard key={item._id} item={item as any} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
