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
      badge: "5:00 AM Sunrise Harvest",
      title: "Farm-Fresh Vegetables",
      subtitle: "Direct mandi wholesale rates, delivered in 10-15 mins in Bhopal.",
      btnText: "Order Vegetables",
      link: "/shop?category=Vegetables",
      image: "/banners/veggies_clean_4k.jpg",
      cardBg: "bg-[#eaf6ee]",
      borderColor: "border-emerald-200/90",
      badgeStyle: "bg-emerald-100/90 text-emerald-900 border-emerald-300/60",
      btnStyle: "bg-[#0a3d24] hover:bg-[#072817] text-white",
      offerPill: "MANDI RATES",
      maskGradient: "from-[#eaf6ee] via-[#eaf6ee]/60",
    },
    {
      _id: "s2",
      badge: "100% Naturally Ripe",
      title: "Sweet Seasonal Fruits",
      subtitle: "Crisp apples, bananas, oranges & berries at direct farm rates.",
      btnText: "Buy Fresh Fruits",
      link: "/shop?category=Fruits",
      image: "/banners/fruits_clean_4k.jpg",
      cardBg: "bg-[#fef4e8]",
      borderColor: "border-amber-200/90",
      badgeStyle: "bg-amber-100/90 text-amber-950 border-amber-300/60",
      btnStyle: "bg-[#9a3412] hover:bg-[#7c2d12] text-white",
      offerPill: "SWEET & JUICY",
      maskGradient: "from-[#fef4e8] via-[#fef4e8]/60",
    },
    {
      _id: "s3",
      badge: "100% Chemical Free",
      title: "Exotics & Salad Greens",
      subtitle: "Fresh avocados, broccoli, button mushrooms & exotic herbs.",
      btnText: "Explore Exotics",
      link: "/shop?category=Exotics",
      image: "/banners/exotics_clean_4k.jpg",
      cardBg: "bg-[#eef8f8]",
      borderColor: "border-teal-200/90",
      badgeStyle: "bg-teal-100/90 text-teal-950 border-teal-300/60",
      btnStyle: "bg-[#0f766e] hover:bg-[#115e59] text-white",
      offerPill: "HYDROPONIC",
      maskGradient: "from-[#eef8f8] via-[#eef8f8]/60",
    },
  ];

  // Active slides from DB or default
  const activeSlides = React.useMemo(() => {
    if (!banners || banners.length === 0) return defaultSlides;
    return banners.map((b: any, idx: number) => ({
      _id: b._id || `db-${idx}`,
      badge: b.badge ? b.badge.replace(/[🌿🌱✨⭐🔥🎉]/gu, "").trim() : "5:00 AM Sunrise Harvest",
      title: b.title,
      subtitle: b.subtitle || "Direct mandi wholesale rates, delivered in 10-15 mins.",
      btnText: b.btnText || "Shop Now",
      link: b.link || "/shop",
      image: b.image || "/banners/veggies_clean_4k.jpg",
      cardBg: defaultSlides[idx % defaultSlides.length].cardBg,
      borderColor: defaultSlides[idx % defaultSlides.length].borderColor,
      badgeStyle: defaultSlides[idx % defaultSlides.length].badgeStyle,
      btnStyle: defaultSlides[idx % defaultSlides.length].btnStyle,
      offerPill: b.offerPill || "",
      maskGradient: defaultSlides[idx % defaultSlides.length].maskGradient,
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
        
        {/* Main Hero Card - Bright Quick-Commerce Style & Compact Mobile Height */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 h-[155px] xs:h-[170px] sm:h-[205px] md:h-[235px] border ${slide.borderColor || 'border-stone-200/80'} ${slide.cardBg || 'bg-[#eaf6ee]'}`}
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
              {/* 1. Right-Side Fresh Produce Photography with Soft Blend */}
              <div className="absolute right-0 top-0 bottom-0 w-[42%] xs:w-[45%] sm:w-[46%] md:w-[48%] pointer-events-none select-none overflow-hidden">
                <img
                  src={slide.image || "/banners/veggies_clean_4k.jpg"}
                  alt={`${slide.title || "Fresh Produce"} - SubziQuick Bhopal`}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
                {/* Soft Gradient Mask for Seamless Edge-Blending */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.maskGradient || "from-[#eaf6ee] via-[#eaf6ee]/60"} to-transparent`}
                />
              </div>

              {/* 2. Left Content - Clean Dark Quick-Commerce Typography */}
              <div className="relative z-20 p-3.5 xs:p-4 sm:p-6 md:p-8 flex flex-col justify-between h-full max-w-[62%] xs:max-w-[60%] sm:max-w-[58%]">
                <div>
                  {/* Badge Row */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-1 sm:mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[9.5px] xs:text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${slide.badgeStyle}`}
                    >
                      <Sparkles size={11} className="shrink-0" />
                      <span>{slide.badge}</span>
                    </span>

                    {slide.offerPill && (
                      <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-stone-900 text-white px-1.5 py-0.5 rounded-full">
                        {slide.offerPill}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-base xs:text-lg sm:text-2xl md:text-[28px] font-extrabold text-stone-950 tracking-tight leading-tight line-clamp-1 sm:line-clamp-2">
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm text-stone-600 font-medium line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-snug">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-1">
                  <Link href={slide.link || "/shop"}>
                    <button
                      className={`${slide.btnStyle} px-3.5 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-[11px] sm:text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer`}
                    >
                      <span>{slide.btnText}</span>
                      <ArrowRight size={12} className="stroke-[2.5]" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Smooth Auto-Slide Progress Bar at bottom */}
          {total > 1 && !isPaused && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/5 z-30 overflow-hidden">
              <motion.div
                key={currentSlide}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.5, ease: "linear" }}
                className="h-full bg-[#0a3d24]"
              />
            </div>
          )}

          {/* Desktop Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-sm flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-stone-200/80 active:scale-90"
                title="Previous Slide"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-sm flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-stone-200/80 active:scale-90"
                title="Next Slide"
              >
                <ChevronRight size={17} />
              </button>

              {/* Dots Pagination */}
              <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 z-30 flex items-center gap-1.5 bg-black/10 backdrop-blur-xs px-2 py-0.5 rounded-full border border-black/5">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx, idx > currentSlide ? 1 : -1)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentSlide === idx
                        ? "w-4 h-1.5 bg-stone-900"
                        : "w-1.5 h-1.5 bg-stone-400/80 hover:bg-stone-600"
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
