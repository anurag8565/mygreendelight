"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MapPin, Sparkles, ShieldCheck, Truck, Leaf } from "lucide-react";

export default function BhopalSeoFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How fast is vegetable and fruit delivery in Bhopal on SubziQuick?",
      a: "SubziQuick delivers farm-fresh vegetables and fruits across Bhopal within 15 to 45 minutes using our dedicated electric delivery fleet. We also offer early morning 6:30 AM breakfast harvest delivery slots.",
    },
    {
      q: "Where does SubziQuick source vegetables and fruits from in Bhopal?",
      a: "Our produce is sourced directly at sunrise from local contract farms across Madhya Pradesh and Karond Mandi Bhopal. Every batch is graded, ozone-sorted, and pesticide-neutralized without middleman storage delays.",
    },
    {
      q: "Can I order exotic vegetables & fruits like Broccoli, Avocado, and Bell Peppers in Bhopal?",
      a: "Yes! SubziQuick is Bhopal's leading store for fresh exotics and hydroponic greens, including imported Hass Avocados, crisp Broccoli, Red & Yellow Bell Peppers, Green Zucchini, Button Mushrooms, Cherry Tomatoes, and Iceberg Lettuce delivered same-day.",
    },
    {
      q: "Which localities in Bhopal are covered for express delivery?",
      a: "We deliver across all major Bhopal pin codes (462xxx), including MP Nagar, Arera Colony, Kolar Road, Bawadiya Kalan, Shahpura, Gulmohar, BHEL, Indrapuri, Ayodhya Bypass, Hoshangabad Road, Saket Nagar, Misrod, and Katara Hills.",
    },
    {
      q: "Are the vegetables 100% ozone-washed and pesticide-safe?",
      a: "Yes. Every leafy green, tomato, and root vegetable goes through automated ozone-bubble wash technology to remove 99.8% of surface dust, chemicals, and microbes before being eco-packed in breathable cotton mesh bags.",
    },
    {
      q: "What payment methods are supported on SubziQuick?",
      a: "We support instant Pay via UPI QR code (Google Pay, PhonePe, Paytm, BHIM), GreenPoints wallet deductions, and Cash on Delivery (COD) with zero extra payment fees.",
    },
    {
      q: "How does the Subah 7:00 AM Morning Subscription work?",
      a: "You can subscribe to daily essentials (such as fresh coriander, lemon, ginger, seasonal vegetables, or A2 Gir Cow Milk) and receive them on your doorstep every morning at 7:00 AM before you start cooking breakfast.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full font-sans">
      {/* Google Rich Snippet FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#0f8646] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2.5">
          <Sparkles size={13} className="text-[#0f8646]" />
          <span>Bhopal&apos;s #1 Farm Fresh & Exotics Network</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Frequently Asked Questions & Bhopal Delivery Guide
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Everything you need to know about fresh Mandi sourcing, fast locality delivery, exotics, and quality standards in Bhopal.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`border rounded-2xl transition-all duration-200 overflow-hidden bg-white shadow-2xs ${
                isOpen ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                      isOpen ? "bg-[#0f8646] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Q{idx + 1}
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-[#0f8646]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 bg-emerald-50/20">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Locality Trust Badges */}
      <div className="mt-8 bg-gradient-to-r from-emerald-900 to-[#073019] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <MapPin size={22} />
          </div>
          <div>
            <h4 className="font-black text-sm text-white">Live Across 19+ Bhopal Localities</h4>
            <p className="text-[11px] text-emerald-200/90 mt-0.5">
              MP Nagar • Arera Colony • Kolar Road • Bawadiya Kalan • Shahpura • Indrapuri • Ayodhya Bypass
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-emerald-500 text-gray-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
            ⚡ 15-45 Min Express Live
          </span>
        </div>
      </div>
    </section>
  );
}
