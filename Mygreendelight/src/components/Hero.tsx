"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  banners?: any[];
}

export default function Hero({ banners = [] }: HeroProps) {
  const defaultSlides = [
    {
      _id: "s1",
      badge: "⚡ 10-15 Min Express Delivery",
      title: "Sunrise Harvested Farm Vegetables & Fruits",
      subtitle: "100% Ozone-Washed • Direct from Local Bhopal & Sehore Farms",
      btnText: "Shop Fresh Produce",
      link: "/shop?category=Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-emerald-950/95 via-emerald-900/80 to-transparent/20",
    },
    {
      _id: "s2",
      badge: "🏷️ Bhopal Mandi Fair Rates",
      title: "Direct Kisan Mandi Rates — Zero Middlemen",
      subtitle: "Daily Live Mandi Rate Updates • Transparent Fair Prices For Bhopal",
      btnText: "Explore Mandi Harvest",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-amber-950/95 via-orange-950/80 to-transparent/20",
    },
    {
      _id: "s3",
      badge: "🥛 100% Pure Organic Dairy",
      title: "Pure Desi A2 Cow Milk & Golden Bilona Ghee",
      subtitle: "Fresh Morning Batch Delivered in 10-15 Mins • 100% Pure & Organic",
      btnText: "Shop Pure Dairy",
      link: "/shop?category=Dairy%20%26%20Staples",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-sky-950/95 via-blue-950/80 to-transparent/20",
    },
    {
      _id: "s4",
      badge: "🥑 Hydroponic & Exotics",
      title: "Hydroponic Greens & Exotic Salads",
      subtitle: "Crisp Lettuce, Cherry Tomatoes, Avocados & Fresh Culinary Herbs",
      btnText: "Shop Exotics",
      link: "/shop?category=Exotics",
      image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-teal-950/95 via-emerald-950/80 to-transparent/20",
    },
  ];

  const activeSlides = banners && banners.length > 0 ? banners : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-slide every 5.5 seconds
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    } else if (diff < -45) {
      setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
    setTouchStart(null);
  };

  return (
    <div className="w-full bg-white pt-2.5 sm:pt-4 pb-1.5 sm:pb-3">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(15,134,70,0.14)] transition-all duration-500 group bg-gray-950 h-[210px] xs:h-[235px] sm:h-[285px] md:h-[330px] lg:h-[360px] border border-gray-100/60"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide._id || currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex items-center overflow-hidden"
            >
              {/* 1. Full-Bleed HD Produce Background Image */}
              <img
                src={slide.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=85"}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
              />

              {/* 2. Glass Dark Radial & Directional Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  slide.bgGradient || "from-black/95 via-black/75 to-transparent/20"
                } z-10`}
              />

              {/* 3. Hero Content Typography */}
              <div className="relative z-20 p-4 sm:p-8 md:p-12 lg:p-14 flex flex-col items-start max-w-xl sm:max-w-2xl">
                {/* Micro Badge */}
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[9.5px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 sm:mb-3 border border-white/30 shadow-xs">
                  <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                  <span>{slide.badge || "⚡ 10-15 Min Express Delivery"}</span>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-[40px] font-black leading-tight sm:leading-[1.15] tracking-tight text-white drop-shadow-md mb-1.5 sm:mb-2.5 line-clamp-2">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-[11px] sm:text-sm text-emerald-100/90 font-medium mb-3.5 sm:mb-6 line-clamp-2 drop-shadow-xs max-w-md sm:max-w-lg leading-relaxed">
                  {slide.subtitle || slide.desc || "100% Ozone-Washed & Chemical-Free produce sourced daily from local contract farms."}
                </p>

                {/* High-Converting CTA Button */}
                <Link href={slide.link || "/shop"}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/40 hover:shadow-emerald-900/50"
                  >
                    <span>{slide.btnText || "Shop Fresh Produce"}</span>
                    <ArrowRight size={14} className="stroke-[2.5]" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {activeSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/25 shadow-md active:scale-95"
                title="Previous Slide"
              >
                <ChevronLeft size={20} className="stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/25 shadow-md active:scale-95"
                title="Next Slide"
              >
                <ChevronRight size={20} className="stroke-[2.5]" />
              </button>

              {/* Dots Pagination */}
              <div className="absolute bottom-3.5 right-4 z-30 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
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
    </div>
  );
}
