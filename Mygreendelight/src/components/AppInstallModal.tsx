"use client";

import React, { useEffect, useState } from "react";
import { Download, X, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    openMGDInstallModal?: () => void;
  }
}

export default function AppInstallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("MGD SW Active"))
        .catch(() => {});
    }

    // Attach global window trigger
    if (typeof window !== "undefined") {
      window.openMGDInstallModal = () => setIsOpen(true);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-mgd-install-modal", handleOpen);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto-open modal after 3 seconds on first visit
      const dismissed = localStorage.getItem("mgd_install_modal_dismissed");
      if (!dismissed || Date.now() - Number(dismissed) > 24 * 60 * 60 * 1000) {
        setTimeout(() => setIsOpen(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Auto-open after 3 seconds if not dismissed
    const dismissed = localStorage.getItem("mgd_install_modal_dismissed");
    if (!dismissed || Date.now() - Number(dismissed) > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => setIsOpen(true), 3500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("open-mgd-install-modal", handleOpen);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleDownloadAndInstall = async () => {
    setIsDownloading(true);

    // 1. Trigger PWA native install if supported by browser
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDownloadSuccess(true);
          setTimeout(() => setIsOpen(false), 2000);
          setDeferredPrompt(null);
          setIsDownloading(false);
          return;
        }
      } catch (err) {
        console.log("Install prompt error", err);
      }
    }

    // 2. Direct instant download fallback
    try {
      const link = document.createElement("a");
      link.href = "/api/download-app";
      link.download = "MyGreenDelight-Bhopal.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setIsOpen(false), 2500);
    } catch (e) {
      console.log("Download failed", e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("mgd_install_modal_dismissed", String(Date.now()));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[1300] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs font-sans cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="cursor-default bg-[#fdfaf3] rounded-3xl overflow-hidden shadow-2xl border border-amber-200/90 max-w-2xl w-full relative text-gray-900"
          >
            {/* Top Warm Banner Header (Exact Reference Design) */}
            <div className="bg-[#faecd5] px-4 py-3 sm:py-3.5 border-b border-amber-200/80 flex items-center justify-between relative">
              <div className="flex-1 text-center pr-6 pl-2">
                <h3 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Get Your Organic Goodies Now with the</span>
                  <span className="text-[#0f8646] font-black">
                    MyGreenDelight App
                  </span>
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8b5a2b] hover:bg-black text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 absolute right-3 top-1/2 -translate-y-1/2"
                title="Close"
              >
                <X size={15} className="stroke-[3]" />
              </button>
            </div>

            {/* Main Modal Body */}
            <div className="p-4 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
              
              {/* Left Column: Brand, Headline, 1-Click Download Now Button, Store Badges */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Brand Header */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black text-base shadow-2xs">
                      🌿
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#0f8646] tracking-tight block">
                        MyGreenDelight
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                        Fresh Organic Produce • Home Delivered
                      </span>
                    </div>
                  </div>

                  {/* Main Headline */}
                  <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight mb-1.5 tracking-tight">
                    Get Your Organic Goodies Now with the MyGreenDelight App
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 font-bold mb-4">
                    Download Now and start shopping
                  </p>

                  {/* Instant Download Action */}
                  <div className="space-y-3 mb-4">
                    {downloadSuccess ? (
                      <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 font-black text-xs text-center flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>🎉 App Downloading & Installing Now!</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={handleDownloadAndInstall}
                        className="w-full py-3.5 px-6 bg-[#3d7a22] hover:bg-[#2f6019] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 group disabled:opacity-75"
                      >
                        <Download size={18} className="stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
                        <span>{isDownloading ? "Starting Download..." : "Download Now"}</span>
                      </button>
                    )}

                    {/* App Store Badges (Clicking triggers direct download/install) */}
                    <div className="flex items-center gap-2.5 pt-1">
                      {/* Google Play Style Badge */}
                      <button
                        type="button"
                        onClick={handleDownloadAndInstall}
                        className="flex-1 bg-black hover:bg-gray-800 text-white p-2 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs border border-gray-700 active:scale-95"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M3.609 1.814L13.792 12 3.61 22.186c-.302-.34-.485-.79-.485-1.286V3.1c0-.496.183-.946.484-1.286zm11.24 11.24l2.128 2.128-11.45 6.474 9.322-8.602zm0-2.108L5.527 2.344l11.45 6.474-2.128 2.128zm1.06 1.054l3.708 2.1-3.708 2.101V12z"/>
                        </svg>
                        <div className="text-left leading-tight">
                          <span className="text-[7.5px] uppercase font-medium text-gray-300 block">Get it on</span>
                          <span className="text-[10.5px] font-black text-white block">Google Play</span>
                        </div>
                      </button>

                      {/* Apple App Store Style Badge */}
                      <button
                        type="button"
                        onClick={handleDownloadAndInstall}
                        className="flex-1 bg-black hover:bg-gray-800 text-white p-2 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs border border-gray-700 active:scale-95"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.66-1.07 1.73-.93 2.76 1 .08 2.02-.51 2.63-1.26z"/>
                        </svg>
                        <div className="text-left leading-tight">
                          <span className="text-[7.5px] uppercase font-medium text-gray-300 block">Download on</span>
                          <span className="text-[10.5px] font-black text-white block">App Store</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold">
                    <span>⚡ 10-Min Fast Delivery</span>
                    <span>•</span>
                    <span>🛵 Direct APK Download</span>
                    <span>•</span>
                    <span>0 MB Storage</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hand Holding Smartphone Graphics with Fresh Produce (Exact Match) */}
              <div className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[240px] aspect-[9/15] bg-gradient-to-br from-emerald-950 via-[#073b1d] to-[#0f8646] rounded-[36px] p-2.5 shadow-2xl border-4 border-gray-900 flex flex-col justify-between overflow-hidden group">
                  
                  {/* Phone Notch */}
                  <div className="w-14 h-2.5 bg-gray-900 rounded-full mx-auto mb-2" />

                  {/* App Screen Content */}
                  <div className="bg-white rounded-2xl p-2 shadow-xs mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-[#0f8646]">
                        🌿 MyGreenDelight
                      </span>
                      <span className="bg-emerald-100 text-[#0f8646] text-[8px] font-black px-1.5 py-0.2 rounded-full">
                        10 Min
                      </span>
                    </div>
                    <div className="w-full h-18 rounded-xl overflow-hidden bg-gray-100 relative">
                      <img
                        src="/hero_basket.jpg"
                        alt="Produce"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Produce Tiles */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <div className="bg-white/95 rounded-xl p-1.5 text-center shadow-2xs">
                      <span className="text-[9px] font-black text-gray-800 block">
                        🥬 Palak ₹15
                      </span>
                    </div>
                    <div className="bg-white/95 rounded-xl p-1.5 text-center shadow-2xs">
                      <span className="text-[9px] font-black text-gray-800 block">
                        🥛 Gir Milk ₹45
                      </span>
                    </div>
                  </div>

                  {/* App Bottom Bar */}
                  <div className="bg-white rounded-2xl p-2 flex items-center justify-around text-[#0f8646] shadow-xs">
                    <span className="text-[9px] font-black">Home</span>
                    <span className="text-[9px] font-bold text-gray-400">Shop</span>
                    <span className="text-[9px] font-bold text-gray-400">Orders</span>
                    <span className="text-[9px] font-bold text-gray-400">Profile</span>
                  </div>

                  {/* Floating Produce Badge */}
                  <div className="absolute top-1/2 -left-2 bg-yellow-400 text-gray-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md -rotate-6">
                    ⚡ 100% Organic
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
