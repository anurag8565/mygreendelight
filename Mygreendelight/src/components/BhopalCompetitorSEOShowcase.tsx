"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Zap,
  TrendingDown,
  Leaf,
  Scale,
  Award,
  ArrowRight,
} from "lucide-react";

export default function BhopalCompetitorSEOShowcase() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const localities = [
    { name: "Arera Colony (E1–E8)", query: "arera colony", tag: "Express 15m" },
    { name: "MP Nagar (Zone 1 & 2)", query: "mp nagar", tag: "High Demand" },
    { name: "Kolar Road & Chuna Bhatti", query: "kolar", tag: "Daily Morning" },
    { name: "Bittan Market & E-4", query: "bittan market", tag: "Farm Fresh" },
    { name: "Gulmohar & Shahpura", query: "shahpura", tag: "Popular" },
    { name: "Bawadiya Kalan & Trilanga", query: "bawadiya kalan", tag: "Fast Delivery" },
    { name: "Katara Hills & Bagsewaniya", query: "katara hills", tag: "Central Hub" },
    { name: "Hoshangabad Road & Misrod", query: "hoshangabad road", tag: "Sunrise Slot" },
    { name: "Ayodhya Bypass & Minal", query: "ayodhya bypass", tag: "Daily Morning" },
    { name: "Indrapuri & BHEL", query: "indrapuri", tag: "Bulk Savings" },
    { name: "Awadhpuri & Piplani", query: "awadhpuri", tag: "Express 20m" },
    { name: "TT Nagar & New Market", query: "tt nagar", tag: "Daily Morning" },
    { name: "Salaiya & Rohit Nagar", query: "salaiya", tag: "Farm Direct" },
    { name: "Saket Nagar & AIIMS Area", query: "saket nagar", tag: "Priority Slot" },
    { name: "Nehru Nagar & Kotra", query: "nehru nagar", tag: "Express 15m" },
    { name: "Lalghati & Kohefiza", query: "kohefiza", tag: "Same Day" },
  ];

  const popularSearches = [
    { label: "🥑 Fresh Hass Avocado", query: "avocado" },
    { label: "🥦 Crisp Green Broccoli", query: "broccoli" },
    { label: "🍄 Fresh Button Mushrooms", query: "mushroom" },
    { label: "🥬 Hydroponic Lettuce", query: "lettuce" },
    { label: "🍅 Desi Organic Tomato", query: "tamatar" },
    { label: "🥔 Pahadi Premium Aloo", query: "aloo" },
    { label: "🧅 Nashik Red Onion", query: "pyaz" },
    { label: "🌿 Fresh Methi & Palak", query: "palak" },
    { label: "🐉 Fresh Dragon Fruit", query: "dragon fruit" },
    { label: "🫐 Blueberries & Berries", query: "blueberry" },
    { label: "🫑 Red & Yellow Bell Peppers", query: "capsicum" },
    { label: "🥗 Daily Salad Diet Box", query: "salad" },
  ];

  const comparisonData = [
    {
      feature: "Produce Sourcing",
      subziquick: "Daily 5:00 AM Sunrise Harvest from local Kisan farms",
      supermarkets: "3 to 5-day old central warehouse inventory",
      quickApps: "Dark-store warehouse refrigeration (wilted leaves)",
    },
    {
      feature: "Customer Pricing",
      subziquick: "Direct Farm Wholesale Rates (Zero middleman cut)",
      supermarkets: "Standard retail markup + plastic packaging cost",
      quickApps: "35% - 50% high markup + high handling/platform fees",
    },
    {
      feature: "Hygiene & Washing",
      subziquick: "100% Ozone-Washed & graded (Removes 99% pesticides)",
      supermarkets: "Stored unwashed in plastic wraps",
      quickApps: "Unwashed batch crates",
    },
    {
      feature: "Delivery Experience",
      subziquick: "15–45 min dedicated Bhopal slots (6 AM – 8 PM)",
      supermarkets: "Next day or fixed 24-hr delayed slots",
      quickApps: "10-min rush delivery (High surge & small portions)",
    },
    {
      feature: "Exotics & Variety",
      subziquick: "120+ items (Hydroponics, Berries, Zucchini, Italian Basil)",
      supermarkets: "Limited to 15-20 common grocery items",
      quickApps: "Frequent out-of-stock on fresh exotics",
    },
    {
      feature: "Replacement Guarantee",
      subziquick: "Instant 100% no-questions-asked refund or replace",
      supermarkets: "Manual store visits required for return",
      quickApps: "Automated chatbot dispute with delayed wallet coins",
    },
  ];

  const faqs = [
    {
      q: "How does SubziQuick provide fresher vegetables than Blinkit, Zepto, or Ondoor in Bhopal?",
      a: "Unlike warehouse-based quick-commerce apps that store vegetables in cold dark stores for 3–5 days, SubziQuick procures directly from local Bhopal farming clusters every morning at 5:00 AM. Every batch is ozone-cleaned, graded, and delivered the same morning to your kitchen.",
    },
    {
      q: "Which areas in Bhopal do you deliver fresh vegetables and fruits to?",
      a: "SubziQuick delivers across all major Bhopal localities including Arera Colony (E1-E8), MP Nagar, Kolar Road, Bittan Market, Gulmohar, Shahpura, Bawadiya Kalan, Katara Hills, Hoshangabad Road, Ayodhya Bypass, Indrapuri, BHEL, Awadhpuri, TT Nagar, Chuna Bhatti, Nehru Nagar, Trilanga, and Salaiya.",
    },
    {
      q: "Are exotic vegetables like Avocado, Broccoli, and Hydroponic Lettuce available in Bhopal?",
      a: "Yes! SubziQuick has Bhopal's largest catalog of exotic produce including Hass Avocados, Green & Purple Broccoli, Hydroponic Romaine/Iceberg Lettuce, Zucchini, Button Mushrooms, Cherry Tomatoes, Italian Basil, Celery, Bok Choy, Blueberries, and Dragon Fruit at wholesale farm prices.",
    },
    {
      q: "What is SubziQuick's 100% Ozone Washing and Quality Guarantee?",
      a: "Every batch of green leafy vegetables, salad produce, and fruits undergoes certified ozone bubble washing. This removes 99.4% of surface chemical pesticides, bacteria, and dust without using harmful detergents, keeping your food pure, natural, and safe for your family.",
    },
    {
      q: "What are the delivery slots and minimum order value?",
      a: "We offer flexible slots starting with Early Sunrise (6:00 AM – 8:30 AM), Morning Fresh (8:30 AM – 11:00 AM), Midday (11:00 AM – 1:00 PM), and Evening (4:00 PM – 7:30 PM). There is no high minimum cart limit, so you can order exactly what you need for daily cooking.",
    },
  ];

  return (
    <section className="w-full py-10 sm:py-16 bg-gradient-to-b from-white via-emerald-50/30 to-white font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Top SEO Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-[#0c831f] text-xs font-black px-3.5 py-1 rounded-full mb-3 border border-emerald-300/60">
            <Award size={14} className="text-[#0c831f]" />
            <span>BHOPAL&apos;S #1 RATED ONLINE PRODUCE PLATFORM</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
            Why Bhopal Chooses SubziQuick Over Cold-Storage Apps
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2.5 font-medium leading-relaxed">
            Experience direct sunrise farm harvest, 100% ozone-cleaned produce, and true wholesale prices delivered in 15–45 minutes across all Bhopal societies.
          </p>
        </div>

        {/* 1. Competitor Comparison Table */}
        <div className="mb-12 sm:mb-16 bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="bg-[#093e21] text-white p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                Direct Market Comparison
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                SubziQuick vs Dark-Store Apps & Supermarkets
              </h3>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full">
              ⚡ 100% Farm Fresh Advantage
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-black text-[11px] sm:text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6 w-1/4">Key Standard</th>
                  <th className="py-3.5 px-4 sm:px-6 w-1/3 bg-emerald-50 text-emerald-900 border-x border-emerald-200 font-extrabold">
                    🌿 SubziQuick (Bhopal)
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 w-1/4 text-gray-500">Quick Commerce Apps</th>
                  <th className="py-3.5 px-4 sm:px-6 w-1/4 text-gray-500">Supermarket Stores</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900 flex items-center gap-1.5">
                      <Scale size={13} className="text-[#0c831f] shrink-0" />
                      <span>{row.feature}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 bg-emerald-50/60 text-emerald-950 font-bold border-x border-emerald-100">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 size={15} className="text-[#0c831f] shrink-0 mt-0.5" />
                        <span>{row.subziquick}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-gray-600">
                      <div className="flex items-start gap-1.5">
                        <XCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{row.quickApps}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-gray-600">
                      <div className="flex items-start gap-1.5">
                        <XCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                        <span>{row.supermarkets}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Bhopal High-Intent Search Tags Grid */}
        <div className="mb-12 sm:mb-16 bg-white p-5 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0c831f] mb-1">
                <Sparkles size={14} />
                <span>POPULAR PRODUCE SEARCHES IN BHOPAL</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
                Top Trending Farm-Fresh Items Today
              </h3>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0c831f] hover:text-[#085a15] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto"
            >
              <span>Explore All 250+ Items</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {popularSearches.map((item, idx) => (
              <Link
                key={idx}
                href={`/shop?search=${encodeURIComponent(item.query)}`}
                className="bg-gray-50 hover:bg-emerald-600 text-gray-800 hover:text-white border border-gray-200 hover:border-emerald-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-sm flex items-center gap-1 group"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-gray-400 group-hover:text-emerald-100 font-medium">
                  • Buy Online
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Bhopal Locality Delivery Hubs */}
        <div className="mb-12 sm:mb-16 bg-gradient-to-br from-[#0c831f] to-[#095a16] text-white p-6 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="bg-white/20 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  📍 Hyperlocal Delivery Hubs
                </span>
                <h3 className="text-xl sm:text-3xl font-black tracking-tight mt-2 text-white">
                  Fast Doorstep Produce Delivery in Bhopal
                </h3>
                <p className="text-xs sm:text-sm text-green-100/90 mt-1 max-w-xl">
                  Dispatched from our Bagsewaniya Central Hub with temperature-safe packing for crisp, fresh delivery.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold shrink-0">
                <Zap size={14} className="text-yellow-300" />
                <span>15–45 Min Express Slots</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {localities.map((loc, idx) => (
                <Link
                  key={idx}
                  href={`/shop?locality=${encodeURIComponent(loc.query)}`}
                  className="bg-white/10 hover:bg-white text-white hover:text-gray-950 p-3 rounded-2xl border border-white/15 hover:border-white transition-all backdrop-blur-xs flex flex-col justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <MapPin size={13} className="text-yellow-300 group-hover:text-emerald-700 shrink-0" />
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
        </div>

        {/* 4. Google FAQ Schema Rich Snippets */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#0c831f] uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Vegetable & Fruit Delivery in Bhopal (FAQ)
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
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
