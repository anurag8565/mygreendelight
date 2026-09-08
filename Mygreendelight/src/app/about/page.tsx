"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
  Tractor,
  Zap,
  Award,
  Store,
  MessageCircle,
  Phone,
  Check,
  X,
  Droplets,
  Sun,
  Users,
  Shield,
  HeartHandshake,
  Truck,
  RotateCcw,
} from "lucide-react";
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

  const impactStats = [
    {
      num: "50,000+",
      label: "Bhopal Kitchens",
      sub: "Happy cooking families",
      icon: <Users className="text-[#0f8646]" size={22} />,
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      num: "5:00 AM",
      label: "Sunrise Harvest",
      sub: "Direct Kisan cluster sourcing",
      icon: <Sun className="text-amber-500" size={22} />,
      bg: "bg-amber-50 border-amber-100",
    },
    {
      num: "99.4%",
      label: "Ozone Washed",
      sub: "Certified pesticide removal",
      icon: <Droplets className="text-blue-500" size={22} />,
      bg: "bg-blue-50 border-blue-100",
    },
    {
      num: "10-15 Min",
      label: "Express Delivery",
      sub: "From Bagsewaniya Central Hub",
      icon: <Zap className="text-emerald-500" size={22} />,
      bg: "bg-emerald-50 border-emerald-100",
    },
  ];

  const pillars = [
    {
      number: "01",
      title: "Direct Kisan Sunrise Harvest",
      tag: "5:00 AM Daily",
      desc: "Zero multi-day cold storage delay. Every morning at sunrise, our produce is harvested directly from local partner farms around Bhopal, Sehore, and Raisen, reaching your kitchen within hours of harvest.",
      img: "/banners/veggies_clean_4k.jpg",
      icon: <Tractor size={18} className="text-[#0f8646]" />,
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    },
    {
      number: "02",
      title: "100% Ozone Micro-Bubble Cleansing",
      tag: "Certified Safe",
      desc: "We wash our leafy greens and vegetables using certified ozone micro-bubble water. This scientific process removes 99.4% of chemical pesticides, bacteria, and roadside dust without damaging natural vitamins.",
      img: "/categories/vegetables_4k.jpg",
      icon: <Droplets size={18} className="text-blue-600" />,
      badgeColor: "bg-blue-100 text-blue-900 border-blue-200",
    },
    {
      number: "03",
      title: "Hyperlocal Quick-Commerce Fleet",
      tag: "10-15 Min Express",
      desc: "Dispatched from our dedicated Central Store Hub at Amrai, Bagsewaniya. Clean, temperature-maintained packing ensures zero bruising and crisp quality on delivery.",
      img: "/banners/fruits_clean_4k.jpg",
      icon: <Zap size={18} className="text-amber-600" />,
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    },
    {
      number: "04",
      title: "No-Questions-Asked Guarantee",
      tag: "100% Risk Free",
      desc: "Inspect your produce at your doorstep. If any item is not fresh, return it instantly to our rider for a full 100% instant UPI refund or immediate replacement.",
      img: "/banners/exotics_clean_4k.jpg",
      icon: <ShieldCheck size={18} className="text-purple-600" />,
      badgeColor: "bg-purple-100 text-purple-900 border-purple-200",
    },
  ];

  const storyMilestones = [
    {
      year: "2025",
      title: "Grassroots EV Auto Delivery",
      subtitle: "Bhopal Society Doorstep Sourcing",
      desc: "Started by delivering farm-fresh vegetables directly to residential societies (Arera Colony, Shahpura, Gulmohar) in clean green EV electric autos. Building customer trust at the grassroots level.",
      tag: "The Inception",
    },
    {
      year: "2026",
      title: "Bagsewaniya Central Store & Ozone Plant",
      subtitle: "State-of-the-Art Cleansing Hub",
      desc: "Established the SubziQuick Central Hub in Amrai, Bagsewaniya with an advanced ozone micro-bubble washing infrastructure to eliminate harmful chemicals from daily food.",
      tag: "Quality Standard",
    },
    {
      year: "Today",
      title: "Bhopal's #1 Fresh Farm App",
      subtitle: "subziquick.in Digital Network",
      desc: "Serving 20+ Bhopal localities with 150+ farm-fresh vegetables, seasonal orchard fruits, hydroponic exotics, zero platform fee, and 10-15 minute doorstep delivery.",
      tag: "Quick Commerce",
    },
  ];

  const comparisons = [
    {
      feature: "Produce Freshness",
      subziQuick: "Same-Day 5 AM Sunrise Harvest",
      mandi: "1-2 Days Old (Exposed to Road Dust)",
      darkStore: "3-5 Days Old in Warehouse Storage",
    },
    {
      feature: "Chemical & Pesticide Wash",
      subziQuick: "100% Certified Ozone Micro-Bubble Wash",
      mandi: "Unwashed / Dusty Water Splash",
      darkStore: "Standard Warehousing (No Ozone)",
    },
    {
      feature: "Delivery Speed",
      subziQuick: "10-15 Min Hyperlocal Express",
      mandi: "Manual Travel & Bargaining",
      darkStore: "Variable (Surge Delay During Peak)",
    },
    {
      feature: "Pricing Transparency",
      subziQuick: "Transparent Wholesale Rates (No Hidden Fees)",
      mandi: "Inconsistent Daily Price Fluctuations",
      darkStore: "High Platform Fees & Delivery Markups",
    },
    {
      feature: "Quality Guarantee",
      subziQuick: "Doorstep Inspection + Instant UPI Refund",
      mandi: "No Returns Possible",
      darkStore: "Tedious Chat Support & Long Wait",
    },
  ];

  const localities = [
    { name: "Arera Colony (E1–E8)", tag: "Express 15m" },
    { name: "MP Nagar (Zone 1 & 2)", tag: "High Demand" },
    { name: "Kolar Road & Chuna Bhatti", tag: "Daily Morning" },
    { name: "Bittan Market & E-4", tag: "Farm Fresh" },
    { name: "Gulmohar & Shahpura", tag: "Popular" },
    { name: "Bawadiya Kalan & Trilanga", tag: "Fast Dispatch" },
    { name: "Katara Hills & Bagsewaniya", tag: "Central Hub" },
    { name: "Hoshangabad Road & Misrod", tag: "Express 15m" },
    { name: "Ayodhya Bypass & Minal", tag: "Daily 6 AM" },
    { name: "Indrapuri & BHEL Area", tag: "Daily Morning" },
    { name: "Awadhpuri & Piplani", tag: "Express 20m" },
    { name: "TT Nagar & New Market", tag: "Fast Dispatch" },
  ];

  const faqs = [
    {
      q: "How is SubziQuick different from warehouse dark-store apps?",
      a: "Warehouse grocery apps store produce in cold rooms for 3 to 5 days. SubziQuick operates on a same-day model: vegetables are sourced fresh at 5:00 AM directly from local partner farms, ozone-washed, and delivered straight to your kitchen in Bhopal.",
    },
    {
      q: "What is 100% Ozone Micro-Bubble Cleansing?",
      a: "Ozone washing is a certified, natural scientific process. Ozone gas dissolved in water eliminates 99.4% of surface pesticides, bacteria, and dust without any harsh chemicals or detergents, leaving vitamins and minerals completely intact.",
    },
    {
      q: "Do you charge any hidden platform fees or packing charges?",
      a: "No! SubziQuick has zero platform fees, zero surge charges, and transparent farm pricing.",
    },
    {
      q: "What if I am not satisfied with the produce delivered?",
      a: "We offer a 100% No-Questions-Asked Guarantee. You can check the produce at your doorstep and return any unsatisfactory item to our rider for an instant UPI refund or immediate free replacement.",
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Navigation */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ===== 1. HERO SECTION (BRIGHT, CLEAN & LUXURY) ===== */}
        <section className="relative bg-gradient-to-b from-emerald-50/80 via-emerald-50/20 to-white pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden border-b border-gray-100">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#0f8646]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-7 text-left space-y-5">
                <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs font-black px-4 py-1.5 rounded-full shadow-2xs">
                  <Leaf size={14} className="text-[#0f8646]" />
                  <span>BORN IN BHOPAL • FARM-TO-KITCHEN IN 15 MINS</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.12]">
                  Fresh From The Farm, <br />
                  <span className="text-[#0f8646]">
                    Trusted by Bhopal.
                  </span>
                </h1>

                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
                  SubziQuick brings <strong>100% Ozone-Washed, Chemical-Free produce</strong> directly from local Bhopal & Sehore Kisan farms to your kitchen in 10-15 minutes — with zero cold-storage delay and zero hidden platform fees.
                </p>

                {/* Quick Quality Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {[
                    { label: "100% Ozone Washed", icon: <Droplets size={16} className="text-blue-500" /> },
                    { label: "5 AM Sunrise Harvest", icon: <Leaf size={16} className="text-[#0f8646]" /> },
                    { label: "10-15 Min Express", icon: <Zap size={16} className="text-amber-500 fill-amber-400" /> },
                    { label: "Instant UPI Refund", icon: <ShieldCheck size={16} className="text-teal-600" /> },
                  ].map((pill, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200/80 rounded-2xl p-2.5 sm:p-3 shadow-2xs flex items-center gap-2"
                    >
                      <span className="shrink-0">{pill.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-gray-800 leading-tight">
                        {pill.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-3">
                  <Link
                    href="/shop"
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Order Farm Produce</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Team,%20I%20want%20to%20know%20more%20about%20your%20farm%20produce."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={17} className="text-[#25D366]" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-xl bg-gray-950 relative aspect-4/5">
                    <img
                      src="/banners/veggies_clean_4k.jpg"
                      alt="SubziQuick Bhopal Farm Fresh Harvest"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Live Hub Pill */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-black flex items-center gap-2 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#0f8646] animate-ping shrink-0" />
                      <span>Central Store Hub Live</span>
                    </div>

                    {/* Bottom Hub Details */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block mb-1">
                        Amrai, Bagsewaniya, Bhopal
                      </span>
                      <h3 className="text-base sm:text-lg font-black leading-snug">
                        SubziQuick Central Distribution Hub
                      </h3>
                      <p className="text-xs text-gray-200 mt-1">
                        Daily 6:00 AM – 10:00 PM • Serving 20+ Bhopal Societies
                      </p>
                    </div>
                  </div>

                  {/* Floating Certified Badge */}
                  <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white text-gray-950 p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black block text-gray-900 leading-tight">
                        100% Ozone Washed
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold block">
                        99.4% Pesticide Removal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== 2. IMPACT STATS ===== */}
        <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {impactStats.map((stat, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-5 sm:p-6 border ${stat.bg} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-2xs">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-100">
                    Verified
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight block">
                    {stat.num}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0f8646] block mt-0.5">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                    {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 3. 4 QUALITY PILLARS ===== */}
        <section className="py-12 sm:py-18 bg-gray-50/60 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-xs font-black text-[#0f8646] uppercase tracking-wider bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
                OUR UNCOMPROMISED QUALITY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-3">
                Why SubziQuick is Bhopal’s Healthiest Choice
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                Unlike dark-store warehouse apps with 4-day old inventory, we deliver sunrise fresh produce with certified chemical removal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {pillars.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-950">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <span className={`absolute top-3 left-3 text-[10.5px] font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor} shadow-xs`}>
                      {item.tag}
                    </span>

                    <span className="absolute bottom-3 right-3 text-2xl font-black text-white/30 font-mono">
                      {item.number}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-black text-gray-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-normal mt-2">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0f8646]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> SubziQuick Certified
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. THE SUBZIQUICK DIFFERENCE (COMPARISON TABLE) ===== */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-black text-[#0f8646] uppercase tracking-wider bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
              TRANSPARENT COMPARISON
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-3">
              How SubziQuick Beats The Rest
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
              See why over 50,000 Bhopal households trust SubziQuick for daily cooking.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-black text-gray-700 uppercase tracking-wider">
                    <th className="p-4 sm:p-5 w-1/4">Feature</th>
                    <th className="p-4 sm:p-5 w-1/3 bg-emerald-50/80 text-[#0f8646] border-x border-emerald-200/80">
                      🌿 SubziQuick
                    </th>
                    <th className="p-4 sm:p-5 w-1/4 text-gray-500">Traditional Mandi / Thela</th>
                    <th className="p-4 sm:p-5 w-1/4 text-gray-500">Warehouse Dark-Store Apps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium">
                  {comparisons.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/40 transition">
                      <td className="p-4 sm:p-5 font-black text-gray-900">
                        {row.feature}
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-[#0f8646] bg-emerald-50/40 border-x border-emerald-100">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-[#0f8646] shrink-0 stroke-[3]" />
                          <span>{row.subziQuick}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <X size={15} className="text-red-500 shrink-0 stroke-[2.5]" />
                          <span>{row.mandi}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <X size={15} className="text-red-500 shrink-0 stroke-[2.5]" />
                          <span>{row.darkStore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===== 5. THE BHOPAL STORY TIMELINE ===== */}
        <section className="py-14 sm:py-20 bg-emerald-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-black uppercase tracking-wider bg-white/15 text-emerald-300 px-3.5 py-1 rounded-full border border-white/20">
                OUR JOURNEY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3">
                From Society EV Autos to Bhopal’s #1 Farm App
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 mt-2 font-medium">
                Our journey started from grassroots electric autos and evolved into Bhopal’s most reliable fresh commerce network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {storyMilestones.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                        {step.year}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full">
                        {step.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white mb-1">
                      {step.title}
                    </h3>
                    <span className="text-xs font-bold text-emerald-300 block mb-3">
                      {step.subtitle}
                    </span>

                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/15 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Milestone Accomplished
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 6. LOCALITY HUBS ===== */}
        <section className="py-12 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-[#0f8646] px-3 py-1 rounded-full inline-block mb-2 border border-emerald-200">
                  📍 Hyperlocal Delivery Hubs
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Delivering Across All Bhopal Neighborhoods
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
                  Dispatched directly from SubziQuick Central Store Hub (Amrai, Bagsewaniya) in 10-15 minutes.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs shrink-0">
                <Zap size={15} className="text-[#0f8646]" />
                <span>6:00 AM – 10:00 PM Express Slots</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {localities.map((loc, idx) => (
                <Link
                  key={idx}
                  href={`/shop?locality=${encodeURIComponent(loc.name)}`}
                  className="bg-white hover:bg-emerald-50 text-gray-800 hover:text-emerald-950 p-3.5 rounded-2xl border border-gray-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <MapPin size={14} className="text-[#0f8646] shrink-0" />
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {loc.tag}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold truncate">
                    {loc.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 7. FREQUENTLY ASKED QUESTIONS ===== */}
        <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-black text-[#0f8646] uppercase tracking-wider bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2.5">
              Everything You Need to Know
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

        {/* ===== 8. LUXURY BOTTOM CALL TO ACTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-20">
          <div className="bg-gradient-to-r from-[#052e16] via-[#0f8646] to-[#042010] rounded-3xl p-7 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="max-w-xl relative z-10 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full inline-block mb-3">
                100% Farm Fresh Bhopal Experience
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-2 text-white">
                Experience Real Farm Produce Today
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Order your daily vegetables & fruits today and enjoy certified ozone-washed fresh produce delivered right to your kitchen in Bhopal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="bg-white text-[#0f8646] hover:bg-emerald-50 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Shop Fresh Produce
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white/80 hover:bg-white/10 text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-black text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Contact Store Hub
                </Link>
              </div>
            </div>

            <div className="shrink-0 relative z-10 hidden lg:block">
              <div className="w-52 h-52 bg-white/10 rounded-3xl flex items-center justify-center p-3 backdrop-blur-xs border border-white/20 shadow-lg">
                <img
                  src="/banners/veggies_clean_4k.jpg"
                  alt="Fresh Bhopal Vegetables"
                  className="w-full h-full object-cover rounded-2xl shadow-md"
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
