"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { CloudRain, AlertTriangle, Sparkles, Info, X, ArrowRight } from "lucide-react";

interface BroadcastData {
  _id: string;
  message: string;
  type: "info" | "warning" | "promo" | "weather";
  isActive: boolean;
  linkText?: string;
  linkUrl?: string;
}

export default function BroadcastBar() {
  const [broadcast, setBroadcast] = useState<BroadcastData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const res = await axios.get("/api/broadcast");
        if (res.data.success && res.data.broadcast && res.data.broadcast.isActive) {
          setBroadcast(res.data.broadcast);
        }
      } catch (e) {
        // Silently handle if error
      }
    };
    fetchBroadcast();
  }, []);

  if (!broadcast || !broadcast.isActive || dismissed) return null;

  const typeStyles = {
    weather: {
      bg: "bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white",
      icon: <CloudRain size={16} className="shrink-0 animate-bounce" />,
      badge: "Bhopal Weather Alert",
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white",
      icon: <AlertTriangle size={16} className="shrink-0 animate-pulse" />,
      badge: "Store Notice",
    },
    promo: {
      bg: "bg-gradient-to-r from-[#0f8646] via-emerald-600 to-teal-700 text-white",
      icon: <Sparkles size={16} className="shrink-0 text-yellow-300" />,
      badge: "Special Offer",
    },
    info: {
      bg: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white",
      icon: <Info size={16} className="shrink-0" />,
      badge: "Update",
    },
  };

  const currentStyle = typeStyles[broadcast.type] || typeStyles.promo;

  return (
    <div className={`w-full ${currentStyle.bg} py-2 px-3 sm:px-6 text-xs font-bold shadow-md relative z-40 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            {currentStyle.icon}
          </div>
          
          <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
            <span className="hidden sm:inline-block uppercase tracking-wider text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs shrink-0">
              {currentStyle.badge}
            </span>

            {/* Complete Message Without Ugly Truncation */}
            <p className="font-extrabold text-[11px] sm:text-xs leading-snug text-white break-words">
              {broadcast.message}
            </p>

            {broadcast.linkUrl && (
              <Link
                href={broadcast.linkUrl}
                className="inline-flex items-center gap-1 bg-white text-gray-950 hover:bg-yellow-300 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black transition-all shrink-0 self-start sm:self-auto shadow-xs border border-white/60 active:scale-95"
              >
                <span>{broadcast.linkText || "View Details"}</span>
                <ArrowRight size={11} />
              </Link>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition shrink-0 cursor-pointer -mt-0.5 sm:mt-0"
          title="Dismiss Notice"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
