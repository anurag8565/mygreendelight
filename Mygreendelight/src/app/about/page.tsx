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

  const promises = [
    {
      icon: <Leaf className="text-[#0c831f]" size={24} />,
      title: "Taazi Sabzi Aur Fal",
      desc: "Seedha subah ki mandi aur local kisan se, bina kisi chemical touch-up ya multi-day cold storage ke.",
    },
    {
      icon: <Zap className="text-amber-500" size={24} />,
      title: "Fast 10-15 Min Delivery",
      desc: "Bina kisi jhanjhat ya lambe intezaar ke, taaza samaan seedha aapke kitchen counter tak.",
    },
    {
      icon: <IndianRupee className="text-emerald-700" size={24} />,
      title: "Sahi Daam, Koi Chhupa Charge Nahi",
      desc: "Mandi ke transparent rates aur zero hidden fee. Free delivery ₹199 se upar ke orders par.",
    },
    {
      icon: <ShieldCheck className="text-blue-600" size={24} />,
      title: "100% Quality Guarantee",
      desc: "Har order ke saath quality ka vaada. Kuch pasand na aaye toh bina kisi sawal ke instant replacement.",
    },
  ];

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950 text-gray-900">
      {/* Top Navigation */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="relative pt-8 sm:pt-14 pb-10 sm:pb-16 bg-gradient-to-b from-emerald-50/70 via-white to-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/70 border border-emerald-300/80 px-3.5 py-1 rounded-full text-xs font-bold text-[#0c6a38] mb-5 shadow-2xs">
              <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span>Hamari Kahani • The SubziQuick Story</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight leading-[1.15] mb-4 sm:mb-6">
              Ek Thele Se Shuru Hui <span className="text-[#0f8646]">Kahani</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
              2020 mein shuru hua ek chhota sa sapna, aaj aapke ghar tak pahunchta hai —{" "}
              <span className="font-bold text-[#0f8646]">Subzi Quick</span>
            </p>

            {/* Action Buttons */}
            <div className="mt-7 sm:mt-9 flex items-center justify-center gap-3 flex-wrap">
              <Link href="/shop">
                <button
                  type="button"
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 sm:px-8 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Taazi Sabzi Mangwayein</span>
                  <ArrowRight size={15} />
                </button>
              </Link>
              <a
                href="https://wa.me/919981418565?text=Namaste%20SubziQuick!%20Aapki%20story%20padhkar%20bahut%20accha%20laga."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-50 border border-gray-300/80 text-gray-800 px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaWhatsapp className="text-[#25D366] text-base" />
                <span>WhatsApp Par Baat Karein</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================= 2. THE STORY TIMELINE (JOURNEY) ================= */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            <div className="relative border-l-2 border-emerald-200 ml-4 sm:ml-8 space-y-12 sm:space-y-16">
              
              {/* --- CHAPTER 1: THE STRUGGLE --- */}
              <div className="relative pl-6 sm:pl-10">
                {/* Node Icon */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-amber-500 border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                  1
                </div>

                <div className="bg-[#fcfdfa] border border-amber-200/80 rounded-3xl p-5 sm:p-8 shadow-xs">
                  <span className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-3">
                    2020 — Shuruaat Ka Sangharsh
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-3 tracking-tight">
                    2020 — Jab Sab Kuch Ruk Gaya
                  </h2>
                  <div className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed space-y-3 font-normal">
                    <p>
                      Mere papa ki job chali gayi. Achanak, bina kisi warning ke. Ghar chalana tha, aur us waqt koi doosra option nazar nahi aa raha tha.
                    </p>
                    <p className="font-medium text-gray-900 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/50">
                      Papa ne haar nahi maani — unhone ek thela uthaya aur sabzi bechna shuru kar diya. Subah jaldi mandi jaana, din bhar galiyon mein thela ghumaana, garmi ho ya baarish — papa ne kabhi peeche mudkar nahi dekha.
                    </p>
                  </div>
                </div>
              </div>

              {/* --- CHAPTER 2: THE IDEA --- */}
              <div className="relative pl-6 sm:pl-10">
                {/* Node Icon */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#0f8646] border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                  2
                </div>

                <div className="bg-[#f7faf8] border border-emerald-200/80 rounded-3xl p-5 sm:p-8 shadow-xs">
                  <span className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3">
                    The Turning Point
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-3 tracking-tight">
                    Ek Beta, Ek Idea
                  </h2>
                  <div className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed space-y-3 font-normal">
                    <p>
                      Main unhe roz mehnat karte dekhta tha. Ek din socha —{" "}
                      <strong className="text-[#0f8646] font-black">
                        &ldquo;kyun na isse online le jaayein?&rdquo;
                      </strong>
                    </p>
                    <p>
                      Bas wahin se shuru hui <strong className="text-gray-950">Subzi Quick</strong> ki kahani — ek thele se nikalkar ek online platform tak ka safar. Wahi taazi sabzi, wahi papa ki mehnat aur imaandari, ab sirf ek click door.
                    </p>
                  </div>
                </div>
              </div>

              {/* --- CHAPTER 3: WHERE WE ARE TODAY --- */}
              <div className="relative pl-6 sm:pl-10">
                {/* Node Icon */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-blue-600 border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>

                <div className="bg-[#f8faff] border border-blue-200/80 rounded-3xl p-5 sm:p-8 shadow-xs">
                  <span className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full mb-3">
                    Our Growth & Heart
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-3 tracking-tight">
                    Aaj Hum Kahan Hain
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-normal mb-4">
                    Jo kabhi ek chhota sa thela tha, aaj woh ek pura online store ban chuka hai — lekin values wahi hain jo papa ne shuru se sikhayi: <strong className="text-gray-950">taazgi, imaandari, aur mehnat</strong>.
                  </p>

                  {/* Emotional Quote Callout */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/60 shadow-2xs relative">
                    <Quote className="text-blue-200 absolute top-2 right-3 w-8 h-8" />
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 italic leading-snug">
                      &ldquo;Har order jo aap dete hain, woh sirf ek transaction nahi — yeh ek family ki mehnat aur ek naye sapne ka hissa hai.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 3. TRUST RIBBON ================= */}
        <TrustRibbon />

        {/* ================= 4. OUR PROMISE (HAMARA VAADA) ================= */}
        <section className="py-12 sm:py-18 bg-[#f8f9fa] border-t border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs inline-block mb-2">
                Uncompromising Values
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight">
                Hamara Vaada
              </h2>
              <p className="text-xs sm:text-base text-gray-600 mt-3 leading-relaxed font-medium">
                Hum sirf sabzi nahi bechte — hum woh values bechte hain jo ek struggling family ne mushkil waqt mein seekhi. Quality mein koi compromise nahi, aur har customer ko woh izzat jo hum khud chahte hain.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {promises.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-950 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 5. CLOSING BANNER ================= */}
        <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#0a4823] via-[#0f8646] to-[#0c6a38] rounded-3xl sm:rounded-4xl p-6 sm:p-12 text-white shadow-xl text-center relative overflow-hidden">
            
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase text-emerald-100 mb-4 border border-white/20">
                <Sparkles size={12} className="text-amber-300" />
                <span>Bhopal Ka Apna Quick Commerce</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-3 tracking-tight">
                Subzi Quick — Ek Thele Se Shuru Hui Kahani, Ab Aapke Ghar Tak.
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-emerald-100 leading-relaxed mb-6 font-medium">
                Aapke har order se ek mehanti parivaar ka hausla badhta hai. Aaj hi taazi sabzi mangwaiye aur is safar ka hissa baniye.
              </p>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/shop">
                  <button
                    type="button"
                    className="bg-white hover:bg-emerald-50 text-[#0f8646] px-6 sm:px-8 py-3 rounded-full font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Abhi Order Karein</span>
                    <ArrowRight size={15} />
                  </button>
                </Link>
                <a
                  href="https://wa.me/919981418565?text=Namaste%20SubziQuick!%20Mujhe%20taazi%20sabzi%20order%20karni%20hai."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/15 hover:bg-white/25 border border-white/30 text-white px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FaWhatsapp className="text-white text-base" />
                  <span>WhatsApp Order</span>
                </a>
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
