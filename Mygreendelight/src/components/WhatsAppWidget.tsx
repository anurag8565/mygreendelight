"use client";

import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MessageCircle } from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissedTooltip, setDismissedTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Gently show a friendly micro-tooltip after 3.5s of browsing
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3500);

    // Auto-dismiss tooltip after 8.5s so it never clutters the screen
    const dismissTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  // Hide widget on admin, delivery boy, auth, cart, or checkout pages to prevent UI overlap
  if (
    !mounted ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/delivery") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/user/cart" ||
    pathname === "/user/checkout"
  ) {
    return null;
  }

  const phoneNumber = "919981418565";
  const message = "Hello SubziQuick! I need quick assistance with farm fresh vegetables / my order.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-[4.75rem] sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-auto font-sans select-none">
      {/* 💬 Sleek Auto-Fading Greeting Tooltip */}
      <AnimatePresence>
        {showTooltip && !dismissedTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mb-2.5 max-w-[210px] bg-white/95 backdrop-blur-md text-stone-800 rounded-2xl p-2.5 px-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-emerald-100 flex items-start gap-2 relative"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0" />
            <div className="min-w-0 pr-3">
              <p className="text-[11px] font-bold text-stone-900 leading-tight">
                Order on WhatsApp?
              </p>
              <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
                Bhopal support online • Instant reply
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDismissedTooltip(true);
                setShowTooltip(false);
              }}
              className="absolute top-1.5 right-1.5 p-1 text-stone-400 hover:text-stone-700 transition"
              aria-label="Dismiss message"
            >
              <X size={12} />
            </button>
            {/* Little downward arrow caret */}
            <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white rotate-45 border-r border-b border-emerald-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 Main Animated WhatsApp Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.6 }}
      >
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHaptic("medium")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            y: [0, -3.5, 0],
          }}
          transition={{
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#2cd66c] text-white rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] border-2 border-white/60 cursor-pointer transition-shadow"
          aria-label="Chat with SubziQuick on WhatsApp"
          title="Chat on WhatsApp"
        >
          {/* Subtle Radial Pulse Wave */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-25 animate-ping pointer-events-none" />

          {/* WhatsApp SVG Icon */}
          <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform duration-300 group-hover:rotate-12" />

          {/* Active Online Status Indicator */}
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-xs">
            <span className="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-75" />
          </span>
        </motion.a>
      </motion.div>
    </div>
  );
}
