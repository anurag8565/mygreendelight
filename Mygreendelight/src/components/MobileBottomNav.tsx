"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import type { RootState } from "@/redux/store";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  ShoppingCart,
  ArrowRight,
  Search,
  ShieldCheck,
  Zap,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(199);
  const { data: session } = useSession();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { userdata } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setMounted(true);
    axios
      .get("/api/settings")
      .then((res) => {
        if (res.data?.success && res.data.freeDeliveryThreshold) {
          setFreeDeliveryThreshold(res.data.freeDeliveryThreshold);
        }
      })
      .catch(() => {});
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
  const isFreeDelivery = cartTotal >= freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: ShoppingBag },
    { label: "Search", href: "/user/search", icon: Search },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      badge: mounted && wishlistItems.length > 0 ? wishlistItems.length : null,
    },
    {
      label: isAdmin ? "Admin" : isLoggedIn ? "Account" : "Login",
      href: isAdmin ? "/admin" : isLoggedIn ? "/user" : "/login",
      icon: isAdmin ? ShieldCheck : User,
      isUserTab: true,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Floating Quick Cart Bar (Hidden on cart, checkout, orders, and track pages) */}
        <AnimatePresence>
          {mounted &&
            cartCount > 0 &&
            pathname !== "/user/cart" &&
            pathname !== "/user/checkout" &&
            pathname !== "/user/ordersuccess" &&
            pathname !== "/user/myorder" &&
            !pathname.startsWith("/track") && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="mx-3 mb-2"
            >
              <Link
                href="/user/cart"
                className="relative overflow-hidden w-full bg-[#0a3d24] hover:bg-[#072817] text-white rounded-xl px-3 py-2 flex items-center justify-between shadow-[0_6px_20px_-3px_rgba(10,61,36,0.35)] border border-emerald-900/60 cursor-pointer active:scale-[0.98] transition-all"
              >
                {/* Subtle Shimmer Sweep */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                    <ShoppingCart size={15} className="text-white" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                        {cartCount} {cartCount > 1 ? "ITEMS" : "ITEM"}
                      </span>
                      <span className="text-emerald-300/60 text-[9px]">•</span>
                      <span className="text-[9px] font-bold text-amber-300 inline-flex items-center gap-0.5">
                        <Zap size={9} className="fill-amber-300 text-amber-300" />
                        10-15M
                      </span>
                    </div>
                    <span className="text-sm font-black text-white tracking-tight">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-black bg-white text-[#0a3d24] px-3 py-1.5 rounded-lg shadow-xs shrink-0 hover:bg-emerald-50 transition relative z-10">
                  <span>View Cart</span>
                  <ArrowRight size={12} className="stroke-[2.5]" />
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Dock: Style 11 (iOS Floating Dock) + Style 05 (Pill Highlight) + Style 06 (Center FAB) */}
        <div className="px-3.5 pb-2.5 pt-1">
          <nav className="relative bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-3xl px-2 py-1.5 flex items-center justify-between shadow-[0_10px_35px_-5px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
            {/* 1. Left Items: Home & Shop */}
            <div className="flex items-center flex-1 justify-around">
              {/* Home */}
              {(() => {
                const isActive = pathname === "/";
                return (
                  <Link
                    href="/"
                    className={`relative py-1.5 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/70 z-0"
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <Home size={19} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                      <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? "font-extrabold" : "font-semibold"}`}>
                        Home
                      </span>
                    </div>
                  </Link>
                );
              })()}

              {/* Shop */}
              {(() => {
                const isActive = pathname === "/shop" || pathname.startsWith("/product");
                return (
                  <Link
                    href="/shop"
                    className={`relative py-1.5 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/70 z-0"
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <ShoppingBag size={19} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                      <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? "font-extrabold" : "font-semibold"}`}>
                        Shop
                      </span>
                    </div>
                  </Link>
                );
              })()}
            </div>

            {/* 2. STYLE 06: Center Elevated Circular FAB Button (Express Cart with live items counter & glow) */}
            <div className="relative -top-5 shrink-0 px-1.5 z-20">
              <Link
                href="/user/cart"
                className="group relative flex flex-col items-center focus:outline-none"
              >
                {/* Subtle outer pulsing ring when cart has items */}
                {cartCount > 0 && (
                  <span className="absolute -inset-1 rounded-full bg-[#0a3d24]/25 animate-ping" />
                )}

                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(10,61,36,0.45)] border-3 border-white transition-transform duration-200 ${
                    pathname === "/user/cart"
                      ? "bg-[#072817] text-white ring-2 ring-[#0a3d24]"
                      : "bg-gradient-to-tr from-[#072817] via-[#0a3d24] to-[#072817] text-white"
                  }`}
                >
                  <ShoppingCart size={22} className="stroke-[2.5]" />
                  {cartCount > 0 ? (
                    <span className="text-[9px] font-black leading-none mt-0.5 tracking-tighter">
                      ₹{Math.round(cartTotal)}
                    </span>
                  ) : null}
                </motion.div>

                {/* Badge count on FAB */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-950 font-black text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}

                <span className="text-[9.5px] font-black text-[#0a3d24] mt-1 tracking-tight">
                  Cart
                </span>
              </Link>
            </div>

            {/* 3. Right Items: Search & Account/Wishlist */}
            <div className="flex items-center flex-1 justify-around">
              {/* Search */}
              {(() => {
                const isActive = pathname === "/user/search";
                return (
                  <Link
                    href="/user/search"
                    className={`relative py-1.5 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/70 z-0"
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <Search size={19} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                      <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? "font-extrabold" : "font-semibold"}`}>
                        Search
                      </span>
                    </div>
                  </Link>
                );
              })()}

              {/* Account / Login */}
              {(() => {
                const targetHref = isAdmin ? "/admin" : isLoggedIn ? "/user" : "/login";
                const isActive = pathname.startsWith("/user") && pathname !== "/user/cart" && pathname !== "/user/search" || pathname.startsWith("/admin");
                const Icon = isAdmin ? ShieldCheck : User;
                const labelText = isAdmin ? "Admin" : isLoggedIn ? "Account" : "Login";

                return (
                  <Link
                    href={targetHref}
                    className={`relative py-1.5 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isActive ? "text-[#0a3d24]" : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/70 z-0"
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
                        <Icon size={19} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                      )}
                      <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? "font-extrabold" : "font-semibold"}`}>
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
    </div>
  );
}
