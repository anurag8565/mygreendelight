"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Sparkles, Salad, Gift, ChefHat, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function InteractiveFarmFeatures() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Salad size={22} className="text-emerald-600" />,
      tag: "🥗 Health & Detox",
      title: "Custom Salad & Health Box Builder",
      desc: "Pick your favorite crispy lettuce, avocados, seeds & dressings to craft a personalized 100% fresh health bowl.",
      link: "/shop/custom-box",
      btnText: "Build Custom Box",
      badge: "Popular in Bhopal",
      gradient: "from-emerald-50 to-green-50/70 border-emerald-200/90",
      btnColor: "bg-[#0f8646] hover:bg-[#0c6a38] text-white",
    },
    {
      icon: <ChefHat size={22} className="text-amber-600" />,
      tag: "🍲 1-Click Cook",
      title: "Farm Fresh Recipe Ingredient Kits",
      desc: "Get pre-measured, washed produce & authentic spices delivered together to cook restaurant-grade dishes at home.",
      link: "/shop?category=Combos",
      btnText: "Explore Recipe Kits",
      badge: "Zero Wastage",
      gradient: "from-amber-50 to-orange-50/70 border-amber-200/90",
      btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      icon: <Gift size={22} className="text-pink-600" />,
      tag: "🎁 Eco Gifting",
      title: "Artisanal Fresh Fruit & Herb Hampers",
      desc: "Gift curated exotic fruit baskets, dry fruits & pure farm honey in handcrafted eco-packaging for special occasions.",
      link: "/shop/gift-basket",
      btnText: "Gift a Fresh Hamper",
      badge: "Custom Ribbon",
      gradient: "from-pink-50 to-rose-50/70 border-pink-200/90",
      btnColor: "bg-rose-600 hover:bg-rose-700 text-white",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-[#fbfdfc] py-5 sm:py-8 font-sans border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
              <Sparkles size={11} /> Specialized Experiences
            </span>
            <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
              More Than Just Groceries
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
              Unique farm-to-table services crafted for Bhopal food lovers
            </p>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition shadow-2xs cursor-pointer"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition shadow-2xs cursor-pointer"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Feature Cards Swipeable Carousel on Mobile / Grid on Desktop */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3.5 sm:gap-5 pb-3 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-3 -mx-3.5 px-3.5 md:mx-0 md:px-0"
        >
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className={`w-[270px] xs:w-[300px] md:w-auto shrink-0 snap-start rounded-3xl p-4 sm:p-5 border bg-gradient-to-br ${f.gradient} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-gray-100">
                    {f.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-700 bg-white/90 px-2 py-0.5 rounded-full border border-gray-200/80 shadow-2xs">
                    {f.badge}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-gray-500 block mb-0.5">
                  {f.tag}
                </span>

                <h3 className="font-black text-sm sm:text-base text-gray-900 leading-snug mb-1.5 line-clamp-1">
                  {f.title}
                </h3>

                <p className="text-[11px] text-gray-600 leading-relaxed font-medium mb-4 line-clamp-2">
                  {f.desc}
                </p>
              </div>

              <Link href={f.link}>
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 ${f.btnColor}`}
                >
                  <span>{f.btnText}</span>
                  <ArrowRight size={13} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
