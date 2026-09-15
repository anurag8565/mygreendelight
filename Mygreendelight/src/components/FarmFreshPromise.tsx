"use client";

import React from "react";
import { ShieldCheck, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function FarmFreshPromise() {
  return (
    <section className="w-full py-4 sm:py-6 bg-[#faf9f5] border-b border-stone-200/70 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Left Column: Shield & Guarantee Highlight */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/70 text-[#0a3d24] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 tracking-tight font-heading">
                  100% Doorstep Freshness Guarantee
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                  Instant Replace or Refund
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-normal mt-0.5">
                Check produce at delivery. If anything isn&apos;t crisp and fresh, get an instant replacement or refund on the spot.
              </p>
            </div>
          </div>

          {/* Right Column: Fresh Hub Info & 1-Click WhatsApp Support */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap border-t md:border-t-0 pt-2.5 md:pt-0 border-stone-100 shrink-0">
            <div className="flex items-center gap-1.5 text-stone-600 bg-stone-50 border border-stone-200/80 px-2.5 py-1 rounded-xl text-[11px] font-medium">
              <MapPin size={13} className="text-emerald-700 shrink-0" />
              <span>Fulfilled from SubziQuick Fresh Hub, Bhopal</span>
            </div>

            <a
              href="https://wa.me/919981418565?text=Hello%20SubziQuick,%20I%20have%20a%20question%20about%20today's%20fresh%20harvest"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/90 transition shadow-2xs shrink-0 active:scale-95"
            >
              <FaWhatsapp className="text-[#25D366] text-sm shrink-0" />
              <span>Help Desk</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
