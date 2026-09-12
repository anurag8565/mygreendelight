"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, RefreshCw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error Boundary caught:", error);
  }, [error]);

  const handleHardRefresh = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.clear();
      } catch (_) {}
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8faf9] text-center px-4 font-sans py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center">
        {/* Animated Brand Pulse Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-3xl shadow-xs mb-4"
        >
          🌿
        </motion.div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Temporary Connection Hiccup
        </h1>

        {/* Friendly Bilingual Message */}
        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
          Kuch der ke liye page load hone me rukawat aayi. Neeche diye gaye button se page ko reload ya home par ja sakte hain.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-6">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>

          <button
            type="button"
            onClick={handleHardRefresh}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Refresh Page</span>
          </button>
        </div>

        {/* Navigation & Help Links */}
        <div className="flex items-center justify-between w-full pt-6 mt-6 border-t border-gray-100 text-xs">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1 transition"
          >
            <Home size={13} />
            <span>Go to Home</span>
          </Link>

          <a
            href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20faced%20an%20issue%20while%20browsing%20the%20store."
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-extrabold flex items-center gap-1 transition"
          >
            <FaWhatsapp size={14} className="text-[#25D366]" />
            <span>Need Help? WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}