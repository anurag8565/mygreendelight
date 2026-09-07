"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import type { RootState } from "@/redux/store";
import { addToCart } from "@/redux/CartSlice";
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
  Gift,
  ArrowLeft,
  Truck,
  ShoppingBag,
  Tag,
  Wallet,
  MapPin,
  Leaf,
  Clock,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  Star,
  Plus,
  Check,
  Bell,
  RefreshCw,
  Award,
  Crown,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_STAPLES = [
  {
    _id: "staple_1",
    name: "Fresh Desi Tamatar (टमाटर)",
    price: 35,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    category: "Vegetables",
    stock: 50,
  },
  {
    _id: "staple_2",
    name: "Farm Fresh Palak (पालक)",
    price: 25,
    unit: "250 g",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80",
    category: "Vegetables",
    stock: 40,
  },
  {
    _id: "staple_3",
    name: "Fresh Green Chilli (हरी मिर्च)",
    price: 15,
    unit: "100 g",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80",
    category: "Vegetables",
    stock: 50,
  },
  {
    _id: "staple_4",
    name: "Fresh Red Onion (प्याज)",
    price: 30,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80",
    category: "Vegetables",
    stock: 60,
  },
  {
    _id: "staple_5",
    name: "Fresh Ratnagiri Alphonso",
    price: 499,
    unit: "1 Dozen (12 pcs)",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80",
    category: "Fruits",
    stock: 25,
  },
];

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
  const [walletBalance, setWalletBalance] = useState<number>(50);
  const [loading, setLoading] = useState(true);

  // Preference Toggles
  const [silentDelivery, setSilentDelivery] = useState(false);
  const [returnBagCashback, setReturnBagCashback] = useState(true);
  const [addedStapleId, setAddedStapleId] = useState<string | null>(null);

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

      // 2. Fetch Wallet Balance
      const walletPromise = axios
        .get(`/api/user/wallet?_t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        })
        .then((res) => {
          if (res.data?.success) {
            setWalletBalance(res.data.balance || 50);
          }
        })
        .catch(() => {});

      await Promise.allSettled([ordersPromise, walletPromise]);
    } catch (e) {
      // Guest or error
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaple = (item: any) => {
    dispatch(
      addToCart({
        _id: item._id as any,
        cartItemId: `${item._id}_default`,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        quantity: 1,
        stock: item.stock || 50,
        category: item.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
    setAddedStapleId(item._id);
    setTimeout(() => setAddedStapleId(null), 1800);
  };

  // Find most recent active order if any (pending or out of delivery)
  const activeOrder = orders.find(
    (o) => o.status === "pending" || o.status === "out of delivery"
  );

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalamount || 0), 0);
  const totalSavings = Math.round(totalSpent * 0.15) + 120; // Estimated 15% mandi wholesale savings + welcome bonus

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
            Sign in to track live orders, access your farm wallet, unlock scratch rewards & save favorites.
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
          {/* Subtle Ambient Emerald Glow in Background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              
              {/* Avatar Box with Golden / Emerald Ring */}
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
                      <Crown size={11} className="text-amber-500 fill-amber-400" /> Green VIP Member
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
                  <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                    <Leaf size={12} className="text-[#0f8646]" /> Same-Day Harvest
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

        {/* 2. VIP Gold & Emerald Membership Card */}
        <div className="bg-gradient-to-br from-[#042413] via-[#094121] to-[#0f8646] text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-400 text-gray-950 font-black text-[9.5px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Star size={11} className="fill-gray-950" /> VIP Farm Pass
                </span>
                <span className="text-xs text-emerald-200 font-bold">
                  Bhopal Exclusive Member
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                You have saved approx ₹{totalSavings} with Farm-Direct Pricing!
              </h3>
              <p className="text-xs text-emerald-100/80 max-w-md">
                Enjoy 15-45 mins express morning delivery, zero platform markups & extra 5% society group perks.
              </p>
            </div>

            <Link
              href="/offers"
              className="bg-white hover:bg-amber-50 text-gray-950 font-black text-xs px-4 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>View VIP Perks</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3. Three Metric Quick-Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Tile 1: Wallet Balance */}
          <Link
            href="/user/cart"
            className="bg-white rounded-2xl p-4 sm:p-4.5 border border-gray-200/80 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Wallet size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Farm Cash & Wallet
                </span>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  ₹{walletBalance}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646] transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Tile 2: My Orders */}
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
                  Orders & Tracking
                </span>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Tile 3: Wishlist */}
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
                  Saved Produce
                </span>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 4. Live Active Order Snip Banner (If user has pending/out of delivery order) */}
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

        {/* 5. Quick 1-Tap Re-Order Essentials Carousel */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500 fill-amber-400" />
                <span>1-Tap Daily Farm Reorder</span>
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Frequently needed staples direct from morning harvest
              </p>
            </div>

            <Link
              href="/shop"
              className="text-[11px] font-black text-[#0f8646] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {QUICK_STAPLES.map((staple) => (
              <div
                key={staple._id}
                className="bg-gray-50/70 border border-gray-100 rounded-2xl p-2.5 flex flex-col justify-between hover:border-emerald-300 transition group"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-2 p-1.5 flex items-center justify-center border border-gray-100">
                  <img
                    src={staple.image}
                    alt={staple.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="min-w-0 mb-2">
                  <h4 className="font-extrabold text-[11px] text-gray-900 truncate" title={staple.name}>
                    {staple.name}
                  </h4>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xs font-black text-[#0f8646]">₹{staple.price}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{staple.unit}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddStaple(staple)}
                  className={`w-full py-1.5 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                    addedStapleId === staple._id
                      ? "bg-emerald-600 text-white"
                      : "bg-white hover:bg-emerald-50 text-[#0f8646] border border-emerald-300 shadow-2xs"
                  }`}
                >
                  {addedStapleId === staple._id ? (
                    <>
                      <Check size={12} />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={12} />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Smart Delivery & Doorstep Preferences */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3.5 px-1 flex items-center gap-1.5">
            <Bell size={14} className="text-[#0f8646]" /> Doorstep & Delivery Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Preference 1: Silent Delivery */}
            <div
              onClick={() => setSilentDelivery(!silentDelivery)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                silentDelivery
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                  : "bg-gray-50/70 border-gray-100 text-gray-900 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${silentDelivery ? "bg-emerald-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                  <Bell size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black">Silent Doorstep Drop</h4>
                  <p className="text-[10.5px] text-gray-500">Do not ring bell (leave at door)</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${silentDelivery ? "bg-[#0f8646] border-[#0f8646] text-white" : "border-gray-300 bg-white text-transparent"}`}>
                ✓
              </div>
            </div>

            {/* Preference 2: Return Cloth Bag */}
            <div
              onClick={() => setReturnBagCashback(!returnBagCashback)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                returnBagCashback
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                  : "bg-gray-50/70 border-gray-100 text-gray-900 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${returnBagCashback ? "bg-emerald-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                  <Leaf size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black">Cloth Bag Return Bonus</h4>
                  <p className="text-[10.5px] text-gray-500">Return clean bag for +₹10 wallet cash</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${returnBagCashback ? "bg-[#0f8646] border-[#0f8646] text-white" : "border-gray-300 bg-white text-transparent"}`}>
                ✓
              </div>
            </div>

          </div>
        </div>

        {/* 7. Organized Minimal Navigation Grid */}
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
                      My Orders & Invoice
                    </h3>
                    <p className="text-[10.5px] text-gray-500 truncate">
                      Track delivery, reorder basket & download receipt
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
                      {cartdata?.length || 0} produce items in cart
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646] shrink-0" />
              </Link>
            </div>
          </div>

          {/* Section: Rewards & Savings */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 px-1 flex items-center gap-1.5">
              <Gift size={14} className="text-amber-600" /> Exclusive Savings & Community
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href="/offers"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/40 hover:bg-amber-50 border border-amber-200/80 hover:border-amber-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-amber-800 transition truncate">
                      Daily Scratch Rewards & Coupons
                    </h3>
                    <p className="text-[10.5px] text-amber-900/80 truncate">
                      Unlock scratch card cashbacks & discount codes
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-700 shrink-0" />
              </Link>

              <Link
                href="/shop"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-200/80 hover:border-emerald-300 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#0f8646] flex items-center justify-center border border-emerald-200 shadow-2xs shrink-0">
                    <Users size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition truncate">
                      Bhopal Society Order Pools
                    </h3>
                    <p className="text-[10.5px] text-emerald-800 truncate">
                      Order together with colony neighbors & save extra 5%
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646] shrink-0" />
              </Link>
            </div>
          </div>

          {/* Section: Shop Fresh Produce Categories */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 px-1 flex items-center gap-1.5">
              <Compass size={14} className="text-purple-600" /> Explore 3 Fresh Categories
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

        {/* 8. Minimal 24/7 Bhopal Concierge Support Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black shadow-2xs shrink-0 border border-emerald-100">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">
                SubziQuick Bhopal Support Desk
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
