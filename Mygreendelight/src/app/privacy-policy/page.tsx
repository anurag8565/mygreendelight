"use client";

import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center mb-4">
            <Lock size={24} />
          </div>
          <span className="text-xs font-black uppercase text-[#0f8646] tracking-wider block mb-1">
            Trust & Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Last Updated: August 2026 • SubziQuick Bhopal Farm Produce Pvt. Ltd.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs space-y-8 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0f8646]" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you use <strong>SubziQuick</strong> to order fresh farm vegetables, seasonal fruits, and groceries in Bhopal, we collect the necessary details to deliver your produce quickly and safely:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li><strong>Contact Information:</strong> Full name, mobile phone number, and email address for order OTP and delivery notifications.</li>
              <li><strong>Delivery Coordinates:</strong> Bhopal street address, GPS location / coordinates to enable accurate same-day rider navigation.</li>
              <li><strong>Order Data:</strong> Basket produce selections, payment preferences (Cash on Delivery or Paytm/UPI online payment), and delivery time-slot choices.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Eye size={18} className="text-[#0f8646]" />
              <span>2. How We Use Your Data</span>
            </h2>
            <p>
              Your personal data is used exclusively to fulfill your farm produce orders across Bhopal:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li>Dispatching delivery riders directly to your doorstep using live GPS routing.</li>
              <li>Sending order verification OTP codes and digital invoices via email.</li>
              <li>Crediting cashback to your GreenPoints wallet upon successful delivery.</li>
              <li>We <strong>never sell, rent, or trade</strong> your personal information to any third-party advertisers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-[#0f8646]" />
              <span>3. Payment & Security</span>
            </h2>
            <p>
              All online payments are processed through PCI-DSS compliant, RBI-authorized gateways (such as <strong>Paytm Payments Bank / Razorpay</strong>) using 256-bit SSL encryption. SubziQuick does not store your credit card numbers, debit card PINs, or UPI credentials on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#0f8646]" />
              <span>4. Contact Our Bhopal Support Desk</span>
            </h2>
            <p>
              If you have any questions regarding your data privacy, you can reach our Bhopal customer grievance desk:
            </p>
            <div className="bg-green-50/70 p-4 rounded-2xl border border-green-200 text-xs text-gray-800 space-y-1">
              <p><strong>Email:</strong> support@subziquick.in / anuragsinghas098@gmail.com</p>
              <p><strong>Support Helpline:</strong> +91 99814 18565 / +91 93012 34567</p>
              <p><strong>Address:</strong> Amrai, Bagsewaniya, Bhopal, Madhya Pradesh - 462043</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
