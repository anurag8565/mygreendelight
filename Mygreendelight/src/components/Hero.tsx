"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  banner?: any;
}

export default function Hero({ banner }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const slides = [
    {
      badge: "⚡ 10-15 Min Express Delivery",
      title: "Sunrise Farm Harvested Fresh Vegetables",
      highlight: "Delivered in Bhopal",
      desc: "100% Ozone-Washed & Chemical-Free produce sourced daily from Sehore & Raisen farms.",
      btnText: "Shop Fresh Veggies",
      link: "/shop?category=Vegetables",
      bgGradient: "from-[#0b4d29] via-[#0f8646] to-emerald-600",
      accentPill: "bg-yellow-300 text-gray-950",
      image: banner?.image || "/hero_basket.jpg",
      tag: "Fresh Today",
    },
    {
      badge: "🎉 Bhopal Special Harvest Offer",
      title: "Flat 20% OFF on Your First 3 Orders",
      highlight: "Code: BHOPAL20",
      desc: "Save big on fresh seasonal fruits, desi dairy, pure grains and daily kitchen essentials.",
      btnText: "Claim 20% OFF",
      link: "/shop",
      bgGradient: "from-amber-800 via-orange-600 to-amber-500",
      accentPill: "bg-white text-orange-700",
      image: "/categories/fruits.jpg",
      tag: "Limited Offer",
    },
    {
      badge: "🥛 100% Pure Organic Dairy",
      title: "Desi A2 Milk, Farm Paneer & Cold Pressed Oils",
      highlight: "Morning 7 AM Batch",
      desc: "Directly from grass-fed local cows. Pure, preservative-free and delivered in insulated boxes.",
      btnText: "Order Dairy Essentials",
      link: "/shop?category=Dairy%20%26%20Bakery",
      bgGradient: "from-teal-950 via-teal-800 to-emerald-700",
      accentPill: "bg-emerald-300 text-teal-950",
      image: "/categories/exotic.jpg",
      tag: "Pure & Raw",
    },
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      // Swiped left
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (diff < -50) {
      // Swiped right
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStart(null);
  };

  return (
    <div className="w-full bg-white pt-2 sm:pt-4 pb-2 sm:pb-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`w-full bg-gradient-to-r ${slide.bgGradient} text-white p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[190px] sm:min-h-[260px] relative overflow-hidden`}
            >
              {/* Background ambient circular glow */}
              <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

              {/* Mobile Decorative Product Watermark Badge */}
              <div className="md:hidden absolute right-2 -bottom-2 w-28 h-28 opacity-25 pointer-events-none">
                <img
                  src={slide.image}
                  alt="Farm Produce"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>

              {/* Left Content */}
              <div className="flex-1 flex flex-col items-start z-10 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/25">
                    <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                    <span>{slide.badge}</span>
                  </span>
                  <span className="hidden sm:inline-block bg-yellow-300 text-gray-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                    {slide.tag}
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl md:text-4xl font-black leading-tight tracking-tight mb-1 sm:mb-2 text-white drop-shadow-xs">
                  {slide.title} <br className="hidden sm:inline" />
                  <span className="text-yellow-300">{slide.highlight}</span>
                </h1>

                <p className="text-xs sm:text-sm text-green-100/90 max-w-lg mb-3 sm:mb-4 line-clamp-2 hidden sm:block">
                  {slide.desc}
                </p>

                <div className="flex items-center gap-3 mt-1 sm:mt-1">
                  <Link href={slide.link}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white text-gray-950 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{slide.btnText}</span>
                      <ArrowRight size={14} className="text-[#0f8646]" />
                    </motion.button>
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-white/90 hidden sm:flex">
                    <ShieldCheck size={14} className="text-yellow-300" />
                    <span>Bhopal Farm Fresh Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Image (Desktop & Tablet) */}
              <div className="hidden sm:flex shrink-0 w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/10 backdrop-blur-md items-center justify-center relative z-10 p-2">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows (Desktop & Hover) */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer hidden sm:flex"
            title="Previous Banner"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer hidden sm:flex"
            title="Next Banner"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots Pagination */}
          <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
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
        </div>
      </div>
    </div>
  );
}
