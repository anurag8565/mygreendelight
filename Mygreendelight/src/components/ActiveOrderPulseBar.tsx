"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ChevronRight, X, Sparkles, Clock, Navigation } from "lucide-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import LiveOrderPulseTracker from "./LiveOrderPulseTracker";
import { triggerHaptic } from "@/utils/haptics";

export default function ActiveOrderPulseBar() {
  const pathname = usePathname();
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  // Don't show the floating bar if we are already on tracking, ordersuccess, or checkout pages
  const isExcludedPage =
    pathname.startsWith("/track") ||
    pathname.startsWith("/user/ordersuccess") ||
    pathname.startsWith("/user/checkout");

  const fetchActiveOrder = async () => {
    try {
      const res = await axios.get("/api/user/active-order");
      if (res.data?.success && res.data?.activeOrder) {
        setActiveOrder(res.data.activeOrder);
      } else {
        setActiveOrder(null);
      }
    } catch {
      // Not logged in or no active order
      setActiveOrder(null);
    }
  };

  useEffect(() => {
    fetchActiveOrder();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchActiveOrder();
      }
    }, 8000);

    const handleVis = () => {
      if (document.visibilityState === "visible") {
        fetchActiveOrder();
      }
    };

    document.addEventListener("visibilitychange", handleVis);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVis);
    };
  }, []);

  if (isExcludedPage || !activeOrder || activeOrder._id === dismissedId) {
    return null;
  }

  const isOut = activeOrder.status === "out of delivery";
  const shortId = String(activeOrder._id).slice(-6).toUpperCase();

  return (
    <>
      {/* 🟢 ULTRA-SLEEK COMPACT FLOATING ORDER PILL */}
      <div className="fixed bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 z-[899] w-auto max-w-[92vw] sm:max-w-md font-sans select-none pointer-events-auto">
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="rounded-full px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#072817]/95 backdrop-blur-md text-white border border-emerald-500/30 shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex items-center gap-2 sm:gap-3"
        >
          {/* Left: Compact Scooter / Packing Icon */}
          <div
            onClick={() => {
              triggerHaptic("medium");
              setShowModal(true);
            }}
            className="flex items-center gap-2 cursor-pointer min-w-0"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center text-emerald-200">
                <Truck size={14} className={isOut ? "animate-bounce" : ""} />
              </div>
            </div>

            {/* Info Text: Single Line Sleek Pill */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] font-bold text-amber-300 font-mono">
                  #{shortId}
                </span>
                <span className="text-[9px] font-black uppercase text-emerald-300">
                  • {isOut ? "On the Way" : "Packing"}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-stone-200 truncate mt-0.5">
                {isOut ? "10-15 Min Bhopal Express" : "Fresh Farm Packing"}
              </p>
            </div>
          </div>

          {/* Right: Small Track Button + Dismiss */}
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <button
              type="button"
              onClick={() => {
                triggerHaptic("medium");
                setShowModal(true);
              }}
              className="bg-white hover:bg-emerald-50 text-[#072817] text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-0.5 transition active:scale-95 cursor-pointer shadow-2xs"
            >
              <span>Track</span>
              <ChevronRight size={11} />
            </button>

            <button
              type="button"
              onClick={() => setDismissedId(activeOrder._id)}
              className="w-5 h-5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs"
              title="Close"
            >
              <X size={11} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 📋 POPUP INTERACTIVE PULSE TRACKER MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3.5 sm:p-4 bg-black/65 backdrop-blur-xs font-sans overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="relative w-full max-w-xl my-auto"
            >
              <LiveOrderPulseTracker
                order={activeOrder}
                customerLocation={activeOrder.address}
                onClose={() => setShowModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
