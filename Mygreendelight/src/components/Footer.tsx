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
    <footer className="bg-[#072416] text-white font-sans border-t border-emerald-800/40 pb-24 sm:pb-24 md:pb-24 lg:pb-8 w-full selection:bg-emerald-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-4">
        
        {/* Main 4-Column Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6 sm:gap-6 lg:gap-8 pb-6 border-b border-white/[0.08]">
          
          {/* Col 1: Brand & Contact */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-4 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <Logo variant="white" />
              <p className="text-xs text-stone-300/80 font-normal leading-relaxed max-w-sm md:max-w-md lg:max-w-sm">
                Bhopal&apos;s trusted farm-to-table delivery service. Direct 5:00 AM daily farm harvest delivered straight to your doorstep in 15-25 minutes.
              </p>

              {/* Quick Contact & Social Chips */}
              <div className="flex items-center gap-2 pt-1 flex-nowrap overflow-x-auto no-scrollbar">
                <a
                  href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white px-3 py-1.5 rounded-full font-semibold text-[11px] transition flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:9981418565"
                  className="bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 text-stone-200 px-3 py-1.5 rounded-full font-semibold text-[11px] transition flex items-center gap-1.5 border border-white/10 shrink-0"
                >
                  <Phone size={12} className="text-emerald-400" />
                  <span>9981418565</span>
                </a>

                <a
                  href="https://www.instagram.com/subziquick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 hover:text-white flex items-center justify-center transition border border-white/10 shrink-0"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61594046110147"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 hover:text-white flex items-center justify-center transition border border-white/10 shrink-0"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-normal pt-1">
              <MapPin size={12} className="text-emerald-400 shrink-0" />
              <span>Bagsewaniya Hub, Bhopal (462043)</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-emerald-200/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Fresh Produce</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-300/85 font-normal">
              <li>
                <Link href="/shop?category=Vegetables" className="hover:text-white transition-colors block">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Fruits" className="hover:text-white transition-colors block">
                  Seasonal & Fresh Fruits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Exotics" className="hover:text-white transition-colors block">
                  Exotic Veggies & Herbs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Combos" className="hover:text-white transition-colors block">
                  Daily Saver Combos
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-emerald-300 hover:text-white transition-colors block font-medium">
                  Browse All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Customer Care */}
          <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-emerald-200/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Customer Help</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-300/85 font-normal">
              <li>
                <Link href="/user/myorder" className="hover:text-white transition-colors block">
                  Track Order / History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors block">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition-colors block">
                  Offers & Daily Coupons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors block">
                  Customer Support Hub
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors block">
                  About SubziQuick
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-emerald-200/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Legal & Trust</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-300/85 font-normal flex flex-wrap gap-x-4 gap-y-2 md:flex-row lg:flex-col">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white transition-colors block">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors block">
                  Refund & Return
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors block">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* SEO & Popular Searches Directory (Blinkit / Zepto Style) */}
        <div className="py-6 border-b border-white/[0.08] space-y-4 text-stone-300/80">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-2">
              Popular Searches &amp; Online Sabzi Delivery in Bhopal
            </h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-stone-400">
              <Link href="/shop?category=Vegetables" className="hover:text-white transition-colors">online vegetable delivery in bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop?category=Vegetables" className="hover:text-white transition-colors">fresh vegetables and fruits in bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop?category=Fruits" className="hover:text-white transition-colors">buy fresh fruits online bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">online sabzi delivery app bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">taaza sabzi online bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">best vegetable delivery service in bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">fresh farm vegetables home delivery bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">doorstep sabzi delivery bhopal cash on delivery</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">same day fresh vegetable delivery bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">today fresh vegetable rate in bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">10-15 minute vegetable delivery bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">fastest sabzi delivery bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">instant fresh vegetable delivery near me</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">early morning fresh vegetable delivery bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop" className="hover:text-white transition-colors">subziquick 15 min express delivery</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-2">
              Daily Farm Fresh Produce &amp; Essentials
            </h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-stone-400">
              <Link href="/user/search?query=tamatar" className="hover:text-white transition-colors">buy fresh desi tamatar online bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=aloo" className="hover:text-white transition-colors">pahadi aloo potato home delivery bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=pyaaz" className="hover:text-white transition-colors">nashik red onion pyaaz online rate bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=palak" className="hover:text-white transition-colors">fresh organic palak spinach delivery bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=matar" className="hover:text-white transition-colors">fresh green peas matar buy online bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=avocado" className="hover:text-white transition-colors">buy hass avocado in bhopal online</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=broccoli" className="hover:text-white transition-colors">fresh green broccoli price in bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=lettuce" className="hover:text-white transition-colors">hydroponic romaine iceberg lettuce bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/user/search?query=mushroom" className="hover:text-white transition-colors">fresh button mushroom 200g online bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop?category=Combos" className="hover:text-white transition-colors">daily value combo vegetable pack bhopal</Link>
              <span className="text-stone-600">•</span>
              <Link href="/shop?category=Combos" className="hover:text-white transition-colors">weekly family sabzi basket bhopal</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-2">
              Express Delivery Across Bhopal Localities (10-15 Min)
            </h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-stone-400">
              <span className="text-stone-300">Arera Colony</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Kolar Road</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">MP Nagar</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Bawadiya Kalan</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Katara Hills</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Shahpura</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Bittan Market (E-4)</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Ayodhya Bypass</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Indrapuri &amp; BHEL</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Hoshangabad Road</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Gulmohar</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Chunabhatti</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Saket Nagar</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Bagsewaniya Hub (462043)</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Trilanga</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Misrod</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-stone-400 font-normal">
          <p className="text-[11px]">
            © {currentYear} SubziQuick Bhopal • Farm Fresh Everyday
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 rounded-full text-[10px] text-stone-300 font-medium">
              UPI
            </span>
            <span className="bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 rounded-full text-[10px] text-stone-300 font-medium">
              Cards
            </span>
            <span className="bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 rounded-full text-[10px] text-stone-300 font-medium">
              NetBanking
            </span>
            <span className="bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 rounded-full text-[10px] text-stone-300 font-medium">
              Cash on Delivery
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
