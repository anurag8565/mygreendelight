"use client";

import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion } from "framer-motion";

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const cartCount = cartdata.reduce((total, item) => total + item.quantity, 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide widget on admin, delivery boy, or auth pages to maintain clean focus
  if (
    !mounted ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/delivery") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const phoneNumber = "919981418565";
  const message = "Hello SubziQuick! I need quick assistance with farm fresh vegetables / my order.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // When mobile has active items in cart, float higher (bottom-[126px]) so the compact cart strip is NEVER overlapped
  const isMobileCartActive =
    cartCount > 0 &&
    pathname !== "/user/cart" &&
    pathname !== "/user/checkout" &&
    pathname !== "/user/ordersuccess" &&
    pathname !== "/user/myorder" &&
    !pathname.startsWith("/track");

  return (
    <div
      className={`fixed ${
        isMobileCartActive ? "bottom-[126px]" : "bottom-20"
      } right-3.5 z-40 md:bottom-7 md:right-7 flex flex-col items-end pointer-events-auto font-sans transition-all duration-300`}
    >
      {/* 🚀 Main Interactive Pulsing Button - Clean FAB (Floating Action Button) */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.92 }}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-tr from-[#1ebe5d] to-[#25D366] text-white rounded-full shadow-[0_8px_25px_-5px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_-4px_rgba(37,211,102,0.65)] transition-all cursor-pointer border border-white/30"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Animated Radial Pulse Ripple Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* Brand Icon with subtle rotation on hover */}
        <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-xs group-hover:rotate-12 transition-transform duration-300" />

        {/* Online Green Glow Dot */}
        <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-white border-2 border-[#25D366]" />
      </motion.a>
    </div>
  );
}
