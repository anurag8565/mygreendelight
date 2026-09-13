"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import type { RootState } from "@/redux/store";
import {
  Home,
  ShoppingBag,
  User,
  ShoppingCart,
  Search,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { userdata } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide bottom nav on admin and delivery boy pages or login/register
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/delivery") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const activeUser: any = userdata || session?.user;
  const isLoggedIn = !!(activeUser?.email);
  const isAdmin = activeUser?.role === "admin";

  const cartTotal = cartdata.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = cartdata.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="pointer-events-auto px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
        {/* Style 11 (iOS Floating Dock) + Style 05 (Smooth Pill Highlight) */}
        <nav className="relative max-w-md mx-auto bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-[26px] p-1.5 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.16)] ring-1 ring-black/5">
          <div className="grid grid-cols-5 items-center gap-1">
            {/* 1. Home */}
            {(() => {
              const isActive = pathname === "/";
              return (
                <Link
                  href="/"
                  className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActivePill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/80 z-0"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <Home size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    <span className={`text-[10.5px] mt-1 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      Home
                    </span>
                  </div>
                </Link>
              );
            })()}

            {/* 2. Shop */}
            {(() => {
              const isActive = pathname === "/shop" || pathname.startsWith("/product");
              return (
                <Link
                  href="/shop"
                  className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActivePill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/80 z-0"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <ShoppingBag size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    <span className={`text-[10.5px] mt-1 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      Shop
                    </span>
                  </div>
                </Link>
              );
            })()}

            {/* 3. Center Cart: Seamless Highlighted Hero Action */}
            {(() => {
              const isActive = pathname === "/user/cart";
              return (
                <Link
                  href="/user/cart"
                  className="relative py-1 px-1 flex flex-col items-center justify-center focus:outline-none"
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className={`relative w-full py-1.5 px-1.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      cartCount > 0
                        ? "bg-[#0a3d24] text-white shadow-[0_4px_16px_rgba(10,61,36,0.35)]"
                        : isActive
                        ? "bg-emerald-50 text-[#0a3d24] border border-emerald-200/80"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <div className="relative">
                      <ShoppingCart
                        size={19}
                        className={cartCount > 0 || isActive ? "stroke-[2.4]" : "stroke-[1.8]"}
                      />
                      {/* Crisp Badge Indicator */}
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 bg-amber-400 text-stone-950 text-[9.5px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center border border-[#0a3d24] shadow-xs">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 tracking-tight leading-none ${
                        cartCount > 0
                          ? "font-black text-white"
                          : isActive
                          ? "font-black text-[#0a3d24]"
                          : "font-semibold"
                      }`}
                    >
                      {cartCount > 0 ? `₹${Math.round(cartTotal)}` : "Cart"}
                    </span>
                  </motion.div>
                </Link>
              );
            })()}

            {/* 4. Search / Wishlist */}
            {(() => {
              const isActive = pathname === "/user/search";
              return (
                <Link
                  href="/user/search"
                  className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActivePill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/80 z-0"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <Search size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    <span className={`text-[10.5px] mt-1 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      Search
                    </span>
                  </div>
                </Link>
              );
            })()}

            {/* 5. Account / Login */}
            {(() => {
              const targetHref = isAdmin ? "/admin" : isLoggedIn ? "/user" : "/login";
              const isActive =
                (pathname.startsWith("/user") &&
                  pathname !== "/user/cart" &&
                  pathname !== "/user/search") ||
                pathname.startsWith("/admin");
              const Icon = isAdmin ? ShieldCheck : User;
              const labelText = isAdmin ? "Admin" : isLoggedIn ? "Account" : "Login";

              return (
                <Link
                  href={targetHref}
                  className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActivePill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/80 z-0"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    {isLoggedIn && activeUser?.image ? (
                      <img
                        src={activeUser.image}
                        alt="User"
                        className={`w-5 h-5 rounded-full object-cover border ${
                          isActive ? "border-[#0a3d24]" : "border-stone-300"
                        }`}
                      />
                    ) : (
                      <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    )}
                    <span className={`text-[10.5px] mt-1 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      {labelText}
                    </span>
                  </div>
                </Link>
              );
            })()}
          </div>
        </nav>
      </div>
    </div>
  );
}
