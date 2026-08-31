"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, ShieldCheck, Thermometer, Clock, Lightbulb, Droplets } from "lucide-react";
import axios from "axios";

interface StorageGuideModalProps {
  category?: string;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StorageGuideModal({
  category = "",
  productName = "",
  isOpen,
  onClose,
}: StorageGuideModalProps) {
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    axios
      .get("/api/produce-guide")
      .then((res) => {
        if (res.data.success && res.data.guides) {
          const guides = res.data.guides;
          const matched = guides.find((g: any) => {
            const cat = g.category.toLowerCase();
            const pName = productName.toLowerCase();
            const targetCat = category.toLowerCase();
            return (
              (pName.includes("palak") || pName.includes("spinach") || pName.includes("saag") || targetCat.includes("vegetable")) &&
              cat.includes("leafy")
            ) || (
              (pName.includes("tomato") || pName.includes("tamatar") || targetCat.includes("fruit")) &&
              cat.includes("tomato")
            ) || (
              (pName.includes("potato") || pName.includes("aloo") || pName.includes("onion") || pName.includes("pyaaz")) &&
              cat.includes("root")
            ) || (
              (pName.includes("paneer") || pName.includes("milk") || targetCat.includes("dairy")) &&
              cat.includes("dairy")
            ) || (
              cat.includes("exotic")
            );
          });
          setGuide(matched || guides[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, category, productName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={18} />
        </button>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-gray-400">
            Loading storage & shelf-life guide...
          </div>
        ) : guide ? (
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <span className="text-3xl">{guide.icon}</span>
              <div>
                <h3 className="font-black text-sm sm:text-base text-gray-900 leading-tight">
                  {guide.category}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Indian Kitchen Ripeness & Freshness Guide
                </p>
              </div>
            </div>

            {/* Storage & Temp Badges */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase mb-1">
                  <Thermometer size={12} />
                  <span>Ideal Temp</span>
                </div>
                <span className="text-xs font-black text-emerald-950 block">
                  {guide.temperature}
                </span>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase mb-1">
                  <Clock size={12} />
                  <span>Shelf Life</span>
                </div>
                <span className="text-xs font-black text-amber-950 block">
                  ~{guide.shelfLifeDays} Days from Harvest
                </span>
              </div>
            </div>

            {/* Ideal Storage */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs">
              <span className="font-black text-gray-900 block mb-1">📍 How to Store</span>
              <p className="text-gray-600 font-medium leading-relaxed">{guide.idealStorage}</p>
            </div>

            {/* Kitchen Hack */}
            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs">
              <div className="flex items-center gap-1 font-black text-blue-900 mb-1">
                <Lightbulb size={14} className="text-amber-500 fill-amber-400" />
                <span>Desi Kitchen Hack</span>
              </div>
              <p className="text-blue-950 font-medium leading-relaxed">{guide.kitchenHacks}</p>
            </div>

            {/* Ozone Wash Promise */}
            <div className="p-3 bg-green-900 text-white rounded-2xl flex items-center gap-2.5 text-xs shadow-xs">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block text-emerald-200 text-[10px] uppercase">
                  100% Ozone Sanitized
                </span>
                <p className="text-[11px] text-green-100 leading-tight">
                  {guide.washingAdvice}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
