"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Flame,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  banners?: any[];
}

export default function Hero({ banners = [] }: HeroProps) {
  const defaultSlides = [
    {
      _id: "s1",
      badge: "10-15 Min Express • Bhopal",
      title: "Farm Fresh Vegetables",
      subtitle: "5:00 AM Mandi harvest, handpicked & delivered directly to your kitchen.",
      btnText: "Order Vegetables",
      link: "/shop?category=Vegetables",
      image: "/banners/veggies_clean_4k.jpg",
      bgGradient: "from-stone-950/90 via-stone-950/70 to-transparent",
      accentColor: "#10b981",
      offerPill: "FLAT ₹50 OFF",
      floatingStat: "100% Handpicked Fresh",
    },
    {
      _id: "s2",
      badge: "Naturally Sweet & Ripe",
      title: "Fresh Seasonal Fruits",
      subtitle: "Crisp apples, sweet bananas & fresh citrus at direct wholesale rates.",
      btnText: "Buy Fresh Fruits",
      link: "/shop?category=Fruits",
      image: "/banners/fruits_clean_4k.jpg",
      bgGradient: "from-stone-950/90 via-stone-950/70 to-transparent",
      accentColor: "#f59e0b",
      offerPill: "WHOLESALE RATES",
      floatingStat: "Naturally Sweet & Ripe",
    },
    {
      _id: "s3",
      badge: "Hydroponic & Clean",
      title: "Exotics & Fresh Greens",
      subtitle: "Avocados, broccoli, lettuce, mushrooms & fresh herbs.",
      btnText: "Explore Exotics",
      link: "/shop?category=Exotics",
      image: "/banners/exotics_clean_4k.jpg",
      bgGradient: "from-stone-950/90 via-stone-950/70 to-transparent",
      accentColor: "#2dd4bf",
      offerPill: "PESTICIDE FREE",
      floatingStat: "Daily Fresh Harvest",
    },
  ];

  // Active slides from DB or default
  const activeSlides = React.useMemo(() => {
    if (!banners || banners.length === 0) return defaultSlides;
    return banners.map((b: any, idx: number) => ({
      _id: b._id || `db-${idx}`,
      badge: b.badge ? b.badge.replace(/[🌿🌱✨⭐🔥🎉]/gu, "").trim() : "10-15 Min Express • Bhopal",
      title: b.title,
      subtitle: b.subtitle || "Handpicked fresh produce delivered to your doorstep.",
      btnText: b.btnText || "Shop Now",
      link: b.link || "/shop",
      image: b.image || "/banners/veggies_clean_4k.jpg",
      bgGradient: b.bgGradient || "from-stone-950/90 via-stone-950/70 to-transparent",
      accentColor: b.accentColor || "#10b981",
      offerPill: b.offerPill || "",
      floatingStat: b.floatingStat || "100% Farm Fresh",
    }));
  }, [banners]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const total = activeSlides.length;

  const goToSlide = useCallback(
    (index: number, newDirection: number = 1) => {
      setDirection(newDirection);
      setCurrentSlide((index + total) % total);
    },
    [total]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1, 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1, -1);
  }, [currentSlide, goToSlide]);

  // Auto-slide every 5.5 seconds unless hovered/touched
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStart(null);
  };

  // Motion variants for smooth sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.02,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 280, damping: 32 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.45 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-30%" : "30%",
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 280, damping: 32 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <section className="w-full bg-[#faf9f5] pt-2 sm:pt-3.5 pb-2 sm:pb-3 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        
        {/* Main Hero Banner Card - Mobile Optimized Height */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-shadow duration-300 group bg-stone-950 h-[225px] xs:h-[245px] sm:h-[300px] md:h-[350px] lg:h-[380px] border border-stone-200/60"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={slide._id || currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full flex items-center overflow-hidden select-none"
            >
              {/* 1. Fresh Produce Background Image */}
              <img
                src={slide.image || "/banners/veggies_clean_4k.jpg"}
                alt={`${slide.title || "Fresh Produce"} - SubziQuick Bhopal`}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />

              {/* 2. Gradient Overlay for Crisp Typography & Vibrant Image Reveal */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-stone-950/15 sm:via-stone-950/55 z-10"
              />

              {/* 3. Hero Content - Mobile First Layout */}
              <div className="relative z-20 p-4 xs:p-5 sm:p-7 md:p-10 lg:p-12 flex flex-col items-start max-w-[280px] xs:max-w-xs sm:max-w-lg md:max-w-xl">
                
                {/* Trust Badge & Offer Pill */}
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5 sm:mb-2.5">
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/25">
                    <Sparkles size={11} className="text-emerald-300 shrink-0" />
                    <span>
                      {(slide.badge || "10-15 Min Express • Bhopal")
                        .replace(/[🌿🌱✨⭐🔥🎉]/gu, "")
                        .trim()}
                    </span>
                  </div>

                  {slide.offerPill && (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-stone-950 text-[9.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      <span>{slide.offerPill.replace(/[🌿🌱✨⭐🔥🎉]/gu, "").trim()}</span>
                    </span>
                  )}
                </div>

                {/* Hero Title */}
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight drop-shadow-sm mb-1 sm:mb-2">
                  {slide.title}
                </h1>

                {/* Hero Subtitle */}
                <p className="text-[11px] xs:text-xs sm:text-sm text-stone-200/90 font-normal leading-relaxed line-clamp-2 drop-shadow-xs max-w-[250px] xs:max-w-xs sm:max-w-md mb-3 sm:mb-4.5">
                  {slide.subtitle || "Handpicked fresh produce delivered straight to your doorstep."}
                </p>

                {/* Action CTA Button - High Contrast White Pill */}
                <Link href={slide.link || "/shop"}>
                  <button className="bg-white hover:bg-stone-100 text-stone-950 font-bold px-4 xs:px-4.5 sm:px-6 py-1.5 xs:py-2 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer">
                    <span>{slide.btnText || "Shop Now"}</span>
                    <ArrowRight size={13} className="text-stone-800" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Smooth Auto-Slide Progress Bar at bottom */}
          {total > 1 && !isPaused && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/15 z-30 overflow-hidden">
              <motion.div
                key={currentSlide}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.5, ease: "linear" }}
                className="h-full bg-emerald-400"
              />
            </div>
          )}

          {/* Desktop Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/20 shadow-md active:scale-90"
                title="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/20 shadow-md active:scale-90"
                title="Next Slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots Pagination */}
              <div className="absolute bottom-2.5 sm:bottom-3.5 right-3 sm:right-4 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx, idx > currentSlide ? 1 : -1)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentSlide === idx
                        ? "w-5 h-1.5 bg-white shadow-xs"
                        : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
