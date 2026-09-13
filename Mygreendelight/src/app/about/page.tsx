"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Leaf,
  Zap,
  IndianRupee,
  ShieldCheck,
  Quote,
  Clock,
  CheckCircle2,
  Store,
  MapPin,
  Tractor,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TrustRibbon from "@/components/TrustRibbon";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function AboutPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  const journeyChapters = [
    {
      step: "01",
      badge: "2020 • Jab Sab Kuch Ruk Gaya",
      title: "Papa Ki Job Chali Gayi Aur Thela Uthana",
      desc: "Mere papa ki job chali gayi. Achanak, bina kisi warning ke. Ghar chalana tha, aur us waqt koi doosra option nazar nahi aa raha tha. Papa ne haar nahi maani — unhone ek thela uthaya aur sabzi bechna shuru kar diya. Subah 4:30 baje mandi jaana, din bhar galiyon mein thela ghumaana, garmi ho ya baarish — papa ne kabhi peeche mudkar nahi dekha.",
      highlight: "Subah 4:30 AM Mandi • Dhoop-Baarish Mein Mehnat",
      tagColor: "bg-amber-100 text-amber-900 border-amber-200",
      accentDot: "bg-amber-500",
    },
    {
      step: "02",
      badge: "The Turning Point • Ek Beta, Ek Idea",
      title: "Papa Ki Mehnat Ko Online Lane Ka Sapna",
      desc: "Main unhe roz mehnat karte dekhta tha. Ek din socha — \"kyun na isse online le jaayein?\" Bas wahin se shuru hui Subzi Quick ki kahani — ek thele se nikalkar ek online platform tak ka safar. Wahi taazi sabzi, wahi papa ki mehnat aur imaandari, ab sirf ek click door.",
      highlight: "Traditional Trust Meets Fast 15-Min Tech",
      tagColor: "bg-emerald-100 text-[#0c6a38] border-emerald-200",
      accentDot: "bg-[#0f8646]",
    },
    {
      step: "03",
      badge: "Aaj Hum Kahan Hain • Growing With You",
      title: "Thele Se Pura Online Store — Same Values",
      desc: "Jo kabhi ek chhota sa thela tha, aaj woh ek pura online store ban chuka hai — lekin values wahi hain jo papa ne shuru se sikhayi: taazgi, imaandari, aur mehnat. Har order jo aap dete hain, woh sirf ek transaction nahi — yeh ek family ki mehnat aur ek naye sapne ka hissa hai.",
      highlight: "Values First: Taazgi, Imaandari, Mehnat",
      tagColor: "bg-blue-100 text-blue-900 border-blue-200",
      accentDot: "bg-blue-600",
    },
  ];

  const corePromises = [
    {
      step: "01",
      icon: Leaf,
      title: "Taazi Sabzi & Fal",
      desc: "Seedha subah ki mandi aur local kisan se, bina kisi chemical touch-up ya multi-day cold storage ke.",
      tag: "100% Sunrise Fresh",
    },
    {
      step: "02",
      icon: Zap,
      title: "Fast 10-15 Min Delivery",
      desc: "Bagsewaniya dark store se seedha aapke kitchen counter tak express dispatch, bina kisi jhanjhat ke.",
      tag: "Express Fleet",
    },
    {
      step: "03",
      icon: IndianRupee,
      title: "Sahi Mandi Daam",
      desc: "Direct mandi pricing, zero hidden surge fee ya platform charge. Free delivery ₹199 se upar ke orders par.",
      tag: "Zero Hidden Fees",
    },
    {
      step: "04",
      icon: ShieldCheck,
      title: "Quality Guarantee",
      desc: "Har order ke saath quality ka vaada. Koi item pasand na aaye toh doorstep par instant replacement.",
      tag: "No Questions Asked",
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950 text-gray-900">
      {/* Top Navbar */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ================= 1. LUXURY HERO BANNER CARD (HOMEPAGE STRUCTURED) ================= */}
        <section className="w-full bg-gradient-to-b from-emerald-50/40 via-white to-white pt-2.5 sm:pt-4 pb-3 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.12)] bg-gray-950 min-h-[300px] sm:min-h-[360px] md:min-h-[400px] border border-gray-100 flex items-center">
              
              {/* Background 4K Produce Imagery */}
              <img
                src="/banners/veggies_clean_4k.jpg"
                alt="SubziQuick Fresh Produce Farm Delivery Bhopal"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40 scale-105"
              />

              {/* Multi-layer Dark Gradient for High-Contrast Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/50 z-10" />

              {/* Ambient Emerald Spotlight */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-[#10b981]/25 rounded-full blur-3xl pointer-events-none z-10" />

              {/* Hero Content */}
              <div className="relative z-20 p-5 sm:p-8 md:p-12 lg:p-14 max-w-3xl flex flex-col items-start text-white">
                
                {/* Pill Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
                  <div className="relative overflow-hidden inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-xs">
                    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <Heart size={12} className="text-red-400 fill-red-400 animate-pulse relative z-10" />
                    <span className="relative z-10">Ek Thele Se Shuru Hui Kahani</span>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-[#0f8646] text-emerald-100 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                    Bhopal 10-15 Min Live
                  </span>
                </div>

                {/* Hero Headline */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-[1.12] tracking-tight text-white drop-shadow-md mb-3">
                  Ek Thele Se Shuru Hua Sapna, <br />
                  <span className="text-[#34d399]">Ab Aapke Ghar Tak.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 font-medium leading-relaxed max-w-2xl mb-6">
                  2020 mein shuru hua ek chhota sa sapna, aaj Bhopal ke hazaron parivaaron tak taazi sabzi aur fal pahunchata hai — wahi papa ki imaandari, wahi taazgi, ab sirf ek click door.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href="/shop">
                    <button
                      type="button"
                      className="relative overflow-hidden bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 sm:px-7 py-3 rounded-full font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
                    >
                      <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                      <ShoppingBag size={15} />
                      <span>Order Fresh Produce</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                  <a
                    href="https://wa.me/919981418565?text=Namaste%20SubziQuick!%20Aapki%20story%20padhkar%20bahut%20accha%20laga."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/15 hover:bg-white/25 border border-white/30 text-white px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FaWhatsapp className="text-[#25D366] text-base" />
                    <span>WhatsApp Order & Help</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. QUICK COMMERCE TRUST & SPEED RIBBON ================= */}
        <TrustRibbon />

        {/* ================= 3. STRUCTURED BENTO-GRID JOURNEY (LIKE HOMEPAGE MODULES) ================= */}
        <section className="w-full py-8 sm:py-12 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            
            {/* Standard Homepage Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 sm:pb-6 border-b border-gray-100 mb-6 sm:mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0f8646] text-white flex items-center justify-center shadow-xs">
                  <Leaf size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    The SubziQuick Journey
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    2020 ke sangharsh se lekar Bhopal ke trusted online store tak ka safar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0f8646] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0f8646] animate-pulse" />
                  <span>Values First Platform</span>
                </span>
              </div>
            </div>

            {/* 3 Structured Journey Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {journeyChapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="bg-[#fcfdfc] border border-gray-200/80 rounded-3xl p-5 sm:p-6 hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Step & Badge Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-black text-gray-400">
                        PHASE {ch.step}
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${ch.tagColor}`}>
                        {ch.badge}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0f8646] transition-colors mb-2.5 leading-snug">
                      {ch.title}
                    </h3>

                    {/* Card Text */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {ch.desc}
                    </p>
                  </div>

                  {/* Micro Highlight Tag */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${ch.accentDot}`} />
                    <span className="text-[11px] font-bold text-gray-700 truncate">
                      {ch.highlight}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 4. EMOTIONAL FOUNDER QUOTE CALLOUT (HOMEPAGE TONE) ================= */}
        <section className="w-full py-6 sm:py-8 bg-[#f8faf8] border-b border-gray-100 font-sans">
          <div className="max-w-5xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              
              {/* Soft Quote Icon */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0f8646] flex items-center justify-center shrink-0 shadow-2xs">
                <Quote size={26} />
              </div>

              {/* Quote Content */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed italic">
                  &ldquo;Har order jo aap dete hain, woh sirf ek transaction nahi — yeh ek family ki mehnat aur ek naye sapne ka hissa hai.&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-gray-500">
                  <span className="text-[#0f8646] font-bold">SubziQuick Family</span>
                  <span>•</span>
                  <span>Bhopal, Madhya Pradesh</span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="shrink-0 bg-[#f8faf8] border border-gray-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Founding Year
                </span>
                <span className="text-lg font-black text-gray-900">
                  Est. 2020
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 5. HAMARA VAADA (STRUCTURED EXACTLY LIKE FARM FRESH PROMISE) ================= */}
        <section className="w-full py-8 sm:py-12 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            
            <div className="bg-[#f8faf8] rounded-3xl border border-gray-100 p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-gray-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
                      Hamara Vaada — Values We Live By
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Hum sirf sabzi nahi bechte — hum woh values bechte hain jo ek struggling family ne mushkil waqt mein seekhi.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full self-start sm:self-auto">
                  <CheckCircle2 size={13} className="text-[#0c831f]" />
                  <span>Quality Guarantee Har Order Par</span>
                </div>
              </div>

              {/* 4 Promises Grid (Like FarmFreshPromise) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {corePromises.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-mono font-bold text-gray-400">
                            PROMISE {item.step}
                          </span>
                          <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {item.tag}
                          </span>
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 text-[#0f8646] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-3">
                          <Icon size={18} />
                        </div>

                        <h3 className="font-bold text-sm text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Assurance Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 font-medium border-t border-gray-200/70">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#0f8646]" />
                  <span>Local Bhopal Sourcing • Karond Mandi & Regional Kisans</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
                  <RotateCcw size={13} className="text-[#0c831f]" />
                  <span>100% Doorstep Replacement If Not Satisfied</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 6. GROUND REALITY & BHOPAL OPERATIONS (STOREFRONT SHOWCASE) ================= */}
        <section className="w-full py-8 sm:py-12 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="bg-[#fcfdfc] border border-gray-200/80 rounded-3xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Left Column: Real Storefront Photo */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-4/3 group">
                <img
                  src="/storefront.jpg"
                  alt="SubziQuick Store Bhopal Bagsewaniya"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="inline-block bg-[#0f8646] text-white text-[10px] font-black px-2 py-0.5 rounded-md mb-1 uppercase tracking-wide">
                    Live Storefront
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-tight">
                    SubziQuick Express Hub, Bagsewaniya, Bhopal
                  </p>
                </div>
              </div>

              {/* Right Column: Local Roots & Trust */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f8646] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 w-fit mb-3">
                  <Store size={13} />
                  <span>Bhopal Ka Apna Quick Commerce</span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-3">
                  Zameen Se Juda Kaam, <br />
                  <span className="text-[#0f8646]">Ghar Jaisi Imaandari.</span>
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-5">
                  Bina kisi multinational corporate dikhaave ke, hum ek local Bhopal family hain jo har subah mandi jaati hai, taaza samaan chunti hai, aur poori imaandari se aapke ghar tak deliver karti hai.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <CheckCircle2 size={15} className="text-[#0c831f] shrink-0" />
                    <span>Certified Electronic Weighing</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <CheckCircle2 size={15} className="text-[#0c831f] shrink-0" />
                    <span>Breathable Kraft Paper Bagging</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <CheckCircle2 size={15} className="text-[#0c831f] shrink-0" />
                    <span>Fair Rates for Local Farmers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <CheckCircle2 size={15} className="text-[#0c831f] shrink-0" />
                    <span>Local Bhopal Delivery Fleet</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/shop">
                    <button
                      type="button"
                      className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Explore Today&apos;s Harvest</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-700 hover:text-[#0f8646] border border-gray-300 hover:border-emerald-300 bg-white px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition cursor-pointer"
                  >
                    Visit Store / Contact
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 7. CLOSING LUXURY BANNER (IDENTICAL HOMEPAGE FINALE) ================= */}
        <section className="w-full py-8 sm:py-12 bg-[#f8faf8] font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="bg-gradient-to-r from-[#072815] via-[#0b4d24] to-[#0f8646] rounded-3xl p-6 sm:p-10 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-2xl text-left relative z-10">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-white/15 text-emerald-200 px-3 py-1 rounded-full inline-block mb-3 border border-white/20">
                  Ek Thele Se Shuru Hui Kahani
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white mb-2.5 tracking-tight">
                  Subzi Quick — Ab Aapke Ghar Tak
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  Aapke har order se ek mehanti parivaar ka hausla badhta hai. Aaj hi taazi mandi sabzi mangwaiye aur is safar ka hissa baniye.
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

                  <a
                    href="https://wa.me/919981418565?text=Namaste%20SubziQuick!%20Mujhe%20taazi%20sabzi%20order%20karni%20hai."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/30 hover:bg-white/10 text-white px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <FaWhatsapp className="text-[#25D366] text-base" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>

              {/* Basket Image Container */}
              <div className="hidden md:block shrink-0 relative z-10">
                <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-3xl bg-white/10 border border-white/20 p-2.5 backdrop-blur-xs flex items-center justify-center shadow-lg">
                  <img
                    src="/hero_basket.jpg"
                    alt="SubziQuick Produce Basket"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
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
