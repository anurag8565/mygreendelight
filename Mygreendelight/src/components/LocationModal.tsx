"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Clock,
} from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

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
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState<any[]>([]);
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const recents = JSON.parse(localStorage.getItem("mgd_recent_locations") || "[]");
        setRecentLocations(recents);
      } catch (e) {
        setRecentLocations([]);
      }
    }
  }, []);

  // Real-time live OpenStreetMap Geocoding search (Real API, zero dummy)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setLiveSuggestions([]);
      setIsSearchingLive(false);
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(async () => {
      setIsSearchingLive(true);
      try {
        const queryWithContext = searchQuery.toLowerCase().includes("bhopal")
          ? searchQuery.trim()
          : `${searchQuery.trim()}, Bhopal, Madhya Pradesh`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            queryWithContext
          )}&countrycodes=in&limit=6&addressdetails=1`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveSuggestions(data);
        } else {
          setLiveSuggestions([]);
        }
      } catch (err) {
        console.error("Live place search error:", err);
        setLiveSuggestions([]);
      } finally {
        setIsSearchingLive(false);
      }
    }, 400);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  const saveLocationChoice = (loc: string) => {
    onSelectLocation(loc);
    if (typeof window !== "undefined") {
      try {
        const updated = [loc, ...recentLocations.filter((item) => item !== loc)].slice(0, 5);
        localStorage.setItem("mgd_recent_locations", JSON.stringify(updated));
        setRecentLocations(updated);
      } catch (e) {}
    }
    onClose();
  };

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
          
          // Check distance from Bhopal
          const R = 6371;
          const bhopalLat = 23.259933;
          const bhopalLng = 77.412613;
          const dLat = ((latitude - bhopalLat) * Math.PI) / 180;
          const dLon = ((longitude - bhopalLng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((bhopalLat * Math.PI) / 180) *
              Math.cos((latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distKm = R * c;

          if (distKm > 35) {
            alert("📍 Note: MyGreenDelight operates exclusively across Bhopal city. Location set to Bhopal Central.");
            saveLocationChoice("Bagsewaniya (Amrai), Bhopal");
            return;
          }

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();

          let detected = "Bagsewaniya (Amrai), Bhopal";
          if (data?.display_name) {
            const parts = data.display_name.split(",");
            detected = parts.slice(0, 3).join(", ").trim();
          } else if (data?.address?.suburb || data?.address?.neighbourhood) {
            detected = `${data.address.suburb || data.address.neighbourhood}, Bhopal`;
          }

          saveLocationChoice(detected);
        } catch (error) {
          console.error("GPS detection error:", error);
          saveLocationChoice("Bagsewaniya (Amrai), Bhopal");
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
    saveLocationChoice(finalAddress);
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
            className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-green-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0f8646] text-white flex items-center justify-center shadow-xs">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                    Delivery Address & Location
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    10-15 Min Express Delivery across Bhopal
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
                className="w-full flex items-center justify-between p-3.5 bg-green-50/80 hover:bg-green-100/80 border border-green-200 rounded-2xl text-[#0f8646] transition group cursor-pointer shadow-2xs"
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
                      {isDetecting ? "Detecting Live GPS..." : "Use Current Location"}
                    </span>
                    <span className="text-[11px] text-green-700 font-medium">
                      GPS coordinates for accurate doorstep delivery
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#0f8646] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* 2. Live Real-Time Search Bar */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Search Colony / Landmark / Street Name
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0f8646] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#0f8646] transition">
                  <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Arera Colony, MP Nagar, Minal Residency..."
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-gray-800 placeholder-gray-400"
                  />
                  {isSearchingLive ? (
                    <Loader2 size={15} className="animate-spin text-[#0f8646] shrink-0" />
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X size={14} />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Live Real Results from OSM Map API */}
              {searchQuery.trim().length >= 2 && (
                <div className="space-y-2 border border-green-200 bg-green-50/40 rounded-2xl p-3">
                  <span className="text-[11px] font-black text-[#0f8646] uppercase tracking-wider block">
                    Live Verified Places ({liveSuggestions.length} found)
                  </span>
                  {isSearchingLive ? (
                    <div className="flex items-center justify-center py-4 gap-2 text-xs text-gray-500">
                      <Loader2 size={14} className="animate-spin text-[#0f8646]" /> Searching live map database...
                    </div>
                  ) : liveSuggestions.length === 0 ? (
                    <div className="text-center py-3 text-xs text-gray-500">
                      No exact match found on map. You can save your address manually below!
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {liveSuggestions.map((place, idx) => {
                        const parts = place.display_name.split(",");
                        const title = parts.slice(0, 2).join(", ").trim();
                        const sub = parts.slice(2, 4).join(", ").trim();

                        return (
                          <div
                            key={idx}
                            onClick={() => saveLocationChoice(title)}
                            className="p-2.5 rounded-xl bg-white border border-gray-100 hover:border-[#0f8646] flex items-center justify-between cursor-pointer transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-green-100 text-[#0f8646] flex items-center justify-center shrink-0">
                                <MapPin size={13} />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-gray-900 block truncate">
                                  {title}
                                </span>
                                <span className="text-[10px] text-gray-400 truncate block">
                                  {sub}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-[#0f8646] bg-green-50 px-2 py-0.5 rounded shrink-0">
                              Select
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Manual Flat / House / Full Address Input */}
              <form onSubmit={handleCustomSubmit} className="space-y-1.5 pt-1">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Or Type Complete Doorstep Address
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

              {/* 4. Recent / Saved Locations */}
              {recentLocations.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <Clock size={12} className="text-gray-400" />
                    Recent Locations
                  </span>
                  <div className="space-y-1.5">
                    {recentLocations.map((loc, i) => (
                      <div
                        key={i}
                        onClick={() => saveLocationChoice(loc)}
                        className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:border-[#0f8646] hover:bg-green-50/50 flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin size={13} className="text-gray-400 shrink-0" />
                          <span className="text-xs font-bold text-gray-800 truncate">
                            {loc}
                          </span>
                        </div>
                        {currentLocation === loc && (
                          <Check size={14} className="text-[#0f8646] stroke-[3]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
