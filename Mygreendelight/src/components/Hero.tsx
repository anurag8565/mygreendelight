"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  banners?: any[];
}

export default function Hero({ banners = [] }: HeroProps) {
  const defaultSlides = [
    {
      _id: "s1",
      badge: "⚡ 10-15 Min Delivery in Bhopal",
      title: "Sunrise Harvested Fresh Vegetables & Fruits",
      subtitle: "100% Ozone-Washed • Direct from Sehore & Raisen Farms",
      btnText: "Shop Fresh Veggies",
      link: "/shop?category=Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85",
      bgGradient: "from-emerald-950/90 via-[#0b4d29]/80 to-transparent",
    },
    {
      _id: "s2",
      badge: "🎉 Bhopal Special Harvest Sale",
      title: "Flat 20% OFF on Your First 3 Orders",
      subtitle: "Use Code: BHOPAL20 • Pure, Chemical-Free Produce",
      btnText: "Claim 20% Discount",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=85",
      bgGradient: "from-amber-950/90 via-orange-900/80 to-transparent",
    },
    {
      _id: "s3",
      badge: "🥛 100% Pure Organic Dairy",
      title: "Desi A2 Cow Milk, Farm Paneer & Cold Pressed Ghee",
      subtitle: "Fresh morning batch delivered by 7 AM or in 10 minutes",
      btnText: "Explore Dairy",
      link: "/shop?category=Dairy%20%26%20Staples",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=85",
      bgGradient: "from-teal-950/90 via-emerald-900/80 to-transparent",
    },
    {
      _id: "s4",
      badge: "🌿 Hydroponic & Exotic Produce",
      title: "Crisp Lettuce, Cherry Tomatoes & Fresh Herbs",
      subtitle: "Pesticide-free exotic greens for healthy salads & bowls",
      btnText: "Shop Exotics",
      link: "/shop?category=Exotics",
      image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=1200&q=85",
      bgGradient: "from-green-950/90 via-[#07321a]/80 to-transparent",
    },
  ];

  const activeSlides = banners && banners.length > 0 ? banners : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      // Swiped left
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    } else if (diff < -45) {
      // Swiped right
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
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group bg-gray-900 min-h-[175px] sm:min-h-[250px] md:min-h-[300px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide._id || currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full min-h-[175px] sm:min-h-[250px] md:min-h-[300px] flex items-center overflow-hidden"
            >
              {/* 1. Full-Bleed Real Background Image */}
              <img
                src={slide.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85"}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center scale-102 group-hover:scale-105 transition-transform duration-700"
              />

              {/* 2. Left High-Contrast Gradient Dark Overlay for Sharp Text Legibility */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient || "from-black/90 via-black/70 to-transparent"} z-10`} />

              {/* 3. Banner Content */}
              <div className="relative z-20 p-4 sm:p-8 md:p-12 flex flex-col items-start max-w-xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 sm:mb-3 border border-white/30 shadow-xs">
                  <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                  <span>{slide.badge || "⚡ 10-15 Min Express Delivery"}</span>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-2xl md:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-md mb-1 sm:mb-2 line-clamp-2">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-green-100/90 font-medium mb-3 sm:mb-5 line-clamp-2 drop-shadow-xs max-w-md">
                  {slide.subtitle || slide.desc || "100% Ozone-Washed & Chemical-Free produce sourced daily."}
                </p>

                {/* CTA Button */}
                <Link href={slide.link || "/shop"}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-1.5 cursor-pointer border border-green-400/40"
                  >
                    <span>{slide.btnText || "Shop Now"}</span>
                    <ArrowRight size={14} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {activeSlides.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer hidden sm:flex"
                title="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer hidden sm:flex"
                title="Next Slide"
              >
                <ChevronRight size={18} />
              </button>

              {/* Dots Pagination */}
              <div className="absolute bottom-3 right-4 z-30 flex items-center gap-1.5">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all rounded-full cursor-pointer ${
                      currentSlide === idx
                        ? "w-6 h-1.5 bg-white shadow-md"
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
