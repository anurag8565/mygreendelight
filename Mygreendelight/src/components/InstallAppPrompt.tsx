"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed / running in standalone mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    const dismissed = localStorage.getItem("pwa_prompt_dismissed");
    if (dismissed && Date.now() - Number(dismissed) < 24 * 60 * 60 * 1000) {
      return; // Dismissed in last 24h
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3 seconds after page load before showing prompt
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instructions for iOS/Safari
      alert("To install on iOS: Tap the Share button at the bottom of Safari, then choose 'Add to Home Screen' (+).");
      setShowPrompt(false);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_prompt_dismissed", String(Date.now()));
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 bg-gradient-to-r from-green-950 via-[#0c592f] to-[#0f8646] text-white p-4 rounded-2xl shadow-2xl border border-green-400/30 flex items-center justify-between gap-3 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white text-[#0f8646] flex items-center justify-center font-black shadow-md shrink-0">
            <Smartphone size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white">Install SubziQuick App</span>
              <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Fast
              </span>
            </div>
            <p className="text-[11px] text-green-100/90 leading-tight mt-0.5">
              1-tap access & lightning-fast grocery deliveries in Bhopal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3.5 py-2 bg-white hover:bg-green-50 text-[#0f8646] rounded-xl font-black text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
          >
            <Download size={13} />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
