"use client";

import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const cartCount = cartdata.reduce((total, item) => total + item.quantity, 0);

  // Keep bubble visible and open by default
  const [isOpen, setIsOpen] = useState(true);
  const [hasDismissed, setHasDismissed] = useState(false);
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

  // When mobile has active items in cart, float higher (bottom-40) so the cart strip is NEVER overlapped
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
        isMobileCartActive ? "bottom-[138px]" : "bottom-24"
      } right-3.5 z-40 md:bottom-7 md:right-7 flex flex-col items-end pointer-events-auto font-sans transition-all duration-300`}
    >
      {/* 🌟 Floating Contextual Glass Bubble ("Bhopal Dispatch Active") */}
      <AnimatePresence>
        {isOpen && !hasDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 8, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-2.5 max-w-[260px] sm:max-w-xs bg-white/95 backdrop-blur-md text-slate-800 p-3 rounded-2xl shadow-[0_10px_35px_-8px_rgba(0,0,0,0.18)] border border-emerald-100 relative"
          >
            {/* Close / Dismiss cross */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasDismissed(true);
                setIsOpen(false);
              }}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition cursor-pointer"
              aria-label="Close notification"
            >
              <X size={13} />
            </button>

            {/* Bubble Header */}
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-extrabold text-[#0f8646]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
              </span>
              <span>Bhopal Dispatch Active</span>
            </div>

            {/* Bubble Body */}
            <p className="text-[11.5px] font-medium text-slate-600 leading-snug pr-4">
              Need fresh harvest help or instant delivery support? Chat with us live!
            </p>

            {/* Quick Action Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white py-1.5 px-3 rounded-xl font-bold text-xs transition-transform shadow-xs cursor-pointer"
            >
              <FaWhatsapp size={14} />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Downward pointer caret */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-emerald-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 Main Interactive Pulsing Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center gap-2.5 bg-gradient-to-tr from-[#1ebe5d] to-[#25D366] text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-[0_8px_25px_-5px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_-4px_rgba(37,211,102,0.6)] transition-all cursor-pointer border border-white/25"
        aria-label="Chat on WhatsApp"
        onClick={() => setHasDismissed(true)}
      >
        {/* Animated Radial Pulse Ripple Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* Brand Icon with subtle rotation on hover */}
        <div className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-xs group-hover:rotate-12 transition-transform duration-300">
          <FaWhatsapp className="w-5 h-5 drop-shadow-xs" />
        </div>

        {/* Text Pill on Desktop */}
        <div className="hidden sm:flex flex-col items-start pr-1 text-left leading-none">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
            Need Help?
          </span>
          <span className="text-xs font-black text-white mt-0.5 tracking-tight">
            Chat on WhatsApp
          </span>
        </div>

        {/* Online Green Glow Dot */}
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#25D366]" />
      </motion.a>

    </div>
  );
}
