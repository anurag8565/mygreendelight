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
    { value: "5:00 AM", label: "Daily Farm Harvest", sub: "Zero Cold Storage" },
    { value: "₹0", label: "Platform Surcharge", sub: "Direct Store Rates" },
  ];

  const corePromises = [
    {
      step: "01",
      icon: Leaf,
      title: "5:00 AM Sunrise Farm Harvest",
      desc: "Seedha Bhopal ke local kisanon aur farms se taazi sabziyan. Zero chemical treatment, zero days-old cold storage.",
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
      title: "Sahi Kifayati Daam (Zero Hidden Fees)",
      desc: "Direct transparent store pricing. Zero platform fee, zero surge charges, aur ₹199 se upar free delivery.",
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
    "Arera Colony",
    "Kolar Road",
    "MP Nagar",
    "Bawadiya Kalan",
    "Katara Hills",
    "Shahpura",
    "Bittan Market (E-4)",
    "Ayodhya Bypass",
    "Indrapuri BHEL",
    "Hoshangabad Road",
    "Gulmohar",
    "Chunabhatti",
    "Saket Nagar",
    "Bagsewaniya",
    "Trilanga",
    "Misrod",
  ];

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950 text-gray-900">
      
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
        
        {/* ================= 1. CLEAN, MODERN & LIGHT HERO SECTION (MOBILE PERFECT) ================= */}
        <section className="w-full bg-gradient-to-b from-emerald-50/60 via-white to-white pt-6 sm:pt-10 pb-6 sm:pb-10 border-b border-gray-100 font-sans">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0a3d24] mb-4 sm:mb-5 shadow-xs">
              <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span>Bhopal Ki Apni Kahani • Founded 2020</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-[1.18] mb-3 sm:mb-4">
              Ek Thele Se Shuru Hui Kahani, <br />
              <span className="text-[#0a3d24]">Ab Aapke Ghar Tak.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
              2020 mein shuru hua ek chhota sa sapna, aaj Bhopal ke hazaron parivaaron tak taazi farm sabzi aur fal 10-15 minutes mein pahunchata hai — wahi papa ki imaandari, wahi taazgi, ab sirf ek click door.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap mb-8 sm:mb-10">
              <Link href="/shop">
                <button
                  type="button"
                  className="bg-[#0a3d24] hover:bg-[#072817] text-white px-6 sm:px-8 py-3 rounded-full font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag size={16} />
                  <span>Order Fresh Produce</span>
                  <ArrowRight size={14} />
                </button>
              </Link>

              <a
                href="https://wa.me/919981418565?text=Namaste%20SubziQuick!%20Mujhe%20taazi%20sabzi%20aur%20fruits%20order%20karni%20hai."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-50 border border-gray-300/90 text-gray-800 px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaWhatsapp className="text-[#25D366] text-base" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Clear Photographic Showcase Banner (Crisp & High Clarity) */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm bg-gray-100 max-w-4xl mx-auto group">
              <img
                src="/thela_story_hero.jpg"
                alt="SubziQuick Origin - Thela to Modern Delivery Bag"
                className="w-full h-auto max-h-[300px] sm:max-h-[420px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="p-3 sm:p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0a3d24]" />
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    Ek Thele Se Nikalkar Ek Modern Online Platform Tak Ka Safar
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200/70">
                  📍 Bhopal, MP • Est. 2020
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 2. LIVE IMPACT METRICS BAR ================= */}
        <section className="w-full py-5 bg-[#f8faf8] border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 text-center border border-gray-200/70 shadow-2xs hover:border-emerald-200 transition-colors"
                >
                  <div className="text-lg sm:text-2xl md:text-3xl font-black text-[#0a3d24]">
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

        {/* ================= 3. SPEED & TRUST RIBBON ================= */}
        <TrustRibbon />

        {/* ================= 4. PAIRED VISUAL COMPARISON (2020 THELA VS TODAY) ================= */}
        <section className="w-full py-8 sm:py-14 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0a3d24] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full shadow-2xs inline-block mb-2">
                Real Founder Story • Asli Sangharsh
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                2020 Ke Thele Se 10-15 Min Express Delivery
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5 font-medium leading-relaxed">
                Kaise ek parivaar ke sankalp aur imaandari ne Bhopal ka sabse bharosemand online fresh vegetable network banaya.
              </p>
            </div>

            {/* Side-by-Side Paired Visual Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
              
              {/* CARD 1: 2020 - THE STRUGGLE (FATHER'S THELA) */}
              <div className="bg-white border border-amber-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  {/* Visual Image */}
                  <div className="relative aspect-16/10 sm:aspect-16/9 overflow-hidden bg-gray-100">
                    <img
                      src="/father_thela_2020.jpg"
                      alt="SubziQuick Origin - Father with vegetable thela in 2020 lockdown Bhopal"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                        Phase 01 • 2020 Shuruaat
                      </span>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-xl font-black text-gray-950 mb-2.5 tracking-tight">
                      2020 — Jab Sab Kuch Ruk Gaya
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2.5 font-normal">
                      <p>
                        Mere papa ki job chali gayi. Achanak, bina kisi warning ke. Ghar chalana tha, aur us waqt koi doosra option nazar nahi aa raha tha.
                      </p>
                      <p className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/60 font-medium text-gray-900">
                        Papa ne haar nahi maani — unhone ek thela uthaya aur sabzi bechna shuru kar diya. Subah jaldi fresh harvest laana, din bhar galiyon mein thela ghumaana, garmi ho ya baarish — papa ne kabhi peeche mudkar nahi dekha.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Highlight */}
                <div className="px-4 sm:px-6 pb-4 pt-2 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Scale size={14} className="text-amber-600" />
                    <span>Sunrise Farm Fresh Procurement</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                    Bhopal, 2020
                  </span>
                </div>
              </div>

              {/* CARD 2: 2026 - THE TURNING POINT (BHOPAL EXPRESS FLEET) */}
              <div className="bg-white border border-emerald-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  {/* Visual Image */}
                  <div className="relative aspect-16/10 sm:aspect-16/9 overflow-hidden bg-gray-100">
                    <img
                      src="/bhopal_express_delivery.jpg"
                      alt="SubziQuick Bhopal 10-15 Min Express Fresh Vegetable Delivery Fleet"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#0a3d24] text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                        Phase 02 • Quick Commerce
                      </span>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-xl font-black text-gray-950 mb-2.5 tracking-tight">
                      The Turning Point — Ek Thele Se Online Platform
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2.5 font-normal">
                      <p>
                        Main unhe roz mehnat karte dekhta tha. Ek din socha — <strong className="text-[#0a3d24]">&ldquo;Kyun na isse online le jaayein?&rdquo;</strong>
                      </p>
                      <p className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/60 font-medium text-gray-900">
                        Bas wahin se shuru hui <strong>Subzi Quick</strong> ki kahani — ek thele se nikalkar ek online platform tak ka safar. Jo kabhi ek chhota thela tha, aaj Bhopal ke hazaron parivaaron tak 10-15 minutes mein taazi sabzi deliver karta hai. Lekin values wahi hain: <strong>Taazgi, Imaandari, aur Mehnat</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Highlight */}
                <div className="px-4 sm:px-6 pb-4 pt-2 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <Bike size={14} className="text-[#0a3d24]" />
                    <span>MP-04 Bhopal Fleet (10-15 Min)</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                    Active Across Bhopal
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 5. EMOTIONAL FOUNDER QUOTE CARD ================= */}
        <section className="w-full py-6 sm:py-10 bg-[#f8faf8] border-b border-gray-100 font-sans">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-xs flex flex-col md:flex-row items-center gap-4 sm:gap-6 relative overflow-hidden">
              
              {/* Soft Quote Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#0a3d24] flex items-center justify-center shrink-0 shadow-2xs">
                <Quote size={24} />
              </div>

              {/* Quote Content */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm sm:text-base md:text-lg font-bold text-gray-950 leading-relaxed italic">
                  &ldquo;Har order jo aap dete hain, woh sirf ek transaction nahi — yeh ek family ki mehnat aur ek naye sapne ka hissa hai.&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-gray-600">
                  <span className="text-[#0a3d24]">Anurag & Family</span>
                  <span>•</span>
                  <span>Founders of SubziQuick Bhopal</span>
                </div>
              </div>

              {/* Founding Badge */}
              <div className="shrink-0 bg-[#f8faf8] border border-gray-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">
                  Family Sourced
                </span>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  Est. 2020
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 6. HAMARA VAADA (CLEAN 4-CARD GRID) ================= */}
        <section className="w-full py-8 sm:py-12 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0a3d24] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full shadow-2xs inline-block mb-2">
                Uncompromising Values
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-gray-950 tracking-tight">
                Hamara Vaada — Values We Live By
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5 font-medium leading-relaxed">
                Hum sirf sabzi nahi bechte — hum woh values bechte hain jo ek struggling family ne mushkil waqt mein seekhi.
              </p>
            </div>

            {/* 4 Promises Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {corePromises.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#fcfdfc] border border-gray-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono font-bold text-gray-400">
                          PROMISE {item.step}
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {item.tag}
                        </span>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 text-[#0a3d24] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-3">
                        <Icon size={18} />
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1">
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

          </div>
        </section>

        {/* ================= 7. SEO-RICH GROUND REALITY & BHOPAL LOCALITIES ================= */}
        <section className="w-full py-8 sm:py-12 bg-[#f8faf8] border-b border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-2xs">
              
              {/* Left Column: Direct Mandi Packing Visual */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-gray-200 shadow-xs aspect-4/3 group">
                <img
                  src="/mandi_packing_fresh.jpg"
                  alt="Online Vegetable Delivery Bhopal - Farm Fresh Sorting & Packing"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="inline-block bg-[#0a3d24] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md mb-1 uppercase tracking-wide">
                    Pure Online Direct Model
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-tight">
                    Subah Fresh Harvest Se Sorting, Seedha Aapke Kitchen Tak
                  </p>
                </div>
              </div>

              {/* Right Column: SEO Keywords & Local Credibility */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a3d24] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 w-fit mb-3">
                  <Sparkles size={13} />
                  <span>Bhopal&apos;s #1 Local Farm-to-Home Platform</span>
                </div>

                <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-2.5">
                  Online Fresh Vegetable & Fruit Delivery in Bhopal — <span className="text-[#0a3d24]">Kifayati Store Daam Mein.</span>
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-4">
                  SubziQuick par hum koi bada retail showroom nahi chalate jiska kharcha customer ke bill mein joda jaaye. Hum har subah 5:00 AM fresh farm harvest chunte hain, taazi sabzi aur fal select karte hain, aur 10-15 minutes mein express deliver karte hain — transparent electronic weighing aur cash on delivery ke saath.
                </p>

                {/* Localities Badges Grid */}
                <div className="mb-5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Delivering in 10-15 Minutes Across Bhopal:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {localities.map((loc, idx) => (
                      <span
                        key={idx}
                        className="text-[10.5px] sm:text-[11px] font-bold text-gray-700 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg shadow-2xs hover:border-emerald-300 hover:text-[#0a3d24] transition-colors"
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
                      className="bg-[#0a3d24] hover:bg-[#072817] text-white px-5 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Order Fresh Vegetables</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-700 hover:text-[#0a3d24] border border-gray-300 hover:border-emerald-300 bg-white px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition cursor-pointer"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 8. LUXURY CLOSING BANNER ================= */}
        <section className="w-full py-8 sm:py-12 bg-white font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="bg-gradient-to-r from-[#051f12] via-[#0a3d24] to-[#072817] rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-2xl text-left relative z-10">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-white/15 text-emerald-200 px-3 py-1 rounded-full inline-block mb-3 border border-white/20">
                  Subzi Quick Bhopal
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight text-white mb-2.5 tracking-tight">
                  Ek Thele Se Shuru Hui Kahani, Ab Aapke Ghar Tak.
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  Aapke har order se ek mehanti parivaar ka hausla badhta hai. Aaj hi taazi farm sabzi mangwaiye aur is safar ka hissa baniye.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/shop">
                    <button
                      type="button"
                      className="relative overflow-hidden bg-white text-[#0a3d24] hover:bg-emerald-50 px-6 sm:px-8 py-3 rounded-full font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 group/btn"
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
                <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-3xl bg-white/10 border border-white/20 p-2.5 backdrop-blur-xs flex items-center justify-center shadow-lg">
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
