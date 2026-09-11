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
      const res = await axios.get(`/api/user/myorder?_t=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      const list = Array.isArray(res.data) ? res.data : res.data?.orders || [];
      setOrders(list);
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
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-gray-900">
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
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans text-gray-900">
      <Nav user={activeUser} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-9 pb-28 sm:pb-20 space-y-5">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#0c831f] transition bg-white px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Store</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAccountData}
              disabled={loading}
              className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/80 px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Refresh Data"
            >
              <RefreshCw size={12} className={loading ? "animate-spin text-[#0c831f]" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200/80 hover:border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 1. Sleek Modern Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-3xl border border-gray-200/70 p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden"
        >
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* Avatar Box */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#0c831f] via-emerald-600 to-green-500 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0 overflow-hidden ring-4 ring-emerald-50">
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
                  <UserIcon size={28} />
                )}
              </div>

              {/* User Bio */}
              <div className="min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
                    {activeUser?.name || "SubziQuick Member"}
                  </h1>

                  {activeUser?.role === "admin" ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <ShieldCheck size={11} /> Admin
                    </span>
                  ) : activeUser?.role === "deliveryboy" ? (
                    <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Truck size={11} /> Delivery Partner
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-[#0c831f] border border-emerald-200/90 font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles size={10} /> Verified Member
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 font-medium truncate">
                  {activeUser?.email || activeUser?.mobile || "Customer Account"}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-[11px] text-gray-500 font-medium">
                  <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    <MapPin size={11} className="text-[#0c831f]" /> Bhopal, MP
                  </span>
                  <span>•</span>
                  <span>10-15 Min Express Delivery</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Wallet & VIP Pass) */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <Link
                href="/user/wallet"
                className="flex items-center gap-1.5 bg-[#f8f9fa] hover:bg-emerald-50 text-gray-800 hover:text-[#0c831f] border border-gray-200/80 hover:border-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition shadow-2xs group"
              >
                <div className="w-2 h-2 rounded-full bg-[#0c831f]" />
                <span>Wallet</span>
                <ChevronRight size={13} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/user/vip-pass"
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-2 rounded-xl text-xs font-black transition shadow-xs group"
              >
                <Sparkles size={12} className="text-amber-200" />
                <span>VIP Pass</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 🚀 Delivery Partner Hub Strip (If Rider or Admin) */}
        {(activeUser?.role === "deliveryboy" || activeUser?.role === "admin") && (
          <Link
            href="/deliveryboy"
            className="bg-gradient-to-r from-emerald-600 to-[#0c831f] text-white rounded-2xl p-4 shadow-sm border border-emerald-500/30 flex items-center justify-between group hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  Rider Delivery Partner Hub
                </h3>
                <p className="text-[11px] text-emerald-100 font-medium">
                  Dispatch orders, map routes & OTP verification
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-white text-[#0c831f] flex items-center justify-center font-bold shrink-0 group-hover:translate-x-0.5 transition-transform shadow-xs">
              <ChevronRight size={16} />
            </div>
          </Link>
        )}

        {/* 2. Three Metric Quick-Action Tiles */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          
          {/* Orders */}
          <Link
            href="/user/myorder"
            className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/70 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between group text-center sm:text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black mx-auto sm:mx-0 border border-blue-100">
                <Package size={18} />
              </div>
              <ChevronRight size={14} className="hidden sm:block text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Orders
              </span>
              <span className="text-sm sm:text-lg font-black text-gray-900 mt-0.5 block">
                {orders.length}
              </span>
            </div>
          </Link>

          {/* Favorites / Wishlist */}
          <Link
            href="/wishlist"
            className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/70 shadow-2xs hover:border-rose-400 hover:shadow-xs transition-all flex flex-col justify-between group text-center sm:text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black mx-auto sm:mx-0 border border-rose-100">
                <Heart size={18} />
              </div>
              <ChevronRight size={14} className="hidden sm:block text-gray-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Favorites
              </span>
              <span className="text-sm sm:text-lg font-black text-gray-900 mt-0.5 block">
                {wishlistItems.length}
              </span>
            </div>
          </Link>

          {/* Cart */}
          <Link
            href="/user/cart"
            className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/70 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between group text-center sm:text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-[#0c831f] flex items-center justify-center font-black mx-auto sm:mx-0 border border-emerald-100">
                <ShoppingCart size={18} />
              </div>
              <ChevronRight size={14} className="hidden sm:block text-gray-300 group-hover:text-[#0c831f] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                In Cart
              </span>
              <span className="text-sm sm:text-lg font-black text-gray-900 mt-0.5 block">
                {totalCartCount}
              </span>
            </div>
          </Link>
        </div>

        {/* 3. Live Active Order Card (If Any) */}
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-[#0c831f] to-emerald-700 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Truck size={20} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="bg-amber-400 text-gray-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    {activeOrder.status === "out of delivery" ? "Out For Delivery" : "Packing Harvest"}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-100">
                    #SZQ-{activeOrder._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 mt-0.5">
                  {activeOrder.items?.length || 1} Items • ₹{activeOrder.totalamount}
                </p>
              </div>
            </div>

            <Link
              href={`/track/${activeOrder._id}`}
              className="bg-white hover:bg-emerald-50 text-[#0c831f] px-4 py-2 rounded-xl font-black text-xs shadow-2xs transition flex items-center justify-center gap-1 w-full sm:w-auto shrink-0"
            >
              <span>Track Delivery</span>
              <ChevronRight size={13} />
            </Link>
          </motion.div>
        )}

        {/* 4. Minimalist Action Menu */}
        <div className="bg-white rounded-3xl border border-gray-200/70 p-4 sm:p-5 shadow-2xs space-y-3">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 px-1">
            Account & Orders
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href="/user/myorder"
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white text-[#0c831f] flex items-center justify-center border border-gray-200/80 shadow-2xs shrink-0">
                  <Package size={17} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#0c831f] transition truncate">
                    My Orders & Invoices
                  </h3>
                  <p className="text-[10.5px] text-gray-500 truncate">
                    Order history, receipts & reorder
                  </p>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400 group-hover:text-[#0c831f] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>

            <Link
              href="/user/subscriptions"
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center border border-gray-200/80 shadow-2xs shrink-0">
                  <RefreshCw size={17} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#0c831f] transition truncate">
                    Daily Subscriptions
                  </h3>
                  <p className="text-[10.5px] text-gray-500 truncate">
                    Morning milk & fresh vegetable plans
                  </p>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400 group-hover:text-[#0c831f] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>

            <Link
              href="/offers"
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-amber-50/50 border border-gray-100 hover:border-amber-300 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white text-amber-600 flex items-center justify-center border border-gray-200/80 shadow-2xs shrink-0">
                  <Tag size={17} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-amber-800 transition truncate">
                    Coupons & Offers
                  </h3>
                  <p className="text-[10.5px] text-gray-500 truncate">
                    Exclusive discount vouchers
                  </p>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>

            <Link
              href="/user/wallet"
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white text-teal-600 flex items-center justify-center border border-gray-200/80 shadow-2xs shrink-0">
                  <Sparkles size={17} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#0c831f] transition truncate">
                    SubziQuick Wallet
                  </h3>
                  <p className="text-[10.5px] text-gray-500 truncate">
                    Cashback & 1-tap checkout balance
                  </p>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400 group-hover:text-[#0c831f] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          </div>
        </div>

        {/* 5. Direct Produce Category Shortcuts */}
        <div className="bg-white rounded-3xl border border-gray-200/70 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
              Shop Fresh Produce
            </h2>
            <Link href="/shop" className="text-xs font-bold text-[#0c831f] hover:underline">
              All Produce
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Link
              href="/shop?category=Vegetables"
              className="p-3 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 transition text-center flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-white border border-gray-100 shadow-2xs">
                <img
                  src="/categories/vegetables_4k.jpg?v=4"
                  alt="Vegetables"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-black text-gray-900 group-hover:text-[#0c831f] truncate w-full">
                Vegetables
              </span>
              <span className="text-[10px] text-gray-400 truncate w-full mt-0.5">Farm Fresh</span>
            </Link>

            <Link
              href="/shop?category=Fruits"
              className="p-3 rounded-2xl bg-gray-50/70 hover:bg-amber-50/50 border border-gray-100 hover:border-amber-300 transition text-center flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-white border border-gray-100 shadow-2xs">
                <img
                  src="/categories/fruits_4k.jpg?v=4"
                  alt="Fruits"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-black text-gray-900 group-hover:text-amber-800 truncate w-full">
                Fruits
              </span>
              <span className="text-[10px] text-gray-400 truncate w-full mt-0.5">Naturally Sweet</span>
            </Link>

            <Link
              href="/shop?category=Exotics"
              className="p-3 rounded-2xl bg-gray-50/70 hover:bg-purple-50/50 border border-gray-100 hover:border-purple-300 transition text-center flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-white border border-gray-100 shadow-2xs">
                <img
                  src="/categories/exotics_4k.jpg?v=4"
                  alt="Exotics"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-black text-gray-900 group-hover:text-purple-800 truncate w-full">
                Exotics
              </span>
              <span className="text-[10px] text-gray-400 truncate w-full mt-0.5">Hydroponics</span>
            </Link>
          </div>
        </div>

        {/* 6. Staff Portals (If Admin) */}
        {activeUser?.role === "admin" && (
          <div className="bg-white rounded-3xl border border-gray-200/70 p-4 sm:p-5 shadow-2xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 px-1 mb-2.5">
              Management
            </h2>
            <Link
              href="/admin"
              className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/40 hover:bg-purple-50 border border-purple-200/80 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-purple-950">
                    Admin Control Center
                  </h3>
                  <p className="text-[10.5px] text-purple-700">
                    Manage orders, inventory, pricing & fleet
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-purple-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}

        {/* 7. Minimal 24/7 Bhopal Support Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/70 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0c831f] flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
              <Phone size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-gray-900">
                SubziQuick Bhopal Support
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">
                Live help & dispatch queries: <strong>+91 9981418565</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:9981418565"
              className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/90 px-3.5 py-2 rounded-xl font-bold text-xs transition text-center shadow-2xs"
            >
              Call Support
            </a>
            <a
              href="https://wa.me/919981418565?text=Hello%20SubziQuick!%20I%20need%20help%20with%20my%20account%20or%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition text-center flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
