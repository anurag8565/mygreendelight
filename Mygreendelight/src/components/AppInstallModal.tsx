"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  X,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Zap,
  Gift,
  ShieldCheck,
  Share2,
  PlusSquare,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppInstallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("MGD PWA SW registered"))
        .catch((err) => console.log("MGD SW registration failed", err));
    }

    // Check if already installed
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true)
    ) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Listen for custom trigger to open modal from anywhere in the app
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("open-mgd-install-modal", handleOpenModal);

    // Capture browser install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto-open after 4 seconds on first visit if not dismissed recently
      const dismissed = localStorage.getItem("mgd_install_modal_dismissed");
      if (!dismissed || Date.now() - Number(dismissed) > 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          setIsOpen(true);
        }, 4000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Auto-open on iOS after 4 seconds if not dismissed
    if (isIosDevice && !isStandalone) {
      const dismissed = localStorage.getItem("mgd_install_modal_dismissed");
      if (!dismissed || Date.now() - Number(dismissed) > 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          setIsOpen(true);
        }, 4000);
      }
    }

    return () => {
      window.removeEventListener("open-mgd-install-modal", handleOpenModal);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // iOS doesn't support programmatic beforeinstallprompt; user follows manual steps shown in modal
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalledSuccess(true);
        setTimeout(() => setIsOpen(false), 2500);
      }
      setDeferredPrompt(null);
    } else {
      // Direct fallback
      alert(
        "To install on desktop or mobile: Click the (⊕ / Install) button in your browser address bar or menu!"
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("mgd_install_modal_dismissed", String(Date.now()));
  };

  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs font-sans cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="cursor-default bg-[#fdfaf3] rounded-3xl overflow-hidden shadow-2xl border border-amber-200/80 max-w-2xl w-full relative text-gray-900"
          >
            {/* Top Warm Banner Header (Matching Reference Design) */}
            <div className="bg-[#faecd5] px-4 py-3 sm:py-3.5 border-b border-amber-200/80 flex items-center justify-between relative">
              <div className="flex-1 text-center pr-6 pl-2">
                <h3 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Get Your Pure Organic Goodies Now with the</span>
                  <span className="text-[#0f8646] font-black">
                    MyGreenDelight App
                  </span>
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-[#8b5a2b] hover:bg-black text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 absolute right-3 top-1/2 -translate-y-1/2"
                title="Close"
              >
                <X size={16} className="stroke-[3]" />
              </button>
            </div>

            {/* Main Modal Body */}
            <div className="p-4 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
              
              {/* Left Column: Details & 1-Click Install CTA */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Brand Tag */}
                  <div className="flex items-center gap-2 mb-2">
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

                  <h2 className="text-base sm:text-2xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                    Get Bhopal&apos;s Purest Mandi Produce on the App
                  </h2>

                  <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                    Install in 1-click on your phone or PC with <strong>Zero PlayStore fees</strong> & <strong>0 MB storage space</strong>!
                  </p>

                  {/* Benefit Perks Checklist */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-white p-2 rounded-xl border border-amber-200/60 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center shrink-0">
                        <Zap size={11} className="stroke-[3]" />
                      </div>
                      <span>⚡ 10-15 Min Express Direct Farm Deliveries</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-white p-2 rounded-xl border border-amber-200/60 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Gift size={11} className="stroke-[3]" />
                      </div>
                      <span>🎁 Instant ₹50 Cashback in MGD Green Wallet</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-white p-2 rounded-xl border border-amber-200/60 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Truck size={11} className="stroke-[3]" />
                      </div>
                      <span>🛵 Perfect for Customers & Delivery Riders</span>
                    </div>
                  </div>
                </div>

                {/* Installation Button / iOS Instructions */}
                <div>
                  {installedSuccess ? (
                    <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 font-black text-xs text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>🎉 MyGreenDelight App Installed Successfully!</span>
                    </div>
                  ) : isIOS ? (
                    <div className="bg-white p-3.5 rounded-2xl border border-amber-300/80 shadow-xs text-xs space-y-2">
                      <span className="font-black text-gray-900 block text-[11px] uppercase tracking-wider text-emerald-800">
                        📱 2 Quick Steps for iPhone & iPad:
                      </span>
                      <div className="flex items-center gap-2 text-gray-700 font-bold">
                        <Share2 size={15} className="text-[#0f8646] shrink-0" />
                        <span>1. Tap <strong>Share</strong> button at bottom of Safari</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 font-bold">
                        <PlusSquare size={15} className="text-[#0f8646] shrink-0" />
                        <span>2. Select <strong>&ldquo;Add to Home Screen&rdquo;</strong> (+)</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="w-full py-3.5 px-6 bg-[#3d7a22] hover:bg-[#2f6019] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                    >
                      <Download size={18} className="stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
                      <span>Install App Now (1-Click)</span>
                    </button>
                  )}

                  {/* Device Compatibility Footnote */}
                  <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-gray-500 font-bold">
                    <span>✓ Android</span>
                    <span>•</span>
                    <span>✓ iOS iPhone</span>
                    <span>•</span>
                    <span>✓ Windows & Mac Desktop</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Smartphone & Produce Visual Mockup */}
              <div className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[240px] aspect-[9/15] bg-gradient-to-br from-emerald-950 via-[#073b1d] to-[#0f8646] rounded-[36px] p-2.5 shadow-2xl border-4 border-gray-900 flex flex-col justify-between overflow-hidden group">
                  
                  {/* Phone Speaker Notch */}
                  <div className="w-16 h-3 bg-gray-900 rounded-full mx-auto mb-2" />

                  {/* Screen Header */}
                  <div className="bg-white/95 rounded-2xl p-2.5 shadow-xs mb-2">
                    <div className="flex items-center justify-between mb-1.5">
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
                        alt="Fresh Produce"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Mini Grid in Screen */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <div className="bg-white/90 rounded-xl p-1.5 text-center">
                      <span className="text-[9px] font-black text-gray-800 block">
                        🥬 Palak ₹15
                      </span>
                    </div>
                    <div className="bg-white/90 rounded-xl p-1.5 text-center">
                      <span className="text-[9px] font-black text-gray-800 block">
                        🥛 Gir Milk ₹45
                      </span>
                    </div>
                  </div>

                  {/* Bottom App Navigation Mock */}
                  <div className="bg-white rounded-2xl p-2 flex items-center justify-around text-[#0f8646] shadow-xs">
                    <span className="text-[9px] font-black">Home</span>
                    <span className="text-[9px] font-bold text-gray-400">Shop</span>
                    <span className="text-[9px] font-bold text-gray-400">Orders</span>
                    <span className="text-[9px] font-bold text-gray-400">Profile</span>
                  </div>

                  {/* Floating Produce Badge */}
                  <div className="absolute top-1/2 -left-2 bg-yellow-400 text-gray-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md -rotate-6">
                    ⚡ 0 MB Storage
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
