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
  Phone,
  Check,
  X,
  Droplets,
  Sun,
  ShieldAlert,
  Star,
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
  const [comparisonTab, setComparisonTab] = useState<"freshness" | "pricing" | "hygiene">("freshness");

  const impactStats = [
    {
      num: "50K+",
      label: "Bhopal Kitchens",
      sub: "Trusted daily cooking families",
      icon: <Users className="text-emerald-400" size={22} />,
    },
    {
      num: "5:00 AM",
      label: "Sunrise Harvest",
      sub: "Direct local Kisan sourcing",
      icon: <Sun className="text-amber-400" size={22} />,
    },
    {
      num: "99.4%",
      label: "Pesticide Removal",
      sub: "Certified Ozone Bubble Wash",
      icon: <Droplets className="text-blue-400" size={22} />,
    },
    {
      num: "15–45m",
      label: "Express Dispatch",
      sub: "Amrai, Bagsewaniya Hub",
      icon: <Zap className="text-emerald-400" size={22} />,
    },
  ];

  const journeySteps = [
    {
      year: "2025",
      title: "The EV Auto Revolution",
      subtitle: "Doorstep Society Selling",
      desc: "Hamne Bhopal ki colonies (Arera Colony, Gulmohar, Shahpura, Kolar) me custom green EV Electric Autos ke zariye subah-subah kisan ki taaza sabzi direct doorstep par bechna shuru kiya. Logon ka vishwaas hi hamari pehchaan bana.",
      badge: "Grassroots",
    },
    {
      year: "2026",
      title: "Central Store in Bagsewaniya",
      subtitle: "Hygienic Hub & Cold Logistics",
      desc: "SubziQuick Central Store (Amrai, Bagsewaniya) establish hua, jahan advanced 100% Ozone Micro-Bubble wash system lagaya gaya taaki har sabzi zero-chemical ho sake.",
      badge: "Quality Standard",
    },
    {
      year: "Present",
      title: "1-Click Digital Platform",
      subtitle: "Bhopal's #1 Farm Produce App",
      desc: "subziquick.in par 120+ organic & exotic vegetables, fresh seasonal fruits, zero platform fee aur subah 6:00 AM se raat 10:00 PM tak express doorstep delivery.",
      badge: "City-Wide Network",
    },
  ];

  const pillars = [
    {
      title: "1. Sunrise 5:00 AM Harvest",
      subtitle: "Direct Kisan Cluster Sourcing",
      desc: "Zero warehouse cold-storage delay. Har subah suraj ugne ke sath Bhopal ke aas-paas ke local contract kisanon se taaza sabziyan todi jaati hain aur usi subah aapke kitchen tak deliver hoti hain.",
      tag: "5:00 AM Daily",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      icon: <Tractor size={20} className="text-[#0c831f]" />,
    },
    {
      title: "2. 100% Ozone Micro-Bubble Wash",
      subtitle: "Certified Pesticide Removal",
      desc: "Chemical detergents ke bina, pure natural ozone gas water se sabhi green leafy vegetables aur fruits ki deep cleansing hoti hai jo 99.4% pesticides, dust aur bacteria ko naturally khatam karti hai.",
      tag: "99.4% Clean",
      img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
      icon: <Droplets size={20} className="text-[#0c831f]" />,
    },
    {
      title: "3. Silent Green EV Auto Fleet",
      subtitle: "Zero Emission Eco-Delivery",
      desc: "Amrai, Bagsewaniya hub se Bhopal ke har kone me hamare Electric Delivery Autos silent aur eco-friendly tareeqe se dispatch hote hain — city pollution kam aur taazgi barkarar.",
      tag: "Eco-Friendly",
      img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
      icon: <Zap size={20} className="text-[#0c831f]" />,
    },
    {
      title: "4. No-Questions-Asked Guarantee",
      subtitle: "100% Instant UPI Refund",
      desc: "Agar delivery ke waqt koi bhi vegetable crispy ya fresh na lage, toh bina kisi bahas ke rider ko wapas kardein. Aapko turant 100% full UPI refund ya instant replacement milega.",
      tag: "Zero Risk",
      img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80",
      icon: <ShieldCheck size={20} className="text-[#0c831f]" />,
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
    { name: "Hoshangabad Road & Misrod", tag: "Sunrise Slot" },
    { name: "Ayodhya Bypass & Minal", tag: "Daily 6 AM" },
    { name: "Indrapuri & BHEL Area", tag: "Bulk Savings" },
    { name: "Awadhpuri & Piplani", tag: "Express 20m" },
    { name: "TT Nagar & New Market", tag: "Daily Morning" },
  ];

  const faqs = [
    {
      q: "SubziQuick dark-store grocery apps se alag kaise hai?",
      a: "Blinkit ya Zepto warehouse dark stores me sabziyon ko 3-5 din tak cold rooms me rakhte hain. SubziQuick me koi purani inventory nahi hoti; har roz subah 5:00 AM kisan se direct harvest lakar usi subah ozone-wash karke deliver kiya jata hai.",
    },
    {
      q: "100% Ozone Bubble Wash process kya hota hai?",
      a: "Ozone washing ek certified natural scientific process hai jo sabziyon ki surface par moujood chemical pesticides aur dust ko bina harmful soap ya detergents ke 99.4% khatam karta hai aur natural vitamins ko intact rakhta hai.",
    },
    {
      q: "Kya SubziQuick koi platform fee ya packaging charges leta hai?",
      a: "Nahi! SubziQuick par zero platform fee, zero hidden handling charge aur mandi ke direct wholesale rates milte hain.",
    },
    {
      q: "Agar koi item pasand na aaye toh kya replacement milega?",
      a: "Haan, 100%! Agar delivery ke time koi item crisp na lage, aap rider ko wapas de sakte hain aur aapko instant UPI refund ya free replacement diya jata hai.",
    },
  ];

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Navigation */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ===== 1. ULTRA-PREMIUM LUXURY HERO SECTION ===== */}
        <section className="relative bg-gradient-to-b from-[#042010] via-[#093e21] to-[#042010] text-white pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
          {/* Subtle Ambient Glow Lights */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
              
              {/* Left Editorial Copy */}
              <div className="w-full lg:w-7/12 text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-300 border border-emerald-400/30 text-xs font-black px-4 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-xs">
                  <Leaf size={14} className="text-emerald-400" />
                  <span>BHOPAL&apos;S OWN FARM-FRESH REVOLUTION</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5 text-white">
                  Khet Ki Taazgi, <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-amber-200 bg-clip-text text-transparent">
                    Bhopal Ka Vishwaas.
                  </span>
                </h1>

                <p className="text-green-100/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mb-8 font-normal">
                  2025 me Bhopal ki colonies me <strong>Green EV Electric Auto</strong> se taaza sabzi deliver karne se shuru hua safar, aaj Bhopal ke sabse vishwasniya farm-fresh network me badal chuka hai.
                </p>

                {/* Quick Trust Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
                  {[
                    { label: "100% Ozone Washed", icon: "🫧" },
                    { label: "5 AM Daily Harvest", icon: "🌾" },
                    { label: "Zero Platform Fee", icon: "💰" },
                    { label: "15-45m Express Slot", icon: "⚡" },
                  ].map((pill, i) => (
                    <div
                      key={i}
                      className="bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-xs rounded-2xl p-2.5 text-left transition"
                    >
                      <span className="text-sm sm:text-base block mb-0.5">{pill.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-white block leading-tight">
                        {pill.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/shop"
                    className="bg-[#0c831f] hover:bg-[#096618] text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-emerald-900/40 flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Order Farm Produce</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Team,%20I%20want%20to%20know%20more%20about%20your%20farm%20produce."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={17} className="text-[#25D366]" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Visual Image Showcase */}
              <div className="w-full lg:w-5/12 flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Main Image Frame */}
                  <div className="rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-emerald-950/80 relative">
                    <img
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                      alt="SubziQuick Bhopal Farm Story"
                      className="w-full h-[340px] sm:h-[420px] object-cover hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#042010] via-transparent to-black/30" />

                    {/* Live Badge */}
                    <div className="absolute top-4 left-4 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-[11px] font-black tracking-wide flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>Direct Farm Sourced</span>
                    </div>

                    {/* Bottom Store Hub Info */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block mb-1">
                        Central Hub & Dispatch
                      </span>
                      <h3 className="text-base sm:text-lg font-black leading-snug">
                        SubziQuick Store, Amrai, Bagsewaniya, Bhopal
                      </h3>
                      <p className="text-xs text-green-200 mt-1">
                        Daily 6:00 AM – 10:00 PM • Serving 20+ Bhopal Societies
                      </p>
                    </div>
                  </div>

                  {/* Floating Verified Badge */}
                  <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white text-gray-950 p-3.5 sm:p-4 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0c831f] flex items-center justify-center font-black shrink-0">
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

        {/* ===== 2. IMPACT STATS STRIP ===== */}
        <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {impactStats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight block">
                    {stat.num}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0c831f] block mt-0.5">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                    {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 3. THE 4 PILLARS OF SUBZIQUICK (VISUAL SHOWCASE) ===== */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black text-[#0c831f] uppercase tracking-wider bg-emerald-100/80 px-4 py-1 rounded-full border border-emerald-300/60">
              OUR UNCOMPROMISED STANDARDS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-3">
              Why SubziQuick is Bhopal’s Healthiest Choice
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
              Unlike warehouse apps with 4-day old inventory, we deliver sunrise fresh produce with zero chemical residues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-[#0c831f] flex items-center gap-1.5 shadow-md">
                    {item.icon}
                    <span>{item.tag}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                      {item.subtitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-5">
                    {item.desc}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0c831f]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> Standard Certified
                    </span>
                    <span className="text-gray-400 font-semibold text-[11px]">
                      Bhopal Wide
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 4. THE BHOPAL EV STORY (INSPIRING TIMELINE) ===== */}
        <section className="py-14 sm:py-20 bg-gradient-to-b from-[#f2f8f4] to-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-black text-[#0c831f] uppercase tracking-wider bg-emerald-100/80 px-4 py-1 rounded-full border border-emerald-300/60">
                OUR JOURNEY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-3">
                From Society EV Autos to SubziQuick App
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                Hamari shuruaat grassroots se hui — Electric Auto ki taazgi se hota hua poore Bhopal ka sabse trusted fresh store.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {journeySteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl sm:text-3xl font-black text-[#0c831f]">
                        {step.year}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <span className="text-xs font-bold text-[#0c831f] block mb-3">
                      {step.subtitle}
                    </span>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-extrabold text-[#0c831f] flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> SubziQuick Growth Milestone
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5. LOCALITY DELIVERY HUBS ===== */}
        <section className="py-12 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-[#093e21] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full inline-block mb-2">
                  📍 Hyperlocal Delivery Hubs
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Fast Doorstep Delivery Across Bhopal
                </h3>
                <p className="text-xs sm:text-sm text-green-100/90 mt-1 max-w-xl">
                  Dispatched directly from SubziQuick Central Store (Amrai, Bagsewaniya) with temperature-safe packing.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold shrink-0">
                <Zap size={15} className="text-yellow-300" />
                <span>6:00 AM – 10:00 PM Express Slots</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {localities.map((loc, idx) => (
                <Link
                  key={idx}
                  href={`/shop?locality=${encodeURIComponent(loc.name)}`}
                  className="bg-white/10 hover:bg-white text-white hover:text-gray-950 p-3.5 rounded-2xl border border-white/15 hover:border-white transition-all backdrop-blur-xs flex flex-col justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <MapPin size={14} className="text-yellow-300 group-hover:text-emerald-700 shrink-0" />
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-white/20 group-hover:bg-emerald-100 group-hover:text-emerald-800">
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

        {/* ===== 6. FREQUENTLY ASKED QUESTIONS ===== */}
        <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-black text-[#0c831f] uppercase tracking-wider bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300/60">
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
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== 7. LUXURY CALL TO ACTION CARD ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-20">
          <div className="bg-gradient-to-br from-[#093e21] via-[#0c831f] to-[#064e16] rounded-3xl p-6 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="max-w-xl relative z-10 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full inline-block mb-3">
                Experience Farm Freshness
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-2 text-white">
                Aaiye, Saath Milkar Bhopal Ko Healthy Banayein!
              </h2>
              <p className="text-green-100 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Order your daily fresh vegetables & seasonal fruits today and enjoy same-day delivery right to your kitchen in Bhopal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="bg-white text-[#0c831f] hover:bg-green-50 px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Shop Fresh Produce
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white/80 hover:bg-white/10 text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Contact Store Hub
                </Link>
              </div>
            </div>

            <div className="shrink-0 relative z-10 hidden lg:block">
              <div className="w-48 h-48 bg-white/10 rounded-3xl flex items-center justify-center p-3 backdrop-blur-xs border border-white/20 rotate-3 shadow-lg">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
