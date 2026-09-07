"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import type { RootState } from "@/redux/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import axios from "axios";
import {
  User as UserIcon,
  Package,
  Wallet,
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
  ShoppingBag,
  Tag,
  Store,
} from "lucide-react";

export default function UserProfileHub() {
  const router = useRouter();
  useGetMe();
  const { data: session, status } = useSession();
  const { userdata } = useSelector((state: RootState) => state.user);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const activeUser: any = userdata || session?.user;
  const isLoggedIn = !!(activeUser?.email);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAccountData();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [isLoggedIn, status]);

  const fetchAccountData = async () => {
    try {
      // 1. Fetch Wallet
      try {
        const walletRes = await axios.get("/api/user/wallet");
        if (walletRes.data?.success) {
          setWalletBalance(walletRes.data.balance || 0);
        }
      } catch (_) {}

      // 2. Fetch Orders count
      try {
        const ordersRes = await axios.get("/api/user/myorder");
        const list = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : ordersRes.data?.orders || [];
        setActiveOrdersCount(list.length);
      } catch (_) {}
    } catch (e) {
      // Guest or error
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated" && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Nav />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100/70 text-[#0f8646] flex items-center justify-center mb-5 shadow-xs">
            <UserIcon size={36} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Sign In to Your Account
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Log in to view your orders, live tracking, wallet cashback & saved wishlist.
          </p>
          <Link
            href="/login"
            className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-900/15 transition flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Nav user={activeUser} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-[#0f8646] transition bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <span className="text-xs font-black text-[#0f8646] uppercase tracking-wider bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
            <Sparkles size={12} /> Account Dashboard
          </span>
        </div>

        {/* User Identity Banner */}
        <div className="bg-gradient-to-r from-[#032412] via-[#073b1d] to-[#0f8646] text-white rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden mb-5">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 border-white/40 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner shrink-0 overflow-hidden">
                {activeUser?.image ? (
                  <img
                    src={activeUser.image}
                    alt={activeUser.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : activeUser?.name ? (
                  activeUser.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon size={32} />
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {activeUser?.name || "SubziQuick Customer"}
                  </h1>
                  {activeUser?.role === "admin" ? (
                    <span className="bg-amber-400 text-gray-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck size={11} /> Admin
                    </span>
                  ) : (
                    <span className="bg-emerald-900/70 text-emerald-200 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={10} className="text-emerald-300" /> Verified Member
                    </span>
                  )}
                </div>
                <p className="text-xs text-green-100/90 font-medium">
                  {activeUser?.email || activeUser?.mobile || "SubziQuick Farm Fresh Deliveries"}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-[11px] text-green-200">
                  <span>📍 Bhopal Central Hub</span>
                  <span>•</span>
                  <span>🌿 Same-Day Harvest</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-white/15 hover:bg-white/25 text-white font-black text-xs px-4 py-2 rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 3 Core Quick Tiles: Orders, Wallet, Wishlist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Tile 1: My Orders */}
          <Link
            href="/user/myorder"
            className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Package size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  My Orders & Tracking
                </span>
                <span className="text-lg font-black text-gray-900">
                  {activeOrdersCount} Placed
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[#0f8646]" />
          </Link>

          {/* Tile 2: Farm Wallet */}
          <Link
            href="/user/wallet"
            className="bg-white rounded-2xl p-4 border border-blue-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                <Wallet size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Farm Wallet & Cashback
                </span>
                <span className="text-lg font-black text-gray-900">
                  ₹{walletBalance.toFixed(2)}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600" />
          </Link>

          {/* Tile 3: Saved Wishlist */}
          <Link
            href="/wishlist"
            className="bg-white rounded-2xl p-4 border border-rose-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shrink-0 border border-rose-100 group-hover:scale-105 transition-transform">
                <Heart size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Saved Produce Wishlist
                </span>
                <span className="text-lg font-black text-gray-900">
                  {wishlistItems.length} Saved
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-rose-600" />
          </Link>
        </div>

        {/* Quick Links Menu Grid */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs mb-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
            Quick Actions & Produce Categories
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            <Link
              href="/user/myorder"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-green-50/60 hover:border-[#0f8646] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#0f8646] flex items-center justify-center shadow-xs border border-gray-100">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition">
                    My Orders & Tracking
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {activeOrdersCount} past orders
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646]" />
            </Link>

            <Link
              href="/user/cart"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-green-50/60 hover:border-[#0f8646] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs border border-gray-100">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition">
                    Active Shopping Cart
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Proceed to checkout
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646]" />
            </Link>

            <Link
              href="/offers"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 hover:border-amber-400 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-xs border border-amber-200">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-amber-800 transition">
                    Offers & Scratch Cards
                  </h4>
                  <span className="text-[11px] text-amber-900/80 font-bold">
                    Win flat discounts daily
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-700" />
            </Link>

            <Link
              href="/shop?category=Vegetables"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-emerald-50/60 hover:border-[#0f8646] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs border border-gray-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=80&q=80"
                    alt="Vegetables"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition">
                    Daily Fresh Vegetables
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    ताज़ी सब्जियां
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646]" />
            </Link>

            <Link
              href="/shop?category=Fruits"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-amber-50/60 hover:border-amber-400 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-xs border border-gray-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=80&q=80"
                    alt="Fruits"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-amber-800 transition">
                    Seasonal Fresh Fruits
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    ताज़े फल
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-700" />
            </Link>

            <Link
              href="/shop?category=Exotics"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-purple-50/60 hover:border-purple-400 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-xs border border-gray-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=80&q=80"
                    alt="Exotics"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-purple-800 transition">
                    Hydroponics & Exotics
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    विदेशी व सलाद
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-purple-700" />
            </Link>

            {activeUser?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 hover:border-purple-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-purple-700 flex items-center justify-center shadow-xs border border-purple-200">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-purple-900 transition">
                      Admin Control Center
                    </h4>
                    <span className="text-[11px] text-purple-700 font-medium">
                      Manage orders & products
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-purple-400 group-hover:text-purple-700" />
              </Link>
            )}

          </div>
        </div>

        {/* 24/7 Helpline & Support Banner */}
        <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#0f8646] flex items-center justify-center font-black shadow-2xs shrink-0 border border-emerald-200">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">
                Need Help With Delivery or Quality?
              </h4>
              <p className="text-xs text-gray-500">
                24/7 Bhopal Helpline: <strong className="text-gray-900">+91 9981418565</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="tel:9981418565"
              className="flex-1 sm:flex-initial bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-xs transition text-center"
            >
              Call Support
            </a>
            <a
              href="https://wa.me/919981418565"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-xs transition text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
