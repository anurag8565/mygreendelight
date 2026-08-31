"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  banners?: any[];
}

export default function Hero({ banners = [] }: HeroProps) {
  const defaultSlides = [
    {
      _id: "s1",
      badge: "🎉 FIRST ORDER SPECIAL OFFER",
      badgeClass: "bg-white text-[#ff5e36]",
      title: "Flat 20% OFF",
      subtitle: "on All Grocery Essentials",
      codeText: "Use Code:",
      codeHighlight: "WELCOME20",
      btnText: "Claim 20% Discount",
      link: "/shop",
      bgGradient: "from-[#ff5722] via-[#ff6f43] to-[#ff8a65]",
      btnClass: "bg-white text-[#ff5722] hover:bg-orange-50",
      bgImage: "/banners/hero_welcome_3d.jpg",
      image: "/banners/hero_welcome_3d.jpg",
    },
    {
      _id: "s2",
      badge: "⚡ 10-15 MIN EXPRESS DELIVERY",
      badgeClass: "bg-white/20 text-white backdrop-blur-md border border-white/25",
      title: "Sunrise Harvested",
      subtitle: "100% Pure Farm Fresh Vegetables",
      codeText: "Direct from:",
      codeHighlight: "Local Bhopal Farms",
      btnText: "Shop Fresh Produce",
      link: "/shop?category=Vegetables",
      bgGradient: "from-[#07321a] via-[#0b542c] to-[#0f8646]",
      btnClass: "bg-white text-[#0f8646] hover:bg-green-50",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=85",
    },
    {
      _id: "s3",
      badge: "🥛 100% PURE & PRESERVATIVE-FREE",
      badgeClass: "bg-white/20 text-white backdrop-blur-md border border-white/25",
      title: "Desi A2 Cow Milk",
      subtitle: "Artisanal Malai Paneer & Cold Ghee",
      codeText: "Morning Batch:",
      codeHighlight: "Delivered in 10 Mins",
      btnText: "Order Dairy Essentials",
      link: "/shop?category=Dairy%20%26%20Staples",
      bgGradient: "from-[#0c4a6e] via-[#0284c7] to-[#38bdf8]",
      btnClass: "bg-white text-[#0284c7] hover:bg-blue-50",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=85",
    },
  ];

  const activeSlides = defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[currentSlide];

  // Touch Swipe Handlers for Mobile
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
    <div className="w-full bg-white pt-2 sm:pt-4 pb-2 sm:pb-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`w-full bg-gradient-to-r ${slide.bgGradient} text-white p-5 sm:p-8 md:p-10 flex items-center justify-between gap-4 min-h-[190px] sm:min-h-[240px] md:min-h-[270px] relative overflow-hidden`}
            >
              {slide.bgImage ? (
                <>
                  {/* Full Bleed 3D Banner Image */}
                  <img
                    src={slide.bgImage}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
                  />
                  {/* Left subtle overlay to guarantee text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 via-transparent to-transparent md:hidden" />

                  {/* Left Content */}
                  <div className="relative z-10 flex-1 flex flex-col items-start max-w-[62%] sm:max-w-md">
                    {/* Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 sm:mb-2.5 shadow-2xs ${slide.badgeClass}`}
                    >
                      <span>{slide.badge}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm text-white font-bold mb-1.5 sm:mb-2 leading-tight drop-shadow-xs">
                      {slide.subtitle}
                    </p>

                    {/* Coupon Code Strip */}
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-white drop-shadow-xs mb-3 sm:mb-4">
                      <span>{slide.codeText}</span>
                      <span className="text-yellow-300 uppercase tracking-wider">
                        {slide.codeHighlight}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link href={slide.link}>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-1.5 cursor-pointer ${slide.btnClass}`}
                      >
                        <span>{slide.btnText}</span>
                        <ArrowRight size={14} className="stroke-[2.5]" />
                      </motion.button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Background ambient lighting */}
                  <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Left Content */}
                  <div className="flex-1 flex flex-col items-start z-10 max-w-[65%] sm:max-w-md">
                    {/* Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 sm:mb-2.5 shadow-2xs ${slide.badgeClass}`}
                    >
                      <span>{slide.badge}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-xs">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm text-white/95 font-bold mb-1.5 sm:mb-2 leading-tight">
                      {slide.subtitle}
                    </p>

                    {/* Coupon Code Strip */}
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-white/90 mb-3 sm:mb-4">
                      <span>{slide.codeText}</span>
                      <span className="text-yellow-300 uppercase tracking-wider">
                        {slide.codeHighlight}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link href={slide.link}>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${slide.btnClass}`}
                      >
                        <span>{slide.btnText}</span>
                        <ArrowRight size={14} className="stroke-[2.5]" />
                      </motion.button>
                    </Link>
                  </div>

                  {/* Right: 3D Produce Bag / Basket Illustration */}
                  <div className="shrink-0 w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 relative z-10 flex items-center justify-center">
                    <motion.img
                      initial={{ scale: 0.9, y: 5 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)] rounded-2xl"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 hover:bg-black/50 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer hidden sm:flex"
            title="Previous Slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 hover:bg-black/50 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer hidden sm:flex"
            title="Next Slide"
          >
            <ChevronRight size={18} />
          </button>

          {/* 4 Dots Pagination */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? "w-5 h-1.5 bg-white shadow-xs"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
