"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Zap, ShieldCheck, Clock, Flame, Tag } from "lucide-react";
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
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-[#052e16]/95 via-[#064e3b]/85 to-transparent/30",
      accentColor: "#10b981",
      offerPill: "FLAT ₹50 OFF • CODE: FRESH50",
    },
    {
      _id: "s2",
      badge: "🏷️ Daily Mandi Fair Rates • Zero Middlemen",
      title: "Pure Farm-Gate Prices, Maximum Freshness",
      subtitle: "Daily transparent mandi rates. Cleaned, sorted and safely packed for your family.",
      btnText: "Explore Kisan Rates",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-[#451a03]/95 via-[#7c2d12]/85 to-transparent/30",
      accentColor: "#f59e0b",
      offerPill: "SAVE UP TO 35% ON VEGGIES",
    },
    {
      _id: "s3",
      badge: "🥛 100% Pure Organic Dairy & Ghee",
      title: "Desi Gir Cow A2 Milk & Vedic Bilona Ghee",
      subtitle: "Fresh raw morning batch delivered chilled to your doorstep before 7:00 AM.",
      btnText: "Shop Pure Dairy",
      link: "/shop?category=Dairy%20%26%20Staples",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-[#0c4a6e]/95 via-[#0369a1]/85 to-transparent/30",
      accentColor: "#38bdf8",
      offerPill: "100% LAB TESTED PURITY",
    },
    {
      _id: "s4",
      badge: "🥑 Hydroponic & Gourmet Exotics",
      title: "Crisp Hydroponic Greens & Exotic Salads",
      subtitle: "Fresh Iceberg, Cherry Tomatoes, Avocados, Herbs & European salad mixes.",
      btnText: "Explore Exotics",
      link: "/shop?category=Exotics",
      image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=1600&q=85",
      bgGradient: "from-[#134e4a]/95 via-[#115e59]/85 to-transparent/30",
      accentColor: "#2dd4bf",
      offerPill: "PESTICIDE FREE CERTIFIED",
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

  const quickPills = [
    { label: "Daily Veggies", icon: "🥬", href: "/shop?category=Vegetables", color: "hover:bg-emerald-50 hover:border-emerald-300" },
    { label: "Fresh Fruits", icon: "🍎", href: "/shop?category=Fruits", color: "hover:bg-amber-50 hover:border-amber-300" },
    { label: "Exotic Salads", icon: "🥑", href: "/shop?category=Exotics", color: "hover:bg-purple-50 hover:border-purple-300" },
    { label: "Pure Dairy", icon: "🥛", href: "/shop?category=Dairy%20%26%20Staples", color: "hover:bg-blue-50 hover:border-blue-300" },
    { label: "Value Combos", icon: "🎁", href: "/shop?category=combos", color: "hover:bg-rose-50 hover:border-rose-300" },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-emerald-50/50 via-white to-white pt-2 sm:pt-3 pb-2 sm:pb-3 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Top Floating Live Ticker */}
        <div className="flex items-center justify-between gap-2 mb-2 px-1 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 bg-emerald-100/70 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#0f8646] animate-ping shrink-0" />
            <span className="truncate">⚡ Delivering Live across Bhopal in 10-15 mins</span>
          </div>

          <Link
            href="/offers"
            className="hidden sm:flex items-center gap-1 font-black text-[#0f8646] hover:text-[#0c6a38] bg-white border border-emerald-200 px-3 py-1 rounded-full shadow-2xs hover:shadow-xs transition"
          >
            <Tag size={12} className="text-amber-500 fill-amber-500" />
            <span>Use Code <strong>FRESH50</strong> for ₹50 OFF</span>
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Main Luxury Hero Banner Card */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(15,134,70,0.18)] transition-all duration-500 group bg-gray-950 h-[220px] xs:h-[245px] sm:h-[300px] md:h-[350px] lg:h-[380px] border border-gray-100/80"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide._id || currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="relative w-full h-full flex items-center overflow-hidden"
            >
              {/* 1. HD Produce Image */}
              <img
                src={slide.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=85"}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
              />

              {/* 2. Multi-layer High Contrast Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  slide.bgGradient || "from-black/95 via-black/80 to-transparent/30"
                } z-10`}
              />

              {/* Ambient Glowing Green Soft Light in corner */}
              <div className="absolute top-0 left-0 w-72 h-72 bg-[#0f8646]/30 rounded-full blur-3xl pointer-events-none z-10" />

              {/* 3. Hero Content */}
              <div className="relative z-20 p-4 sm:p-8 md:p-12 lg:p-14 flex flex-col items-start max-w-xl sm:max-w-2xl">
                
                {/* Micro Offer & Quality Badge */}
                <div className="flex items-center gap-2 flex-wrap mb-2 sm:mb-3">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[9.5px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-xs">
                    <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                    <span>{slide.badge || "🌿 Farm Fresh • Same Day Delivery"}</span>
                  </div>

                  {slide.offerPill && (
                    <span className="hidden xs:inline-flex items-center gap-1 bg-amber-400 text-gray-950 text-[9px] sm:text-[10.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      <Flame size={11} className="fill-amber-950" />
                      <span>{slide.offerPill}</span>
                    </span>
                  )}
                </div>

                {/* Hero Title */}
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-black leading-tight sm:leading-[1.12] tracking-tight text-white drop-shadow-lg mb-1.5 sm:mb-2.5 line-clamp-2">
                  {slide.title}
                </h1>

                {/* Hero Subtitle */}
                <p className="text-[11.5px] sm:text-sm text-emerald-100/95 font-medium mb-4 sm:mb-6 line-clamp-2 drop-shadow-sm max-w-md sm:max-w-lg leading-relaxed">
                  {slide.subtitle || slide.desc || "100% Ozone-Washed & Chemical-Free produce sourced daily from local contract farms."}
                </p>

                {/* Action CTA Group */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href={slide.link || "/shop"}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
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
                    <span>View All 150+ Items</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {activeSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/25 shadow-md active:scale-95"
                title="Previous Slide"
              >
                <ChevronLeft size={22} className="stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer hidden sm:flex border border-white/25 shadow-md active:scale-95"
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

        {/* Quick Category Pills Bar (Eye-Catching & Ultra User-Friendly) */}
        <div className="mt-2.5 sm:mt-3.5 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {quickPills.map((pill, idx) => (
            <Link
              key={idx}
              href={pill.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xs transition-all duration-200 shrink-0 text-xs font-black text-gray-800 ${pill.color} active:scale-95`}
            >
              <span className="text-base">{pill.icon}</span>
              <span className="whitespace-nowrap">{pill.label}</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
