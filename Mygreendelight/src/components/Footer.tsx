"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  ArrowRight,
  Mail,
  Zap,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07321a] text-white font-sans border-t border-green-950 pb-24 md:pb-10 w-full max-w-full overflow-hidden">
      {/* 1. Top Trust Features Strip */}
      <div className="border-b border-green-900/60 bg-[#052613]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
                <Zap size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  10-15 Min Express Delivery
                </h4>
                <p className="text-[10px] sm:text-[11px] text-green-200/80">Across all Bhopal localities</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  100% Farm Fresh Quality
                </h4>
                <p className="text-[10px] sm:text-[11px] text-green-200/80">Direct from local Sehore & Raisen farms</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  FREE Delivery on ₹499+
                </h4>
                <p className="text-[10px] sm:text-[11px] text-green-200/80">Zero hidden packaging charges</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  24/7 Bhopal Helpline
                </h4>
                <p className="text-[10px] sm:text-[11px] text-green-200/80">+91 9981418565</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Store Logo & 2-Line Detail (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <Link
              href="/"
              className="text-white text-2xl sm:text-3xl font-black flex items-center gap-2 tracking-tight mb-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-white text-[#0f8646] flex items-center justify-center shadow-md">
                <ShoppingCart className="fill-current w-5 h-5" />
              </div>
              <span>MyGreenDelight</span>
            </Link>

            <p className="text-xs sm:text-sm text-green-100/90 mb-4 leading-relaxed font-medium">
              Bhopal’s dedicated farm-to-fork produce network. Delivering 100% ozone-washed, chemical-free fresh vegetables, fruits and pantry essentials straight from local Madhya Pradesh farms in under 15 minutes.
            </p>

            {/* Store Address Box */}
            <div className="bg-white/10 border border-white/10 rounded-2xl p-3.5 mb-4 backdrop-blur-xs">
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block mb-1">
                📍 Bhopal Central Farm Hub & Store
              </span>
              <p className="text-xs text-green-100 leading-snug">
                Plot No. 12, Main Market, Arera Colony, Bhopal, MP - 462016
              </p>
            </div>

            {/* Social Media Channels */}
            <div className="flex items-center gap-2.5 mt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
                title="Follow on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
                title="Follow on Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.593 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/919981418565"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center text-white transition-colors"
                title="Connect on WhatsApp"
              >
                <MessageCircle size={15} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                title="Watch on YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Farm Produce Aisles (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider mb-4 text-emerald-300">
              Farm Produce Aisles
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-green-100/90 font-medium">
              <Link
                href="/shop?category=Vegetables"
                className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
              >
                <span>🥬</span>
                <span>Green Leafy Vegetables</span>
              </Link>
              <Link
                href="/shop?category=Vegetables"
                className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
              >
                <span>🥔</span>
                <span>Daily Potatoes, Onions & Tomatoes</span>
              </Link>
              <Link
                href="/shop?category=Fruits"
                className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
              >
                <span>🍎</span>
                <span>Sweet & Juicy Seasonal Fruits</span>
              </Link>
              <Link
                href="/shop?category=Dairy%20%26%20Bakery"
                className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
              >
                <span>🥛</span>
                <span>Desi A2 Cow Milk & Malai Paneer</span>
              </Link>
              <Link
                href="/shop?category=Vegetables"
                className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
              >
                <span>🌿</span>
                <span>Fresh Herbs, Ginger & Garlic</span>
              </Link>
              <Link
                href="/shop"
                className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 text-yellow-300 font-bold"
              >
                <span>🥗</span>
                <span>1-Click Cook Recipe Kits</span>
              </Link>
              <Link
                href="/shop/custom-box"
                className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 text-emerald-300 font-bold"
              >
                <span>🥑</span>
                <span>Craft Custom Salad Bowl</span>
              </Link>
            </div>
          </div>

          {/* Column 3: Quick Links & Account (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider mb-4 text-emerald-300">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-green-100/90 font-medium">
              <Link href="/" className="hover:text-white hover:translate-x-1 transition-all">
                Home
              </Link>
              <Link href="/shop" className="hover:text-white hover:translate-x-1 transition-all">
                Shop All Produce
              </Link>
              <Link href="/user/wallet" className="hover:text-white hover:translate-x-1 transition-all flex items-center justify-between text-yellow-300 font-bold">
                <span>MGD Green Wallet</span>
                <span className="text-[10px] bg-green-900/80 px-1.5 py-0.5 rounded-sm">+10% Bonus</span>
              </Link>
              <Link href="/user/subscriptions" className="hover:text-white hover:translate-x-1 transition-all flex items-center justify-between text-emerald-300 font-bold">
                <span>🥛 7 AM Subscriptions</span>
                <span className="text-[10px] bg-blue-950 px-1.5 py-0.5 rounded-sm">New</span>
              </Link>
              <Link href="/user/upload-list" className="hover:text-white hover:translate-x-1 transition-all flex items-center justify-between text-orange-300 font-bold">
                <span>📝 Paste Parchi / List</span>
                <span className="text-[10px] bg-orange-950 px-1.5 py-0.5 rounded-sm">Auto-Cart</span>
              </Link>
              <Link href="/user/myorder" className="hover:text-white hover:translate-x-1 transition-all">
                Track Live Order
              </Link>
              <Link href="/wishlist" className="hover:text-white hover:translate-x-1 transition-all">
                Saved Wishlist
              </Link>
              <Link href="/about" className="hover:text-white hover:translate-x-1 transition-all">
                About Our Farms
              </Link>
              <Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all">
                Help & Contact Us
              </Link>
            </div>
          </div>

          {/* Column 4: Contact & Bhopal Dispatch Hubs (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider mb-4 text-emerald-300">
              Order Help & Support
            </h3>

            <div className="space-y-3">
              <a
                href="tel:9981418565"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl flex items-center gap-3 transition-colors border border-white/10"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block font-bold">Direct Call Support</span>
                  <span className="text-xs font-black text-white">+91 9981418565</span>
                </div>
              </a>

              <a
                href="https://wa.me/919981418565?text=Hello%20MyGreenDelight%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366]/20 hover:bg-[#25D366]/30 p-3 rounded-2xl flex items-center gap-3 transition-colors border border-[#25D366]/30"
              >
                <div className="w-8 h-8 rounded-xl bg-[#25D366]/40 flex items-center justify-center text-white shrink-0">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block font-bold">1-Click WhatsApp Order</span>
                  <span className="text-xs font-black text-white">+91 9981418565</span>
                </div>
              </a>

              <div className="pt-2 text-[11px] text-green-200/80">
                <span className="font-bold text-white block mb-1.5">Active Bhopal Delivery Zones:</span>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px]">Arera Colony</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px]">MP Nagar</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px]">Kolar Road</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px]">Hoshangabad Rd</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px]">Indrapuri</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Legal & Payment Badges */}
        <div className="border-t border-green-900/60 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-green-200/80 gap-4">
          <p>© {new Date().getFullYear()} MyGreenDelight Bhopal. Handcrafted with 💚 for fresh eating.</p>

          <div className="flex items-center gap-3 text-xs font-semibold flex-wrap text-green-100">
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition">
              Refund & Cancellation
            </Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-white transition">
              Shipping Policy
            </Link>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-white/15 px-2.5 py-1 rounded-lg font-black text-[10px] text-white">
              UPI (GPay / PhonePe / Paytm)
            </span>
            <span className="bg-white/15 px-2.5 py-1 rounded-lg font-black text-[10px] text-white">
              RuPay / Cards
            </span>
            <span className="bg-white/15 px-2.5 py-1 rounded-lg font-black text-[10px] text-white">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}