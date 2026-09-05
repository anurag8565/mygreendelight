"use client";

import React, { useEffect, useState } from "react";
import { Bell, BellRing, Sparkles, Check, X, Sunrise, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MorningHarvestNotifier() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      if (Notification.permission === "granted") {
        setSubscribed(true);
      }
    }
  }, []);

  const requestNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        setSubscribed(true);
        new Notification("🌿 SubziQuick Harvest Alert Activated!", {
          body: "You'll receive daily 6:30 AM farm-fresh Mandi harvest updates and priority delivery slots.",
          icon: "/hero_basket.jpg",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted || dismissed || permission === "denied") return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white py-2 px-3.5 sm:px-6 shadow-xs relative z-30 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Sunrise size={16} className="text-yellow-200" />
          </div>

          <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="bg-white/20 text-yellow-100 text-[10px] font-black uppercase px-2 py-0.5 rounded-full w-fit shrink-0 backdrop-blur-xs">
              🌅 6:30 AM Sunrise Mandi
            </span>
            <p className="font-extrabold text-[11px] sm:text-xs truncate sm:whitespace-normal">
              Today&apos;s direct farm palak, methi & A2 milk harvest dispatch is live in Bhopal!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!subscribed ? (
            <button
              type="button"
              onClick={requestNotification}
              className="bg-white text-gray-950 hover:bg-yellow-300 font-black text-[10.5px] sm:text-xs px-3 py-1 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Bell size={12} className="stroke-[2.5]" />
              <span>Get Harvest Alerts</span>
            </button>
          ) : (
            <span className="bg-emerald-900/40 text-emerald-100 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Check size={11} className="stroke-[3]" />
              <span>Alerts Active</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition cursor-pointer"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
