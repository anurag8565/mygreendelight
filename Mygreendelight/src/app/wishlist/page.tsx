"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Groceryitemcard from "@/components/Groceryitemcard";
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Zap,
  Leaf,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGetMe from "@/hooks/useGetMe";
import { clearWishlist } from "@/redux/WishlistSlice";
import { addMultipleToCart } from "@/redux/CartSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  useGetMe();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { userdata } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.wishlist);
  const { cartdata } = useSelector((state: RootState) => state.cart);

  const [mounted, setMounted] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch trending groceries for empty state or recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecs(true);
        const res = await axios.get("/api/groceries?limit=8");
        if (res.data?.groceries) {
          setRecommendedItems(res.data.groceries);
        }
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (!mounted) return null;

  // Calculate wishlist estimated value
  const totalEstimated = items.reduce(
    (acc, curr) => acc + (Number(curr.price) || 0),
    0
  );

  // Calculate active cart summary
  const totalCartItems = cartdata.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );
  const totalCartAmount = cartdata.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Add all wishlist items to cart
  const handleAddAllToCart = () => {
    if (!items || items.length === 0) return;

    const cartItemsToAdd = items.map((item: any) => ({
      _id: item._id,
      cartItemId: item._id.toString() + (item.unit ? `-${item.unit}` : ""),
      name: item.name,
      price: Number(item.price) || 0,
      unit: item.unit || "1 unit",
      image: item.image,
      quantity: 1,
      stock: item.stock ?? 50,
      category: item.category || "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    dispatch(addMultipleToCart(cartItemsToAdd));
    setAddedAllSuccess(true);
    setTimeout(() => {
      setAddedAllSuccess(false);
    }, 3500);
  };

  // Clear wishlist
  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    setShowClearConfirm(false);
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans text-gray-800 pb-20 md:pb-0">
      <Nav user={(userdata as any) || { role: "user" }} />

      {/* Top Mobile Header & Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Go Back"
              className="p-1.5 -ml-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-1.5">
                <span>My Wishlist</span>
                <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                  {items.length}
                </span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0c831f] transition">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link href="/shop" className="hover:text-[#0c831f] transition">
              Shop
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#0c831f] font-bold">Wishlist</span>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-[#0c831f] hover:underline flex items-center gap-1"
          >
            <span>Browse Shop</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 w-full flex-1">
        {/* Quick Trust / Info Ribbon */}
        <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-6 bg-gradient-to-r from-emerald-50/60 via-green-50/40 to-teal-50/60 border border-emerald-100/80 rounded-2xl p-2.5 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-900">
            <Zap size={14} className="text-amber-500 fill-amber-500 shrink-0" />
            <span className="truncate">10-15 Min Bhopal Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-900 border-x border-emerald-200/60 px-1">
            <Leaf size={14} className="text-emerald-600 shrink-0" />
            <span className="truncate">5:00 AM Fresh Mandi</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-900">
            <RotateCcw size={14} className="text-teal-600 shrink-0" />
            <span className="truncate">Zero-Risk Doorstep Return</span>
          </div>
        </div>

        {/* Success Alert Banner when Add All clicked */}
        <AnimatePresence>
          {addedAllSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-emerald-500 text-white rounded-2xl shadow-md flex items-center justify-between text-xs sm:text-sm font-bold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>All {items.length} saved items added to your cart! 🛒</span>
              </div>
              <Link
                href="/cart"
                className="bg-white text-[#0c831f] px-3 py-1 rounded-xl text-xs font-black shadow-xs hover:bg-emerald-50 transition"
              >
                Go to Cart →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {items.length > 0 ? (
          <div>
            {/* Action Bar */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs p-3.5 sm:p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>Saved Fresh Produce</span>
                  <span className="text-xs bg-emerald-100 text-[#0c831f] px-2.5 py-0.5 rounded-full font-extrabold">
                    {items.length} Items
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Estimated Total:{" "}
                  <span className="font-extrabold text-gray-900">
                    ₹{totalEstimated}
                  </span>{" "}
                  • Ready for 10-15 min express dispatch
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="flex-1 sm:flex-none bg-[#0c831f] hover:bg-[#096718] active:scale-95 text-white px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>Add All to Cart</span>
                </button>

                {showClearConfirm ? (
                  <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                    <button
                      type="button"
                      onClick={handleClearWishlist}
                      className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1 text-gray-600 hover:text-gray-900 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition border border-gray-100 cursor-pointer"
                    title="Clear Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
              {items.map((item) => (
                <Groceryitemcard key={item._id} item={item as any} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="my-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Heart size={36} className="fill-red-100 text-red-500 animate-pulse" />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]">
                  🌱
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1.5">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed max-w-xs mx-auto">
                Save your daily farm-fresh vegetables and seasonal fruits to re-order in 1-tap!
              </p>
              <Link
                href="/shop"
                className="bg-[#0c831f] hover:bg-[#096718] active:scale-95 text-white px-7 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition inline-flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Explore Fresh Mandi Harvest</span>
              </Link>
            </div>
          </div>
        )}

        {/* Recommended Produce Section */}
        {recommendedItems.length > 0 && (
          <div className="mt-10 sm:mt-14 border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <h3 className="text-base sm:text-xl font-black text-gray-900">
                    Trending Bhopal Farm Produce
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Harvested fresh today from local Mandis
                </p>
              </div>

              <Link
                href="/shop"
                className="text-xs font-black text-[#0c831f] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
              {recommendedItems.map((item) => (
                <Groceryitemcard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Sticky Cart Bar on Mobile */}
      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-3 left-3 right-3 md:hidden z-40"
          >
            <Link
              href="/cart"
              className="bg-[#0c831f] text-white rounded-2xl p-3 shadow-[0_8px_25px_rgba(12,131,31,0.35)] flex items-center justify-between font-sans border border-emerald-400/30"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                  {totalCartItems}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
                    {totalCartItems} Item{totalCartItems > 1 ? "s" : ""} in Cart
                  </p>
                  <p className="text-sm font-black">₹{totalCartAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white text-[#0c831f] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xs">
                <span>View Cart</span>
                <ChevronRight size={14} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
