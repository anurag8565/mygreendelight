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
  Zap,
  HelpCircle,
  Truck,
  Leaf,
  ExternalLink,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { BHOPAL_HUBS, StoreLocation } from "@/data/storeLocations";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Leaflet map with SSR turned off
const BhopalStoreMap = dynamic(() => import("@/components/BhopalStoreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] bg-emerald-50/60 rounded-3xl flex items-center justify-center text-gray-400 font-medium border border-emerald-100">
      <div className="flex items-center gap-2 text-xs font-bold text-[#0f8646]">
        <Loader2 size={16} className="animate-spin" />
        <span>Loading Bhopal Store Map...</span>
      </div>
    </div>
  ),
});

export default function ContactPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  // Form State
  const [formData, setFormData] = useState({
    name: userdata?.name || "",
    email: userdata?.email || "",
    phone: userdata?.mobile || "",
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
        setStatusMsg({ type: "success", text: res.data.message || "Message sent successfully! Our Bhopal team will contact you shortly." });
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
          "Something went wrong. Please try again or WhatsApp us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickHelpTopics = [
    {
      icon: <Truck className="text-[#0f8646]" size={20} />,
      title: "Track Live Order",
      desc: "Live GPS tracking & rider contact for ongoing deliveries",
      link: "/user/myorder",
      linkText: "Track Order",
      bg: "bg-emerald-50/70 border-emerald-200/80",
    },
    {
      icon: <RotateCcw className="text-amber-600" size={20} />,
      title: "Quality & Replacements",
      desc: "100% no-questions-asked refund or replacement guarantee",
      link: "https://wa.me/919981418565?text=Hello%20SubziQuick!%20I%20have%20an%20issue%20with%20produce%20quality%20in%20my%20order.",
      linkText: "Claim Quality Help",
      bg: "bg-amber-50/70 border-amber-200/80",
      external: true,
    },
    {
      icon: <CreditCard className="text-blue-600" size={20} />,
      title: "Payments & Refunds",
      desc: "UPI UTR verification & wallet balance assistance",
      link: "https://wa.me/919981418565?text=Hello%20SubziQuick!%20I%20have%20a%20question%20about%20my%20UPI%20payment%20or%20refund.",
      linkText: "Payment Support",
      bg: "bg-blue-50/70 border-blue-200/80",
      external: true,
    },
    {
      icon: <MessageCircle className="text-[#25D366]" size={20} />,
      title: "WhatsApp Helpdesk",
      desc: "Instant live chat with Bhopal dispatch team in < 2 mins",
      link: "https://wa.me/919981418565?text=Hello%20SubziQuick!%20I%20need%20quick%20assistance.",
      linkText: "Chat on WhatsApp",
      bg: "bg-green-50/70 border-green-200/80",
      external: true,
    },
  ];

  const faqs = [
    {
      q: "How fast is delivery across Bhopal?",
      a: "SubziQuick provides 15-45 minutes express delivery directly from our Bhopal farm hubs. You can also pick a scheduled morning farm slot (6:00 AM - 10:00 AM) during checkout.",
    },
    {
      q: "What is your Freshness & Quality Guarantee?",
      a: "If any vegetable or fruit does not meet your quality expectations upon delivery, we offer an instant 100% no-questions-asked replacement or refund directly via our delivery partner or WhatsApp support.",
    },
    {
      q: "What are your delivery operating hours?",
      a: "We deliver 7 days a week from 7:00 AM to 10:00 PM across all Bhopal neighborhoods including Arera Colony, Kolar Road, MP Nagar, Hoshangabad Road, Bawadiya Kalan, and beyond.",
    },
    {
      q: "How do I use my Farm Wallet & Scratch Card coupons?",
      a: "Your wallet balance and unlocked scratch card discounts automatically apply at checkout with 1 tap, reducing your payable order total instantly.",
    },
    {
      q: "How do Bhopal Society Order Pools work?",
      a: "When neighbors in the same colony order together and reach the group pool target, every order unlocks an additional flat 5% discount automatically.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col justify-between font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      {/* Navigation */}
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="flex-1 space-y-8 sm:space-y-12 pb-24 sm:pb-16">
        
        {/* ===== 1. HERO SECTION ===== */}
        <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase mb-4 bg-emerald-50 text-[#0f8646] border border-emerald-200/80 shadow-2xs">
              <Headphones size={13} />
              <span>24/7 Bhopal Customer Care & Concierge</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
              How Can We <span className="text-[#0f8646]">Help You</span> Today?
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
              Have an order question, quality feedback, or need instant delivery assistance? Connect with our dedicated Bhopal farm team anytime.
            </p>
          </div>
        </section>

        {/* ===== 2. FOUR QUICK-HELP PROBLEM CARDS ===== */}
        <section className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {quickHelpTopics.map((topic, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`p-4 sm:p-5 rounded-3xl border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-emerald-300 hover:shadow-xs transition-all`}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 shadow-2xs">
                    {topic.icon}
                  </div>
                  <h3 className="font-black text-sm text-gray-900 mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                    {topic.desc}
                  </p>
                </div>

                {topic.external ? (
                  <a
                    href={topic.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between text-xs font-black text-[#0f8646] hover:text-[#0c6a38] transition pt-2 border-t border-gray-100 group"
                  >
                    <span>{topic.linkText}</span>
                    <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ) : (
                  <Link
                    href={topic.link}
                    className="inline-flex items-center justify-between text-xs font-black text-[#0f8646] hover:text-[#0c6a38] transition pt-2 border-t border-gray-100 group"
                  >
                    <span>{topic.linkText}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== 3. DIRECT CONTACT CHANNELS BENTO ===== */}
        <section className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Phone Support */}
            <a
              href="tel:9981418565"
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0f8646] border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Direct Phone Support
                </span>
                <p className="text-sm font-black text-gray-900 mt-0.5 group-hover:text-[#0f8646] transition truncate">
                  +91 9981418565
                </p>
                <p className="text-[10.5px] text-gray-400 font-medium mt-0.5">
                  Mon – Sun: 7 AM – 10 PM
                </p>
              </div>
            </a>

            {/* WhatsApp Live Desk */}
            <a
              href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support!%20I%20need%20help%20with%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#25D366]/10 text-[#25D366] border border-green-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  WhatsApp Concierge
                </span>
                <p className="text-sm font-black text-gray-900 mt-0.5 group-hover:text-[#0f8646] transition truncate">
                  +91 9981418565
                </p>
                <p className="text-[10.5px] text-gray-400 font-medium mt-0.5">
                  Instant response in &lt; 2 mins
                </p>
              </div>
            </a>

            {/* Email Support */}
            <a
              href="mailto:anuragsinghas098@gmail.com"
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Email Desk
                </span>
                <p className="text-sm font-black text-gray-900 mt-0.5 group-hover:text-blue-600 transition truncate">
                  anuragsinghas098@gmail.com
                </p>
                <p className="text-[10.5px] text-gray-400 font-medium mt-0.5">
                  Detailed inquiries & receipts
                </p>
              </div>
            </a>

          </div>
        </section>

        {/* ===== 4. SEND US A MESSAGE FORM + STORE HUB ===== */}
        <section className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Cols: Clean Message Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black">
                  <Send size={15} />
                </div>
                <h2 className="text-xl font-black text-gray-900">
                  Send Us a Message
                </h2>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                Fill out the quick inquiry form below and our team will get back to you promptly.
              </p>

              {statusMsg && (
                <div
                  className={`p-3.5 rounded-2xl mb-5 text-xs font-bold flex items-start gap-2.5 ${
                    statusMsg.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                      : "bg-red-50 border border-red-200 text-red-900"
                  }`}
                >
                  {statusMsg.type === "success" ? (
                    <CheckCircle2 className="shrink-0 text-[#0f8646] mt-0.5" size={16} />
                  ) : (
                    <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={16} />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-[10.5px] font-black text-gray-600 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anurag Singh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs bg-gray-50/60 font-medium transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10.5px] font-black text-gray-600 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs bg-gray-50/60 font-medium transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {/* Email */}
                  <div>
                    <label className="block text-[10.5px] font-black text-gray-600 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs bg-gray-50/60 font-medium transition"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[10.5px] font-black text-gray-600 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs bg-gray-50/60 font-bold transition"
                    >
                      <option value="Order Issue">Order Issue</option>
                      <option value="Quality & Freshness">Quality & Freshness</option>
                      <option value="Delivery Timing">Delivery Timing</option>
                      <option value="Payment & Refund">Payment & Refund</option>
                      <option value="Society Pool Inquiries">Society Pool Inquiries</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10.5px] font-black text-gray-600 uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can our Bhopal support team assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#0f8646] outline-none text-xs bg-gray-50/60 font-medium resize-none transition"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10.5px] text-gray-400 flex items-center gap-1 font-medium">
                    <Lock size={12} className="text-[#0f8646]" /> 100% Privacy Protected
                  </p>
                </div>
              </form>
            </div>

            {/* Right 5 Cols: Store Hub Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black">
                  <Store size={15} />
                </div>
                <h2 className="text-xl font-black text-gray-900">
                  Our Bhopal Store Hub
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Fresh harvest packing & dispatch centre in Bhopal:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3">
                  <MapPin size={18} className="text-[#0f8646] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-gray-900">SubziQuick Central Store</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                      Amrai, Bagsewaniya, Bhopal, Madhya Pradesh – 462043
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-gray-900">Dispatch & Store Timings</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Morning: 6:00 AM – 1:00 PM <br />
                      Evening: 4:00 PM – 9:00 PM (Daily)
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-gray-900">100% Quality Replacement</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Instant replacement or refund if produce is not fresh.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bhopal Store Map Container */}
              <div className="h-52 rounded-2xl overflow-hidden border border-gray-200/90 shadow-inner mt-2">
                <BhopalStoreMap selectedHub={selectedHub} />
              </div>
            </div>

          </div>
        </section>

        {/* ===== 5. FREQUENTLY ASKED QUESTIONS ===== */}
        <section className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-2xs">
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black tracking-wider uppercase mb-2 bg-emerald-50 text-[#0f8646] border border-emerald-200">
                <HelpCircle size={12} />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Got Questions? We Have Answers.
              </h2>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? "bg-emerald-50/40 border-emerald-300"
                        : "bg-gray-50/60 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 flex items-center justify-between text-left font-black text-xs sm:text-sm text-gray-900 cursor-pointer gap-3"
                    >
                      <span>{faq.q}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-[#0f8646]" : ""}`}>
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed font-medium pt-1 border-t border-emerald-200/40">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
