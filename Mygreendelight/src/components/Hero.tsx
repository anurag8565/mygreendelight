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

export default function Hero({ banners = [] }: HeroProps) {
  const defaultSlides = [
    {
      _id: "s1",
      iconType: "clock",
      tag: "15 Min Express Delivery",
      title: "Farm-Fresh Vegetables",
      subtitle: "Harvested before sunrise, sorted by hand and delivered daily in Bhopal.",
      btnText: "Order Vegetables",
      link: "/shop?category=Vegetables",
      image: "/categories/vegetables_4k.jpg",
    },
    {
      _id: "s2",
      iconType: "sparkles",
      tag: "Naturally Sweet & Ripe",
      title: "Seasonal Fresh Fruits",
      subtitle: "Crisp apples, sweet bananas, citrus & berries at direct mandi rates.",
      btnText: "Explore Fruits",
      link: "/shop?category=Fruits",
      image: "/categories/fruits_4k.jpg",
    },
    {
      _id: "s3",
      iconType: "shield",
      tag: "100% Chemical-Free",
      title: "Hydroponics & Greens",
      subtitle: "Broccoli, avocados, fresh herbs & premium salads for healthy living.",
      btnText: "Shop Exotics",
      link: "/shop?category=Exotics",
      image: "/categories/exotics_4k.jpg",
    },
  ];

  // Active slides from DB or default
  const activeSlides = React.useMemo(() => {
    if (!banners || banners.length === 0) return defaultSlides;
    return banners.map((b: any, idx: number) => ({
      _id: b._id || `db-${idx}`,
      iconType: idx % 3 === 0 ? "clock" : idx % 3 === 1 ? "sparkles" : "shield",
      tag: b.badge ? b.badge.replace(/[^\w\s•-]/gu, "").trim() : defaultSlides[idx % defaultSlides.length].tag,
      title: b.title || defaultSlides[idx % defaultSlides.length].title,
      subtitle: b.subtitle || defaultSlides[idx % defaultSlides.length].subtitle,
      btnText: b.btnText || defaultSlides[idx % defaultSlides.length].btnText,
      link: b.link || "/shop",
      image: b.image || defaultSlides[idx % defaultSlides.length].image,
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

  const renderIcon = (type?: string) => {
    switch (type) {
      case "sparkles":
        return <Sparkles size={11} className="text-amber-600 shrink-0" />;
      case "shield":
        return <ShieldCheck size={11} className="text-[#0a3d24] shrink-0" />;
      default:
        return <Clock size={11} className="text-[#0a3d24] shrink-0" />;
    }
  };

  return (
    <section className="w-full bg-[#faf9f5] pt-2 sm:pt-3.5 pb-2 sm:pb-3 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        
        {/* Clean Theme-Aligned Hero Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-[0_1px_6px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 h-[160px] xs:h-[175px] sm:h-[210px] md:h-[240px]"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={slide._id || currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full flex items-center justify-between select-none"
            >
              {/* Left Content Column */}
              <div className="flex-1 p-3.5 xs:p-4 sm:p-6 md:p-8 flex flex-col justify-between h-full z-10 min-w-0 pr-2">
                <div>
                  {/* Clean Trust Tag with Real Icon */}
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200/70 text-[#0a3d24] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1.5 sm:mb-2">
                    {renderIcon(slide.iconType)}
                    <span>{slide.tag}</span>
                  </div>

                  {/* Clean Headline */}
                  <h2 className="text-base xs:text-lg sm:text-2xl md:text-[26px] font-bold text-stone-900 tracking-tight leading-tight line-clamp-1 sm:line-clamp-2">
                    {slide.title}
                  </h2>

                  {/* Clean Subtitle */}
                  <p className="text-[11px] xs:text-xs sm:text-sm text-stone-500 font-normal leading-snug line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 max-w-sm">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Bottom Row: CTA Button & Pagination Dots */}
                <div className="flex items-center gap-3 pt-1">
                  <Link href={slide.link || "/shop"}>
                    <button
                      type="button"
                      className="bg-[#0a3d24] hover:bg-[#072817] text-white px-3.5 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold text-[11px] sm:text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>{slide.btnText}</span>
                      <ArrowRight size={12} className="stroke-[2.5]" />
                    </button>
                  </Link>

                  {/* Dots Indicator */}
                  {total > 1 && (
                    <div className="flex items-center gap-1 ml-1">
                      {activeSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => goToSlide(idx, idx > currentSlide ? 1 : -1)}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            currentSlide === idx
                              ? "w-4 h-1.5 bg-[#0a3d24]"
                              : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400"
                          }`}
                          title={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Clean Authentic Product Image */}
              <div className="w-[38%] xs:w-[40%] sm:w-[42%] md:w-[44%] h-full shrink-0 relative overflow-hidden bg-stone-100">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop Navigation Side Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-stone-700 shadow-sm flex items-center justify-center transition-all z-20 cursor-pointer hidden sm:flex border border-stone-200 active:scale-90"
                title="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-stone-700 shadow-sm flex items-center justify-center transition-all z-20 cursor-pointer hidden sm:flex border border-stone-200 active:scale-90"
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
