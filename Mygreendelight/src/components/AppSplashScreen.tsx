"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Zap, Leaf } from "lucide-react";

export default function AppSplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ⚡ Session-only check: only play once per browsing session
    try {
      const alreadyViewed = sessionStorage.getItem("szq_splash_viewed_v1");
      if (!alreadyViewed) {
        setIsVisible(true);
        // Lock body scroll while splash is active
        document.body.style.overflow = "hidden";
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Smooth loading line progress animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    // Auto dismiss after 1.55 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 1550);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(dismissTimer);
    };
  }, [isVisible]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem("szq_splash_viewed_v1", "true");
    } catch {}
    document.body.style.overflow = "";
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="subziquick-splash"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-gradient-to-b from-[#031c10] via-[#0a3d24] to-[#02130a] text-white font-sans overflow-hidden select-none cursor-pointer"
        >
          {/* Ambient Luxury Glow Orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Skip Hint */}
          <div className="w-full pt-6 sm:pt-8 px-6 flex justify-end relative z-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-300/60 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              Tap to Skip
            </span>
          </div>

          {/* Centerpiece: Animated Logo, Rings & Minimalist Brand Name */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 -mt-6">
            
            {/* Pulsing Concentric Radar Rings Behind Logo */}
            <div className="relative mb-5 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1, 1.55, 1.9], opacity: [0.6, 0.25, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-28 h-28 rounded-full border border-emerald-400/40 pointer-events-none"
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1, 1.35, 1.6], opacity: [0.7, 0.3, 0] }}
                transition={{ duration: 1.8, delay: 0.35, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-28 h-28 rounded-full border border-amber-400/30 pointer-events-none"
              />

              {/* Master Logo Icon with Spring Scale & Glow */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 22,
                  delay: 0.1,
                }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-stone-950 via-[#072d1a] to-emerald-800 p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.55)] border-2 border-emerald-400/40 flex items-center justify-center"
              >
                <Image
                  src="/logo-icon.png"
                  alt="SubziQuick Emblem"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  priority
                  unoptimized
                />

                {/* Sparkling corner micro-badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.45, type: "spring" }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 flex items-center justify-center shadow-md border border-white"
                >
                  <Sparkles size={11} className="fill-stone-950" />
                </motion.div>
              </motion.div>
            </div>

            {/* Brand Wordmark (Serif + Modern Luxury) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="flex items-baseline justify-center font-[family-name:var(--font-brand-serif),serif]"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                SubziQuick
              </h1>
              <span className="text-amber-400 font-black text-xl sm:text-2xl ml-1 font-heading">
                .in
              </span>
            </motion.div>

            {/* Single Elegant Tagline */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.05em" }}
              animate={{ opacity: 1, letterSpacing: "0.22em" }}
              transition={{ delay: 0.42, duration: 0.55 }}
              className="text-[10.5px] sm:text-xs font-bold uppercase text-emerald-200/90 mt-2 font-heading"
            >
              BHOPAL • FARM FRESH IN 10-15 MINS
            </motion.p>

            {/* Micro Badges (Minimal, zero clutter) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.45 }}
              className="flex items-center gap-2 mt-4 flex-wrap justify-center"
            >
              <span className="bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                <Zap size={11} className="text-amber-400 fill-amber-400" />
                <span>10-15 Min Express</span>
              </span>

              <span className="bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                <Leaf size={11} className="text-emerald-300" />
                <span>100% Farm-Fresh Daily</span>
              </span>
            </motion.div>
          </div>

          {/* Bottom Luxury Progress Fill Bar */}
          <div className="w-full max-w-xs px-6 pb-8 sm:pb-12 relative z-10">
            <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-300 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-emerald-300/70 font-semibold mt-2 tracking-wider">
              <span>INITIALIZING TAZEE SABZI</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
