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
  Leaf,
} from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#052613] text-white font-sans border-t border-green-950/80 pb-28 sm:pb-24 md:pb-12 w-full max-w-full overflow-hidden">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Store Brand & Local Trust Bento (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-3">
              <Logo variant="white" />
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 mb-5 leading-relaxed font-medium max-w-md">
              Bhopal’s dedicated farm-fresh produce store. 100% ozone-washed, chemical-free vegetables & seasonal fruits delivered in 10-15 minutes.
            </p>

            {/* Clean Mobile-Friendly Bento Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md mb-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9.5px] font-black uppercase text-emerald-300 tracking-wider block">
                    Bhopal Store
                  </span>
                  <p className="text-xs text-white font-bold truncate">
                    Bagsewaniya, Bhopal
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Clock size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9.5px] font-black uppercase text-amber-300 tracking-wider block">
                    Express Dispatch
                  </span>
                  <p className="text-xs text-white font-bold truncate">
                    6:00 AM – 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-Tap Helpline & WhatsApp Buttons */}
            <div className="flex items-center gap-2.5 max-w-md">
              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Live</span>
              </a>

              <a
                href="tel:9981418565"
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <Phone size={14} className="text-emerald-300" />
                <span>Call Helpline</span>
              </a>
            </div>
          </div>

          {/* Column 2: 3-Column Navigation Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
            
            {/* Column A: Fresh Harvest */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3.5 text-emerald-300 flex items-center gap-1.5">
                <Leaf size={13} />
                <span>Categories</span>
              </h3>
              <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                <Link href="/shop?category=Vegetables" className="hover:text-white transition">
                  🥬 Vegetables
                </Link>
                <Link href="/shop?category=Fruits" className="hover:text-white transition">
                  🍎 Seasonal Fruits
                </Link>
                <Link href="/shop?category=Exotics" className="hover:text-white transition">
                  🥑 Exotics & Salads
                </Link>
                <Link href="/shop" className="hover:text-amber-300 transition text-amber-300 font-bold">
                  🎁 Value Combos
                </Link>
              </div>
            </div>

            {/* Column B: Customer Account */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3.5 text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck size={13} />
                <span>Account & Care</span>
              </h3>
              <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                <Link href="/user/myorder" className="hover:text-white transition">
                  My Orders
                </Link>
                <Link href="/wishlist" className="hover:text-white transition">
                  Saved Wishlist
                </Link>
                <Link href="/offers" className="hover:text-white transition text-amber-300 font-bold">
                  🏷️ Offers & Deals
                </Link>
                <Link href="/contact" className="hover:text-white transition">
                  Help & Support
                </Link>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </div>
            </div>

            {/* Column C: Policies & Trust (Hidden on small phone or placed nicely) */}
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3.5 text-emerald-300 flex items-center gap-1.5">
                <Truck size={13} />
                <span>Store Policies</span>
              </h3>
              <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link href="/terms-conditions" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
                <Link href="/refund-policy" className="hover:text-white transition">
                  Refund & Return
                </Link>
                <Link href="/shipping-policy" className="hover:text-white transition">
                  Shipping Policy
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Clean Minimalist Delivery Localities Strip */}
        <div className="border-t border-white/10 mt-8 pt-5 pb-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Truck size={13} className="text-emerald-400" />
            <span className="font-black text-[11px] text-emerald-300 uppercase tracking-wider">
              10-15 Min Express Delivery Areas Across Bhopal:
            </span>
          </div>
          <p className="text-[11px] text-emerald-100/70 leading-relaxed font-medium">
            Arera Colony • MP Nagar • Kolar Road • Bagsewaniya • Bawadiya Kalan • Gulmohar • Shahpura • Katara Hills • Hoshangabad Road • Bittan Market • Saket Nagar • Ayodhya Bypass • Indrapuri • Chunabhatti • TT Nagar • Misrod • Trilanga
          </p>
        </div>

        {/* Bottom Legal & Payment Badges */}
        <div className="border-t border-white/10 mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/70 gap-3 text-center sm:text-left">
          <p className="text-[11px] font-medium">
            © {new Date().getFullYear()} SubziQuick Bhopal • Farm Fresh Everyday
          </p>

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