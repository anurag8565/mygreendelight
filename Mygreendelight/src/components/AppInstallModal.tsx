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
  Monitor,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    openMGDInstallModal?: () => void;
  }
}

export default function AppInstallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "desktop">("android");
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Register Service Worker for PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("PWA SW Active"))
        .catch((err) => console.log("SW Reg Error", err));
    }

    // Detect device type
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActiveTab("ios");
      } else if (/android/.test(ua)) {
        setActiveTab("android");
      } else {
        setActiveTab("desktop");
      }

      // Attach global trigger
      window.openMGDInstallModal = () => setIsOpen(true);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-mgd-install-modal", handleOpen);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("open-mgd-install-modal", handleOpen);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalledSuccess(true);
        setTimeout(() => setIsOpen(false), 2500);
      }
      setDeferredPrompt(null);
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
          className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs font-sans cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="cursor-default bg-[#fdfaf3] rounded-3xl overflow-hidden shadow-2xl border border-amber-200/80 max-w-2xl w-full relative text-gray-900"
          >
            {/* Top Warm Header Strip (Matching Reference Design) */}
            <div className="bg-[#faecd5] px-4 py-3 sm:py-3.5 border-b border-amber-200/80 flex items-center justify-between relative">
              <div className="flex-1 text-center pr-6 pl-2">
                <h3 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Get Your Pure Organic Goodies Now with the</span>
                  <span className="text-[#0f8646] font-black">
                    MyGreenDelight App
                  </span>
                </h3>
              </div>

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
              
              {/* Left Column: Details & Step-by-Step Installation */}
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
                        Fresh Organic Produce • 10-Min Delivery
                      </span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-xl font-black text-gray-900 leading-tight mb-1.5 tracking-tight">
                    Install App on Mobile & Desktop
                  </h2>

                  <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed mb-3.5">
                    <strong>Zero PlayStore fees</strong> & <strong>0 MB storage space</strong> needed! Single click setup for customers & riders.
                  </p>

                  {/* Device Tab Switcher */}
                  <div className="flex items-center bg-amber-100/70 p-1 rounded-2xl mb-4 gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("android")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                        activeTab === "android"
                          ? "bg-white text-[#0f8646] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Smartphone size={12} />
                      <span>Android</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("ios")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                        activeTab === "ios"
                          ? "bg-white text-[#0f8646] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <span>🍎 iPhone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("desktop")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                        activeTab === "desktop"
                          ? "bg-white text-[#0f8646] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Monitor size={12} />
                      <span>PC / Laptop</span>
                    </button>
                  </div>

                  {/* Dynamic Instructions per OS */}
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs mb-4 text-xs font-bold text-gray-800 space-y-2">
                    {activeTab === "android" && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center text-[10px] shrink-0 font-black">
                            1
                          </span>
                          <span>
                            Click <strong>&ldquo;Install App Now&rdquo;</strong> below or Chrome menu (<strong>⋮</strong>).
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center text-[10px] shrink-0 font-black">
                            2
                          </span>
                          <span>
                            Select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                          </span>
                        </div>
                      </>
                    )}

                    {activeTab === "ios" && (
                      <>
                        <div className="flex items-center gap-2">
                          <Share2 size={15} className="text-[#0f8646] shrink-0" />
                          <span>
                            1. Tap the <strong>Share</strong> button [⎋] at bottom of Safari.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PlusSquare size={15} className="text-[#0f8646] shrink-0" />
                          <span>
                            2. Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> [➕].
                          </span>
                        </div>
                      </>
                    )}

                    {activeTab === "desktop" && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center text-[10px] shrink-0 font-black">
                            1
                          </span>
                          <span>
                            Look at top URL Address Bar right side (near Bookmark star).
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center text-[10px] shrink-0 font-black">
                            2
                          </span>
                          <span>
                            Click the <strong>Install App (⊕)</strong> icon to add to desktop.
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Main 1-Click Button */}
                <div>
                  {installedSuccess ? (
                    <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 font-black text-xs text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={16} />
                      <span>🎉 MyGreenDelight App Installed Successfully!</span>
                    </div>
                  ) : deferredPrompt ? (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="w-full py-3.5 px-6 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                    >
                      <Download size={18} className="stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
                      <span>Install App Now (1-Click)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "desktop") {
                          alert("Look at the right side of your Chrome URL address bar and click the (⊕ / Install) icon!");
                        } else if (activeTab === "android") {
                          alert("Tap the 3 dots (⋮) in Chrome menu and tap 'Install App' or 'Add to Home Screen'!");
                        } else {
                          alert("In Safari, tap Share [⎋] and tap 'Add to Home Screen' [+]!");
                        }
                      }}
                      className="w-full py-3.5 px-6 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                    >
                      <Download size={18} className="stroke-[2.5]" />
                      <span>Install App on {activeTab === "android" ? "Android" : activeTab === "ios" ? "iPhone" : "PC"}</span>
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-3 mt-2.5 text-[10px] text-gray-500 font-bold">
                    <span>⚡ 10-Min Fast Orders</span>
                    <span>•</span>
                    <span>🛵 Customers & Riders</span>
                    <span>•</span>
                    <span>0 MB Storage</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Smartphone & Produce Visual Mockup */}
              <div className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[230px] aspect-[9/15] bg-gradient-to-br from-emerald-950 via-[#073b1d] to-[#0f8646] rounded-[34px] p-2.5 shadow-2xl border-4 border-gray-900 flex flex-col justify-between overflow-hidden group">
                  
                  {/* Phone Notch */}
                  <div className="w-14 h-2.5 bg-gray-900 rounded-full mx-auto mb-2" />

                  {/* Mock Screen */}
                  <div className="bg-white rounded-2xl p-2 shadow-xs mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-[#0f8646]">
                        🌿 MyGreenDelight
                      </span>
                      <span className="bg-emerald-100 text-[#0f8646] text-[8px] font-black px-1.5 py-0.2 rounded-full">
                        10 Min
                      </span>
                    </div>
                    <div className="w-full h-16 rounded-xl overflow-hidden bg-gray-100 relative">
                      <img
                        src="/hero_basket.jpg"
                        alt="Produce"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Produce Tiles */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <div className="bg-white/95 rounded-xl p-1.5 text-center">
                      <span className="text-[9px] font-black text-gray-800 block">
                        🥬 Palak ₹15
                      </span>
                    </div>
                    <div className="bg-white/95 rounded-xl p-1.5 text-center">
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

                  {/* Floating Tag */}
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
