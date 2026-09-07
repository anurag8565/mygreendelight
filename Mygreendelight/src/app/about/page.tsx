"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Heart,
  Truck,
  Users,
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
  HelpCircle,
  Scale,
  RefreshCw,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion } from "framer-motion";

export default function AboutPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"story" | "standards" | "localities">("story");

  const impactMetrics = [
    {
      value: "50,000+",
      label: "Bhopal Households",
      sub: "Regular daily cooking families",
      icon: <Users className="text-[#0c831f]" size={20} />,
    },
    {
      value: "100%",
      label: "Ozone Washed",
      sub: "99.4% pesticide-free safety",
      icon: <Sparkles className="text-[#0c831f]" size={20} />,
    },
    {
      value: "5:00 AM",
      label: "Sunrise Farm Harvest",
      sub: "Direct local Kisan sourcing",
      icon: <Tractor className="text-[#0c831f]" size={20} />,
    },
    {
      value: "15–45 min",
      label: "Average Delivery",
      sub: "From Amrai Central Hub",
      icon: <Truck className="text-[#0c831f]" size={20} />,
    },
  ];

  const pillars = [
    {
      title: "Direct Kisan Harvest",
      tag: "Zero Middlemen",
      icon: <Tractor className="text-[#0c831f]" size={24} />,
      desc: "Hum har subah 5:00 AM Bhopal aur MP ke local kisan clusters se taaza sabziyan aur fruits source karte hain, jisse kisan ko sahi daam aur aapko authentic wholesale price milta hai.",
      highlight: "5:00 AM Daily Sourcing",
    },
    {
      title: "100% Ozone Bubble Wash",
      tag: "Lab Grade Clean",
      icon: <Sparkles className="text-[#0c831f]" size={24} />,
      desc: "Sabhi green veggies aur fruits certified natural ozone micro-bubble wash se saaf kiye jaate hain jo surface chemicals aur mitti ko bina detergent ke 99.4% eliminate karta hai.",
      highlight: "99.4% Pesticide Removal",
    },
    {
      title: "Eco-Friendly EV Fleet",
      tag: "Green Bhopal",
      icon: <Zap className="text-[#0c831f]" size={24} />,
      desc: "Electric delivery autos aur zero-emission dispatch ke sath hum Bhopal ke environment ko clean rakhte hue aapke kitchen tak direct silent doorstep delivery karte hain.",
      highlight: "Zero Carbon Emissions",
    },
    {
      title: "Doorstep Trust Guarantee",
      tag: "100% Customer First",
      icon: <ShieldCheck className="text-[#0c831f]" size={24} />,
      desc: "Agar koi item pasand na aaye ya crisp na ho, toh rider ko turant wapas karein — 100% no-questions-asked instant UPI refund ya hassle-free replacement.",
      highlight: "No Questions Refund",
    },
  ];

  const timeline = [
    {
      period: "The Beginning",
      title: "Direct Farm Partnerships",
      badge: "Roots",
      desc: "Bhopal ke aaspas ke progressive kisanon ke sath direct contract banaye taaki quality aur wholesale rates par control rahe.",
    },
    {
      period: "2025",
      title: "EV Electric Auto Society Rounds",
      badge: "Eco-Doorstep",
      desc: "Bhopal ki colonies (Arera Colony, Gulmohar, Shahpura, Kolar) me custom green EV Electric Autos ke zariye live fresh sabzi bechna shuru kiya.",
    },
    {
      period: "2026",
      title: "SubziQuick Digital Platform Launch",
      badge: "1-Click Online",
      desc: "Central Store (Amrai, Bagsewaniya) ke sath subziquick.in web platform live kiya, jahan 120+ taaza items par zero platform fee milti hai.",
    },
    {
      period: "Today & Ahead",
      title: "Bhopal's #1 Fresh Produce Network",
      badge: "City-Wide Express",
      desc: "20+ Bhopal societies me subah 6:00 AM se raat 10:00 PM tak express slots aur 100% ozone-cleaned guarantee ke sath delivery.",
    },
  ];

  const localities = [
    { name: "Arera Colony (E1–E8)", timing: "Express 15m" },
    { name: "MP Nagar (Zone 1 & 2)", timing: "High Demand" },
    { name: "Kolar Road & Chuna Bhatti", timing: "Daily Morning" },
    { name: "Bittan Market & E-4", timing: "Farm Fresh" },
    { name: "Gulmohar & Shahpura", timing: "Popular" },
    { name: "Bawadiya Kalan & Trilanga", timing: "Fast Dispatch" },
    { name: "Katara Hills & Bagsewaniya", timing: "Store Hub" },
    { name: "Hoshangabad Road & Misrod", timing: "Sunrise Slot" },
    { name: "Ayodhya Bypass & Minal", timing: "Daily 6 AM" },
    { name: "Indrapuri & BHEL", timing: "Bulk Savings" },
    { name: "Awadhpuri & Piplani", timing: "Express 20m" },
    { name: "TT Nagar & New Market", timing: "Daily Morning" },
    { name: "Salaiya & Rohit Nagar", timing: "Farm Direct" },
    { name: "Saket Nagar & AIIMS Area", timing: "Priority Slot" },
    { name: "Nehru Nagar & Kotra", timing: "Express 15m" },
    { name: "Lalghati & Kohefiza", timing: "Same Day" },
  ];

  const faqs = [
    {
      q: "SubziQuick ki sabziyan dark-store apps se alag kyun hain?",
      a: "Warehouse apps sabziyon ko 3-5 din tak cold dark rooms me store karte hain. SubziQuick har roz subah 5:00 AM kisan se fresh harvest lakar, ozone wash karke usi subah aapke kitchen tak deliver karta hai.",
    },
    {
      q: "100% Ozone Bubble Wash kya hai?",
      a: "Ozone washing ek certified natural purification process hai jo sabziyon aur fruits ki surface se 99.4% chemical pesticides, dust aur bacteria ko bina kisi harmful soap ya detergent ke remove karta hai.",
    },
    {
      q: "SubziQuick ka central store kahan located hai?",
      a: "Hamara central hub Amrai, Bagsewaniya, Bhopal (MP - 462043) me sthit hai, jahan se poore Bhopal me superfast dispatch hota hai.",
    },
    {
      q: "Kya koi platform ya hidden packaging fee lagti hai?",
      a: "Nahi! SubziQuick par zero platform fee, zero hidden handling charge aur honest wholesale mandi farm rates milte hain.",
    },
    {
      q: "Agar koi item pasand na aaye toh return kaise hoga?",
      a: "Aap delivery ke samay hi rider ko item wapas kar sakte hain. Aapko turant 100% instant UPI refund ya free replacement diya jata hai.",
    },
  ];

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Full Header Navigation */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ===== 1. MINIMAL HERO SECTION ===== */}
        <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 bg-gradient-to-b from-[#f2f8f4] via-white to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              
              {/* Left Content */}
              <div className="w-full lg:w-7/12 text-left">
                <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-[#0c831f] text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full mb-4 border border-emerald-300/60 shadow-2xs">
                  <Leaf size={13} className="text-[#0c831f]" />
                  <span>BORN IN BHOPAL • FARM-TO-FORK DIRECT</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-gray-950 tracking-tight leading-[1.12] mb-4 sm:mb-6">
                  Taazgi Khet Se, <br />
                  <span className="text-[#0c831f]">Bharosa Bhopal Ka.</span>
                </h1>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mb-6 font-normal">
                  2025 me Bhopal ki societies me <strong>Green EV Auto</strong> se taaza sabzi deliver karne se shuru hui hamari journey, aaj Bhopal ke sabse vishwasniya online farm-fresh network me badal chuki hai.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-8">
                  {[
                    "🥬 100% Ozone-Washed",
                    "🚜 Direct Kisan Rates",
                    "⚡ 15-45m Express Slot",
                    "💰 Zero Platform Fee",
                  ].map((pill, i) => (
                    <span
                      key={i}
                      className="bg-white border border-gray-200/90 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/shop"
                    className="bg-[#0c831f] hover:bg-[#096618] text-white px-6 sm:px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Start Shopping Fresh</span>
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <a
                    href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Team,%20I%20want%20to%20know%20more%20about%20your%20farm%20produce."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 px-5 sm:px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={16} className="text-[#25D366]" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Hero Visual Card */}
              <div className="w-full lg:w-5/12 flex justify-center">
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-emerald-950">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="SubziQuick Fresh Farm Harvest Bhopal"
                    className="w-full h-[320px] sm:h-[400px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-gray-900 text-xs font-black flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live 5:00 AM Harvest</span>
                  </div>

                  {/* Bottom Text Over Image */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#0c831f] text-white px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                      Bagsewaniya Central Store
                    </span>
                    <h3 className="text-lg font-black leading-tight text-white">
                      Pure chemical-free vegetables & seasonal fruits delivered fresh daily.
                    </h3>
                    <p className="text-xs text-green-200 mt-1">
                      Amrai, Bagsewaniya, Bhopal • 6:00 AM – 10:00 PM
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== 2. IMPACT NUMBERS STRIP (BENTO COUNTER) ===== */}
        <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {impactMetrics.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/80 rounded-3xl p-4 sm:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col items-start justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight block">
                    {item.value}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0c831f] block mt-0.5">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                    {item.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 3. THE 4 PILLARS OF SUBZIQUICK (BENTO GRID) ===== */}
        <section className="py-10 sm:py-16 bg-[#f8faf9] border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0c831f] bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
                WHY SUBZIQUICK IS DIFFERENT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mt-2.5">
                Our 4 Pillars of Uncompromised Freshness
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Designed to deliver healthier produce faster, cleaner, and cheaper than dark-store grocery apps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {pillar.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#0c831f] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#0c831f]">
                      ✓ {pillar.highlight}
                    </span>
                    <span className="text-gray-400 font-bold text-[11px]">
                      Verified Standard
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. THE BHOPAL STORY & EV JOURNEY ===== */}
        <section className="py-12 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0c831f] bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
              OUR STORY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mt-2.5">
              From Society EV Autos to SubziQuick App
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Hamara safar shuru hua Bhopal ke kisanon ke sath, EV Electric Auto ki taazgi se hota hua ek modern digital platform tak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {timeline.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      {step.period}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0c831f] border border-emerald-200">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-gray-900 mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 text-[11px] font-bold text-[#0c831f] flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>SubziQuick Milestone</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 5. TABBED INTERACTIVE EXPLORER (Localities & FAQs) ===== */}
        <section className="py-10 sm:py-16 bg-[#f8faf9] border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            
            {/* Tab Switcher */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveTab("story")}
                className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeTab === "story"
                    ? "bg-[#0c831f] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                🌿 Hygiene & Promise
              </button>
              <button
                onClick={() => setActiveTab("localities")}
                className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeTab === "localities"
                    ? "bg-[#0c831f] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                📍 Bhopal Localities
              </button>
              <button
                onClick={() => setActiveTab("standards")}
                className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeTab === "standards"
                    ? "bg-[#0c831f] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                ❓ FAQs
              </button>
            </div>

            {/* TAB CONTENT 1: HYGIENE & PROMISE */}
            {activeTab === "story" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    Hamara 100% Customer First Commitment
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    SubziQuick ka har order aapke ghar tak highest hygiene aur fresh standards ke sath pahunchaya jata hai. Agar kisan ki harvest me koi quality kami lage, toh bina kisi argument ke instant doorstep refund ya replacement milega.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl">
                    <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 mb-1">
                      <Sparkles size={14} className="text-[#0c831f]" />
                      Zero Harsh Detergents
                    </h4>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Sirf certified pure ozone micro-bubble wash jo natural minerals aur taste ko preserve karta hai.
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl">
                    <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={14} className="text-[#0c831f]" />
                      Breathable Paper Packaging
                    </h4>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Zero harmful plastic packing jo sabziyon ko 48 ghante tak naturally fresh rakhti hai.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT 2: LOCALITIES */}
            {activeTab === "localities" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      Bhopal Delivery Network
                    </h3>
                    <p className="text-xs text-gray-500">
                      Dispatched directly from Amrai, Bagsewaniya store hub
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-100 text-[#0c831f] px-2.5 py-1 rounded-full">
                    15–45 Min Slots
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {localities.map((loc, idx) => (
                    <Link
                      key={idx}
                      href={`/shop?locality=${encodeURIComponent(loc.name)}`}
                      className="bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 p-3 rounded-2xl transition flex flex-col justify-between group"
                    >
                      <span className="text-xs font-bold text-gray-900 group-hover:text-[#0c831f] truncate">
                        {loc.name}
                      </span>
                      <span className="text-[10px] text-gray-400 group-hover:text-emerald-700 font-semibold mt-1">
                        • {loc.timing}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT 3: FAQS */}
            {activeTab === "standards" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
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
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

          </div>
        </section>

        {/* ===== 6. LUXURY BOTTOM ACTION CARD ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          <div className="bg-gradient-to-br from-[#093e21] via-[#0c831f] to-[#064e16] rounded-3xl p-6 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="max-w-xl relative z-10 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full inline-block mb-3">
                Experience Farm Freshness
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2 text-white">
                Aaiye, Saath Milkar Bhopal Ko Healthy Banayein!
              </h2>
              <p className="text-green-100 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Order your daily fresh vegetables & seasonal fruits today and enjoy same-day delivery right to your kitchen in Bhopal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="bg-white text-[#0c831f] hover:bg-green-50 px-6 sm:px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Shop Produce Now
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white/80 hover:bg-white/10 text-white px-6 sm:px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Contact Store
                </Link>
              </div>
            </div>

            <div className="shrink-0 relative z-10 hidden lg:block">
              <div className="w-44 h-44 bg-white/10 rounded-3xl flex items-center justify-center p-3 backdrop-blur-xs border border-white/20 rotate-2">
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80"
                  alt="Fresh Bhopal Vegetables"
                  className="w-full h-full object-cover rounded-2xl shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Full Footer */}
      <Footer />
    </div>
  );
}
