"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, Sparkles, ArrowRight, Tag } from "lucide-react";
import axios from "axios";

export default function PromoBanners({ banners = [] }: { banners?: any[] }) {
  const [copied, setCopied] = useState(false);
  const [dbCoupon, setDbCoupon] = useState<string>("WELCOME20");

  useEffect(() => {
    axios
      .get("/api/coupons/featured")
      .then((res) => {
        if (res.data?.success && res.data.coupon?.code) {
          setDbCoupon(res.data.coupon.code);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const b1 = banners[0] || {
    title: "Sunrise Super Saver",
    subtitle: "Organic Veggies & Fruits",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=85",
    btnText: "Shop Fresh Produce",
    link: "/shop?category=Vegetables",
  };

  const b2 = banners[1] || {
    title: "First 3 Orders Offer",
    subtitle: "Flat 20% Instant Discount",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=85",
    code: dbCoupon,
    link: "/shop",
  };

  const activeCouponCode = b2.code || dbCoupon;

  return (
    <div className="w-full py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Super Saver Produce */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c592f] via-[#0f8646] to-[#15803d] min-h-[220px] flex items-center justify-between shadow-md hover:shadow-xl transition-all group p-6 sm:p-8">
          <div className="relative z-10 flex flex-col items-start max-w-xs">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-green-100 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-white/20">
              <Sparkles size={12} className="text-yellow-300" /> Special Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
              {b1.title} <br />
              <span className="text-green-200">{b1.subtitle}</span>
            </h3>
            <p className="text-xs text-green-100/90 mb-5 leading-relaxed">
              Handpicked from local farms. 100% pesticide-free guarantee.
            </p>
            <Link href={b1.link}>
              <button className="bg-white text-[#0f8646] hover:bg-green-50 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5">
                {b1.btnText} <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div className="relative z-10 shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30 hidden sm:flex items-center justify-center bg-white/10 backdrop-blur-xs">
            <img
              src={b1.image}
              alt={b1.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Banner 2: 10-15 Min Express Delivery & Farm Fresh Guarantee */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/80 min-h-[220px] flex items-center justify-between shadow-md hover:shadow-xl transition-all border border-amber-200/80 group p-6 sm:p-8">
          <div className="relative z-10 flex flex-col items-start max-w-xs">
            <span className="inline-flex items-center gap-1 bg-amber-200/80 text-amber-900 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-300">
              ⚡ Bhopal Express Guarantee
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
              10-15 Min Delivery <br />
              <span className="text-orange-600 font-black">To Your Doorstep</span>
            </h3>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Arera Colony • Kolar Road • MP Nagar • Bairagarh & across all Bhopal hubs with 100% Quality Guarantee.
            </p>

            <Link href="/shop">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer">
                <span>Shop Fresh Produce</span>
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div className="relative z-10 shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 hidden sm:flex items-center justify-center bg-white/40">
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=85"
              alt="Express Delivery"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
