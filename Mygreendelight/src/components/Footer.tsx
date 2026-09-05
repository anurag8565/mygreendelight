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
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#052613] text-white font-sans border-t border-green-950 pb-36 sm:pb-28 md:pb-12 w-full max-w-full overflow-hidden">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Column 1: Store Logo, Bio & Address (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-3">
              <Logo variant="white" />
            </div>

            <p className="text-xs sm:text-sm text-green-100/90 mb-4 leading-relaxed font-medium max-w-md">
              Bhopal’s dedicated Mandi fresh farm-to-table produce store. 100% ozone-washed, chemical-free fresh vegetables, seasonal fruits, and pure daily essentials with same-day home delivery.
            </p>

            {/* Store Address & Hours Box */}
            <div className="bg-white/10 border border-white/10 rounded-2xl p-3.5 mb-4 backdrop-blur-xs max-w-md space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block">
                    Store Address
                  </span>
                  <p className="text-xs text-green-100 font-semibold leading-snug">
                    Amrai, Bagsewaniya, Bhopal, MP - 462043
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1 border-t border-white/10">
                <Clock size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                    Daily Delivery Hours
                  </span>
                  <p className="text-xs text-green-100 font-bold leading-snug">
                    6:00 AM – 1:00 PM (Morning Fresh Slots)
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
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
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
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
                className="w-8 h-8 rounded-xl bg-[#25D366]/30 hover:bg-[#25D366] flex items-center justify-center text-white transition-colors"
                title="Connect on WhatsApp"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Produce & Quick Links (4 Cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-6">
            
            {/* Produce Categories */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider mb-3 text-emerald-300">
                Fresh Produce
              </h3>
              <div className="flex flex-col gap-2 text-xs text-green-100/90 font-medium">
                <Link href="/shop?category=Vegetables" className="hover:text-white transition">
                  🥬 Leafy Greens
                </Link>
                <Link href="/shop?category=Vegetables" className="hover:text-white transition">
                  🥔 Daily Essentials
                </Link>
                <Link href="/shop?category=Fruits" className="hover:text-white transition">
                  🍎 Farm Fresh Fruits
                </Link>
                <Link href="/shop?category=Dairy%20%26%20Staples" className="hover:text-white transition">
                  🥛 Desi Cow Milk
                </Link>
                <Link href="/shop" className="hover:text-white transition text-emerald-300 font-bold">
                  🎁 Value Combos
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider mb-3 text-emerald-300">
                Quick Links
              </h3>
              <div className="flex flex-col gap-2 text-xs text-green-100/90 font-medium">
                <Link href="/shop" className="hover:text-white transition">
                  Shop All Produce
                </Link>
                <Link href="/offers" className="hover:text-white transition text-amber-300 font-bold">
                  🏷️ Offers & Coupons
                </Link>
                <Link href="/about" className="hover:text-white transition">
                  🌿 Our Farm Story
                </Link>
                <Link href="/user/myorder" className="hover:text-white transition">
                  Track Live Order
                </Link>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </div>
            </div>

          </div>

          {/* Column 3: Contact & Order Helpline (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider mb-3 text-emerald-300">
              Customer Support
            </h3>

            <div className="space-y-2.5">
              <a
                href="tel:9981418565"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl flex items-center gap-3 transition-colors border border-white/10"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block font-bold">Call Helpline</span>
                  <span className="text-xs font-black text-white">+91 9981418565</span>
                </div>
              </a>

              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366]/20 hover:bg-[#25D366]/30 p-3 rounded-2xl flex items-center gap-3 transition-colors border border-[#25D366]/30"
              >
                <div className="w-8 h-8 rounded-xl bg-[#25D366]/40 flex items-center justify-center text-white shrink-0">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block font-bold">WhatsApp Support</span>
                  <span className="text-xs font-black text-white">+91 9981418565</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bhopal Local SEO & Delivery Zones Section */}
        <div className="border-t border-green-900/60 mt-8 pt-6 pb-2 text-xs text-green-200/80">
          <h4 className="font-bold text-emerald-300 text-xs mb-2 tracking-wide uppercase">
            📍 Same-Day Fresh Vegetable & Fruit Delivery Areas in Bhopal:
          </h4>
          <p className="leading-relaxed text-[11px] text-green-100/70">
            Arera Colony • MP Nagar • Kolar Road • Bagsewaniya • Gulmohar Colony • Shahpura • Hoshangabad Road • Saket Nagar • BHEL • Chunabhatti • TT Nagar • Misrod • Awadhpuri • Katara Hills • Ayodhya Bypass • Indrapuri • Govindpura • Trilanga • Bawadiya Kalan • Salaiya • Habibganj • MP Nagar Zone 1 & 2 • New Market • Koh-e-Fiza • Lalghati • Airport Road.
          </p>
          <p className="mt-2 text-[10px] text-green-300/60">
            Popular Searches: Online Sabzi Delivery Bhopal | Fresh Vegetables Online Bhopal | Karond Mandi Fresh Fruits Home Delivery | Buy Farm Fresh Vegetables Online MP | SubziQuick Bhopal Same Day Delivery.
          </p>
        </div>

        {/* Bottom Legal & Payment Badges */}
        <div className="border-t border-green-900/60 mt-4 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-green-200/80 gap-3 text-center md:text-left">
          <p>© {new Date().getFullYear()} SubziQuick • Amrai, Bagsewaniya, Bhopal, Madhya Pradesh</p>

          <div className="flex items-center justify-center gap-2.5 text-[11px] font-semibold flex-wrap text-green-100">
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

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="bg-white/10 px-2 py-0.5 rounded-md font-bold text-[10px] text-white">
              UPI
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md font-bold text-[10px] text-white">
              Cards
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md font-bold text-[10px] text-white">
              COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}