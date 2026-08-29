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
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b4d29] text-white font-sans border-t border-green-900">
      {/* 4 Trust Feature Strip */}
      <div className="border-b border-green-800/80 bg-[#093e21]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-green-300">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  10-15 Min Express Delivery
                </h4>
                <p className="text-[11px] text-green-200/80">Across all Bhopal hubs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-green-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  100% Farm Fresh Quality
                </h4>
                <p className="text-[11px] text-green-200/80">Sourced directly from farmers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-green-300">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  FREE Delivery Above ₹499
                </h4>
                <p className="text-[11px] text-green-200/80">Zero extra packaging fees</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-green-300">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  24/7 Bhopal Support
                </h4>
                <p className="text-[11px] text-green-200/80">+91 9981418565</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Story (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <Link
              href="/"
              className="text-white text-2xl font-black flex items-center gap-2 tracking-tight mb-3"
            >
              <ShoppingCart className="text-green-300 fill-current w-7 h-7" />
              <span>MyGreenDelight</span>
            </Link>
            <p className="text-xs sm:text-sm text-green-100/80 mb-5 leading-relaxed">
              Bhopal’s dedicated farm-to-fork produce network. Delivering 100% ozone-washed, chemical-free fresh vegetables and seasonal fruits straight from local farms in under 15 minutes.
            </p>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-xs">
              <span className="text-[10px] font-black text-green-300 uppercase tracking-wider block mb-1">
                Bhopal Store Headquarters
              </span>
              <p className="text-xs text-green-100 flex items-start gap-1.5 leading-snug">
                <MapPin size={15} className="shrink-0 text-green-300 mt-0.5" />
                <span>Plot No. 12, Main Market, Arera Colony, Bhopal, MP - 462016</span>
              </p>
            </div>
          </div>

          {/* Column 2: Pure Fruits & Vegetables Produce (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 text-green-300">
              Farm Produce Aisles
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-green-100/90 font-medium">
              <Link
                href="/shop?category=Vegetables"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                🥬 Green Leafy Vegetables
              </Link>
              <Link
                href="/shop?category=Vegetables"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                🥔 Daily Potatoes, Onions & Tomatoes
              </Link>
              <Link
                href="/shop?category=Fruits"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                🍎 Sweet & Juicy Seasonal Fruits
              </Link>
              <Link
                href="/shop?category=Fruits"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                🍊 Citrus & Vitamin C Boosters
              </Link>
              <Link
                href="/shop?category=Vegetables"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                🌿 Fresh Herbs, Ginger, Garlic & Salads
              </Link>
              <Link
                href="/shop?category=Vegetables"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                🌱 100% Organic Pesticide-Free Harvest
              </Link>
            </div>
          </div>

          {/* Column 3: Quick Links & Account (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 text-green-300">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-green-100/90 font-medium">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop Produce
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                Our Story
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact & Hubs
              </Link>
              <Link href="/user/myorder" className="hover:text-white transition-colors">
                My Orders
              </Link>
              <Link href="/wishlist" className="hover:text-white transition-colors">
                Saved Items
              </Link>
            </div>
          </div>

          {/* Column 4: Bhopal Hubs & Direct Contact (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 text-green-300">
              Order Help & Hubs
            </h3>

            <div className="space-y-3">
              <a
                href="tel:9981418565"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl flex items-center gap-3 transition-colors border border-white/10"
              >
                <div className="w-8 h-8 rounded-xl bg-green-500/30 flex items-center justify-center text-green-300 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block font-bold">Call Support</span>
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
                  <span className="text-[10px] text-green-200 block font-bold">WhatsApp Order</span>
                  <span className="text-xs font-black text-white">+91 9981418565</span>
                </div>
              </a>

              <div className="pt-2 text-[11px] text-green-200/80">
                <span className="font-bold text-white block mb-1">Active Bhopal Delivery Hubs:</span>
                <span className="inline-block bg-white/10 px-2 py-0.5 rounded-md text-[10px] mr-1 mb-1">Arera Colony</span>
                <span className="inline-block bg-white/10 px-2 py-0.5 rounded-md text-[10px] mr-1 mb-1">Kolar Road</span>
                <span className="inline-block bg-white/10 px-2 py-0.5 rounded-md text-[10px] mr-1 mb-1">MP Nagar</span>
                <span className="inline-block bg-white/10 px-2 py-0.5 rounded-md text-[10px] mr-1 mb-1">Bairagarh</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="border-t border-green-800/80 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-green-200/80 gap-4">
          <p>© {new Date().getFullYear()} MyGreenDelight Bhopal. All Rights Reserved.</p>

          <div className="flex items-center gap-4 text-xs font-semibold flex-wrap text-green-100">
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
              Shipping & Delivery
            </Link>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/15 px-2.5 py-1 rounded-lg font-extrabold text-[10px] text-white">
              UPI (GPay / PhonePe / Paytm)
            </span>
            <span className="bg-white/15 px-2.5 py-1 rounded-lg font-extrabold text-[10px] text-white">
              COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}