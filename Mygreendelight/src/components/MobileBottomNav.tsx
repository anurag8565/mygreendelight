"use client";

import React from "react";
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
  const { data: session } = useSession();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { userdata } = useSelector((state: RootState) => state.user);

  // Hide bottom nav on admin, delivery, product detail, cart, checkout, and auth pages to avoid overlapping floating action bars
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/delivery") ||
    pathname.startsWith("/product") ||
    pathname === "/user/cart" ||
    pathname === "/user/checkout" ||
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none">
      <div className="pointer-events-auto px-2 sm:px-4 pb-[max(0.15rem,env(safe-area-inset-bottom))] pb-1 pt-0">
        {/* Style 11 (iOS Floating Dock) + Smooth Pill Highlight + Responsive Tablet Scaling */}
        <nav className="relative max-w-sm sm:max-w-md md:max-w-lg mx-auto bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-[24px] p-1 sm:p-1.5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
          <div className="grid grid-cols-5 items-center gap-0.5 sm:gap-1.5">
            {/* 1. Home */}
            {(() => {
              const isActive = pathname === "/";
              return (
                <Link
                  href="/"
                  className={`relative py-1 px-0.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      <Home size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    </motion.div>
                    <span className={`text-[10px] sm:text-[10.5px] mt-0.5 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      Home
                    </span>
                    {/* Modern iOS Active Dot Indicator */}
                    <div className="h-1 mt-1 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveDot"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#0a3d24]"
                        />
                      )}
                    </div>
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
                  className={`relative py-1 px-0.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      <ShoppingBag size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    </motion.div>
                    <span className={`text-[10px] sm:text-[10.5px] mt-0.5 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      Shop
                    </span>
                    {/* Modern iOS Active Dot Indicator */}
                    <div className="h-1 mt-1 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveDot"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#0a3d24]"
                        />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* 3. Center Cart: Compact, Flush-Elevated Circular Action */}
            {(() => {
              const isActive = pathname === "/user/cart";
              return (
                <div className="relative -top-1 flex flex-col items-center justify-center shrink-0 px-0.5 z-20">
                  <Link
                    href="/user/cart"
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    {/* Subtle Pulsing Ring when items are in cart */}
                    {cartCount > 0 && (
                      <span className="absolute -inset-0.5 rounded-full bg-[#0a3d24]/25 animate-ping pointer-events-none" />
                    )}

                    {/* Perfectly Proportioned Circular Cart Button */}
                    <motion.div
                      key={cartCount}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      whileTap={{ scale: 0.88 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 450, damping: 24 }}
                      className={`relative w-10.5 h-10.5 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-[0_4px_14px_rgba(10,61,36,0.35)] transition-colors ${
                        cartCount > 0
                          ? "bg-gradient-to-tr from-[#072817] via-[#0a3d24] to-[#072817] text-white ring-1 ring-[#0a3d24]/20"
                          : isActive
                          ? "bg-[#072817] text-white ring-1.5 ring-emerald-400"
                          : "bg-[#0a3d24] text-white"
                      }`}
                    >
                      <ShoppingCart size={17} className="stroke-[2.4]" />

                      {/* Golden Count Badge */}
                      {cartCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 font-black text-[9px] min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center border border-white shadow-xs"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </motion.div>

                    <span
                      className={`text-[9.5px] sm:text-[10px] mt-0.5 tracking-tight leading-none ${
                        cartCount > 0
                          ? "font-black text-[#0a3d24]"
                          : isActive
                          ? "font-black text-[#0a3d24]"
                          : "font-semibold text-stone-500"
                      }`}
                    >
                      {cartCount > 0 ? `₹${Math.round(cartTotal)}` : "Cart"}
                    </span>

                    {/* Active Dot for Cart when on cart page and cart is empty */}
                    <div className="h-1 mt-1 flex items-center justify-center">
                      {isActive && cartCount === 0 && (
                        <motion.div
                          layoutId="mobileActiveDot"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#0a3d24]"
                        />
                      )}
                    </div>
                  </Link>
                </div>
              );
            })()}

            {/* 4. Search */}
            {(() => {
              const isActive = pathname === "/user/search";
              return (
                <Link
                  href="/user/search"
                  className={`relative py-1 px-0.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      <Search size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    </motion.div>
                    <span className={`text-[10px] sm:text-[10.5px] mt-0.5 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      Search
                    </span>
                    {/* Modern iOS Active Dot Indicator */}
                    <div className="h-1 mt-1 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveDot"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#0a3d24]"
                        />
                      )}
                    </div>
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
                  className={`relative py-1 px-0.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
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
                    </motion.div>
                    <span className={`text-[10px] sm:text-[10.5px] mt-0.5 tracking-tight leading-none ${isActive ? "font-black" : "font-semibold"}`}>
                      {labelText}
                    </span>
                    {/* Modern iOS Active Dot Indicator */}
                    <div className="h-1 mt-1 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveDot"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#0a3d24]"
                        />
                      )}
                    </div>
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
