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
import { clearWishlist, hydrateWishlist, setWishlist } from "@/redux/WishlistSlice";
import { addMultipleToCart } from "@/redux/CartSlice";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function WishlistPage() {
  useGetMe();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { userdata } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.wishlist);
  const { cartdata } = useSelector((state: RootState) => state.cart);

  const [mounted, setMounted] = useState(false);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const currentUserId = userdata?._id ? String(userdata._id) : ((userdata as any)?.id ? String((userdata as any).id) : null);

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateWishlist({ userId: currentUserId }));
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    axios
      .get("/api/wishlist")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.wishlist) && res.data.wishlist.length > 0) {
          dispatch(setWishlist({ items: res.data.wishlist, userId: currentUserId }));
        }
      })
      .catch((err) => {
        console.error("Failed to load wishlist", err);
      });
  }, [currentUserId, dispatch]);

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
      cartItemId: `${item._id}_default`,
      name: item.name,
      price: Number(item.price) || 0,
      unit: item.unit || "1 unit",
      image: item.image,
      quantity: 1,
      stock: item.stock ?? 50,
      category: item.category || "Vegetables",
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
  const handleClearWishlist = async () => {
    dispatch(clearWishlist({ userId: currentUserId }));
    setShowClearConfirm(false);
    if (currentUserId) {
      try {
        await axios.delete("/api/wishlist");
      } catch (e) {
        console.error("Failed to clear wishlist on server", e);
      }
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col justify-between font-sans text-gray-900 pb-20 md:pb-0">
      <Nav user={userdata} />

      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Go Back"
              className="p-1.5 -ml-1 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>My Saved Favorites</span>
                <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-black">
                  {items.length}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="text-xs font-black text-[#0f8646] hover:underline flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80"
            >
              <span>Explore Shop</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 w-full flex-1 space-y-6">
        
        {/* Quick Trust / Info Ribbon */}
        <div className="grid grid-cols-3 gap-2 bg-white border border-gray-200/80 rounded-2xl p-3 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700">
            <Zap size={14} className="text-amber-500 fill-amber-400 shrink-0" />
            <span className="truncate">15-45 Min Express</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700 border-x border-gray-100 px-1">
            <Leaf size={14} className="text-[#0f8646] shrink-0" />
            <span className="truncate">Same-Day Harvest</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700">
            <RotateCcw size={14} className="text-blue-600 shrink-0" />
            <span className="truncate">100% Replacement</span>
          </div>
        </div>

        {/* Success Alert Banner when Add All clicked */}
        <AnimatePresence>
          {addedAllSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 bg-[#0f8646] text-white rounded-2xl shadow-md flex items-center justify-between text-xs sm:text-sm font-bold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>All {items.length} saved produce items added to your basket!</span>
              </div>
              <Link
                href="/user/cart"
                className="bg-white text-[#0f8646] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs hover:bg-emerald-50 transition"
              >
                Go to Cart →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {items.length > 0 ? (
          <div className="space-y-5">
            
            {/* Action Bar Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                    Saved Fresh Produce
                  </h2>
                  <span className="text-xs bg-emerald-50 text-[#0f8646] border border-emerald-200 px-2.5 py-0.5 rounded-full font-black">
                    {items.length} Items
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Estimated Total: <strong className="text-gray-900 font-black">₹{totalEstimated}</strong> • Direct wholesale rates from Bhopal farms
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="flex-1 sm:flex-none bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>Add All to Cart</span>
                </button>

                {showClearConfirm ? (
                  <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-2xl border border-red-200">
                    <button
                      type="button"
                      onClick={handleClearWishlist}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition cursor-pointer"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition border border-gray-200 cursor-pointer shadow-2xs"
                    title="Clear Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Items Grid - Real user items only */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {items.map((item) => (
                <Groceryitemcard key={item._id} item={item as any} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="my-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-14 text-center max-w-md mx-auto shadow-2xs">
              <div className="w-20 h-20 bg-rose-50 border border-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 relative shadow-2xs">
                <Heart size={36} className="fill-rose-100 text-rose-500 animate-pulse" />
                <span className="absolute -bottom-1 -right-1 bg-[#0f8646] text-white p-1 rounded-full text-[10px] flex items-center justify-center">
                  <Leaf size={11} />
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
                Your Wishlist is Empty
              </h2>
              
              <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed max-w-xs mx-auto font-medium">
                Tap the heart icon on any vegetable or fruit to save your favorites for 1-tap reordering!
              </p>
              
              <Link
                href="/shop"
                className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Explore Fresh Farm Harvest</span>
              </Link>
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
              href="/user/cart"
              className="bg-[#0f8646] text-white rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(15,134,70,0.35)] flex items-center justify-between font-sans border border-emerald-400/30"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                  {totalCartItems}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
                    {totalCartItems} Item{totalCartItems > 1 ? "s" : ""} in Basket
                  </p>
                  <p className="text-sm font-black">₹{totalCartAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white text-[#0f8646] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xs">
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
