"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Link from "next/link";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Send,
  Lock,
  ChevronDown,
  ChevronUp,
  Store,
  ShieldCheck,
  Package,
  Clock,
  RotateCcw,
  CreditCard,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Headphones,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { BHOPAL_HUBS, StoreLocation } from "@/data/storeLocations";
import { motion } from "framer-motion";

// Dynamically import Leaflet map with SSR turned off
const BhopalStoreMap = dynamic(() => import("@/components/BhopalStoreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] bg-green-50/70 rounded-3xl flex items-center justify-center text-gray-400 font-medium">
      Loading Bhopal Store Map...
    </div>
  ),
});

export default function ContactPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Issue",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Map state
  const [selectedHub, setSelectedHub] = useState<StoreLocation | null>(
    BHOPAL_HUBS[0]
  );

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await axios.post("/api/contact", formData);
      if (res.data.success) {
        setStatusMsg({ type: "success", text: res.data.message });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Order Issue",
          message: "",
        });
      } else {
        setStatusMsg({
          type: "error",
          text: res.data.message || "Failed to send message.",
        });
      }
    } catch (error: any) {
      setStatusMsg({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How can I track my 10-minute delivery?",
      a: "You can track your rider in real-time using our live Leaflet GPS tracking map on the Track Order page or directly from your My Orders dashboard.",
    },
    {
      q: "What are your delivery operating hours?",
      a: "We deliver 100% farm-fresh produce from 7:00 AM to 10:00 PM, 7 days a week across all Bhopal neighborhoods.",
    },
    {
      q: "What if I receive unsatisfactory produce?",
      a: "We offer an instant, no-questions-asked replacement or refund directly via our delivery partner or customer support.",
    },
    {
      q: "How can I contact customer support directly?",
      a: "You can call or WhatsApp our dedicated Bhopal support team at +91 9981418565 for instant order assistance.",
    },
  ];

  return (
    <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
      {/* Full Header Navigation */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1">
        {/* ===== HERO BANNER SECTION ===== */}
        <section className="relative bg-gradient-to-b from-green-50/60 via-white to-white overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 sm:py-16">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              {/* Header Texts */}
              <div className="md:col-span-7">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0f8646] uppercase tracking-wider bg-green-100/80 px-3.5 py-1 rounded-full mb-4">
                  <Headphones size={14} /> 24/7 CUSTOMER CARE & BHOPAL HUBS
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
                  We Are Always Here <br />
                  <span className="text-[#0f8646]">To Help You!</span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
                  Have an order query, feedback, or need instant assistance with your fresh delivery? Connect with our Bhopal support team anytime.
                </p>
              </div>

              {/* Support Image Card */}
              <div className="md:col-span-5 flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                    alt="MyGreenDelight Customer Support"
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xs text-xs font-extrabold text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Live Bhopal Support (7 AM - 10 PM)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FORM + GET IN TOUCH CARDS ===== */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Send Us a Message Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                Send Us a Message
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill out the quick form below and our team will get back to you within minutes.
              </p>

              {statusMsg && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-bold flex items-start gap-3 ${
                    statusMsg.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {statusMsg.type === "success" ? (
                    <CheckCircle2 className="shrink-0 text-green-600 mt-0.5" size={18} />
                  ) : (
                    <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={18} />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs sm:text-sm bg-gray-50/60 font-medium"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs sm:text-sm bg-gray-50/60 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs sm:text-sm bg-gray-50/60 font-medium"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs sm:text-sm bg-gray-50/60 font-bold"
                    >
                      <option value="Order Issue">Order Issue</option>
                      <option value="Delivery Delay">Delivery Delay</option>
                      <option value="Payment & Refund">Payment & Refund</option>
                      <option value="Product Quality">Product Quality</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our Bhopal team assist you today?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full p-3.5 rounded-2xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs sm:text-sm bg-gray-50/60 font-medium resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Privacy disclaimer */}
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-2 font-medium">
                  <Lock size={13} className="text-[#0f8646]" />
                  Your information is 100% safe & protected under our privacy policy.
                </p>
              </form>
            </div>

            {/* Right: Get in Touch Card (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                  Quick Support Channels
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Direct contact lines for Bhopal customers & partner inquiries.
                </p>

                <div className="space-y-3.5">
                  {/* Call Us */}
                  <a
                    href="tel:9981418565"
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-green-50/70 transition-colors border border-gray-100 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-green-100 text-[#0f8646] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm">
                        Direct Phone Support
                      </h4>
                      <p className="text-xs font-black text-[#0f8646] mt-0.5">
                        +91 9981418565
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                        Mon - Sun: 7:00 AM – 10:00 PM
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp Us */}
                  <a
                    href="https://wa.me/919981418565?text=Hello%20MyGreenDelight%20Support,%20I%20need%20help%20with%20my%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-green-50/70 transition-colors border border-gray-100 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm">
                        WhatsApp Live Chat
                      </h4>
                      <p className="text-xs font-black text-[#25D366] mt-0.5">
                        +91 9981418565
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                        Instant chat replies from our team
                      </p>
                    </div>
                  </a>

                  {/* Email Us */}
                  <a
                    href="mailto:support@mygreendelight.in"
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-green-50/70 transition-colors border border-gray-100 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm">
                        Email Inquiries
                      </h4>
                      <p className="text-xs font-black text-blue-700 mt-0.5">
                        support@mygreendelight.in
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                        Detailed inquiries & business partnerships
                      </p>
                    </div>
                  </a>

                  {/* Office Hub */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="w-11 h-11 rounded-2xl bg-green-100 text-[#0f8646] flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm">
                        Bhopal Headquarters
                      </h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        Plot No. 12, Main Market, Arera Colony, Bhopal, MP - 462016
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== OUR STORE LOCATION & INTERACTIVE MAP ===== */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left: Hubs List (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 mb-1">
                  <Store size={20} className="text-[#0f8646]" />
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    Our Bhopal Hubs
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  Select a local dark store hub to view live location on the map:
                </p>

                <div className="space-y-3 mb-6">
                  {BHOPAL_HUBS.map((hub) => {
                    const isSelected = selectedHub?.id === hub.id;
                    return (
                      <div
                        key={hub.id}
                        onClick={() => setSelectedHub(hub)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? "bg-green-50/80 border-[#0f8646] shadow-xs"
                            : "bg-gray-50/60 border-gray-200/80 hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#0f8646] text-white"
                              : "bg-white text-gray-600"
                          }`}
                        >
                          <Store size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-gray-900 text-sm truncate">
                              {hub.name}
                            </h4>
                            {isSelected && (
                              <span className="text-[10px] font-black text-[#0f8646] uppercase bg-green-200/60 px-2 py-0.5 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {hub.address}
                          </p>
                          <p className="text-[11px] text-[#0f8646] font-bold mt-1">
                            ⚡ 10-15 Min Express Delivery Active
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs"
                >
                  <MapPin size={14} />
                  <span>Start Express Shopping</span>
                </Link>
              </div>

              {/* Right: Leaflet Interactive Map (7 Cols) */}
              <div className="lg:col-span-7 h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden relative border border-gray-200">
                <BhopalStoreMap selectedHub={selectedHub} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== FREQUENTLY ASKED QUESTIONS (FAQ) ===== */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Quick answers regarding ordering, returns, and delivery
              </p>
            </div>
            <Link
              href="/about"
              className="text-[#0f8646] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <span>Learn More</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm leading-snug">
                        {faq.q}
                      </h4>
                      <button className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    <p
                      className={`text-xs text-gray-500 leading-relaxed transition-all ${
                        isOpen ? "block mt-2" : "line-clamp-2"
                      }`}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Full Footer */}
      <Footer />
    </div>
  );
}
