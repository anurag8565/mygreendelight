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
      badge: "🌿 Sunrise Farm Harvest • 10-15 Min Express",
      title: "Direct From Local Bhopal & Sehore Farms",
      subtitle: "100% Ozone-Washed, Handpicked Vegetables & Fruits Delivered Fresh.",
      btnText: "Order Fresh Produce",
      link: "/shop?category=Vegetables",
      image: "/banners/veggies_clean_4k.jpg",
      bgGradient: "from-[#032010]/95 via-[#064e3b]/85 to-transparent/30",
      accentColor: "#10b981",
      offerPill: "FLAT ₹50 OFF • CODE: FRESH50",
      floatingStat: "🌱 5:00 AM Fresh Harvest",
    },
    {
      _id: "s2",
      badge: "🍎 Juicy Orchards • 100% Naturally Sweet",
      title: "Handpicked Premium Seasonal Fruits",
      subtitle: "Crisp Apples, Sweet Mangoes, Pomegranates & Farm Fresh Citrus.",
      btnText: "Explore Fresh Fruits",
      link: "/shop?category=Fruits",
      image: "/banners/fruits_clean_4k.jpg",
      bgGradient: "from-[#381303]/95 via-[#7c2d12]/85 to-transparent/30",
      accentColor: "#f59e0b",
      offerPill: "SWEET & JUICY GUARANTEE",
      floatingStat: "🍎 100% Wax & Carbide Free",
    },
    {
      _id: "s3",
      badge: "🥑 Hydroponic & Gourmet Exotics",
      title: "Crisp Hydroponic Greens & Exotic Salads",
      subtitle: "Fresh Iceberg, Cherry Tomatoes, Avocados, Herbs & European salad mixes.",
      btnText: "Explore Exotics",
      link: "/shop?category=Exotics",
      image: "/banners/exotics_clean_4k.jpg",
      bgGradient: "from-[#0f3a36]/95 via-[#115e59]/85 to-transparent/30",
      accentColor: "#2dd4bf",
      offerPill: "PESTICIDE FREE CERTIFIED",
      floatingStat: "🥑 Gourmet Fresh Daily",
    },
  ];

  // Active slides from DB or default
  const activeSlides = React.useMemo(() => {
    if (!banners || banners.length === 0) return defaultSlides;
    return banners.map((b: any, idx: number) => ({
      _id: b._id || `db-${idx}`,
      badge: b.badge || "🌿 Sunrise Farm Harvest • Express",
      title: b.title,
      subtitle: b.subtitle || "100% Ozone-Washed & Fresh produce delivered to your doorstep.",
      btnText: b.btnText || "Shop Now",
      link: b.link || "/shop",
      image: b.image || "/banners/veggies_clean_4k.jpg",
      bgGradient: b.bgGradient || "from-[#032010]/95 via-[#064e3b]/85 to-transparent/30",
      accentColor: b.accentColor || "#10b981",
      offerPill: b.offerPill || "",
      floatingStat: b.floatingStat || "🌱 100% Farm Fresh",
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
      scale: 1.04,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 260, damping: 30 },
        opacity: { duration: 0.45 },
        scale: { duration: 0.6 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-30%" : "30%",
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: "spring" as const, stiffness: 260, damping: 30 },
        opacity: { duration: 0.35 },
      },
    }),
  };

  return (
    <section className="w-full bg-gradient-to-b from-emerald-50/40 via-white to-white pt-2.5 sm:pt-4 pb-2 sm:pb-3 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Main Luxury Hero Banner Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_45px_rgba(15,134,70,0.22)] transition-shadow duration-500 group bg-gray-950 h-[245px] xs:h-[270px] sm:h-[330px] md:h-[380px] lg:h-[410px] border border-gray-100"
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
              {/* 1. 4K Produce Background Image with Smooth Subtle Ken-Burns Zoom */}
              <motion.img
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "easeOut" }}
                src={slide.image || "/banners/veggies_clean_4k.jpg"}
                alt={slide.title}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />

              {/* 2. Multi-layer High-Contrast Gradient Mask for 100% Typography Crispness */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  slide.bgGradient || "from-black/95 via-black/80 to-transparent/30"
                } z-10`}
              />

              {/* Ambient Glowing Emerald Soft Spotlight */}
              <div
                style={{ backgroundColor: slide.accentColor || "#10b981" }}
                className="absolute top-0 left-0 w-80 h-80 opacity-20 rounded-full blur-3xl pointer-events-none z-10 transition-colors duration-700"
              />

              {/* 3. Hero Animated Content */}
              <div className="relative z-20 p-4 sm:p-8 md:p-12 lg:p-14 flex flex-col items-start max-w-xl sm:max-w-2xl">
                
                {/* Micro Offer & Quality Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 flex-wrap mb-2 sm:mb-3"
                >
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[9.5px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-xs">
                    <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                    <span>{slide.badge || "🌿 Farm Fresh • Express Delivery"}</span>
                  </div>

                  {slide.offerPill && (
                    <span className="hidden xs:inline-flex items-center gap-1 bg-amber-400 text-gray-950 text-[9px] sm:text-[10.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      <Flame size={11} className="fill-amber-950" />
                      <span>{slide.offerPill}</span>
                    </span>
                  )}
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.45 }}
                  className="text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-black leading-tight sm:leading-[1.12] tracking-tight text-white drop-shadow-md mb-1.5 sm:mb-2.5 line-clamp-2"
                >
                  {slide.title}
                </motion.h1>

                {/* Hero Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.45 }}
                  className="text-[11.5px] sm:text-sm text-emerald-100/95 font-medium mb-4 sm:mb-6 line-clamp-2 drop-shadow-sm max-w-md sm:max-w-lg leading-relaxed"
                >
                  {slide.subtitle || "100% Ozone-Washed & Chemical-Free produce sourced daily from local contract farms."}
                </motion.p>

                {/* Action CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.45 }}
                  className="flex items-center gap-3 flex-wrap"
                >
                  <Link href={slide.link || "/shop"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-emerald-300/40 hover:shadow-emerald-950/60"
                    >
                      <span>{slide.btnText || "Shop Fresh Produce"}</span>
                      <ArrowRight size={15} className="stroke-[2.5]" />
                    </motion.button>
                  </Link>

                  <Link
                    href="/shop"
                    className="hidden sm:inline-flex items-center gap-1.5 text-white/90 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-md px-4 py-2.5 rounded-full font-bold text-xs border border-white/25 transition"
                  >
                    <Zap size={13} className="text-amber-300" />
                    <span>Explore 150+ Items</span>
                  </Link>
                </motion.div>
              </div>

              {/* Right Floating Glassmorphic Certified Badges (Desktop) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="hidden md:flex flex-col gap-2.5 absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="bg-black/40 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/25 text-emerald-300 flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-200/80 uppercase font-black tracking-wider block">
                      SubziQuick Certified
                    </span>
                    <span className="text-xs font-black text-white">
                      {slide.floatingStat || "100% Ozone Washed & Fresh"}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
                  className="bg-black/40 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/25 text-amber-300 flex items-center justify-center font-bold">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-200/80 uppercase font-black tracking-wider block">
                      Bhopal Express
                    </span>
                    <span className="text-xs font-black text-white">
                      10-15 Min Doorstep Delivery
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Smooth Auto-Slide Progress Bar at bottom */}
          {total > 1 && !isPaused && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15 z-30 overflow-hidden">
              <motion.div
                key={currentSlide}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.5, ease: "linear" }}
                className="h-full bg-emerald-400"
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/25 shadow-md active:scale-90"
                title="Previous Slide"
              >
                <ChevronLeft size={22} className="stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/25 shadow-md active:scale-90"
                title="Next Slide"
              >
                <ChevronRight size={22} className="stroke-[2.5]" />
              </button>

              {/* Dots Pagination */}
              <div className="absolute bottom-3 sm:bottom-4 right-4 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx, idx > currentSlide ? 1 : -1)}
                    className={`transition-all rounded-full cursor-pointer ${
                      currentSlide === idx
                        ? "w-6 h-1.5 bg-white shadow-xs"
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
