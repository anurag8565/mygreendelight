"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Mail,
} from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#041a0d] text-white font-sans border-t border-emerald-950/80 pb-20 sm:pb-12 md:pb-6 w-full selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-4">
        
        {/* Main 4-Column Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 pb-6 border-b border-white/10">
          
          {/* Col 1: Brand & Contact (Desktop: 4 cols, Mobile: full width) */}
          <div className="col-span-2 md:col-span-4 space-y-3">
            <Logo variant="white" />
            <p className="text-xs text-emerald-100/70 font-medium leading-relaxed max-w-sm">
              Bhopal&apos;s 10-15 min fresh vegetable & fruit delivery service. 5:00 AM direct Mandi harvest to your doorstep.
            </p>

            {/* Quick Contact Chips */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 shadow-2xs"
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:9981418565"
                className="bg-white/10 hover:bg-white/15 active:scale-95 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 border border-white/10"
              >
                <Phone size={12} className="text-emerald-300" />
                <span>9981418565</span>
              </a>

              <a
                href="https://www.instagram.com/subziquick"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61594046110147"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-200/60 font-medium pt-0.5">
              <MapPin size={12} className="text-emerald-400 shrink-0" />
              <span>Bagsewaniya Hub, Bhopal (462043)</span>
            </div>
          </div>

          {/* Col 2: Categories (Desktop: 3 cols, Mobile: 1 col) */}
          <div className="col-span-1 md:col-span-3 space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
              Fresh Produce
            </h3>
            <ul className="space-y-1.5 text-xs text-emerald-100/70 font-medium">
              <li>
                <Link href="/category/vegetables" className="hover:text-white transition">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/category/fruits" className="hover:text-white transition">
                  Seasonal & Fresh Fruits
                </Link>
              </li>
              <li>
                <Link href="/category/exotics" className="hover:text-white transition">
                  Exotic Veggies & Herbs
                </Link>
              </li>
              <li>
                <Link href="/category/combos" className="hover:text-white transition">
                  Daily Saver Combos
                </Link>
              </li>
              <li>
                <Link href="/category/leafy" className="hover:text-white transition">
                  Green Leafy Veggies
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Customer Care (Desktop: 3 cols, Mobile: 1 col) */}
          <div className="col-span-1 md:col-span-3 space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
              Quick Help
            </h3>
            <ul className="space-y-1.5 text-xs text-emerald-100/70 font-medium">
              <li>
                <Link href="/orders" className="hover:text-white transition">
                  Track Order / History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition">
                  Offers & Daily Coupons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Customer Support Hub
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About SubziQuick
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies (Desktop: 2 cols, Mobile: full width) */}
          <div className="col-span-2 md:col-span-2 space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
              Legal & Trust
            </h3>
            <ul className="space-y-1.5 text-xs text-emerald-100/70 font-medium flex flex-wrap gap-x-4 gap-y-1.5 md:flex-col">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition">
                  Refund & Return
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Micro Localities Notice */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-200/60 font-medium border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <Truck size={13} className="text-emerald-400 shrink-0" />
            <span>Delivering across Bhopal: Arera Colony, MP Nagar, Kolar, Bagsewaniya, Shahpura, Bawadiya Kalan, Katara Hills, Hoshangabad Rd & all PIN 462xxx areas.</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-emerald-100/60 font-medium">
          <p className="text-[11px]">
            © {currentYear} SubziQuick Bhopal • Farm Fresh Everyday
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white/90 font-semibold">
              UPI
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white/90 font-semibold">
              Cards
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white/90 font-semibold">
              NetBanking
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white/90 font-semibold">
              Cash on Delivery
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
