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

            {/* 3. Center Cart: Elevated Circular FAB Button with Live Pulsing Animation */}
            {(() => {
              const isActive = pathname === "/user/cart";
              return (
                <div className="relative -top-4 flex flex-col items-center justify-center shrink-0 px-0.5 z-20">
                  <Link
                    href="/user/cart"
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    {/* Pulsing Animated Glow Ring when items are in cart */}
                    {cartCount > 0 && (
                      <span className="absolute -inset-1 rounded-full bg-[#0a3d24]/30 animate-ping pointer-events-none" />
                    )}

                    {/* Circular Elevated FAB */}
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-[0_6px_20px_rgba(10,61,36,0.4)] transition-all ${
                        cartCount > 0
                          ? "bg-gradient-to-tr from-[#072817] via-[#0a3d24] to-[#072817] text-white ring-2 ring-[#0a3d24]/20"
                          : isActive
                          ? "bg-[#0a3d24] text-white ring-2 ring-emerald-300"
                          : "bg-[#0a3d24] text-white"
                      }`}
                    >
                      <ShoppingCart size={19} className="stroke-[2.4]" />
                      {cartCount > 0 && (
                        <span className="text-[8.5px] font-black leading-none mt-0.5 tracking-tighter">
                          ₹{Math.round(cartTotal)}
                        </span>
                      )}

                      {/* Golden Count Badge */}
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 font-black text-[9.5px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                          {cartCount}
                        </span>
                      )}
                    </motion.div>

                    <span
                      className={`text-[9.5px] mt-0.5 tracking-tight leading-none ${
                        cartCount > 0 || isActive
                          ? "font-black text-[#0a3d24]"
                          : "font-bold text-stone-600"
                      }`}
                    >
                      Cart
                    </span>
                  </Link>
                </div>
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
