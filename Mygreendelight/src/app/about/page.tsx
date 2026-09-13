"use client";

import React from "react";
import Link from "next/link";
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
  MapPin,
  RotateCcw,
  ShoppingBag,
  Bike,
  Scale,
  Award,
  Users,
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

  const stats = [
    { value: "2020", label: "Founded from a Thela", sub: "Lockdown Struggle" },
    { value: "10-15 Min", label: "Express Delivery", sub: "Across Bhopal" },
    { value: "100%", label: "Mandi Fresh Daily", sub: "Zero Cold Storage" },
    { value: "₹0", label: "Platform Surcharge", sub: "Transparent Pricing" },
  ];

  const corePromises = [
    {
      step: "01",
      icon: Leaf,
      title: "5:00 AM Sunrise Mandi Harvest",
      desc: "Seedha Bhopal ki Karond Mandi aur aas-paas ke kisanon se taazi sabziyan. Zero chemical treatment, zero days-old cold storage.",
      tag: "Farm Fresh Daily",
    },
    {
      step: "02",
      icon: Zap,
      title: "10-15 Min Express Delivery",
      desc: "SubziQuick ki dedicated Bhopal EV fleet se aapke ghar tak lightning-fast delivery, bina kisi lambe intezaar ke.",
      tag: "Bhopal Express Fleet",
    },
    {
      step: "03",
      icon: IndianRupee,
      title: "Sahi Mandi Daam (No Hidden Fees)",
      desc: "Direct wholesale mandi pricing. Zero platform fee, zero surge charges, aur ₹199 se upar free delivery.",
      tag: "Transparent Rates",
    },
    {
      step: "04",
      icon: ShieldCheck,
      title: "100% Quality & Replacement Guarantee",
      desc: "Har order ke saath quality ka pakka vaada. Doorstep par sabzi pasand na aaye toh instant replacement ya refund.",
      tag: "No Questions Asked",
    },
  ];

  const localities = [
    "Bagsewaniya",
    "MP Nagar",
    "Arera Colony",
    "Gulmohar",
    "Kolar Road",
    "Hoshangabad Road",
    "TT Nagar",
    "Saket Nagar",
    "Shahpura",
    "Chunabhatti",
    "Ayodhya Bypass",
    "Bawadiya Kalan",
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950 text-gray-900">
      
      {/* SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About SubziQuick - Ek Thele Se Shuru Hui Online Delivery Kahani",
            description:
              "The inspiring story of SubziQuick Bhopal: Started from a humble wooden vegetable cart (thela) during 2020 lockdown by a father, now Bhopal's fastest online fresh vegetable and fruit delivery service in 10-15 minutes.",
            url: "https://subziquick.in/about",
            publisher: {
              "@type": "Organization",
              name: "SubziQuick Bhopal",
              url: "https://subziquick.in",
              logo: "https://subziquick.in/brand-logo.png",
              founder: {
                "@type": "Person",
                name: "Anurag & Family",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bhopal",
                addressRegion: "Madhya Pradesh",
                postalCode: "462043",
                addressCountry: "IN",
              },
            },
          }),
        }}
      />

      {/* Top Navbar */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        
        {/* ================= 1. LUXURY EYE-CATCHING HERO BANNER ================= */}
        <section className="w-full bg-gradient-to-b from-emerald-50/40 via-white to-white pt-2.5 sm:pt-4 pb-3 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] bg-gray-950 min-h-[380px] sm:min-h-[440px] md:min-h-[480px] border border-gray-100 flex items-center">
              
              {/* Background 4K Thela-to-Online Story Image */}
              <img
                src="/thela_story_hero.jpg"
                alt="SubziQuick Bhopal - Online Vegetable and Fruit Delivery Story"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40 scale-105"
              />

              {/* Multi-layer High-Contrast Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/45 z-10" />

              {/* Glowing Ambient Spotlight */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-[#10b981]/25 rounded-full blur-3xl pointer-events-none z-10" />

              {/* Hero Content */}
              <div className="relative z-20 p-5 sm:p-8 md:p-12 lg:p-14 max-w-3xl flex flex-col items-start text-white">
                
                {/* Pill Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
                  <div className="relative overflow-hidden inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-xs">
                    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <Heart size={12} className="text-red-400 fill-red-400 animate-pulse relative z-10" />
                    <span className="relative z-10">Bhopal Ki Apni Kahani • Est. 2020</span>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-[#0f8646] text-emerald-100 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                    10-15 Min Express Delivery Live
                  </span>
                </div>

                {/* Primary SEO Heading */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[46px] font-black leading-tight sm:leading-[1.14] tracking-tight text-white drop-shadow-md mb-3">
                  Ek Thele Se Shuru Hui Kahani, <br />
                  <span className="text-[#34d399]">Online Taazi Sabzi Aapke Ghar Tak.</span>
                </h1>

                {/* SEO-Rich Subtitle */}
                <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 font-medium leading-relaxed max-w-2xl mb-6">
                  2020 mein papa ki mehnat aur ek thele se shuru hua safar, aaj Bhopal ka sabse bharosemand online fresh vegetable & fruit delivery platform hai. Wahi taazgi, wahi mandi ke saste daam, ab sirf ek click door.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href="/shop">
                    <button
                      type="button"
                      className="relative overflow-hidden bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 sm:px-8 py-3.5 rounded-full font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
                    >
                      <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                      <ShoppingBag size={15} />
                      <span>Shop Fresh Vegetables & Fruits</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                  <a
                    href="https://wa.me/919981418565?text=Namaste%20SubziQuick!%20Mujhe%20taazi%20sabzi%20aur%20fruits%20order%20karni%20hai."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/15 hover:bg-white/25 border border-white/30 text-white px-5 sm:px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FaWhatsapp className="text-[#25D366] text-base" />
                    <span>WhatsApp Order & Help</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. LIVE IMPACT METRICS BAR ================= */}
        <section className="w-full py-5 bg-[#f8faf8] border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-2xs hover:border-emerald-200 transition-colors"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#0f8646]">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                    {s.label}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3. QUICK COMMERCE TRUST & SPEED RIBBON ================= */}
        <TrustRibbon />

        {/* ================= 4. PAIRED VISUAL COMPARISON (THE STORY: 2020 VS TODAY) ================= */}
        <section className="w-full py-10 sm:py-16 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full shadow-2xs inline-block mb-2.5">
                The Real Journey • Bhopal Roots
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Ek Thele Se 10-15 Min Express Delivery Tak
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium leading-relaxed">
                Kaise ek parivaar ke sankalp aur mehnat ne Bhopal ka sabse tezi se badhta quick vegetable delivery network banaya.
              </p>
            </div>

            {/* Side-by-Side Paired Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              
              {/* CARD 1: 2020 - THE STRUGGLE (FATHER'S THELA) */}
              <div className="bg-[#fcfdfa] border border-amber-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  {/* Visual Image */}
                  <div className="relative aspect-16/10 sm:aspect-16/9 overflow-hidden">
                    <img
                      src="/father_thela_2020.jpg"
                      alt="SubziQuick Origin - Father with vegetable thela in 2020 lockdown Bhopal"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                        Phase 01 • 2020 Shuruaat
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs sm:text-sm font-bold leading-snug">
                        2020 — Jab Sab Kuch Ruk Gaya, Papa Ne Thela Uthaya
                      </p>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="p-5 sm:p-7">
                    <h3 className="text-lg sm:text-xl font-black text-gray-950 mb-3 tracking-tight">
                      Achanak Job Chali Gayi, Par Hausla Nahi Toota
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2.5 font-normal">
                      <p>
                        Mere papa ki job chali gayi. Achanak, bina kisi warning ke. Ghar chalana tha, aur us waqt koi doosra option nazar nahi aa raha tha.
                      </p>
                      <p className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 font-medium text-gray-900">
                        Papa ne haar nahi maani — unhone ek thela uthaya aur sabzi bechna shuru kar diya. Subah jaldi mandi jaana, din bhar galiyon mein thela ghumaana, garmi ho ya baarish — papa ne kabhi peeche mudkar nahi dekha.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Highlight */}
                <div className="px-5 sm:px-7 pb-5 pt-2 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Scale size={14} className="text-amber-600" />
                    <span>Karond Mandi Sunrise Procurement</span>
                  </span>
                  <span className="text-[11px] font-mono text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                    Bhopal, 2020
                  </span>
                </div>
              </div>

              {/* CARD 2: 2026 - THE TURNING POINT & MODERN BHOPAL FLEET */}
              <div className="bg-[#f7faf8] border border-emerald-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  {/* Visual Image */}
                  <div className="relative aspect-16/10 sm:aspect-16/9 overflow-hidden">
                    <img
                      src="/bhopal_express_delivery.jpg"
                      alt="SubziQuick Bhopal 10-15 Min Express Fresh Vegetable Delivery Electric Fleet"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#0f8646] text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                        Phase 02 • Quick Commerce
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs sm:text-sm font-bold leading-snug">
                        Ek Beta, Ek Idea — Ek Thele Se Online Platform
                      </p>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="p-5 sm:p-7">
                    <h3 className="text-lg sm:text-xl font-black text-gray-950 mb-3 tracking-tight">
                      Wahi Mehnat Aur Imaandari, Ab Ek Click Door
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2.5 font-normal">
                      <p>
                        Main unhe roz mehnat karte dekhta tha. Ek din socha — <strong className="text-[#0f8646]">&ldquo;Kyun na isse online le jaayein?&rdquo;</strong>
                      </p>
                      <p className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60 font-medium text-gray-900">
                        Bas wahin se shuru hui <strong>Subzi Quick</strong> ki kahani — ek thele se nikalkar ek online platform tak ka safar. Jo kabhi ek chhota thela tha, aaj Bhopal ke hazaron parivaaron tak 10-15 minutes mein taazi sabzi pahunchata hai. Lekin values wahi hain: <strong>Taazgi, Imaandari, aur Mehnat</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Highlight */}
                <div className="px-5 sm:px-7 pb-5 pt-2 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <Bike size={14} className="text-[#0f8646]" />
                    <span>MP-04 Eco-Friendly Fleet (10-15 Min)</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                    Active Across Bhopal
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 5. EMOTIONAL FOUNDER QUOTE CALLOUT ================= */}
        <section className="w-full py-8 sm:py-10 bg-[#f8faf8] border-b border-gray-100 font-sans">
          <div className="max-w-5xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden">
              
              {/* Soft Quote Icon */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#0f8646] flex items-center justify-center shrink-0 shadow-2xs">
                <Quote size={30} />
              </div>

              {/* Quote Content */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-base sm:text-lg md:text-xl font-bold text-gray-950 leading-relaxed italic">
                  &ldquo;Har order jo aap dete hain, woh sirf ek transaction nahi — yeh ek family ki mehnat aur ek naye sapne ka hissa hai.&rdquo;
                </p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm font-bold text-gray-600">
                  <span className="text-[#0f8646]">Anurag & Family</span>
                  <span>•</span>
                  <span>Founders of SubziQuick Bhopal</span>
                </div>
              </div>

              {/* Founding Badge */}
              <div className="shrink-0 bg-[#fcfdfc] border border-gray-200 px-5 py-3 rounded-2xl text-center shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Family Sourced
                </span>
                <span className="text-xl font-black text-gray-900">
                  Est. 2020
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 6. HAMARA VAADA (STRUCTURED FARM FRESH PROMISE) ================= */}
        <section className="w-full py-8 sm:py-14 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            
            <div className="bg-[#f8faf8] rounded-3xl border border-gray-100 p-5 sm:p-8 md:p-10 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
                      Hamara Vaada — Uncompromising Values
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Hum sirf sabzi nahi bechte — hum woh values bechte hain jo ek struggling family ne mushkil waqt mein seekhi.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-2xs">
                  <CheckCircle2 size={14} className="text-[#0c831f]" />
                  <span>Quality Guarantee Har Order Par</span>
                </div>
              </div>

              {/* 4 Promises Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {corePromises.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-mono font-bold text-gray-400">
                            PROMISE {item.step}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {item.tag}
                          </span>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-[#0f8646] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-3">
                          <Icon size={20} />
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1.5">
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
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 font-medium border-t border-gray-200/70">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#0f8646]" />
                  <span>Karond Mandi Daily Sunrise Procurement • Zero Multi-Day Cold Storage</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs">
                  <RotateCcw size={13} className="text-[#0c831f]" />
                  <span>100% Doorstep Replacement If Not Satisfied</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 7. SEO-RICH GROUND REALITY & BHOPAL LOCALITIES SECTION ================= */}
        <section className="w-full py-10 sm:py-16 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="bg-[#fcfdfc] border border-gray-200/80 rounded-3xl p-5 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Direct Mandi Packing Visual */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-4/3 group">
                <img
                  src="/mandi_packing_fresh.jpg"
                  alt="Online Vegetable Delivery Bhopal - Mandi Fresh Sorting & Packing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <span className="inline-block bg-[#0f8646] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md mb-1 uppercase tracking-wide">
                    Pure Online Direct Model
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-tight">
                    Subah Mandi Se Fresh Sorting, Seedha Aapke Kitchen Tak
                  </p>
                </div>
              </div>

              {/* Right Column: SEO Keywords & Local Credibility */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f8646] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 w-fit mb-3">
                  <Sparkles size={13} />
                  <span>Bhopal&apos;s #1 Local Farm-to-Home Platform</span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-3">
                  Online Fresh Vegetable & Fruit Delivery in Bhopal — <span className="text-[#0f8646]">Seedha Mandi Daam Mein.</span>
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-5">
                  SubziQuick par hum koi bada retail showroom nahi chalate jiska kharcha customer ke bill mein joda jaaye. Hum har subah 5:00 AM Karond Mandi jaate hain, taazi sabzi aur fal khud chunte hain, aur 10-15 minutes mein express deliver karte hain — transparent electronic weighing aur cash on delivery ke saath.
                </p>

                {/* Localities Badges Grid */}
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Delivering in 10-15 Minutes Across Bhopal:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {localities.map((loc, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-bold text-gray-700 bg-white border border-gray-200/80 px-2.5 py-1 rounded-lg shadow-2xs hover:border-emerald-300 hover:text-[#0f8646] transition-colors"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/shop">
                    <button
                      type="button"
                      className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Order Fresh Vegetables</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-700 hover:text-[#0f8646] border border-gray-300 hover:border-emerald-300 bg-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition cursor-pointer"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 8. LUXURY CLOSING BANNER ================= */}
        <section className="w-full py-8 sm:py-14 bg-[#f8faf8] font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
            <div className="bg-gradient-to-r from-[#072815] via-[#0b4d24] to-[#0f8646] rounded-3xl p-6 sm:p-10 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-2xl text-left relative z-10">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-white/15 text-emerald-200 px-3 py-1 rounded-full inline-block mb-3 border border-white/20">
                  Subzi Quick Bhopal
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white mb-2.5 tracking-tight">
                  Ek Thele Se Shuru Hui Kahani, Ab Aapke Ghar Tak.
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  Aapke har order se ek mehanti parivaar ka hausla badhta hai. Aaj hi taazi mandi sabzi mangwaiye aur is safar ka hissa baniye.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/shop">
                    <button
                      type="button"
                      className="relative overflow-hidden bg-white text-[#0f8646] hover:bg-emerald-50 px-6 sm:px-8 py-3 rounded-full font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 group/btn"
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
