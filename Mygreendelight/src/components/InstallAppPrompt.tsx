"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Download, X, Smartphone, Sparkles, Zap, ShieldCheck, Share, PlusSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / standalone
    if (typeof window === "undefined") return;

    const isApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    if (isApp) {
      setIsStandalone(true);
      return;
    }

    // 2. Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isAppleDevice && /webkit/.test(userAgent) && !/crios|fxios|opios/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 3. Check dismissal in current session or last 12 hours
    const dismissedTime = localStorage.getItem("subziquick_pwa_dismissed");
    const isRecentlyDismissed = dismissedTime && Date.now() - Number(dismissedTime) < 12 * 60 * 60 * 1000;

    // 4. Capture native install prompt (Prevents Chrome's disappearing 3-second auto-bar)
    const handleBeforeInstall = (e: any) => {
      e.preventDefault(); // STOP Chrome from showing temporary auto-disappearing mini-infobar!
      setDeferredPrompt(e);
      (window as any).__subziquickInstallPrompt = e;

      // Show our persistent custom popup after 1.5 seconds unless recently dismissed
      if (!isRecentlyDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If iOS Safari and not dismissed, show prompt after 2.5 seconds
    if (isSafari && !isRecentlyDismissed) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
    }

    // 5. Allow any button on the site to trigger this prompt
    const handleManualTrigger = () => {
      setShowPrompt(true);
    };
    window.addEventListener("trigger-pwa-install", handleManualTrigger);

    // 6. Handle app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setIsStandalone(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("trigger-pwa-install", handleManualTrigger);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS step-by-step installation instructions modal
      setShowIOSGuide(true);
      return;
    }

    const promptEvent = deferredPrompt || (typeof window !== "undefined" && (window as any).__subziquickInstallPrompt);

    if (!promptEvent) {
      // If browser doesn't support direct prompt, guide the user
      alert("To install SubziQuick: Tap your browser's 3-dot menu (⋮) at top right and select 'Add to Home screen' or 'Install app'.");
      setShowPrompt(false);
      return;
    }

    try {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
      (window as any).__subziquickInstallPrompt = null;
    } catch (err) {
      console.warn("Install prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("subziquick_pwa_dismissed", String(Date.now()));
  };

  if (isStandalone) return null;

  return (
    <>
      {/* ================= PERSISTENT APP INSTALL POPUP ================= */}
      <AnimatePresence>
        {showPrompt && !showIOSGuide && (
          <motion.div
            initial={{ y: 120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[380px] z-50 font-sans"
          >
            <div className="bg-gradient-to-br from-[#051f12] via-[#0a3d24] to-[#072817] text-white p-4 sm:p-5 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.35)] border border-emerald-500/30 relative overflow-hidden backdrop-blur-xl">
              
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/25 hover:bg-black/40 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                aria-label="Close Install Prompt"
              >
                <X size={15} />
              </button>

              {/* Header Row: App Icon & Brand Name */}
              <div className="flex items-center gap-3 pr-6 mb-3">
                <div className="w-13 h-13 rounded-2xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center border border-white/40">
                  <img
                    src="/icon.png"
                    alt="SubziQuick App Icon"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-tight">
                      SubziQuick App
                    </h3>
                    <span className="bg-amber-400 text-gray-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Free App
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90 font-medium leading-tight mt-0.5">
                    Online Fresh Vegetable & Fruit Delivery
                  </p>
                </div>
              </div>

              {/* Quick Perks Strip */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-[10.5px] font-bold text-emerald-100 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5">
                  <Zap size={13} className="text-amber-300 shrink-0" />
                  <span>10-15 Min Express</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-300 shrink-0" />
                  <span>Direct Store Rates</span>
                </div>
              </div>

              {/* Install Action Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 relative overflow-hidden bg-white hover:bg-emerald-50 text-[#0a3d24] py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                >
                  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
                  <Download size={15} className="stroke-[2.5]" />
                  <span>Install App on Phone</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-[11px] font-bold text-emerald-200 hover:text-white px-2.5 py-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Not Now
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= IOS STEP-BY-STEP INSTALL GUIDE MODAL ================= */}
      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-gray-900 shadow-2xl border border-gray-100 text-left font-sans"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/icon.png" alt="SubziQuick" className="w-8 h-8 rounded-lg shadow-2xs" />
                  <h3 className="font-black text-base text-gray-900">
                    Install on iPhone
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-gray-700">
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="w-7 h-7 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">Share Icon Par Tap Karein</span>
                    Safari browser ke neeche center mein <Share size={13} className="inline mx-1 text-blue-600" /> Share button dabayein.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="w-7 h-7 rounded-xl bg-[#0a3d24] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">&quot;Add to Home Screen&quot; Chuney</span>
                    Menu me thoda neeche scroll karein aur <PlusSquare size={13} className="inline mx-1 text-[#0a3d24]" /> <strong>Add to Home Screen</strong> select karein.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="w-7 h-7 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">Top-Right &quot;Add&quot; Par Tap Karein</span>
                    SubziQuick app aapki iPhone Home Screen par install ho jayegi!
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full bg-[#0a3d24] hover:bg-[#072817] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Samajh Gaya (Done)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
