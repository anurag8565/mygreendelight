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
  Sparkles,
} from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/subziquick",
      title: "Follow SubziQuick on Instagram",
      bgClass: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-rose-950/30",
      icon: (
        <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order.",
      title: "Chat on WhatsApp",
      bgClass: "bg-[#25D366] shadow-emerald-950/30",
      icon: (
        <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.632.062-1.923-.448-1.57-.621-2.572-2.22-2.65-2.324-.078-.104-.632-.843-.632-1.611 0-.769.404-1.15.547-1.307.144-.157.312-.196.417-.196.104 0 .209.002.301.006.098.004.229-.037.358.273.131.314.445 1.084.484 1.163.039.078.065.17.013.274-.052.105-.078.17-.156.262-.079.091-.165.204-.236.274-.078.079-.16.164-.069.32.091.157.404.667.868 1.08.597.532 1.101.697 1.258.775.156.079.248.065.34-.039.091-.105.391-.457.495-.614.105-.157.209-.131.353-.078.144.052.913.431 1.07.509.157.079.261.118.3.183.039.066.039.38-.105.785zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.66 1.438 5.169L2 22l4.978-1.393A9.95 9.95 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com/subziquick",
      title: "Follow on Facebook",
      bgClass: "bg-[#1877F2] shadow-blue-950/30",
      icon: (
        <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: "Phone",
      href: "tel:9981418565",
      title: "Call Helpline",
      bgClass: "bg-emerald-600 shadow-emerald-950/30",
      icon: <Phone size={17} className="text-white" />,
    },
    {
      name: "Email",
      href: "mailto:anuragsinghas098@gmail.com",
      title: "Email Support",
      bgClass: "bg-blue-600 shadow-blue-950/30",
      icon: <Mail size={17} className="text-white" />,
    },
  ];

  return (
    <footer className="bg-[#052613] text-white font-sans border-t border-emerald-900/50 pb-32 sm:pb-24 md:pb-12 w-full max-w-full overflow-hidden">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Store Brand & Local Trust Bento (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col w-full">
            <div className="mb-3">
              <Logo variant="white" />
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 mb-5 leading-relaxed font-medium max-w-md">
              Bhopal’s dedicated farm-fresh produce store. 100% ozone-washed, chemical-free vegetables & seasonal fruits delivered in 10-15 minutes.
            </p>

            {/* Clean Mobile Bento Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md mb-5 w-full">
              <div className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-3 backdrop-blur-xs flex items-center gap-3 transition">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                  <MapPin size={16} />
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

              <div className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-3 backdrop-blur-xs flex items-center gap-3 transition">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                  <Clock size={16} />
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

            {/* Quick 1-Tap Helpline & WhatsApp Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 max-w-md mb-5 w-full">
              <a
                href="https://wa.me/919981418565?text=Hello%20SubziQuick%20Support,%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer text-center"
              >
                <MessageCircle size={15} className="shrink-0" />
                <span className="truncate">WhatsApp Live</span>
              </a>

              <a
                href="tel:9981418565"
                className="bg-white/10 hover:bg-white/15 active:scale-98 border border-white/15 text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer text-center"
              >
                <Phone size={14} className="text-emerald-300 shrink-0" />
                <span className="truncate">Call Helpline</span>
              </a>
            </div>

            {/* Official Social Media Channels Strip - Ultra Mobile Responsive */}
            <div className="pt-1 pb-2 w-full max-w-md">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-emerald-300 tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-300" />
                  Connect With Us
                </span>
                <span className="text-[10px] text-emerald-200/60 font-medium">
                  @subziquick
                </span>
              </div>

              {/* Social Icon Buttons Row */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-xl sm:rounded-2xl ${item.bgClass} flex items-center justify-center text-white shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/10`}
                    title={item.title}
                    aria-label={item.title}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: 3-Column Navigation Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-2">
            
            {/* Column A: Fresh Harvest */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3 text-emerald-300 flex items-center gap-1.5">
                <Leaf size={14} className="text-emerald-400" />
                <span>Categories</span>
              </h3>
              <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                <Link href="/shop?category=Vegetables" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  🥬 Vegetables
                </Link>
                <Link href="/shop?category=Fruits" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  🍎 Seasonal Fruits
                </Link>
                <Link href="/shop?category=Exotics" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  🥑 Exotics & Salads
                </Link>
                <Link href="/shop" className="hover:text-amber-300 text-amber-300 font-bold hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  🎁 Value Combos
                </Link>
              </div>
            </div>

            {/* Column B: Customer Account */}
            <div className="flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3 text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Account & Care</span>
              </h3>
              <div className="flex flex-col gap-2.5 text-xs text-emerald-100/80 font-medium">
                <Link href="/user/myorder" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  My Orders
                </Link>
                <Link href="/wishlist" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  Saved Wishlist
                </Link>
                <Link href="/offers" className="hover:text-amber-300 text-amber-300 font-bold hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  🏷️ Offers & Deals
                </Link>
                <Link href="/contact" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  Help & Support
                </Link>
                <Link href="/about" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  About Us
                </Link>
              </div>
            </div>

            {/* Column C: Store Policies */}
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <h3 className="font-black text-xs uppercase tracking-wider mb-3 text-emerald-300 flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-400" />
                <span>Store Policies</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 text-xs text-emerald-100/80 font-medium">
                <Link href="/privacy-policy" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  Privacy Policy
                </Link>
                <Link href="/terms-conditions" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  Terms & Conditions
                </Link>
                <Link href="/refund-policy" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  Refund & Return
                </Link>
                <Link href="/shipping-policy" className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center py-0.5">
                  Shipping Policy
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Clean Minimalist Delivery Localities Strip */}
        <div className="border-t border-white/10 mt-8 pt-5 pb-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Truck size={14} className="text-emerald-400 shrink-0" />
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
            © {currentYear} SubziQuick Bhopal • Farm Fresh Everyday
          </p>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              UPI
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              Cards
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              NetBanking
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[10px] text-white">
              COD
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}