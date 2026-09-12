"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Sun,
  Users,
  Check,
  X,
  Zap,
  Sparkles,
  Clock,
  RefreshCw,
  HeartHandshake,
  CheckCheck,
  Flame,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TrustRibbon from "@/components/TrustRibbon";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion } from "framer-motion";

export default function AboutPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    {
      value: "5:00 AM",
      label: "Sunrise Harvest",
      desc: "Daily morning pick from regional contract farms",
      icon: <Sun size={20} className="text-amber-500" />,
    },
    {
      value: "10-15m",
      label: "Bhopal Express Delivery",
      desc: "Dispatched on-demand for peak crunch & aroma",
      icon: <Zap size={20} className="text-[#0c831f]" />,
    },
    {
      value: "100%",
      label: "Hand-Graded A-Quality",
      desc: "Every leaf & fruit individually sorted and checked",
      icon: <ShieldCheck size={20} className="text-teal-600" />,
    },
    {
      value: "₹0",
      label: "Zero Hidden Surcharges",
      desc: "Fair kisan rates with zero middleman commission",
      icon: <HeartHandshake size={20} className="text-emerald-600" />,
    },
  ];

  const steps = [
    {
      step: "01",
      time: "05:00 AM",
      tag: "DAWN HARVEST",
      title: "Direct Soil Harvest with Zero Multi-Day Cold Storage",
      desc: "Unlike warehouse dark stores that hold vegetables in industrial chillers for 3 to 5 days, our produce starts with regional farmers in Sehore, Raisen, and Bhopal outskirts at 5:00 AM. What was rooted in soil at sunrise arrives in your kitchen within hours.",
      image: "/hero_fresh_farm.jpg",
      points: [
        "Zero multi-day chemical cold storage",
        "Retains natural chlorophyll, hydration & vitamins",
        "Fair, guaranteed prices paid directly to local kisans",
      ],
    },
    {
      step: "02",
      time: "06:30 AM",
      tag: "TRIPLE INSPECTION",
      title: "Hand-Graded, Clean Water Rinsed & Waste Removed",
      desc: "We reject wilted, bruised, or substandard produce at our intake station. Leafy greens and veggies are gently rinsed under clean, potable water to wash off field mud and grime, then hand-graded into kitchen-ready crisp bundles.",
      image: "/banners/veggies_clean_4k.jpg",
      points: [
        "100% A-grade produce selection criteria",
        "Clean running water rinse for crisp crunch",
        "Breathable eco-packaging to prevent moisture decay",
      ],
    },
    {
      step: "03",
      time: "10-15 MINS",
      tag: "HYPERLOCAL DISPATCH",
      title: "Open-Box Doorstep Inspection with 100% Instant Refund",
      desc: "Trust is built at your doorstep, not through marketing promises. When our delivery partner arrives, take a moment to inspect your produce. If any item does not meet your standard, return it on the spot for an instant UPI cashback or replacement.",
      image: "/banners/fruits_clean_4k.jpg",
      points: [
        "Open-box doorstep check with rider",
        "Instant UPI refund or immediate replacement",
        "Secure 4-digit doorstep verification OTP",
      ],
    },
  ];

  const comparisons = [
    {
      aspect: "Sourcing & Harvest",
      subziQuick: "Picked at 5:00 AM dawn, delivered same day",
      traditional: "3 to 6 days old in transit, wholesale mandis & dark stores",
    },
    {
      aspect: "Grading & Cleanliness",
      subziQuick: "Triple-checked hand grading & clean water rinse",
      traditional: "Left unwashed in dust or sprayed with unhygienic water",
    },
    {
      aspect: "Doorstep Delivery Speed",
      subziQuick: "10–15 minutes hyper-express across Bhopal",
      traditional: "Uncertain multi-hour delivery slots with delays",
    },
    {
      aspect: "Pricing & Transparency",
      subziQuick: "Zero platform fee, zero surge charges, fair rates",
      traditional: "Hidden packing fees, handling charges & surge markups",
    },
    {
      aspect: "Return & Guarantee",
      subziQuick: "Open-box doorstep check • 100% Instant UPI refund",
      traditional: "Complicated customer support tickets with no return",
    },
  ];

  const neighborhoods = [
    "Arera Colony",
    "MP Nagar",
    "Kolar Road",
    "Bawadiya Kalan",
    "Gulmohar Colony",
    "Shahpura",
    "Bittan Market",
    "Katara Hills",
    "Chunabhatti",
    "Trilanga",
    "Bagsewaniya",
    "Hoshangabad Road",
    "Ayodhya Bypass",
    "Indrapuri BHEL",
  ];

  const faqs = [
    {
      q: "How does SubziQuick deliver so fast without keeping days-old stock?",
      a: "Our entire supply chain is designed specifically for Bhopal. Produce is harvested at 5:00 AM sunrise, sorted at our local micro-fulfillment stations, and dispatched through our dedicated delivery fleet across Bhopal in 10-15 minutes.",
    },
    {
      q: "How do you ensure produce cleanliness and hygiene?",
      a: "Every morning, produce undergoes strict hand-sorting to eliminate blemished or wilted pieces. Field mud is gently washed away with clean potable water, and produce is packed in ventilated eco-kraft packaging.",
    },
    {
      q: "Are there any hidden platform charges or surge fees?",
      a: "Zero. What you see is what you pay. We do not charge surge fees during peak hours, and orders above ₹199 in Bhopal enjoy free doorstep delivery.",
    },
    {
      q: "What if an item does not meet my freshness expectation?",
      a: "You can inspect your order right at your doorstep when the delivery arrives. If any vegetable or fruit doesn't meet your satisfaction, you can hand it back to the rider for an instant UPI refund or replacement.",
    },
  ];

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950 text-gray-900">
      {/* Top Navbar */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ===== 1. HERO BANNER CARD (MATCHING HOMEPAGE LUXURY STYLE) ===== */}
        <section className="w-full bg-gradient-to-b from-emerald-50/50 via-white to-white pt-2.5 sm:pt-4 pb-2 sm:pb-3 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-gray-100 bg-gray-950 h-[300px] xs:h-[330px] sm:h-[390px] md:h-[430px] lg:h-[460px] group">
              
              {/* 4K Background Produce Image */}
              <motion.img
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 7, ease: "easeOut" }}
                src="/hero_fresh_farm.jpg"
                alt="SubziQuick Bhopal Farm Fresh Vegetables & Produce"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Multi-layer High-Contrast Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent/40 z-10" />

              {/* Ambient Emerald Glow */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none z-10" />

              {/* Hero Banner Content */}
              <div className="relative z-20 p-4 xs:p-5 sm:p-8 md:p-12 lg:p-14 flex flex-col items-start max-w-xl sm:max-w-2xl justify-center h-full">
                
                {/* Quality Badge with Shimmer Sweep */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 flex-wrap mb-2 sm:mb-3"
                >
                  <div className="relative overflow-hidden inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[9px] xs:text-[9.5px] sm:text-xs font-black px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-xs">
                    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse relative z-10" />
                    <span className="relative z-10">🌿 The SubziQuick Story • Bhopal</span>
                  </div>

                  <span className="relative overflow-hidden hidden xs:inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-950 text-[9px] sm:text-[10.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    <Flame size={11} className="fill-amber-950 relative z-10" />
                    <span className="relative z-10">100% Farm-Direct</span>
                  </span>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.45 }}
                  className="text-xl xs:text-2xl sm:text-4xl md:text-[44px] font-black leading-tight sm:leading-[1.12] tracking-tight text-white drop-shadow-md mb-2 sm:mb-3"
                >
                  Pure farm harvest. <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-200 bg-clip-text text-transparent">
                    Direct to your kitchen.
                  </span>
                </motion.h1>

                {/* Hero Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.45 }}
                  className="text-[11px] xs:text-[12px] sm:text-sm text-emerald-100/95 font-medium mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 drop-shadow-sm max-w-md sm:max-w-lg leading-relaxed"
                >
                  Ending the compromise between wilted roadside produce and multi-day warehouse storage. Handpicked at 5:00 AM sunrise and delivered crisp in Bhopal in 10-15 minutes.
                </motion.p>

                {/* Action CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.45 }}
                  className="flex items-center gap-2.5 xs:gap-3 flex-wrap"
                >
                  <Link href="/shop">
                    <button
                      type="button"
                      className="relative overflow-hidden bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-emerald-300/40 hover:shadow-emerald-950/60 group/btn"
                    >
                      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      <span className="relative z-10">Explore Fresh Harvest</span>
                      <ArrowRight size={14} className="stroke-[2.5] relative z-10 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>

                  <a
                    href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20farm%20produce."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white/95 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-xs border border-white/25 transition cursor-pointer"
                  >
                    <FaWhatsapp size={15} className="text-[#25D366]" />
                    <span>WhatsApp Help</span>
                  </a>
                </motion.div>
              </div>

              {/* Floating Quality Badge (Desktop) */}
              <div className="hidden md:flex absolute bottom-6 right-6 z-20 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl items-center gap-3 text-white text-xs font-bold shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCheck size={18} />
                </div>
                <div>
                  <span className="block text-[10px] text-emerald-300 font-black uppercase">Doorstep Inspection</span>
                  <span>100% Instant Refund Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. CONTINUOUS TRUST & SPEED MARQUEE RIBBON ===== */}
        <TrustRibbon />

        {/* ===== 3. MINIMALIST 4-PILLAR METRICS STRIP ===== */}
        <section className="py-8 sm:py-12 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8f9fa] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-2xs hover:shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center mb-3 sm:mb-4 border border-gray-200/60 shadow-2xs">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {stat.label}
                    </div>
                    <div className="text-[10.5px] sm:text-xs text-gray-500 font-medium mt-1 leading-snug">
                      {stat.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. THREE CORE PILLARS: THE JOURNEY TO YOUR KITCHEN ===== */}
        <section className="py-12 sm:py-16 bg-[#f8f9fa] border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            
            {/* Section Header */}
            <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                OUR FARM-TO-FORK PROMISE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight mt-2.5">
                How Freshness Reaches You
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
                Three simple, strict standards that separate SubziQuick from traditional warehouse stores.
              </p>
            </div>

            {/* 3 Step Cards */}
            <div className="space-y-8 sm:space-y-12">
              {steps.map((item, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-gray-200/80 shadow-2xs grid lg:grid-cols-12 gap-6 sm:gap-10 items-center ${
                      isEven ? "lg:grid-flow-dense" : ""
                    }`}
                  >
                    {/* Visual Card */}
                    <div className={`lg:col-span-5 ${isEven ? "lg:col-start-8" : ""}`}>
                      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-950 aspect-4/3 border border-gray-100 shadow-sm group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-gray-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-gray-200 shadow-2xs">
                          {item.tag}
                        </span>
                        <span className="absolute bottom-3.5 left-3.5 text-white font-mono text-xs font-black bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                          ⏰ {item.time}
                        </span>
                      </div>
                    </div>

                    {/* Editorial Text */}
                    <div className={`lg:col-span-7 space-y-3 sm:space-y-4 ${isEven ? "lg:col-start-1" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                          {item.step}
                        </span>
                        <span className="h-0.5 w-8 bg-emerald-200 rounded-full" />
                      </div>

                      <h3 className="text-lg sm:text-2xl font-black text-gray-950 leading-tight">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>

                      <ul className="space-y-2 pt-2">
                        {item.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0c831f] flex items-center justify-center shrink-0">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== 5. THE SUBZIQUICK DIFFERENCE (HONEST COMPARISON TABLE) ===== */}
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                HONEST COMPARISON
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight mt-2.5">
                The SubziQuick Difference
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
                Why Bhopal families choose morning farm-direct harvest over supermarket aisles.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80 text-[10.5px] font-black text-gray-500 uppercase tracking-wider">
                      <th className="p-4 sm:p-5 w-1/3">Standard</th>
                      <th className="p-4 sm:p-5 w-1/3 bg-emerald-50 text-[#0c831f]">
                        🌿 SubziQuick Standard
                      </th>
                      <th className="p-4 sm:p-5 w-1/3 text-gray-400">Traditional Mandi / Dark Stores</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium">
                    {comparisons.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/40 transition">
                        <td className="p-4 sm:p-5 font-bold text-gray-900">
                          {row.aspect}
                        </td>
                        <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/30">
                          <div className="flex items-center gap-2">
                            <Check size={15} className="text-[#0c831f] shrink-0 stroke-[3]" />
                            <span>{row.subziQuick}</span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 text-gray-500">
                          <div className="flex items-center gap-2">
                            <X size={15} className="text-rose-400 shrink-0 stroke-[2.5]" />
                            <span>{row.traditional}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. HYPERLOCAL BHOPAL LOCALITY CHIPS ===== */}
        <section className="py-10 sm:py-14 bg-[#f8f9fa] border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-2xs">
              <div className="max-w-xl mb-5">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 inline-block mb-1.5">
                  DELIVERY COVERAGE
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-gray-950">
                  Delivering Across Bhopal City
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                  From breakfast smoothies to dinner tadka, our express riders bring fresh produce to your doorstep in 10-15 minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {neighborhoods.map((area, idx) => (
                  <Link
                    key={idx}
                    href={`/shop?locality=${encodeURIComponent(area)}`}
                    className="bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200/80 rounded-xl sm:rounded-2xl px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:text-emerald-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <MapPin size={12} className="text-[#0c831f]" />
                    <span>{area}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 7. MINIMALIST FAQS ACCORDION ===== */}
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-3xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                COMMON QUESTIONS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-2.5">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8f9fa] rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-gray-900 hover:text-[#0c831f] transition-colors cursor-pointer"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180 text-[#0c831f]" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3 font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 8. LUXURY BOTTOM CTA BANNER (WITH SHIMMER CTA) ===== */}
        <section className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-12 sm:py-16 font-sans">
          <div className="bg-gradient-to-r from-[#072815] via-[#0b4d24] to-[#0f8646] rounded-3xl p-6 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-xl text-left relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 text-emerald-200 px-3 py-1 rounded-full inline-block mb-3 border border-white/20">
                Taste the Mandi Difference
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white mb-2 tracking-tight">
                Cook With True Farm Freshness Today
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                Join thousands of Bhopal homes enjoying handpicked, sunrise-harvested produce delivered right to their kitchen counter in 10-15 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/shop">
                  <button
                    type="button"
                    className="relative overflow-hidden bg-white text-[#0f8646] hover:bg-emerald-50 px-6 sm:px-7 py-3 rounded-full font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 group/btn"
                  >
                    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
                    <span className="relative z-10">Shop Fresh Harvest</span>
                    <ArrowRight size={14} className="stroke-[2.5] relative z-10 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/30 hover:bg-white/10 text-white px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Contact Store
                </Link>
              </div>
            </div>

            <div className="hidden md:block shrink-0 relative z-10">
              <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-3xl bg-white/10 border border-white/20 p-2.5 backdrop-blur-xs flex items-center justify-center shadow-lg">
                <img
                  src="/hero_basket.jpg"
                  alt="SubziQuick Fresh Produce Basket"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
