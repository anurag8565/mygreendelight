import React from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  Mail,
  Zap,
  ChevronRight,
  Instagram,
} from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#052613] text-white font-sans border-t border-green-950 pb-28 sm:pb-24 md:pb-10 w-full max-w-full overflow-hidden">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Column 1: Store Logo, Bio & Address (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-3">
              <Logo variant="white" />
            </div>

            <p className="text-xs sm:text-sm text-green-100/90 mb-4 leading-relaxed font-medium max-w-md">
              Bhopal’s dedicated farm fresh farm-to-table produce store. 100% ozone-washed, chemical-free vegetables, seasonal fruits, and daily essentials with same-day home delivery.
            </p>

            {/* Store Address & Hours Box */}
            <div className="bg-white/10 border border-white/10 rounded-2xl p-3 sm:p-3.5 mb-4 backdrop-blur-xs max-w-md space-y-2">
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

              <div className="flex items-start gap-2.5 pt-1.5 border-t border-white/10">
                <Clock size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                    Delivery Timings
                  </span>
                  <p className="text-xs text-green-100 font-bold leading-snug">
                    6:00 AM – 10:00 PM • 10-15 Min Express Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/subziquick"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-xs hover:scale-108 transition-all"
                title="Follow on Instagram @subziquick"
              >
                <Instagram size={16} />
              </a>

              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-xs hover:scale-108 transition-all"
                title="Chat on WhatsApp"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.632.062-1.923-.448-1.57-.621-2.572-2.22-2.65-2.324-.078-.104-.632-.843-.632-1.611 0-.769.404-1.15.547-1.307.144-.157.312-.196.417-.196.104 0 .209.002.301.006.098.004.229-.037.358.273.131.314.445 1.084.484 1.163.039.078.065.17.013.274-.052.105-.078.17-.156.262-.079.091-.165.204-.236.274-.078.079-.16.164-.069.32.091.157.404.667.868 1.08.597.532 1.101.697 1.258.775.156.079.248.065.34-.039.091-.105.391-.457.495-.614.105-.157.209-.131.353-.078.144.052.913.431 1.07.509.157.079.261.118.3.183.039.066.039.38-.105.785zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.66 1.438 5.169L2 22l4.978-1.393A9.95 9.95 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </a>

              <a
                href="tel:9981418565"
                className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs hover:scale-108 transition-all"
                title="Call Helpline"
              >
                <Phone size={15} />
              </a>

              <a
                href="mailto:anuragsinghas098@gmail.com"
                className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs hover:scale-108 transition-all"
                title="Send Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Produce & Quick Links (4 Cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-6">
            
            {/* Produce Categories */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3 text-emerald-300">
                Fresh Categories
              </h3>
              <div className="flex flex-col gap-2 text-xs text-green-100/90 font-medium">
                <Link href="/shop?category=Vegetables" className="hover:text-white transition flex items-center gap-1">
                  <span>🥬 Daily Vegetables</span>
                </Link>
                <Link href="/shop?category=Fruits" className="hover:text-white transition flex items-center gap-1">
                  <span>🍎 Seasonal Fruits</span>
                </Link>
                <Link href="/shop?category=Exotics" className="hover:text-white transition flex items-center gap-1">
                  <span>🥑 Hydroponic Exotics</span>
                </Link>
                <Link href="/shop" className="hover:text-white transition text-amber-300 font-bold flex items-center gap-1">
                  <span>🎁 Value Combos</span>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3 text-emerald-300">
                Customer Care
              </h3>
              <div className="flex flex-col gap-2 text-xs text-green-100/90 font-medium">
                <Link href="/user/myorder" className="hover:text-white transition">
                  Track My Order
                </Link>
                <Link href="/wishlist" className="hover:text-white transition">
                  My Wishlist
                </Link>
                <Link href="/offers" className="hover:text-white transition text-amber-300 font-bold">
                  🏷️ Offers & Discounts
                </Link>
                <Link href="/contact" className="hover:text-white transition">
                  Help & Support
                </Link>
                <Link href="/about" className="hover:text-white transition">
                  Our Farm Fresh Story
                </Link>
              </div>
            </div>

          </div>

          {/* Column 3: Contact Helpline (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-black text-xs uppercase tracking-wider mb-3 text-emerald-300">
              Need Help? Call Us
            </h3>

            <div className="space-y-2.5">
              <a
                href="tel:9981418565"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl flex items-center gap-3 transition-colors border border-white/10"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Phone size={15} />
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block font-bold">Direct Helpline</span>
                  <span className="text-xs font-black text-white">+91 9981418565</span>
                </div>
              </a>

              <a
                href="mailto:anuragsinghas098@gmail.com"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl flex items-center gap-3 transition-colors border border-white/10"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Mail size={15} />
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block font-bold">Email Support</span>
                  <span className="text-xs font-black text-white truncate max-w-[140px] block">
                    anuragsinghas098@gmail.com
                  </span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bhopal Top Search Keywords & Localities SEO Cloud */}
        <div className="border-t border-green-900/60 mt-6 pt-4 pb-2 text-xs text-green-200/80">
          <div className="flex items-center gap-1.5 mb-2">
            <Truck size={14} className="text-emerald-300" />
            <h4 className="font-bold text-emerald-300 text-xs tracking-wide uppercase">
              10-15 Min Express Delivery Localities in Bhopal:
            </h4>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-green-100/80">
            <Link href="/shop?locality=arera+colony" className="hover:text-amber-300 transition">Arera Colony E1-E8</Link>
            <span>•</span>
            <Link href="/shop?locality=mp+nagar" className="hover:text-amber-300 transition">MP Nagar Zone 1 & 2</Link>
            <span>•</span>
            <Link href="/shop?locality=kolar" className="hover:text-amber-300 transition">Kolar Road</Link>
            <span>•</span>
            <Link href="/shop?locality=bagsewaniya" className="hover:text-amber-300 transition">Bagsewaniya & Amrai</Link>
            <span>•</span>
            <Link href="/shop?locality=bawadiya+kalan" className="hover:text-amber-300 transition">Bawadiya Kalan</Link>
            <span>•</span>
            <Link href="/shop?locality=gulmohar" className="hover:text-amber-300 transition">Gulmohar Colony</Link>
            <span>•</span>
            <Link href="/shop?locality=shahpura" className="hover:text-amber-300 transition">Shahpura Sector A-C</Link>
            <span>•</span>
            <Link href="/shop?locality=katara+hills" className="hover:text-amber-300 transition">Katara Hills</Link>
            <span>•</span>
            <Link href="/shop?locality=hoshangabad+road" className="hover:text-amber-300 transition">Hoshangabad Road</Link>
            <span>•</span>
            <Link href="/shop?locality=bittan+market" className="hover:text-amber-300 transition">Bittan Market E4</Link>
            <span>•</span>
            <Link href="/shop?locality=saket+nagar" className="hover:text-amber-300 transition">Saket Nagar AIIMS</Link>
            <span>•</span>
            <Link href="/shop?locality=ayodhya+bypass" className="hover:text-amber-300 transition">Ayodhya Bypass</Link>
            <span>•</span>
            <Link href="/shop?locality=indrapuri" className="hover:text-amber-300 transition">Indrapuri & BHEL</Link>
            <span>•</span>
            <Link href="/shop?locality=chunabhatti" className="hover:text-amber-300 transition">Chunabhatti</Link>
            <span>•</span>
            <Link href="/shop?locality=tt+nagar" className="hover:text-amber-300 transition">TT Nagar New Market</Link>
            <span>•</span>
            <Link href="/shop?locality=misrod" className="hover:text-amber-300 transition">Misrod</Link>
            <span>•</span>
            <Link href="/shop?locality=awadhpuri" className="hover:text-amber-300 transition">Awadhpuri</Link>
            <span>•</span>
            <Link href="/shop?locality=trilanga" className="hover:text-amber-300 transition">Trilanga & Rohit Nagar</Link>
          </div>

          <div className="flex items-center gap-1.5 mt-3 mb-1.5">
            <Zap size={13} className="text-amber-300" />
            <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wide">
              Top Trending Searches:
            </span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10.5px] text-green-100/70">
            <Link href="/shop" className="hover:text-white transition">online vegetable delivery in bhopal</Link>
            <span>•</span>
            <Link href="/shop?category=Fruits" className="hover:text-white transition">buy fresh fruits online bhopal</Link>
            <span>•</span>
            <Link href="/user/checkout" className="hover:text-white transition">fresh sabzi cash on delivery</Link>
            <span>•</span>
            <Link href="/shop" className="hover:text-white transition">today vegetable rate in bhopal</Link>
            <span>•</span>
            <Link href="/shop?category=Exotics" className="hover:text-white transition">buy avocado & broccoli bhopal</Link>
            <span>•</span>
            <Link href="/offers" className="hover:text-white transition">free vegetable delivery app bhopal</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition">pesticide free 100% ozone washed vegetables</Link>
            <span>•</span>
            <Link href="/shop" className="hover:text-white transition">zero platform fee grocery delivery</Link>
          </div>
        </div>

        {/* Bottom Legal & Payment Badges */}
        <div className="border-t border-green-900/60 mt-4 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-green-200/80 gap-3 text-center md:text-left">
          <p className="text-[11px]">© {new Date().getFullYear()} SubziQuick Bhopal • Farm Fresh Everyday</p>

          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold flex-wrap text-green-100">
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="hover:text-white transition">
              Terms
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition">
              Refund Policy
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
              NetBanking
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