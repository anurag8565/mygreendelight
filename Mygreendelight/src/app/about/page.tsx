"use client";

import React from "react";
import Link from "next/link";
import {
  Leaf,
  Heart,
  Truck,
  Users,
  Target,
  Eye,
  TrendingUp,
  Handshake,
  ShieldCheck,
  Package,
  Clock,
  Sparkles,
  ArrowRight,
  Briefcase,
  Store,
  MapPin,
  CheckCircle2,
  Quote,
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

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
      {/* Full Header Navigation */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative bg-gradient-to-b from-green-50/60 via-white to-white overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 sm:py-20">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Content (7 Cols) */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0f8646] uppercase tracking-wider bg-green-100/80 px-3.5 py-1 rounded-full mb-4">
                    <Sparkles size={14} /> OUR STORY • OUR PROMISE
                  </span>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.15] mb-6">
                    Kisan Ki Mehnat, <br />
                    <span className="text-[#0f8646]">Aapke Parivaar Ki Sehat.</span>
                  </h1>

                  <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-3 mb-8">
                    <p>
                      Covid-19 ke dauraan jab papa ki naukri chali gayi thi, tab unhone himmat nahi haari aur thele par Bhopal ki sadko par taaza sabzi bechna shuru kiya.
                    </p>
                    <p>
                      Maine dekhi unki subah 4 baje ki kadi mehnat, imandari aur hamari struggle. Wahi se ek soch aayi — <em>"Kyun na hum kisanon se seedha judkar, poore Bhopal ko Mandi rate par bilkul taaza aur saaf sabzi same-day ghar tak pahunchayein?"</em>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 via-emerald-50/60 to-white border-l-4 border-[#0f8646] p-5 rounded-r-2xl mb-8 shadow-2xs">
                    <p className="text-gray-900 font-extrabold text-sm sm:text-base leading-snug">
                      SubziQuick sirf ek grocery app nahi hai, <br />
                      yeh hamare parivaar ka sapna aur Bhopal ka bharosa hai.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="#journey"
                      className="inline-flex items-center gap-2 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      <span>Explore Our Journey</span>
                      <ArrowRight size={16} />
                    </a>

                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-[#0f8646] text-gray-800 hover:text-[#0f8646] px-7 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs"
                    >
                      <span>Shop Farm Produce</span>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right Hero Image Card (5 Cols) */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="SubziQuick Farm Story"
                    className="w-full h-[380px] sm:h-[440px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#0f8646] px-3 py-1 rounded-full inline-block mb-2">
                      Farm to Kitchen
                    </span>
                    <h3 className="font-extrabold text-lg leading-tight">
                      100% Pesticide-Free Bhopal Harvest
                    </h3>
                  </div>
                </div>

                {/* Floating Heart Quote Badge */}
                <div className="absolute -bottom-6 sm:-bottom-8 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-5 max-w-[240px] border border-green-100 text-left">
                  <Quote size={20} className="text-[#0f8646] mb-1" />
                  <p className="text-xs font-black text-gray-900 leading-snug">
                    "Papa ki mehnat, hamara sapna, aapka bharosa."
                  </p>
                  <span className="text-[10px] text-gray-400 font-bold mt-1 block">
                    — SubziQuick Founder Family
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== STATS COUNTER STRIP ===== */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Users size={24} className="text-[#0f8646]" />,
                value: "50,000+",
                label: "Happy Bhopal Families",
                sub: "Daily active customers",
              },
              {
                icon: <Clock size={24} className="text-[#0f8646]" />,
                value: "6 AM – 10 PM",
                label: "Store & Delivery Hours",
                sub: "Daily Express & Morning Slots",
              },
              {
                icon: <Leaf size={24} className="text-[#0f8646]" />,
                value: "100%",
                label: "Farm Fresh Harvest",
                sub: "Zero cold storage delay",
              },
              {
                icon: <MapPin size={24} className="text-[#0f8646]" />,
                value: "Bagsewaniya",
                label: "Central Store",
                sub: "Amrai, Bhopal - 462043",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className="text-2xl sm:text-3xl font-black text-[#0f8646]">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 mt-1">
                  {stat.label}
                </span>
                <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== OUR JOURNEY TIMELINE ===== */}
        <section id="journey" className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-[#0f8646] uppercase tracking-wider bg-green-100/80 px-3.5 py-1 rounded-full">
              MILESTONES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
              The Journey of SubziQuick
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              From a humble street cart to Bhopal’s most loved Mandi fresh & same-day produce delivery network
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                year: "2020",
                badge: "The Hardship",
                icon: <Briefcase size={22} className="text-[#0f8646]" />,
                title: "Job Loss & Resilience",
                desc: "Covid pandemic struck and my father lost his job. Without losing heart, he started selling fresh vegetables on a street cart.",
              },
              {
                year: "2022",
                badge: "The Spark",
                icon: <Store size={22} className="text-[#0f8646]" />,
                title: "Direct Farm Connections",
                desc: "We built trusted relationships with local farmers in Raisen & Sehore, eliminating middlemen to give fair prices to both farmers and families.",
              },
              {
                year: "2024",
                badge: "The Innovation",
                icon: <TrendingUp size={22} className="text-[#0f8646]" />,
                title: "SubziQuick Digital Store",
                desc: "Launched our online platform and central store in Bagsewaniya (Amrai) to deliver pure fresh harvest directly to Bhopal doorsteps.",
              },
              {
                year: "2026",
                badge: "Express Fresh Service",
                icon: <Sparkles size={22} className="text-[#0f8646]" />,
                title: "Same-Day Bhopal Mandi Runs (6 AM – 10 PM)",
                desc: "Now serving households across Bhopal with prompt deliveries, ozone-washed produce, and 100% satisfaction guarantee.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-[#0f8646]">
                      {step.year}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    {step.badge}
                  </span>
                  <h3 className="font-extrabold text-base text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== OUR CORE PROMISES ===== */}
        <section className="bg-gradient-to-b from-white via-green-50/40 to-white py-16 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black text-[#0f8646] uppercase tracking-wider bg-green-100/80 px-3.5 py-1 rounded-full">
                OUR VALUES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
                Why Bhopal Trusts SubziQuick
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Mission Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#0f8646] flex items-center justify-center mb-5">
                    <Target size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Our Mission</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    To make healthy, clean, chemical-free farm produce accessible to every Bhopal kitchen with guaranteed same-day delivery at honest Mandi rates.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#0f8646]">
                  <CheckCircle2 size={16} /> 100% Farm-Direct
                </div>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#0f8646] flex items-center justify-center mb-5">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Our Vision</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    To build Madhya Pradesh’s most reliable, transparent, and eco-friendly grocery logistics network that empowers both farmers and urban consumers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#0f8646]">
                  <CheckCircle2 size={16} /> Zero Waste Logistics
                </div>
              </div>

              {/* Founder Promise Card */}
              <div className="bg-[#0f8646] text-white rounded-3xl p-8 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5 backdrop-blur-xs">
                    <ShieldCheck size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">No Questions Asked Returns</h3>
                  <p className="text-xs sm:text-sm text-green-100 leading-relaxed">
                    If an apple is not crunchy or spinach is not crisp, hand it back to our rider for an instant replacement or refund. That is our family pledge.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2 text-xs font-bold text-white">
                  <Heart size={16} className="fill-white" /> Customer First Guarantee
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA CALLOUT ===== */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="bg-gradient-to-r from-[#0c592f] via-[#0f8646] to-[#15803d] rounded-3xl p-8 sm:p-14 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="max-w-xl relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4">
                Aaiiye, Saath Milkar Ek Sehatmand Bhopal Banayein!
              </h2>
              <p className="text-green-100 text-xs sm:text-sm leading-relaxed mb-8">
                Order your daily fresh vegetables & seasonal fruits today and get reliable same-day delivery right to your doorstep in Bhopal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="bg-white text-[#0f8646] hover:bg-green-50 px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md"
                >
                  Start Shopping Now
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white/80 hover:bg-white/10 text-white px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all"
                >
                  Contact Our Store
                </Link>
              </div>
            </div>

            <div className="shrink-0 relative z-10 hidden lg:block">
              <div className="w-52 h-52 bg-white/10 rounded-3xl flex items-center justify-center p-4 backdrop-blur-xs border border-white/20 rotate-3">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
                  alt="Fresh Delivery"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
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
