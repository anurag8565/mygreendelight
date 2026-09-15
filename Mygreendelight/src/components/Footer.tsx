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
  ChevronDown,
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
                Bhopal&apos;s trusted farm-to-table delivery service. Direct 5:00 AM daily farm harvest delivered straight to your doorstep in 10-15 minutes.
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

        {/* Sleek Collapsible SEO & Popular Searches Directory (Keeps Footer Compact, 100% Crawlable) */}
        {/* Sleek Collapsible SEO & Popular Searches Directory (100% Mobile Responsive & Touch-Friendly) */}
        <details className="group py-2 border-b border-white/[0.08] text-stone-300/80 w-full overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[11px] sm:text-xs text-stone-400 hover:text-emerald-300 transition-colors select-none py-1.5 gap-2">
            <span className="flex items-center gap-2 font-medium min-w-0 flex-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate sm:whitespace-normal font-semibold">
                Popular Searches &amp; Bhopal Delivery Directory
              </span>
            </span>
            <span className="p-1 rounded-md bg-white/[0.05] border border-white/[0.08] shrink-0 group-hover:bg-white/[0.1] transition-colors">
              <ChevronDown size={13} className="group-open:rotate-180 transition-transform text-stone-400 group-hover:text-emerald-300" />
            </span>
          </summary>
          
          <div className="pt-3 pb-3 space-y-3.5 text-[11px] w-full">
            <div>
              <h4 className="font-bold text-[10px] sm:text-[10.5px] uppercase tracking-wider text-emerald-300 mb-2">
                Popular Searches in Bhopal
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { text: "online vegetable delivery in bhopal", href: "/shop?category=Vegetables" },
                  { text: "fresh vegetables & fruits in bhopal", href: "/shop?category=Vegetables" },
                  { text: "buy fresh fruits online bhopal", href: "/shop?category=Fruits" },
                  { text: "online sabzi delivery app bhopal", href: "/shop" },
                  { text: "taaza sabzi online bhopal", href: "/shop" },
                  { text: "best vegetable delivery service bhopal", href: "/shop" },
                  { text: "fresh farm vegetables home delivery", href: "/shop" },
                  { text: "doorstep sabzi cash on delivery", href: "/shop" },
                  { text: "same day fresh vegetable delivery", href: "/shop" },
                  { text: "today fresh vegetable rate in bhopal", href: "/shop" },
                  { text: "10-15 minute vegetable delivery", href: "/shop" },
                  { text: "fastest sabzi delivery bhopal", href: "/shop" },
                  { text: "instant fresh vegetable delivery", href: "/shop" },
                  { text: "subziquick 15 min express delivery", href: "/shop" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="inline-block bg-white/[0.04] hover:bg-emerald-950/50 hover:text-emerald-300 hover:border-emerald-700/50 border border-white/[0.08] px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] text-stone-300 transition-colors break-words max-w-full"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[10px] sm:text-[10.5px] uppercase tracking-wider text-emerald-300 mb-2">
                Daily Farm Fresh Produce &amp; Essentials
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { text: "buy fresh desi tamatar", href: "/user/search?query=tamatar" },
                  { text: "pahadi aloo potato home delivery", href: "/user/search?query=aloo" },
                  { text: "nashik red onion pyaaz", href: "/user/search?query=pyaaz" },
                  { text: "fresh organic palak spinach", href: "/user/search?query=palak" },
                  { text: "fresh green peas matar", href: "/user/search?query=matar" },
                  { text: "buy hass avocado in bhopal", href: "/user/search?query=avocado" },
                  { text: "fresh green broccoli price", href: "/user/search?query=broccoli" },
                  { text: "hydroponic romaine lettuce", href: "/user/search?query=lettuce" },
                  { text: "fresh button mushroom 200g", href: "/user/search?query=mushroom" },
                  { text: "daily value combo vegetable pack", href: "/shop?category=Combos" },
                  { text: "weekly family sabzi basket", href: "/shop?category=Combos" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="inline-block bg-white/[0.04] hover:bg-emerald-950/50 hover:text-emerald-300 hover:border-emerald-700/50 border border-white/[0.08] px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] text-stone-300 transition-colors break-words max-w-full"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[10px] sm:text-[10.5px] uppercase tracking-wider text-emerald-300 mb-2">
                Express Delivery Across Bhopal Localities (10-15 Min)
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  "Arera Colony",
                  "Kolar Road",
                  "MP Nagar",
                  "Bawadiya Kalan",
                  "Katara Hills",
                  "Shahpura",
                  "Bittan Market (E-4)",
                  "Ayodhya Bypass",
                  "Indrapuri & BHEL",
                  "Hoshangabad Road",
                  "Gulmohar",
                  "Chunabhatti",
                  "Saket Nagar",
                  "Bagsewaniya Hub (462043)",
                  "Trilanga",
                  "Misrod",
                ].map((loc, i) => (
                  <span
                    key={i}
                    className="inline-block bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md text-[10px] sm:text-[10.5px] text-stone-300 break-words"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </details>

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
