"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  banner?: any;
}

export default function Hero({ banner }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: "? 10-15 Min Express Delivery",
      title: "Farm Fresh Vegetables & Daily Groceries",
      highlight: "Delivered in Bhopal",
      desc: "Directly harvested from local Madhya Pradesh farms to your kitchen doorstep.",
      btnText: "Order Fresh Produce",
      link: "/shop?category=Vegetables",
      bgGradient: "from-emerald-900 via-[#0f8646] to-green-700",
      accentColor: "bg-yellow-300 text-gray-900",
      image: banner?.image || "/hero_basket.jpg",
    },
    {
      badge: "?? First Order Special Offer",
      title: "Flat 20% OFF on All Grocery Essentials",
      highlight: "Use Code: WELCOME20",
      desc: "Save big on fresh fruits, dairy, whole grains, and organic staples today.",
      btnText: "Claim 20% Discount",
      link: "/shop",
      bgGradient: "from-amber-700 via-orange-600 to-amber-600",
      accentColor: "bg-white text-orange-700",
      image: "/categories/fruits.jpg",
    },
    {
      badge: "?? 100% Pure & Farm-Fresh",
      title: "Daily Dairy, Bread & Breakfast Staples",
      highlight: "Morning Harvest",
      desc: "Fresh milk, paneer, artisanal breads and cold-pressed cooking oils.",
      btnText: "Explore Dairy",
      link: "/shop?category=Dairy%20%26%20Bakery",
      bgGradient: "from-teal-900 via-emerald-800 to-teal-700",
      accentColor: "bg-emerald-300 text-teal-950",
      image: "/categories/exotic.jpg",
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

  return (
    <div className="w-full bg-white pt-2 sm:pt-4 pb-2 sm:pb-4">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`w-full bg-gradient-to-r ${slide.bgGradient} text-white p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 min-h-[170px] sm:min-h-[260px] relative overflow-hidden`}
            >
              {/* Background ambient glow circle */}
              <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              {/* Left Content */}
              <div className="flex-1 flex flex-col items-start z-10 w-full">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/20">
                  <Sparkles size={12} className="text-yellow-300 fill-yellow-300" />
                  <span>{slide.badge}</span>
                </span>

                <h1 className="text-lg sm:text-3xl md:text-4xl font-black leading-tight tracking-tight mb-1 sm:mb-2 text-white">
                  {slide.title} <br className="hidden sm:inline" />
                  <span className="text-yellow-300">{slide.highlight}</span>
                </h1>

                <p className="text-xs sm:text-sm text-green-100/90 max-w-lg mb-3 sm:mb-5 line-clamp-2 hidden sm:block">
                  {slide.desc}
                </p>

                <div className="flex items-center gap-3 mt-1 sm:mt-0">
                  <Link href={slide.link}>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{slide.btnText}</span>
                      <ArrowRight size={14} />
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Right Decorative Image */}
              <div className="hidden sm:flex shrink-0 w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm items-center justify-center relative z-10">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Pagination */}
          <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full ${
                  currentSlide === idx
                    ? "w-5 h-1.5 bg-white"
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
