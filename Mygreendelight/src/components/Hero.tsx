"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  banners?: any[];
}

// Sanitize string to strictly remove emojis & unwanted glyphs
const cleanText = (str?: string) => {
  if (!str) return "";
  return str.replace(/[^\w\s•\-,&/()%₹]/gu, "").replace(/\s+/g, " ").trim();
};

export default function Hero({ banners = [] }: HeroProps) {
  const defaultSlides = [
    {
      _id: "s1",
      iconType: "sparkles",
      tag: "100% Organic • Cold Pressed Juicy",
      title: "Organic Fresh Fruits For Your Health",
      subtitle: "Sweet, juicy oranges & handpicked seasonal orchard fruits.",
      btnText: "Shop Fruits",
      link: "/shop?category=Fruits",
      image: "/banners/hero_freshgo_orange.jpg",
    },
    {
      _id: "s2",
      iconType: "clock",
      tag: "Daily Farm Harvest • 10-15 Min",
      title: "Farm Fresh Daily Harvest",
      subtitle: "Cleaned, sorted & delivered daily from local Mandi.",
      btnText: "Shop Vegetables",
      link: "/shop?category=Vegetables",
      image: "/banners/hero_freshgo_veg_basket.jpg",
    },
    {
      _id: "s3",
      iconType: "sparkles",
      tag: "Naturally Sweet • Zero Artificial Ripening",
      title: "Sweet Handpicked Fruits",
      subtitle: "Crisp apples, ripe mangoes, grapes & seasonal treats.",
      btnText: "Explore Fruits",
      link: "/shop?category=Fruits",
      image: "/banners/hero_freshgo_fruits.jpg",
    },
    {
      _id: "s4",
      iconType: "shield",
      tag: "Super Saver Packs • Up to 35% OFF",
      title: "Daily Kitchen Combos & Greens",
      subtitle: "Crisp broccoli, fresh greens, Aloo, Pyaaz & Tamatar combos.",
      btnText: "View Combos",
      link: "/shop?category=Combos",
      image: "/banners/hero_freshgo_greens.jpg",
    },
  ];

  // Active slides sanitized from DB or default
  const activeSlides = React.useMemo(() => {
    if (!banners || banners.length === 0) return defaultSlides;
    return banners.map((b: any, idx: number) => {
      const def = defaultSlides[idx % defaultSlides.length];
      let rawBadge = b.badge ? cleanText(b.badge) : def.tag;
      let rawTitle = b.title ? cleanText(b.title) : def.title;
      let rawSubtitle = b.subtitle ? cleanText(b.subtitle) : def.subtitle;
      let rawBtnText = b.btnText ? cleanText(b.btnText) : def.btnText;

      // Ensure consistent 4K landscape imagery across all slides
      let slideImg = b.image || def.image;
      if (slideImg.includes("hero1.jpg") || slideImg.includes("veggies_clean_4k.jpg")) slideImg = "/banners/hero_freshgo_veg_basket.jpg";
      if (slideImg.includes("hero_fruits_orchard.jpg") || slideImg.includes("fruits_clean_4k.jpg")) slideImg = "/banners/hero_freshgo_fruits.jpg";
      if (slideImg.includes("hero2.jpg") || slideImg.includes("exotics_clean_4k.jpg")) slideImg = "/banners/hero_freshgo_greens.jpg";

      return {
        _id: b._id || `db-${idx}`,
        iconType: idx % 3 === 0 ? "clock" : idx % 3 === 1 ? "sparkles" : "shield",
        tag: rawBadge || def.tag,
        title: rawTitle || def.title,
        subtitle: rawSubtitle || def.subtitle,
        btnText: rawBtnText || def.btnText,
        link: b.link || def.link,
        image: slideImg,
      };
    });
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

  // Auto-slide every 5.5 seconds unless paused
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  // Dynamic Theme presets tailored for each banner background
  const isOrangeSlide = slide.image?.includes("hero_freshgo_orange");
  const isDarkGreensSlide = slide.image?.includes("hero_freshgo_greens");

  // Touch Swipe Handlers for mobile
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

  const renderIcon = (type?: string) => {
    switch (type) {
      case "sparkles":
        return <Sparkles size={12} className={isDarkGreensSlide ? "text-amber-300 shrink-0 stroke-[2.2]" : "text-amber-600 shrink-0 stroke-[2.2]"} />;
      case "shield":
        return <ShieldCheck size={12} className={isDarkGreensSlide ? "text-emerald-200 shrink-0 stroke-[2.2]" : "text-[#0a3d24] shrink-0 stroke-[2.2]"} />;
      default:
        return <Clock size={12} className={isDarkGreensSlide ? "text-emerald-200 shrink-0 stroke-[2.2]" : "text-[#0a3d24] shrink-0 stroke-[2.2]"} />;
    }
  };

  return (
    <section className="w-full bg-[#faf9f5] pt-2.5 sm:pt-4 pb-2 sm:pb-3 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        
        {/* Unified Luxury Quick-Commerce Banner Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all duration-300 h-[175px] xs:h-[190px] sm:h-[225px] md:h-[260px] lg:h-[295px] xl:h-[320px] select-none"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={slide._id || currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Full-bleed Background Photographic Layer with 4K clarity & natural contrast */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-right sm:object-center contrast-[1.04] saturate-[1.06]"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Natural directional fade tailored to each banner */}
              {isOrangeSlide ? (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-transparent to-transparent pointer-events-none z-1" />
              ) : isDarkGreensSlide ? (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/65 via-50% sm:via-38% to-transparent pointer-events-none z-1" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 via-48% sm:via-36% to-transparent pointer-events-none z-1" />
              )}

              {/* Left Editorial Content Layer */}
              <div className="relative z-10 h-full p-3.5 xs:p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between max-w-[64%] xs:max-w-[62%] sm:max-w-md lg:max-w-xl">
                <div>
                  {/* Clean Trust Micro-Pill */}
                  <div
                    className={`inline-flex items-center gap-1.5 text-[9.5px] xs:text-[10px] sm:text-[11px] lg:text-xs font-bold px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full mb-1 sm:mb-2 lg:mb-3 shadow-2xs ${
                      isOrangeSlide
                        ? "bg-white/95 border border-white/80 text-[#0a3d24]"
                        : isDarkGreensSlide
                        ? "bg-white/15 border border-white/25 text-white backdrop-blur-xs"
                        : "bg-emerald-50/95 border border-emerald-200/80 text-[#0a3d24]"
                    }`}
                  >
                    {renderIcon(slide.iconType)}
                    <span className="truncate">{slide.tag}</span>
                  </div>

                  {/* High-Impact Headline */}
                  <h2
                    className={`text-[16px] xs:text-[18px] sm:text-2xl md:text-[26px] lg:text-[32px] xl:text-[34px] font-extrabold tracking-tight leading-tight line-clamp-2 font-heading ${
                      isOrangeSlide
                        ? "text-[#072d1a] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                        : isDarkGreensSlide
                        ? "text-white drop-shadow-sm"
                        : "text-stone-900"
                    }`}
                  >
                    {slide.title}
                  </h2>

                  {/* Value Proposition Subtitle */}
                  <p
                    className={`text-[11px] xs:text-xs sm:text-sm lg:text-base font-medium leading-snug line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 lg:mt-2 max-w-lg ${
                      isOrangeSlide
                        ? "text-[#1c3828] font-semibold drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]"
                        : isDarkGreensSlide
                        ? "text-emerald-100/90"
                        : "text-stone-600"
                    }`}
                  >
                    {slide.subtitle}
                  </p>
                </div>

                {/* Bottom Row: CTA Pill Button & Minimalist Pagination Dots */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-5 pt-1 lg:pt-2">
                  <Link href={slide.link || "/shop"}>
                    <button
                      type="button"
                      className={`px-3.5 xs:px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full font-bold text-[11px] xs:text-xs sm:text-sm lg:text-[15px] shadow-sm transition flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap ${
                        isOrangeSlide
                          ? "bg-[#0a3d24] hover:bg-[#062918] text-white shadow-md"
                          : isDarkGreensSlide
                          ? "bg-emerald-400 hover:bg-emerald-300 text-stone-950 shadow-md"
                          : "bg-[#0a3d24] hover:bg-[#072416] text-white"
                      }`}
                    >
                      <span>{slide.btnText}</span>
                      <ArrowRight size={14} className="stroke-[2.5]" />
                    </button>
                  </Link>

                  {/* Elegant Pagination Indicators */}
                  {total > 1 && (
                    <div className="flex items-center gap-1 ml-0.5 sm:ml-1">
                      {activeSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => goToSlide(idx, idx > currentSlide ? 1 : -1)}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            currentSlide === idx
                              ? isDarkGreensSlide
                                ? "w-4.5 h-1.5 bg-emerald-400"
                                : "w-4.5 h-1.5 bg-[#0a3d24]"
                              : isDarkGreensSlide
                              ? "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                              : "w-1.5 h-1.5 bg-stone-300/90 hover:bg-stone-400"
                          }`}
                          title={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop Navigation Side Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hidden sm:flex border border-stone-200/80 active:scale-90"
                title="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hidden sm:flex border border-stone-200/80 active:scale-90"
                title="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
