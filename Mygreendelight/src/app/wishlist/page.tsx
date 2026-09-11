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
  Trash2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import useGetMe from "@/hooks/useGetMe";
import { clearWishlist, hydrateWishlist, setWishlist } from "@/redux/WishlistSlice";
import { addMultipleToCart } from "@/redux/CartSlice";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function WishlistPage() {
  useGetMe();
  const dispatch = useDispatch<AppDispatch>();

  const { userdata } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.wishlist);
  const { cartdata } = useSelector((state: RootState) => state.cart);

  const [mounted, setMounted] = useState(false);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const currentUserId = userdata?._id
    ? String(userdata._id)
    : (userdata as any)?.id
    ? String((userdata as any).id)
    : null;

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateWishlist({ userId: currentUserId }));
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    axios
      .get("/api/wishlist")
      .then((res) => {
        if (
          res.data?.success &&
          Array.isArray(res.data?.wishlist) &&
          res.data.wishlist.length > 0
        ) {
          dispatch(
            setWishlist({ items: res.data.wishlist, userId: currentUserId })
          );
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

  // Active cart summary for mobile pill
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
    }, 3000);
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
    <div className="bg-[#f8faf8] min-h-screen flex flex-col justify-between font-sans text-gray-900 pb-20 md:pb-0 selection:bg-green-100 selection:text-green-900">
      <Nav user={userdata} />

      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 w-full flex-1 space-y-4 sm:space-y-5">
        {/* Minimalist Top Breadcrumb & Actions Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Link href="/" className="hover:text-gray-700 transition">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#0f8646] font-bold">Wishlist ({items.length})</span>
          </div>

          <Link
            href="/shop"
            className="text-xs font-semibold text-[#0f8646] hover:underline flex items-center gap-1"
          >
            <span>Explore Store</span>
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Success Alert Banner when Add All clicked */}
        <AnimatePresence>
          {addedAllSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 bg-[#0f8646] text-white rounded-xl shadow-xs flex items-center justify-between text-xs sm:text-sm font-semibold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>All {items.length} saved items added to your basket!</span>
              </div>
              <Link
                href="/user/cart"
                className="bg-white text-[#0f8646] px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-50 transition"
              >
                Go to Cart →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {items.length > 0 ? (
          <div className="space-y-4">
            {/* Sleek Action Strip */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>Saved Items</span>
                  <span className="text-xs font-semibold bg-emerald-50 text-[#0f8646] px-2 py-0.5 rounded-full border border-emerald-200/60">
                    {items.length}
                  </span>
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Est. Total: <strong className="text-gray-900 font-bold">₹{totalEstimated}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="flex-1 sm:flex-none bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>Add All to Cart</span>
                </button>

                {showClearConfirm ? (
                  <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-200">
                    <button
                      type="button"
                      onClick={handleClearWishlist}
                      className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1 text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-gray-200 cursor-pointer"
                    title="Clear Wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {items.map((item) => (
                <Groceryitemcard key={item._id} item={item as any} />
              ))}
            </div>
          </div>
        ) : (
          /* Sleek Minimalist Empty State */
          <div className="py-12 sm:py-16 text-center">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center max-w-sm mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="w-14 h-14 bg-rose-50 border border-rose-100/80 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Heart size={26} className="fill-rose-100 text-rose-500" />
              </div>

              <h2 className="text-base font-extrabold text-gray-900 mb-1">
                Your Wishlist is Empty
              </h2>

              <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-xs mx-auto">
                Save your daily vegetables and fruits here to easily reorder them anytime.
              </p>

              <Link
                href="/shop"
                className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Produce</span>
                <ArrowRight size={13} />
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
              className="bg-[#0f8646] text-white rounded-2xl p-3 shadow-lg flex items-center justify-between font-sans border border-emerald-400/30"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                  {totalCartItems}
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-emerald-100">
                    {totalCartItems} {totalCartItems > 1 ? "Items" : "Item"} in Basket
                  </p>
                  <p className="text-xs font-extrabold">₹{totalCartAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white text-[#0f8646] px-3 py-1 rounded-xl font-bold text-xs shadow-2xs">
                <span>View Cart</span>
                <ChevronRight size={13} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
