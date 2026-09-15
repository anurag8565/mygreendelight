"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SocietyData {
  id: string;
  slug: string;
  name: string;
  locality: string;
  landmark?: string;
  pincode: string;
  targetOrders: number;
  discountPercent: number;
  currentOrders: number;
  isUnlocked: boolean;
  ordersNeeded: number;
}

export default function BhopalSocietyPool() {
  const [societies, setSocieties] = useState<SocietyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load previously selected society from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("subziquick_selected_society");
      if (saved) setSelectedSociety(saved);
    }

    axios
      .get("/api/society-pool")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.societies)) {
          setSocieties(res.data.societies);
        }
      })
      .catch((err) => {
        console.error("Society pool fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectSociety = (soc: SocietyData) => {
    setSelectedSociety(soc.slug);
    if (typeof window !== "undefined") {
      localStorage.setItem("subziquick_selected_society", soc.slug);
      localStorage.setItem("subziquick_selected_society_name", soc.name);
      localStorage.setItem("subziquick_selected_society_pincode", soc.pincode);
    }
  };

  if (!loading && societies.length === 0) return null;

  return (
    <section className="w-full py-4 sm:py-6 bg-white border-b border-stone-200/70 font-sans select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300/80 px-2.5 py-0.5 rounded-full text-[10.5px] font-black text-amber-950 mb-1 shadow-2xs">
              <Sparkles size={11} className="text-amber-600 fill-amber-600" />
              <span>Bhopal Community Bulk-Drop Pool</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-[#0a3d24] shrink-0" />
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading">
                Society & Campus Club Savings
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5 max-w-xl">
              When 3 or more neighbors order together, everyone unlocks <strong>FREE Delivery + Extra 5% OFF</strong> on morning farm fresh produce.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-stone-500 hover:text-[#0a3d24] font-semibold text-xs sm:text-sm flex items-center gap-0.5 transition shrink-0 self-start sm:self-auto"
          >
            <span>Shop for My Society</span>
            <ChevronRight size={14} className="stroke-[2]" />
          </Link>
        </div>

        {/* Real Dynamic Society Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {societies.slice(0, 6).map((soc) => {
            const isSelected = selectedSociety === soc.slug;
            const progressPercent = Math.min(
              100,
              Math.round((soc.currentOrders / soc.targetOrders) * 100)
            );

            return (
              <motion.div
                key={soc.id || soc.slug}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                onClick={() => handleSelectSociety(soc)}
                className={`relative rounded-2xl sm:rounded-3xl p-4 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-50/70 border-[#0a3d24] shadow-[0_8px_24px_rgba(10,61,36,0.12)] ring-1.5 ring-[#0a3d24]"
                    : "bg-stone-50/60 hover:bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs hover:shadow-md"
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-white text-stone-700 border-stone-200/90 flex items-center gap-1 shadow-2xs">
                      <MapPin size={10} className="text-[#0a3d24]" />
                      <span>{soc.locality} ({soc.pincode})</span>
                    </span>

                    {soc.isUnlocked ? (
                      <span className="bg-[#0a3d24] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        <span>Pool Unlocked!</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-950 border border-amber-300/80 text-[9.5px] font-black px-2 py-0.5 rounded-full">
                        {soc.ordersNeeded} More Needed
                      </span>
                    )}
                  </div>

                  {/* Society Title */}
                  <h3 className="font-extrabold text-sm text-stone-900 leading-snug line-clamp-1 group-hover:text-[#0a3d24] transition-colors">
                    {soc.name}
                  </h3>
                  {soc.landmark && (
                    <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
                      Near {soc.landmark}
                    </p>
                  )}

                  {/* Live Progress Bar */}
                  <div className="mt-3.5 pt-2.5 border-t border-stone-200/60">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-stone-600 flex items-center gap-1">
                        <Users size={12} className="text-[#0a3d24]" />
                        <span>{soc.currentOrders} of {soc.targetOrders} orders today</span>
                      </span>
                      <span className="text-[#0a3d24] font-black">
                        {progressPercent}%
                      </span>
                    </div>

                    <div className="w-full bg-stone-200/70 h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          soc.isUnlocked
                            ? "bg-gradient-to-r from-emerald-600 to-[#0a3d24]"
                            : "bg-gradient-to-r from-amber-400 to-amber-600"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Pill */}
                <div className="mt-3.5 pt-2 flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-bold text-stone-500">
                    {soc.isUnlocked ? "✨ 5% Discount Active" : "📦 Join Community Drop"}
                  </span>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-[#0a3d24] text-white shadow-2xs"
                        : "bg-white hover:bg-stone-100 text-stone-800 border border-stone-200"
                    }`}
                  >
                    <span>{isSelected ? "My Society ✓" : "Select"}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Stamp */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500 font-medium text-center sm:text-left">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#0a3d24]" />
            <span>Deliveries bundled directly into your society gate before 7:30 AM</span>
          </span>
          <Link
            href="/contact?topic=society_partner"
            className="text-[#0a3d24] hover:underline font-bold text-xs flex items-center gap-1"
          >
            <span>Don&apos;t see your society? Request Society Listing</span>
            <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </section>
  );
}
