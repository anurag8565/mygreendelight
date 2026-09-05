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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { userdata } = useSelector((state: RootState) => state.user);
  const { data: session } = useSession();

  const activeUser = userdata?.email
    ? userdata
    : session?.user?.email
    ? session.user
    : null;

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
      label: (activeUser as any)?.role === "admin" ? "Admin" : activeUser?.email ? "Account" : "Login",
      href: (activeUser as any)?.role === "admin" ? "/admin" : activeUser?.email ? "/user/myorder" : "/login",
      icon: User,
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
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mx-3 mb-2"
            >
              <Link
                href="/user/cart"
                className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-2xl p-3.5 flex items-center justify-between shadow-xl shadow-green-900/25 border border-green-500/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                    <ShoppingCart size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-green-200 block">
                      {cartCount} item{cartCount > 1 ? "s" : ""} added
                    </span>
                    <span className="text-sm font-black text-white">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-black bg-white text-[#0f8646] px-3.5 py-2 rounded-xl shadow-xs">
                  <span>View Cart</span>
                  <ArrowRight size={14} />
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
                <div className="relative">
                  <Icon
                    size={22}
                    className={`transition-transform ${
                      isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                    }`}
                  />
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
