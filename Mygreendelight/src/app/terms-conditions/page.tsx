"use client";

import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Scale, Clock, Truck, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TermsConditionsPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center mb-4">
            <Scale size={24} />
          </div>
          <span className="text-xs font-black uppercase text-[#0f8646] tracking-wider block mb-1">
            Terms of Service
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Effective Date: August 2026 • MyGreenDelight Online Produce Services
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs space-y-8 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#0f8646]" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By accessing our website (<strong>mygreendelight.in</strong>) or placing an order for fruits, vegetables, and daily staples, you agree to be bound by these Terms and Conditions. Our services are currently active exclusively within the municipal limits of Bhopal, Madhya Pradesh.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Truck size={18} className="text-[#0f8646]" />
              <span>2. Delivery & Mandi Pricing</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li><strong>Fresh Mandi Pricing:</strong> All vegetable and fruit rates are updated daily based on Bhopal Krishi Upaj Mandi arrivals and quality grading.</li>
              <li><strong>Weight & Natural Variations:</strong> Natural produce may experience slight weight variances (within ±3%) during sorting, cleaning, and transit.</li>
              <li><strong>Delivery Slots:</strong> Orders placed under Instant Express are dispatched within 15-45 minutes. Scheduled morning/evening batch slots are delivered within their allocated time window.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-[#0f8646]" />
              <span>3. Order Acceptance & OTP Verification</span>
            </h2>
            <p>
              To ensure contactless and verified delivery, an OTP code will be sent to your registered email or phone when the delivery rider arrives at your address. Handing over the OTP to the rider completes the delivery and acts as proof of produce inspection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#0f8646]" />
              <span>4. User Account & Wallet Balance</span>
            </h2>
            <p>
              GreenPoints wallet cash and promo discounts are promotional in nature, non-transferable to external bank accounts, and can only be redeemed against future orders placed on MyGreenDelight.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
