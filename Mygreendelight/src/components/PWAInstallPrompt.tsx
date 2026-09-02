"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Sparkles, Smartphone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("mgd_pwa_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 1000 * 60 * 60 * 24 * 3) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show prompt after 3 seconds on iOS if not dismissed
    if (isIosDevice && !isInstalled) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSModal(false);
    localStorage.setItem("mgd_pwa_dismissed", Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-20 sm:bottom-6 left-3.5 right-3.5 sm:left-auto sm:right-6 sm:max-w-sm z-[80] bg-gradient-to-r from-emerald-950 via-[#073b1d] to-[#0f8646] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-emerald-400/30 font-sans backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2.5 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#0f8646] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                  🌿
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-xs sm:text-sm text-white">
                      Install MyGreenDelight
                    </h4>
                    <span className="bg-amber-400 text-gray-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      Fast 10m
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-green-100/90 font-medium">
                    1-Tap home screen app for instant orders
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition cursor-pointer"
                title="Dismiss"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstall}
                className="flex-1 bg-white hover:bg-amber-300 text-gray-950 font-black text-xs py-2 px-3 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Download size={13} className="stroke-[2.5]" />
                <span>Install App Free</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-[11px] text-green-200 hover:text-white font-bold px-2 py-1 transition cursor-pointer"
              >
                Not Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Safari Installation Guide Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div
            onClick={() => setShowIOSModal(false)}
            className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-xs cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 relative text-gray-900 cursor-default animate-in slide-in-from-bottom duration-200"
            >
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                <X size={16} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#0f8646] flex items-center justify-center mb-3 mx-auto">
                <Smartphone size={24} />
              </div>

              <h3 className="text-base font-black text-center text-gray-900 mb-1">
                Install on iPhone & iPad
              </h3>
              <p className="text-xs text-gray-500 text-center mb-4">
                Follow 2 simple steps in Safari to add MyGreenDelight to your Home Screen:
              </p>

              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs font-bold text-gray-800 mb-5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0f8646] text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> icon (square with arrow up) at the bottom of Safari.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0f8646] text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> (➕ icon).
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 bg-[#0f8646] text-white font-black text-xs rounded-xl shadow-md cursor-pointer hover:bg-[#0c6a38] transition"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
