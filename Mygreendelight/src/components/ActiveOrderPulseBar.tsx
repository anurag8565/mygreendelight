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

  // Don't show the floating bar if we are already on the dedicated track order page
  const isOnTrackPage = pathname.startsWith("/track/");

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

  if (isOnTrackPage || !activeOrder || activeOrder._id === dismissedId) {
    return null;
  }

  const isOut = activeOrder.status === "out of delivery";
  const shortId = String(activeOrder._id).slice(-6).toUpperCase();

  return (
    <>
      {/* 🟢 FLOATING ACTIVE ORDER PULSE PILL */}
      <div className="fixed bottom-18 sm:bottom-6 left-1/2 -translate-x-1/2 z-[899] w-[94%] max-w-md font-sans select-none">
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 bg-stone-950/95 backdrop-blur-md text-white border border-emerald-500/40 shadow-[0_10px_30px_rgba(10,61,36,0.35)] flex items-center justify-between gap-2.5 overflow-hidden"
        >
          {/* Ambient Background Gradient Glow */}
          <div className="absolute -left-8 -top-8 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

          {/* Left: Animated Icon + Live Pulse Indicator */}
          <div
            onClick={() => {
              triggerHaptic("medium");
              setShowModal(true);
            }}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            {/* Scooter Badge with Ping Radar */}
            <div className="relative shrink-0">
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#0a3d24] to-emerald-600 text-white flex items-center justify-center font-black shadow-inner border border-emerald-400/40">
                <Truck size={17} className={isOut ? "animate-bounce" : ""} />
              </div>
            </div>

            {/* Info Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-black text-amber-300">
                  #SZQ-{shortId}
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {isOut ? "In-Transit 🛵" : "Packing 🌿"}
                </span>
              </div>
              <p className="text-xs font-black text-stone-100 truncate mt-0.5">
                {isOut
                  ? "Rider Raaste Me Hai (Bhopal Express)"
                  : "Mandi Lot Sorted & Assigned"}
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                triggerHaptic("medium");
                setShowModal(true);
              }}
              className="bg-[#0a3d24] hover:bg-[#062415] text-white text-[11px] sm:text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer border border-emerald-600/50"
            >
              <span>Track</span>
              <ChevronRight size={13} />
            </button>

            <button
              type="button"
              onClick={() => setDismissedId(activeOrder._id)}
              className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Dismiss for now"
            >
              <X size={13} />
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
