"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import type { RootState } from "@/redux/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import axios from "axios";
import {
  User as UserIcon,
  Package,
  Heart,
  ShoppingCart,
  Phone,
  MessageCircle,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Truck,
  ShoppingBag,
  Wallet,
  MapPin,
  Leaf,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfileHub() {
  const router = useRouter();
  const dispatch = useDispatch();
  useGetMe();
  const { data: session, status } = useSession();
  const { userdata } = useSelector((state: RootState) => state.user);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { cartdata } = useSelector((state: RootState) => state.cart);

  const activeUser: any = userdata || session?.user;
  const isLoggedIn = !!activeUser?.email;

  const [orders, setOrders] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAccountData();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [isLoggedIn, status]);

  const fetchAccountData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const ordersPromise = axios
        .get(`/api/user/myorder?_t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        })
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : res.data?.orders || [];
          setOrders(list);
        })
        .catch(() => {});

      // 2. Fetch Real Wallet Balance
      const walletPromise = axios
        .get(`/api/user/wallet?_t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        })
        .then((res) => {
          if (res.data?.success && typeof res.data.balance === "number") {
            setWalletBalance(res.data.balance);
          } else if (typeof activeUser?.walletBalance === "number") {
            setWalletBalance(activeUser.walletBalance);
          } else {
            setWalletBalance(0);
          }
        })
        .catch(() => {
          setWalletBalance(typeof activeUser?.walletBalance === "number" ? activeUser.walletBalance : 0);
        });

      await Promise.allSettled([ordersPromise, walletPromise]);
    } catch (e) {
      // Guest or network error
    } finally {
      setLoading(false);
    }
  };

  // Find most recent active order if any (pending or out of delivery)
  const activeOrder = orders.find(
    (o) => o.status === "pending" || o.status === "out of delivery"
  );

  const totalCartCount = (cartdata || []).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);

  if (status === "unauthenticated" && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f7faf8] flex flex-col font-sans text-gray-900">
        <Nav />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100/80 text-[#0f8646] flex items-center justify-center mb-5 shadow-xs border border-emerald-200">
            <UserIcon size={38} className="stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            Welcome to SubziQuick
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
            Sign in to track live orders, view past deliveries, manage cart and favorite fresh harvest.
          </p>
          <Link
            href="/login"
            className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <UserIcon size={18} />
            <span>Login or Create Account</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-gray-900">
      <Nav user={activeUser} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-10 pb-28 sm:pb-20 space-y-6">
        
        {/* Top Minimal Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-700 hover:text-[#0f8646] transition bg-white px-3.5 py-2 rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Store</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAccountData}
              disabled={loading}
              className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/90 px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              title="Refresh Account Data"
            >
              <RefreshCw size={12} className={loading ? "animate-spin text-[#0f8646]" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <span className="text-[11px] font-black text-[#0f8646] uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 flex items-center gap-1.5">
              <Sparkles size={13} /> Account Hub
            </span>
          </div>
        </div>

        {/* 1. Ultra-Luxury Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden"
        >
          {/* Subtle Ambient Emerald Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              
              {/* Avatar Box */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0f8646] to-emerald-400 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0 overflow-hidden border-2 border-white ring-2 ring-emerald-500/20">
                {activeUser?.image ? (
                  <img
                    src={activeUser.image}
                    alt={activeUser.name || "User"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : activeUser?.name ? (
                  activeUser.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon size={32} />
                )}
              </div>

              {/* User Bio */}
              <div className="min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {activeUser?.name || "SubziQuick Customer"}
                  </h1>

                  {activeUser?.role === "admin" ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <ShieldCheck size={11} className="text-amber-700" /> Admin
                    </span>
                  ) : activeUser?.role === "deliveryboy" ? (
                    <span className="bg-blue-100 text-blue-900 border border-blue-300 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <Truck size={11} className="text-blue-700" /> Rider
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-[#0f8646] border border-emerald-200 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <Sparkles size={11} /> Verified Customer
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 font-medium truncate">
                  {activeUser?.email || activeUser?.mobile || "Farm-Fresh Grocery Member"}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-2.5 text-[11px] text-gray-600 font-semibold flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80">
                    <MapPin size={12} className="text-[#0f8646]" /> Bhopal, Madhya Pradesh
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50/70 px-2.5 py-0.5 rounded-lg border border-emerald-200/60 font-black">
                    <Wallet size={12} className="text-[#0f8646]" /> Wallet: ₹{walletBalance}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-gray-100/80 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-700 font-black text-xs px-4 py-2.5 rounded-xl border border-gray-200/90 transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
              title="Sign Out"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* 2. Three 100% Real Metric Quick-Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Tile 1: My Orders */}
          <Link
            href="/user/myorder"
            className="bg-white rounded-2xl p-4 sm:p-4.5 border border-gray-200/80 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                <Package size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Orders Placed
                </span>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Tile 2: Wishlist */}
          <Link
            href="/wishlist"
            className="bg-white rounded-2xl p-4 sm:p-4.5 border border-gray-200/80 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shrink-0 border border-rose-100 group-hover:scale-105 transition-transform">
                <Heart size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Saved Favorites
                </span>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Tile 3: Active Cart Basket */}
          <Link
            href="/user/cart"
            className="bg-white rounded-2xl p-4 sm:p-4.5 border border-gray-200/80 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <ShoppingCart size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Cart Items
                </span>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  {totalCartCount} {totalCartCount === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 3. Live Active Order Banner (Only if order is pending or out for delivery) */}
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-600 via-[#0f8646] to-emerald-700 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
                <Truck size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                  <span className="bg-amber-400 text-gray-950 text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full">
                    {activeOrder.status === "out of delivery" ? "🛵 Out For Delivery" : "🌱 Packing Harvest"}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-100">
                    #SZQ-{activeOrder._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-medium">
                  {activeOrder.items?.length || 1} Items • ₹{activeOrder.totalamount} • Express 15-45 Mins
                </p>
              </div>
            </div>

            <Link
              href={`/track/${activeOrder._id}`}
              className="bg-white hover:bg-emerald-50 text-[#0f8646] px-4 py-2.5 rounded-xl font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0"
            >
              <span>Track Live Delivery</span>
              <ChevronRight size={14} />
            </Link>
          </motion.div>
        )}

        {/* 4. Organized Minimal Navigation Grid */}
        <div className="space-y-4">
          
          {/* Section: Orders & Cart */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 px-1 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-[#0f8646]" /> Orders & Shopping
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href="/user/myorder"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#0f8646] flex items-center justify-center border border-gray-200 shadow-2xs shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition truncate">
                      My Orders & Invoices
                    </h3>
                    <p className="text-[10.5px] text-gray-500 truncate">
                      Track delivery, reorder basket & download receipts
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646] shrink-0" />
              </Link>

              <Link
                href="/user/cart"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center border border-gray-200 shadow-2xs shrink-0">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition truncate">
                      Active Basket
                    </h3>
                    <p className="text-[10.5px] text-gray-500 truncate">
                      {totalCartCount} fresh produce items in cart
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646] shrink-0" />
              </Link>
            </div>
          </div>

          {/* Section: Offers & Discounts */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 px-1 flex items-center gap-1.5">
              <Tag size={14} className="text-amber-600" /> Coupons & Deals
            </h2>

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/offers"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/40 hover:bg-amber-50 border border-amber-200/80 hover:border-amber-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs shrink-0">
                    <Tag size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-amber-800 transition truncate">
                      Available Coupons & Seasonal Offers
                    </h3>
                    <p className="text-[10.5px] text-amber-900/80 truncate">
                      View active promo codes for Bhopal delivery
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-700 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Section: Shop Fresh Produce Categories */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 px-1 flex items-center gap-1.5">
              <Leaf size={14} className="text-[#0f8646]" /> Shop Fresh Produce Categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Vegetables */}
              <Link
                href="/shop?category=Vegetables"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-100 shrink-0 border border-emerald-200 p-0.5">
                    <img
                      src="/categories/vegetables_4k.jpg"
                      alt="Vegetables"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80";
                      }}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition truncate">
                      Fresh Vegetables
                    </h3>
                    <p className="text-[10px] text-gray-400 truncate">Farm harvested daily</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-400 group-hover:text-[#0f8646] shrink-0" />
              </Link>

              {/* Fruits */}
              <Link
                href="/shop?category=Fruits"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-amber-50/50 border border-gray-100 hover:border-amber-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 shrink-0 border border-amber-200 p-0.5">
                    <img
                      src="/categories/fruits_4k.jpg"
                      alt="Fruits"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=120&q=80";
                      }}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-amber-800 transition truncate">
                      Seasonal Fruits
                    </h3>
                    <p className="text-[10px] text-gray-400 truncate">Sweet & juicy picks</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-400 group-hover:text-amber-700 shrink-0" />
              </Link>

              {/* Exotics */}
              <Link
                href="/shop?category=Exotics"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-purple-50/50 border border-gray-100 hover:border-purple-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-purple-100 shrink-0 border border-purple-200 p-0.5">
                    <img
                      src="/categories/exotics_4k.jpg"
                      alt="Exotics"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=120&q=80";
                      }}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-purple-800 transition truncate">
                      Hydroponics & Exotics
                    </h3>
                    <p className="text-[10px] text-gray-400 truncate">Gourmet & salad greens</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-400 group-hover:text-purple-700 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Section: Staff / Role Portals (Conditional) */}
          {(activeUser?.role === "admin" || activeUser?.role === "deliveryboy") && (
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 px-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-600" /> Operational Portals
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeUser?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-black text-purple-950 transition truncate">
                          Admin Control Center
                        </h3>
                        <p className="text-[10.5px] text-purple-700 truncate">
                          Manage orders, groceries, inventory & fleet
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-purple-400 group-hover:text-purple-700 shrink-0" />
                  </Link>
                )}

                {activeUser?.role === "deliveryboy" && (
                  <Link
                    href="/deliveryboy"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-300 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#0f8646] text-white flex items-center justify-center shadow-xs shrink-0">
                        <Truck size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-black text-emerald-950 transition truncate">
                          Rider Delivery Partner Hub
                        </h3>
                        <p className="text-[10.5px] text-[#0f8646] truncate">
                          View assigned trips & deliver with OTP
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#0f8646]" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. Minimal 24/7 Bhopal Support Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black shadow-2xs shrink-0 border border-emerald-100">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">
                SubziQuick Bhopal Helpdesk
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                Live Help & Dispatch Status: <strong className="text-gray-900">+91 9981418565</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="tel:9981418565"
              className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2.5 rounded-xl font-black text-xs transition text-center shadow-2xs cursor-pointer"
            >
              Call Support
            </a>
            <a
              href="https://wa.me/919981418565?text=Hello%20SubziQuick!%20I%20need%20help%20with%20my%20account%20or%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
