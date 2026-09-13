"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
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

  const pillars = [
    {
      icon: <Sun size={24} className="text-amber-500" />,
      title: "5:00 AM Dawn Harvest",
      desc: "Freshly picked every sunrise directly from regional farms around Bhopal. Zero multi-day cold storage.",
    },
    {
      icon: <ShieldCheck size={24} className="text-[#0c831f]" />,
      title: "100% Hand-Graded Quality",
      desc: "Every leaf, vegetable and fruit is individually sorted and cleaned with potable water before dispatch.",
    },
    {
      icon: <Truck size={24} className="text-emerald-600" />,
      title: "10-15 Min Express Delivery",
      desc: "Delivered direct from our Bagsewaniya hub straight to your doorstep across Bhopal.",
    },
  ];

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950 text-gray-900">
      {/* Top Navbar */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* ===== 1. HERO SECTION (CLEAN & MODERN) ===== */}
        <section className="w-full bg-gradient-to-b from-emerald-50/50 via-white to-white pt-6 sm:pt-10 pb-6 sm:pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full text-[11px] font-black text-[#0f8646] uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles size={12} className="text-[#0c831f]" />
              <span>About SubziQuick Bhopal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
              Farm Fresh Produce, <br />
              <span className="text-[#0f8646]">Delivered in 10-15 Minutes.</span>
            </h1>

            <p className="mt-4 text-xs sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              We started SubziQuick with one simple mission: to bring authentic sunrise-harvested, pesticide-safe vegetables and fruits from local farmers straight to your kitchen in Bhopal — at fair mandi rates and lightning speed.
            </p>

            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Link href="/shop">
                <button
                  type="button"
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 sm:px-8 py-3 rounded-full font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Shop Fresh Produce</span>
                  <ArrowRight size={15} />
                </button>
              </Link>

              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Team"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaWhatsapp className="text-[#25D366] text-base" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* ===== 2. TRUST RIBBON ===== */}
        <TrustRibbon />

        {/* ===== 3. CORE 3 PILLARS (CLEAN CARDS) ===== */}
        <section className="py-10 sm:py-16 bg-white border-b border-gray-100 font-sans">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-3xl font-black text-gray-950 tracking-tight">
                Why Families Trust SubziQuick
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                No middlemen, no days-old cold storage. Only crisp, natural nutrition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {pillars.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-[#f8f9fa] border border-gray-100 hover:border-emerald-200 transition-all shadow-2xs flex flex-col items-start"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-2xs flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. ZERO SURCHARGES & PROMISES ===== */}
        <section className="py-10 sm:py-14 bg-[#f8f9fa] border-b border-gray-100 font-sans">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-lg sm:text-2xl font-black text-gray-900 mb-3">
              Our 100% Quality & Price Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
              If any item delivered does not meet your standard, simply let us know at your doorstep or through our support for an immediate replacement or refund.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-gray-800">
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#0c831f]" /> Zero Platform Surcharge
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#0c831f]" /> Free Delivery Above ₹199
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#0c831f]" /> Transparent Mandi Rates
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
