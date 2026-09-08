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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
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
              initial={{ y: 60, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="mx-3.5 mb-2.5"
            >
              <Link
                href="/user/cart"
                className="w-full bg-gradient-to-r from-[#0c831f] via-[#0e771e] to-[#064e13] text-white rounded-2xl p-3.5 flex items-center justify-between shadow-[0_10px_25px_-5px_rgba(12,131,31,0.5)] border border-emerald-400/40 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-sm shrink-0 shadow-inner">
                    <ShoppingCart size={19} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block">
                        {cartCount} {cartCount > 1 ? "ITEMS" : "ITEM"}
                      </span>
                      <span className="text-emerald-300/60 text-[10px]">•</span>
                      <span className="text-[10px] font-bold text-amber-300 inline-flex items-center gap-0.5">
                        <Zap size={10} className="fill-amber-300 text-amber-300" />
                        10-15 MIN
                      </span>
                    </div>
                    <span className="text-base font-black text-white leading-tight block truncate">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-black bg-white text-[#0c831f] px-4 py-2 rounded-xl shadow-md shrink-0 hover:bg-emerald-50 transition">
                  <span>View Cart</span>
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Dock with Safe Area Bottom Padding */}
        <nav className="bg-white/95 backdrop-blur-lg border-t border-gray-200/90 px-2 pt-1.5 pb-2.5 sm:pb-2 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex-1 py-1 flex flex-col items-center justify-center transition-all relative rounded-xl ${
                  isActive ? "text-[#0f8646]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {item.isUserTab && isLoggedIn && activeUser?.image ? (
                    <img
                      src={activeUser.image}
                      alt="User"
                      className={`w-5.5 h-5.5 rounded-full object-cover border transition-all ${
                        isActive ? "border-[#0f8646] scale-110" : "border-gray-300"
                      }`}
                    />
                  ) : (
                    <Icon
                      size={22}
                      className={`transition-transform ${
                        isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                      }`}
                    />
                  )}
                  {item.isUserTab && isLoggedIn && !activeUser?.image && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#0f8646] rounded-full ring-2 ring-white" />
                  )}
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight ${
                    isActive ? "font-extrabold text-[#0f8646]" : "font-semibold"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 w-4 h-1 bg-[#0f8646] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
