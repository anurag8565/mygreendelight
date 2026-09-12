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
  Droplets,
  Sun,
  Users,
  Check,
  X,
  Zap,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    {
      value: "5:00 AM",
      label: "Sunrise Harvest",
      desc: "Freshly picked daily from local farmer clusters",
      icon: <Sun size={20} className="text-amber-500" />,
    },
    {
      value: "100%",
      label: "Hand-Graded Fresh",
      desc: "Sorted & triple-checked for crisp A-grade quality",
      icon: <ShieldCheck size={20} className="text-emerald-600" />,
    },
    {
      value: "10-15m",
      label: "Express Delivery",
      desc: "Packed on-demand for crisp garden crunch",
      icon: <Zap size={20} className="text-emerald-500" />,
    },
    {
      value: "₹0",
      label: "Zero Hidden Fees",
      desc: "Direct farm-gate pricing with zero markups",
      icon: <ShieldCheck size={20} className="text-teal-600" />,
    },
  ];

  const pillars = [
    {
      number: "01",
      tag: "Harvested at Sunrise",
      title: "Direct from the soil, never sitting in cold rooms.",
      desc: "Most city vegetables sit in multi-day warehouse storage losing natural water content, crunch, and essential vitamins. At SubziQuick, every morning begins at 5:00 AM with our partner farmers around Bhopal. What was in the ground at dawn reaches your cutting board within hours.",
      image: "/hero_fresh_farm.jpg",
      points: ["Zero multi-day cold storage", "Crisp natural texture & aroma", "Fair prices directly to local kisans"],
    },
    {
      number: "02",
      tag: "Triple Quality Check",
      title: "Hand-sorted, graded & cleaned for crisp perfection.",
      desc: "We reject wilted, bruised, or substandard produce at the gate. Every batch of leafy greens and daily vegetables is carefully hand-sorted, graded, and cleaned with pure running water to eliminate field dust and grime—delivering only fresh, kitchen-ready vegetables.",
      image: "/banners/veggies_clean_4k.jpg",
      points: ["100% A-grade produce selection", "Pure cold water rinse for crisp crunch", "Zero wilted or damaged pieces"],
    },
    {
      number: "03",
      tag: "Total Transparency",
      title: "Inspect at your doorstep. 100% instant refund.",
      desc: "We believe trust is earned at the doorstep, not on marketing billboards. When our rider arrives, take a moment to inspect your fresh produce. If any item fails to meet your highest freshness standards, hand it back for an instant UPI refund or replacement on the spot.",
      image: "/banners/fruits_clean_4k.jpg",
      points: ["Open-box doorstep check", "Instant UPI cashback or replacement", "Zero annoying customer support tickets"],
    },
  ];

  const comparisons = [
    {
      aspect: "Sourcing & Storage",
      subziQuick: "Picked at 5 AM sunrise, delivered same day",
      traditional: "3 to 5 days old in transit & mandi open air",
    },
    {
      aspect: "Safety & Hygiene",
      subziQuick: "Triple-checked hand grading & clean water rinse",
      traditional: "Sprayed with dirty water or left unwashed in dust",
    },
    {
      aspect: "Delivery Speed",
      subziQuick: "10–15 minute express doorstep arrival",
      traditional: "Variable slots with unpredictable delays",
    },
    {
      aspect: "Pricing & Fees",
      subziQuick: "Zero platform fees, zero surge charges",
      traditional: "Hidden convenience fees & high delivery surcharges",
    },
    {
      aspect: "Freshness Guarantee",
      subziQuick: "Inspect at doorstep • Instant UPI refund",
      traditional: "No return policy or painful ticket delays",
    },
  ];

  const neighborhoods = [
    "Arera Colony",
    "MP Nagar",
    "Kolar Road",
    "Shahpura",
    "Gulmohar",
    "Bawadiya Kalan",
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
      a: "Our entire supply chain is streamlined for morning throughput. Farmers harvest at sunrise, our express packing stations hand-sort and clean immediately, and our hyperlocal delivery fleet delivers directly across Bhopal within 10-15 minutes.",
    },
    {
      q: "How does SubziQuick ensure produce cleanliness and hygiene?",
      a: "Every batch is inspected at sunrise upon arrival from the farms. We hand-grade every item to remove damaged pieces, rinse leafy vegetables under pure running water to wash off field dust, and pack them in ventilated eco-friendly containers.",
    },
    {
      q: "Are there any hidden platform charges or surge fees?",
      a: "None. What you see is what you pay. We charge zero platform fees, zero surge pricing during peak hours, and keep farm-gate pricing honest and accessible.",
    },
    {
      q: "What if I am not happy with the quality of an item?",
      a: "You can inspect your order right at your doorstep when the delivery arrives. If any vegetable or fruit doesn't meet your satisfaction, you can return it to the rider immediately for an instant refund or replacement.",
    },
  ];

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950 text-gray-900">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ===== 1. HERO SECTION (MINIMALIST & EYE-CATCHING) ===== */}
        <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-gray-100/80 bg-gradient-to-b from-emerald-50/50 via-[#fbfcfb] to-[#fbfcfb]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              {/* Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-white text-emerald-900 border border-emerald-200/80 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs mb-6"
              >
                <Leaf size={14} className="text-[#0f8646]" />
                <span>The SubziQuick Story • Born in Bhopal</span>
              </motion.div>

              {/* Minimalist Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.1] mb-6"
              >
                Pure farm harvest. <br />
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Straight to your kitchen.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-2xl font-normal"
              >
                We started SubziQuick to end the compromise between wilted roadside produce and days-old warehouse dark stores. Sourced at dawn from regional growers, handpicked for quality, and delivered crisp in 10-15 minutes.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                <Link
                  href="/shop"
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-7 sm:px-8 py-3 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Fresh Harvest</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20farm%20produce."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-6 sm:px-7 py-3 rounded-full font-bold text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <FaWhatsapp size={16} className="text-[#25D366]" />
                  <span>WhatsApp Concierge</span>
                </a>
              </motion.div>
            </div>

            {/* Minimalist Hero Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-12 sm:mt-16 max-w-5xl mx-auto"
            >
              <div className="relative rounded-3xl overflow-hidden border border-gray-200/70 shadow-lg bg-gray-950 aspect-16/9 sm:aspect-21/9 max-h-[440px]">
                <img
                  src="/hero_fresh_farm.jpg"
                  alt="SubziQuick Fresh Farm Harvest Bhopal"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Floating Clean Badge */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-300 block mb-0.5">
                      100% Chemical-Free Promise
                    </span>
                    <h2 className="text-base sm:text-xl font-black text-white">
                      From Morning Dew to Your Cutting Board
                    </h2>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles size={13} className="text-amber-300" />
                    <span>Tested & Hand-Graded Daily</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== 2. KEY METRICS STRIP (MINIMALIST & CLEAN) ===== */}
        <section className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-2xs hover:shadow-xs hover:border-emerald-200/80 transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 font-normal mt-0.5 leading-snug">
                    {stat.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 3. THREE CORE PILLARS (EDITORIAL & ELEGANT) ===== */}
        <section className="py-12 sm:py-20 bg-white border-y border-gray-100/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-3">
                How We Deliver True Freshness
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-normal">
                Three simple standards that define everything we do at SubziQuick.
              </p>
            </div>

            <div className="space-y-12 sm:space-y-16">
              {pillars.map((pillar, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <div
                    key={idx}
                    className={`grid lg:grid-cols-12 gap-8 sm:gap-12 items-center ${
                      isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Visual Card */}
                    <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : ""}`}>
                      <div className="relative rounded-3xl overflow-hidden border border-gray-200/80 shadow-md bg-gray-950 aspect-4/3 group">
                        <img
                          src={pillar.image}
                          alt={pillar.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-gray-900 text-xs font-black px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
                          {pillar.tag}
                        </span>
                      </div>
                    </div>

                    {/* Editorial Content */}
                    <div className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-1" : ""}`}>
                      <span className="text-3xl sm:text-4xl font-black text-emerald-600/30 font-mono block">
                        {pillar.number}
                      </span>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {pillar.desc}
                      </p>

                      <ul className="space-y-2 pt-2">
                        {pillar.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-800">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center shrink-0">
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

        {/* ===== 4. THE SUBZIQUICK DIFFERENCE (CLEAN CONTRAST) ===== */}
        <section className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              HONEST COMPARISON
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-3">
              The SubziQuick Difference
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-normal">
              Why thousands of Bhopal families have made the switch to clean, farm-direct food.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[580px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                    <th className="p-4 sm:p-5 w-1/3">Standard</th>
                    <th className="p-4 sm:p-5 w-1/3 bg-emerald-50/50 text-[#0f8646]">
                      🌿 SubziQuick Standard
                    </th>
                    <th className="p-4 sm:p-5 w-1/3 text-gray-400">Traditional Market / Dark Stores</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium">
                  {comparisons.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition">
                      <td className="p-4 sm:p-5 font-bold text-gray-900">
                        {row.aspect}
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                        <div className="flex items-center gap-2">
                          <Check size={15} className="text-[#0f8646] shrink-0 stroke-[3]" />
                          <span>{row.subziQuick}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-gray-500">
                        <div className="flex items-center gap-2">
                          <X size={15} className="text-rose-400 shrink-0 stroke-[2]" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===== 5. NEIGHBORHOODS DELIVERED (MINIMALIST PILLS) ===== */}
        <section className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/70 shadow-2xs">
            <div className="max-w-xl mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
                COVERAGE
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                Delivering Across Bhopal
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                From morning breakfast to evening dinner, our express riders bring taaza sabzi to your doorstep in 10-15 minutes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {neighborhoods.map((area, idx) => (
                <Link
                  key={idx}
                  href={`/shop?locality=${encodeURIComponent(area)}`}
                  className="bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200/80 rounded-full px-4 py-1.5 text-xs font-bold text-gray-700 hover:text-emerald-950 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin size={12} className="text-[#0f8646]" />
                  <span>{area}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 6. FREQUENTLY ASKED QUESTIONS ===== */}
        <section className="py-10 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              FAQS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-2.5">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-gray-900 hover:text-[#0f8646] transition-colors cursor-pointer"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-[#0f8646]" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== 7. MINIMALIST CALL TO ACTION ===== */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-24">
          <div className="bg-gradient-to-r from-emerald-900 via-[#0f8646] to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="max-w-xl text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 text-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
                Experience Real Farm Freshness
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white mb-2">
                Cook With Fresh Produce Today
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Join thousands of Bhopal homes enjoying handpicked, sunrise-harvested vegetables and fruits delivered to your door in 10-15 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="bg-white text-[#0f8646] hover:bg-emerald-50 px-7 py-3 rounded-full font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Shop Fresh Harvest
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/40 hover:bg-white/10 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Get In Touch
                </Link>
              </div>
            </div>

            <div className="hidden lg:block shrink-0">
              <div className="w-40 h-40 rounded-2xl bg-white/10 border border-white/20 p-2 backdrop-blur-xs flex items-center justify-center shadow-md">
                <img
                  src="/hero_basket.jpg"
                  alt="SubziQuick Fresh Basket"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
