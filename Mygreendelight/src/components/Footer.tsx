"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Mail,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa6";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#041a0d] text-white font-sans border-t border-emerald-950/80 pb-20 sm:pb-12 md:pb-6 w-full selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-4">
        
        {/* Main 4-Column Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 pb-6 border-b border-white/10">
          
          {/* Col 1: Brand & Contact (Desktop: 4 cols) */}
          <div className="col-span-2 md:col-span-4 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
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
                  <FaWhatsapp className="w-3.5 h-3.5" />
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
                  <FaInstagram className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61594046110147"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-200/70 font-medium pt-1">
              <MapPin size={12} className="text-emerald-400 shrink-0" />
              <span>Bagsewaniya Hub, Bhopal (462043)</span>
            </div>
          </div>

          {/* Col 2: Categories (Desktop: 3 cols) */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
              Fresh Produce
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/70 font-medium">
              <li>
                <Link href="/shop?category=Vegetables" className="hover:text-emerald-300 transition block">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Fruits" className="hover:text-emerald-300 transition block">
                  Seasonal & Fresh Fruits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Exotics" className="hover:text-emerald-300 transition block">
                  Exotic Veggies & Herbs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Combos" className="hover:text-emerald-300 transition block">
                  Daily Saver Combos
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-emerald-300 transition block text-emerald-400/90 font-semibold">
                  Browse All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Customer Care (Desktop: 3 cols) */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
              Customer Help
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/70 font-medium">
              <li>
                <Link href="/user/myorder" className="hover:text-emerald-300 transition block">
                  Track Order / History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-emerald-300 transition block">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-emerald-300 transition block">
                  Offers & Daily Coupons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-300 transition block">
                  Customer Support Hub
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-300 transition block">
                  About SubziQuick
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies (Desktop: 2 cols) */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
              Legal & Trust
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/70 font-medium flex flex-wrap gap-x-4 gap-y-2 md:flex-col">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-300 transition block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-emerald-300 transition block">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-emerald-300 transition block">
                  Refund & Return
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-emerald-300 transition block">
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
