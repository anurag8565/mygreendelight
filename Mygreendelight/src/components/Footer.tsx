"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Mail,
  ChevronDown,
  Leaf,
  Sparkles,
} from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const socialChannels = [
    {
      name: "Instagram",
      handle: "@subziquick",
      href: "https://www.instagram.com/subziquick",
      title: "Follow SubziQuick on Instagram",
      bgGradient: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
      icon: (
        <svg className="w-5.5 h-5.5 sm:w-4.5 sm:h-4.5 fill-white" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      handle: "+91 99814 18565",
      href: "https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order.",
      title: "Chat on WhatsApp Support",
      bgGradient: "bg-[#25D366]",
      icon: (
        <svg className="w-5.5 h-5.5 sm:w-4.5 sm:h-4.5 fill-white" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.632.062-1.923-.448-1.57-.621-2.572-2.22-2.65-2.324-.078-.104-.632-.843-.632-1.611 0-.769.404-1.15.547-1.307.144-.157.312-.196.417-.196.104 0 .209.002.301.006.098.004.229-.037.358.273.131.314.445 1.084.484 1.163.039.078.065.17.013.274-.052.105-.078.17-.156.262-.079.091-.165.204-.236.274-.078.079-.16.164-.069.32.091.157.404.667.868 1.08.597.532 1.101.697 1.258.775.156.079.248.065.34-.039.091-.105.391-.457.495-.614.105-.157.209-.131.353-.078.144.052.913.431 1.07.509.157.079.261.118.3.183.039.066.039.38-.105.785zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.66 1.438 5.169L2 22l4.978-1.393A9.95 9.95 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      ),
    },
    {
      name: "Facebook",
      handle: "SubziQuick",
      href: "https://www.facebook.com/profile.php?id=61594046110147",
      title: "Follow SubziQuick on Facebook",
      bgGradient: "bg-[#1877F2]",
      icon: (
        <svg className="w-5.5 h-5.5 sm:w-4.5 sm:h-4.5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: "Helpline",
      handle: "9981418565",
      href: "tel:9981418565",
      title: "Direct Phone Call",
      bgGradient: "bg-emerald-600",
      icon: <Phone className="w-5 h-5 sm:w-4 sm:h-4 text-white" />,
    },
    {
      name: "Email Desk",
      handle: "anuragsinghas098@gmail.com",
      href: "mailto:anuragsinghas098@gmail.com",
      title: "Email Support Desk",
      bgGradient: "bg-blue-600",
      icon: <Mail className="w-5 h-5 sm:w-4 sm:h-4 text-white" />,
    },
  ];

  const localities = [
    "Arera Colony",
    "MP Nagar",
    "Kolar Road",
    "Bagsewaniya",
    "Bawadiya Kalan",
    "Gulmohar",
    "Shahpura",
    "Katara Hills",
    "Hoshangabad Road",
    "Bittan Market",
    "Saket Nagar",
    "Ayodhya Bypass",
    "Indrapuri",
    "Chunabhatti",
    "TT Nagar",
    "Misrod",
    "Trilanga",
    "Ashoka Garden",
    "Habibganj",
    "BHEL",
  ];

  return (
    <footer className="bg-[#031d0e] text-white font-sans border-t border-emerald-950/90 pb-36 sm:pb-28 md:pb-12 w-full max-w-full overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-12 md:pt-14 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 lg:gap-10 items-start">
          
          {/* Column 1: Store Brand & Contact Center */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left w-full">
            <div className="mb-3 flex justify-center sm:justify-start w-full">
              <Logo variant="white" />
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 mb-5 leading-relaxed font-medium max-w-sm mx-auto sm:mx-0">
              SubziQuick (Subzi Quick) is Bhopal&apos;s dedicated 10-15 min online fresh vegetable and fruit delivery service. Handpicked, farm-fresh produce direct to your kitchen.
            </p>

            {/* Store Address & Hours Bento Chips */}
            <div className="grid grid-cols-2 gap-2.5 max-w-md mb-4 w-full">
              <div className="bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="text-[9px] font-black uppercase text-emerald-300 tracking-wider block">
                    Store Location
                  </span>
                  <p className="text-xs text-white font-bold truncate">
                    Bagsewaniya, Bhopal
                  </p>
                </div>
              </div>

              <div className="bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 transition">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                  <Clock size={15} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider block">
                    Fast Dispatch
                  </span>
                  <p className="text-xs text-white font-bold truncate">
                    6:00 AM – 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Direct 1-Tap Action Callouts */}
            <div className="grid grid-cols-2 gap-2.5 max-w-md mb-5 w-full">
              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer text-center group min-h-[42px]"
              >
                <MessageCircle size={15} className="shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">WhatsApp Live</span>
              </a>

              <a
                href="tel:9981418565"
                className="bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-white py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer text-center group min-h-[42px]"
              >
                <Phone size={14} className="text-emerald-300 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">Call Helpline</span>
              </a>
            </div>

            {/* Official Social Media Dock */}
            <div className="pt-2 pb-1 w-full max-w-md flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-between w-full mb-3">
                <span className="text-xs sm:text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-300" />
                  Connect With Us
                </span>
                <span className="hidden sm:inline text-[10px] text-emerald-200/60 font-medium">
                  @subziquick
                </span>
              </div>

              {/* Social Channels Icons - Centered on Mobile & Larger Touch Targets */}
              <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-2.5 flex-wrap w-full">
                {socialChannels.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`w-11 h-11 sm:w-10 sm:h-10 rounded-2xl sm:rounded-xl ${item.bgGradient} flex items-center justify-center text-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20`}
                    title={item.title}
                    aria-label={item.title}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-7 lg:col-span-8 w-full pt-1">
            
            {/* Tablet & Desktop Navigation View (3 Columns on screens >= 640px) */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-6 md:gap-6 lg:gap-10">
              
              {/* Col 1: Produce Categories */}
              <div className="flex flex-col">
                <h3 className="font-black text-xs uppercase tracking-wider mb-4 text-emerald-300 flex items-center gap-2">
                  <Leaf size={14} className="text-emerald-400" />
                  <span>Fresh Harvest</span>
                </h3>
                <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                  <Link href="/shop?category=Vegetables" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5">
                    Daily Fresh Vegetables
                  </Link>
                  <Link href="/shop?category=Fruits" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5">
                    Seasonal Fruits
                  </Link>
                  <Link href="/shop?category=Exotics" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5">
                    Exotics & Salads
                  </Link>
                  <Link href="/shop" className="hover:text-amber-300 text-amber-300 font-bold hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5">
                    Value Combos & Deals
                  </Link>
                </div>
              </div>

              {/* Col 2: Customer Account & Care */}
              <div className="flex flex-col">
                <h3 className="font-black text-xs uppercase tracking-wider mb-4 text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Account & Care</span>
                </h3>
                <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                  <Link href="/user/myorder" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    Track Orders
                  </Link>
                  <Link href="/wishlist" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    Saved Favorites
                  </Link>
                  <Link href="/offers" className="hover:text-amber-300 text-amber-300 font-bold hover:translate-x-1 transition-all py-0.5">
                    Offers & Scratch Deals
                  </Link>
                  <Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    Customer Support
                  </Link>
                  <Link href="/about" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    About SubziQuick
                  </Link>
                </div>
              </div>

              {/* Col 3: Store Policies */}
              <div className="flex flex-col">
                <h3 className="font-black text-xs uppercase tracking-wider mb-4 text-emerald-300 flex items-center gap-2">
                  <Truck size={14} className="text-emerald-400" />
                  <span>Store Policies</span>
                </h3>
                <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                  <Link href="/privacy-policy" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    Privacy Policy
                  </Link>
                  <Link href="/terms-conditions" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    Terms & Conditions
                  </Link>
                  <Link href="/refund-policy" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    Refund & Return
                  </Link>
                  <Link href="/shipping-policy" className="hover:text-white hover:translate-x-1 transition-all py-0.5">
                    Shipping Policy
                  </Link>
                </div>
              </div>

            </div>

            {/* Mobile Accordion View (Visible only on phone < 640px) */}
            <div className="sm:hidden flex flex-col gap-2.5 mt-2">
              
              {/* Accordion 1: Categories */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition">
                <button
                  type="button"
                  onClick={() => toggleSection("categories")}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-xs font-black text-emerald-300 uppercase tracking-wider cursor-pointer active:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <Leaf size={14} className="text-emerald-400" />
                    Produce Categories
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openSection === "categories" ? "rotate-180 text-white" : "text-emerald-400"
                    }`}
                  />
                </button>
                {openSection === "categories" && (
                  <div className="px-4 pb-3 pt-1 border-t border-white/5 flex flex-col gap-2 text-xs text-emerald-100/80 font-medium">
                    <Link href="/shop?category=Vegetables" className="py-1 hover:text-white">
                      Daily Fresh Vegetables
                    </Link>
                    <Link href="/shop?category=Fruits" className="py-1 hover:text-white">
                      Seasonal Fresh Fruits
                    </Link>
                    <Link href="/shop?category=Exotics" className="py-1 hover:text-white">
                      Exotic Vegetables & Salads
                    </Link>
                    <Link href="/shop" className="py-1 text-amber-300 font-bold">
                      Value Combos & Deals
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordion 2: Customer Account */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition">
                <button
                  type="button"
                  onClick={() => toggleSection("account")}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-xs font-black text-emerald-300 uppercase tracking-wider cursor-pointer active:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    Account & Support
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openSection === "account" ? "rotate-180 text-white" : "text-emerald-400"
                    }`}
                  />
                </button>
                {openSection === "account" && (
                  <div className="px-4 pb-3 pt-1 border-t border-white/5 flex flex-col gap-2 text-xs text-emerald-100/80 font-medium">
                    <Link href="/user/myorder" className="py-1 hover:text-white">
                      Track My Orders
                    </Link>
                    <Link href="/wishlist" className="py-1 hover:text-white">
                      Saved Favorites
                    </Link>
                    <Link href="/offers" className="py-1 text-amber-300 font-bold">
                      Offers & Discounts
                    </Link>
                    <Link href="/contact" className="py-1 hover:text-white">
                      Customer Support
                    </Link>
                    <Link href="/about" className="py-1 hover:text-white">
                      About SubziQuick
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordion 3: Policies */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition">
                <button
                  type="button"
                  onClick={() => toggleSection("policies")}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-xs font-black text-emerald-300 uppercase tracking-wider cursor-pointer active:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <Truck size={14} className="text-emerald-400" />
                    Store Policies
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openSection === "policies" ? "rotate-180 text-white" : "text-emerald-400"
                    }`}
                  />
                </button>
                {openSection === "policies" && (
                  <div className="px-4 pb-3 pt-1 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-emerald-100/80 font-medium">
                    <Link href="/privacy-policy" className="py-1 hover:text-white">
                      Privacy Policy
                    </Link>
                    <Link href="/terms-conditions" className="py-1 hover:text-white">
                      Terms & Conditions
                    </Link>
                    <Link href="/refund-policy" className="py-1 hover:text-white">
                      Refund & Return
                    </Link>
                    <Link href="/shipping-policy" className="py-1 hover:text-white">
                      Shipping Policy
                    </Link>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* 3. Bhopal Express Delivery Localities Strip */}
        <div className="border-t border-white/10 mt-8 pt-6 pb-2">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 text-center sm:text-left">
            <Truck size={14} className="text-emerald-400 shrink-0" />
            <span className="font-black text-[11px] text-emerald-300 uppercase tracking-wider">
              10-15 Min Express Delivery Localities Across Bhopal:
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            {localities.map((loc, i) => (
              <span
                key={i}
                className="bg-white/[0.05] hover:bg-emerald-500/20 text-emerald-100/70 hover:text-white px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition border border-white/5 cursor-default select-none"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Bottom Legal & Payment Badges */}
        <div className="border-t border-white/10 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/70 gap-3.5 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-3">
            <p className="text-[11px] font-medium text-emerald-100/80">
              © {currentYear} SubziQuick Bhopal • Farm Fresh Everyday
            </p>
            <span className="hidden sm:inline text-white/30">•</span>
            <p className="text-[10.5px] text-emerald-300/70">
              Made with 💚 in Bhopal, MP
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              UPI
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              Credit / Debit Cards
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              NetBanking
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              Cash on Delivery
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}