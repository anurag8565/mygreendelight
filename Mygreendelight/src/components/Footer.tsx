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
  Leaf,
  ArrowRight,
} from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F1E8] text-[#1C1917] font-sans border-t border-[#EAE4D9] pb-32 sm:pb-16 w-full max-w-full overflow-hidden">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 pb-6">
        
        {/* Top Grid: Brand & 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start pb-10 border-b border-[#EAE4D9]">
          
          {/* Column 1: Brand & Philosophy (Desktop: 4 Cols) */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="mb-4">
              <Logo variant="default" />
            </div>

            <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-medium mb-6 max-w-sm">
              Tradition in every sunrise. Purity in every harvest. Sourced directly from local MP kisan contract farms, hand-graded with triple inspection, and delivered to your doorstep in 10-15 minutes.
            </p>

            {/* Quiet, Minimalist Contact Pills */}
            <div className="flex flex-col gap-2 w-full max-w-xs text-xs">
              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#14532D] hover:text-[#0f3e22] font-semibold py-1 transition group"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#14532D]">
                  <MessageCircle size={13} />
                </div>
                <span>WhatsApp: +91 99814 18565</span>
              </a>

              <a
                href="tel:9981418565"
                className="flex items-center gap-2 text-[#292524] hover:text-[#14532D] font-medium py-1 transition group"
              >
                <div className="w-6 h-6 rounded-full bg-[#EAE4D9]/80 flex items-center justify-center text-[#78716C] group-hover:text-[#14532D]">
                  <Phone size={13} />
                </div>
                <span>Helpline: +91 99814 18565</span>
              </a>

              <div className="flex items-center gap-2 text-[#78716C] py-1">
                <div className="w-6 h-6 rounded-full bg-[#EAE4D9]/80 flex items-center justify-center text-[#78716C]">
                  <Clock size={13} />
                </div>
                <span>6:00 AM – 10:00 PM (Daily Dispatch)</span>
              </div>

              <div className="flex items-center gap-2 text-[#78716C] py-1">
                <div className="w-6 h-6 rounded-full bg-[#EAE4D9]/80 flex items-center justify-center text-[#78716C]">
                  <MapPin size={13} />
                </div>
                <span>Amrai, Bagsewaniya, Bhopal, MP</span>
              </div>
            </div>
          </div>

          {/* 4 Clean Navigation Columns (Desktop: 8 Cols) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-2">
            
            {/* Col 1: Harvest Catalog */}
            <div className="flex flex-col">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#14532D] mb-4">
                Harvest Catalog
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-[#57534E] font-medium">
                <Link href="/shop?category=Vegetables" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Daily Vegetables
                </Link>
                <Link href="/shop?category=Fruits" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Seasonal Fruits
                </Link>
                <Link href="/shop?category=Exotics" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Hydroponic Exotics
                </Link>
                <Link href="/shop" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Value Farm Combos
                </Link>
                <Link href="/shop" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all text-[#14532D] font-bold">
                  All Products →
                </Link>
              </div>
            </div>

            {/* Col 2: Our Story */}
            <div className="flex flex-col">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#14532D] mb-4">
                Our Story
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-[#57534E] font-medium">
                <Link href="/about" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  About SubziQuick
                </Link>
                <Link href="/about" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  5:00 AM Harvest
                </Link>
                <Link href="/about" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  MP Kisan Network
                </Link>
                <Link href="/about" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Quality Standards
                </Link>
                <Link href="/contact" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Col 3: Customer Care */}
            <div className="flex flex-col">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#14532D] mb-4">
                Customer Care
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-[#57534E] font-medium">
                <Link href="/user/myorder" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Track Order
                </Link>
                <Link href="/wishlist" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Saved Favorites
                </Link>
                <Link href="/contact" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Help Desk
                </Link>
                <Link href="/shipping-policy" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Express Delivery Info
                </Link>
                <a
                  href="https://www.instagram.com/subziquick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14532D] hover:translate-x-0.5 transition-all"
                >
                  Instagram @subziquick
                </a>
              </div>
            </div>

            {/* Col 4: Store Policies */}
            <div className="flex flex-col">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#14532D] mb-4">
                Legal Policies
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-[#57534E] font-medium">
                <Link href="/privacy-policy" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Privacy Policy
                </Link>
                <Link href="/terms-conditions" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Terms of Service
                </Link>
                <Link href="/refund-policy" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Refund & Replacement
                </Link>
                <Link href="/shipping-policy" className="hover:text-[#14532D] hover:translate-x-0.5 transition-all">
                  Shipping Policy
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Quiet Coverage Line */}
        <div className="py-4 text-center sm:text-left border-b border-[#EAE4D9]">
          <p className="text-[11px] text-[#78716C] leading-relaxed">
            <strong className="text-[#292524] font-bold">10-15 Min Bhopal Express Coverage:</strong> Arera Colony, Kolar Road, MP Nagar, Bagsewaniya, Bawadiya Kalan, Gulmohar, Shahpura, Katara Hills, Hoshangabad Road, Saket Nagar, Chunabhatti, Bittan Market & nearby societies.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Payment */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C] text-center sm:text-left">
          <div>
            <p className="text-[11.5px] font-medium">
              © {currentYear} SubziQuick Bhopal. Handpicked Fresh Every Sunrise.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#78716C] flex-wrap justify-center">
            <span>UPI</span>
            <span>•</span>
            <span>Cards</span>
            <span>•</span>
            <span>NetBanking</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}