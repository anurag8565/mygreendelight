"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import axios from "axios";
import { signOut } from "next-auth/react";
import {
  User,
  Package,
  Wallet,
  Crown,
  Milk,
  Heart,
  ShoppingCart,
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  Salad,
  Gift,
  BookOpen,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfileHub() {
  const router = useRouter();
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [vipStatus, setVipStatus] = useState<any>(null);
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      // 1. Fetch Wallet
      const walletRes = await axios.get("/api/user/wallet");
      if (walletRes.data?.success) {
        setWalletBalance(walletRes.data.balance || 0);
      }

      // 2. Fetch VIP Pass
      const vipRes = await axios.get("/api/user/vip-pass");
      if (vipRes.data?.success) {
        setVipStatus(vipRes.data);
      }

      // 3. Fetch Orders count
      const ordersRes = await axios.get("/api/user/myorder");
      if (ordersRes.data?.orders) {
        setActiveOrdersCount(ordersRes.data.orders.length);
      }
    } catch (e) {
      // Guest or error
    } finally {
      setLoading(false);
    }
  };

  const isVip = vipStatus?.isMember;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Nav user={userdata as any} />

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
          <span className="text-xs font-black text-[#0f8646] uppercase tracking-wider bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            Account Dashboard
          </span>
        </div>

        {/* User Identity Banner */}
        <div className="bg-gradient-to-r from-[#032412] via-[#073b1d] to-[#0f8646] text-white rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden mb-5">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 border-white/40 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner shrink-0">
                {userdata?.name ? userdata.name.charAt(0).toUpperCase() : <User size={32} />}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {userdata?.name || "Bhopal Resident"}
                  </h1>
                  {isVip && (
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Crown size={11} /> VIP Member
                    </span>
                  )}
                  {userdata?.role === "admin" && (
                    <span className="bg-purple-500 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-green-100/90 font-medium">
                  {userdata?.email || userdata?.mobile || "Welcome to SubziQuick Pure Farm Deliveries"}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-[11px] text-green-200">
                  <span>📍 Bhopal Central Hub</span>
                  <span>•</span>
                  <span>⚡ 10-15 Min Express</span>
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

        {/* 2 Clean Account Navigation Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          {/* Tile 1: My Orders */}
          <Link
            href="/user/myorder"
            className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Package size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  My Orders & Live Tracking
                </span>
                <span className="text-lg font-black text-gray-900">
                  {activeOrdersCount} Orders Placed
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#0f8646] flex items-center gap-0.5 justify-end">
                View Orders <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          {/* Tile 2: Saved Wishlist */}
          <Link
            href="/wishlist"
            className="bg-white rounded-2xl p-4 border border-rose-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shrink-0 border border-rose-100 group-hover:scale-105 transition-transform">
                <Heart size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Saved Produce Wishlist
                </span>
                <span className="text-lg font-black text-gray-900">
                  Favorite Items
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-rose-600 flex items-center gap-0.5 justify-end">
                View Saved <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Links Menu Grid */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs mb-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 text-emerald-800">
            Account & Farm Services
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
                    {activeOrdersCount} previous orders
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646]" />
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-green-50/60 hover:border-[#0f8646] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-xs border border-gray-100">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition">
                    Saved Wishlist
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Favorite produce & items
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
                    Active Cart
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Proceed to checkout
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0f8646]" />
            </Link>

            <Link
              href="/shop/custom-box"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-green-50/60 hover:border-[#0f8646] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-teal-600 flex items-center justify-center shadow-xs border border-gray-100">
                  <Salad size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 group-hover:text-[#0f8646] transition">
                    Custom Salad Builder
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Craft fresh bowl
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
                    Win flat ₹30–₹50 OFF daily
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-700" />
            </Link>

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
