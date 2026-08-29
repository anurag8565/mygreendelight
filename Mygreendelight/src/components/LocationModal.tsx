"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  X,
  Search,
  Navigation,
  Check,
  Building,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

const BHOPAL_LOCALITIES = [
  { name: "Arera Colony", detail: "E-1 to E-7, Bittan Market, 10 No. Market", tag: "Express 10m" },
  { name: "MP Nagar", detail: "Zone I, Zone II, DB City Mall area", tag: "Express 10m" },
  { name: "Kolar Road", detail: "Chuna Bhatti, Sarvadharma, Danish Kunj", tag: "Express 15m" },
  { name: "Shahpura", detail: "Shahpura Lake, Sector A/B/C, Manisha Market", tag: "Express 10m" },
  { name: "TT Nagar", detail: "New Market, Malviya Nagar, Platinum Plaza", tag: "Express 10m" },
  { name: "Hoshangabad Road", detail: "Aashima Mall, Misrod, Ratanpur, Bagmugaliya", tag: "Express 15m" },
  { name: "Gulmohar Colony", detail: "Trilanga, Rohit Nagar, Bawadiya Kalan", tag: "Express 12m" },
  { name: "Indrapuri", detail: "Sector A/B/C, Piplani, BHEL, Raisen Road", tag: "Express 15m" },
  { name: "Ayodhya Bypass", detail: "Minal Residency, Ayodhya Nagar, Karond", tag: "Express 15m" },
  { name: "Shivaji Nagar", detail: "6 No. Stop, 7 No. Stop, Nutan College area", tag: "Express 10m" },
  { name: "Bairagarh", detail: "Sant Hirdaram Nagar, Lalghati, VIP Road", tag: "Express 15m" },
  { name: "Katara Hills", detail: "Spring Valley, Sagar Golden Palm, Bagsewaniya", tag: "Express 20m" },
];

export default function LocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLocalities = BHOPAL_LOCALITIES.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();

          let detected = "Bhopal, Madhya Pradesh";
          if (data?.locality) {
            detected = `${data.locality}, Bhopal`;
          } else if (data?.city) {
            detected = `${data.city}, ${data.principalSubdivision || "MP"}`;
          }

          onSelectLocation(detected);
          onClose();
        } catch (error) {
          console.error("GPS detection error:", error);
          onSelectLocation("Bhopal, Madhya Pradesh");
          onClose();
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        console.error("GPS permission error:", err);
        alert("Please enable location/GPS permission in your browser to auto-detect.");
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    const finalAddress = customAddress.includes("Bhopal")
      ? customAddress.trim()
      : `${customAddress.trim()}, Bhopal`;
    onSelectLocation(finalAddress);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container (Bottom Sheet on Mobile, Centered Modal on Desktop) */}
          <motion.div
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-green-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0f8646] text-white flex items-center justify-center shadow-xs">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                    Select Delivery Location
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Order fresh groceries delivered in Bhopal in 10-15 mins
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              {/* 1. GPS Auto-Detect Button */}
              <button
                type="button"
                onClick={handleGPSDetect}
                disabled={isDetecting}
                className="w-full flex items-center justify-between p-3.5 bg-green-50/80 hover:bg-green-100/80 border border-green-200 rounded-2xl text-[#0f8646] transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0f8646] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    {isDetecting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Navigation size={16} className="group-hover:rotate-45 transition-transform" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm block leading-snug">
                      {isDetecting ? "Detecting GPS Location..." : "Use Current Location"}
                    </span>
                    <span className="text-[11px] text-green-700 font-medium">
                      Using device GPS for precise doorstep delivery
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#0f8646] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* 2. Custom Address / Colony Input */}
              <form onSubmit={handleCustomSubmit} className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Or Enter Your Exact Address / Colony
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#0f8646] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#0f8646] transition">
                    <Building size={16} className="text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="e.g. Flat 302, Sagar Landmark, Ayodhya Bypass"
                      className="w-full bg-transparent outline-none text-xs sm:text-sm text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!customAddress.trim()}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs transition cursor-pointer shrink-0 ${
                      customAddress.trim()
                        ? "bg-[#0f8646] text-white hover:bg-[#0c6a38] shadow-xs"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Save
                  </button>
                </div>
              </form>

              {/* 3. Search & Filter Bhopal Localities */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    Popular Delivery Hubs in Bhopal
                  </span>
                  <span className="text-[10px] text-green-700 bg-green-100 font-bold px-2 py-0.5 rounded-md">
                    10-15 Min Express
                  </span>
                </div>

                {/* Filter Search Input */}
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-3 focus-within:border-[#0f8646] focus-within:bg-white transition">
                  <Search size={15} className="text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Bhopal areas (e.g. Arera, MP Nagar, Kolar)..."
                    className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Localities List */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {filteredLocalities.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-400">
                      No matching locality found. You can type your exact colony above!
                    </div>
                  ) : (
                    filteredLocalities.map((loc) => {
                      const fullLocName = `${loc.name}, Bhopal`;
                      const isSelected =
                        currentLocation.toLowerCase().includes(loc.name.toLowerCase());

                      return (
                        <div
                          key={loc.name}
                          onClick={() => {
                            onSelectLocation(fullLocName);
                            onClose();
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                            isSelected
                              ? "bg-green-50/80 border-[#0f8646] shadow-2xs"
                              : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                isSelected
                                  ? "bg-[#0f8646] text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <MapPin size={13} />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-gray-900 block truncate">
                                {loc.name}, Bhopal
                              </span>
                              <span className="text-[10px] text-gray-400 truncate block">
                                {loc.detail}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-extrabold text-[#0f8646] bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                              {loc.tag}
                            </span>
                            {isSelected && (
                              <Check size={14} className="text-[#0f8646] stroke-[3]" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
