"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
  Navigation,
  Copy,
  Check,
  Package,
  Leaf,
  Store,
  Home,
  X,
  Radio,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { triggerHaptic } from "@/utils/haptics";

interface LiveOrderPulseTrackerProps {
  order: any;
  customerLocation?: { latitude: number; longitude: number };
  onClose?: () => void;
  compact?: boolean;
}

export default function LiveOrderPulseTracker({
  order,
  customerLocation,
  onClose,
  compact = false,
}: LiveOrderPulseTrackerProps) {
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!order) return null;

  const status = order.status || "pending";
  const isDelivered = status === "delivered" || status === "completed";
  const isOutForDelivery = status === "out of delivery";
  const isCancelled = status === "cancelled";
  const rider = order.assigneddelliveryboy;

  // Step indices: 0 = Placed, 1 = Packing, 2 = In Transit, 3 = Delivered
  const stepIndex = isCancelled
    ? -1
    : isDelivered
    ? 3
    : isOutForDelivery
    ? 2
    : status === "pending"
    ? 0
    : 1;

  // Calculate distance & estimated minutes
  const rawCust = customerLocation || order.address;
  const custLat = Number(rawCust?.latitude);
  const custLng = Number(rawCust?.longitude);

  const riderCoords = rider?.location?.coordinates;
  const riderLng = Number(
    Array.isArray(riderCoords) ? riderCoords[0] : (rider?.location as any)?.longitude
  );
  const riderLat = Number(
    Array.isArray(riderCoords) ? riderCoords[1] : (rider?.location as any)?.latitude
  );

  let distKm = 1.4;
  let etaMins = 9;
  let hasExactGPS = false;

  if (
    !isNaN(custLat) &&
    !isNaN(custLng) &&
    custLat &&
    custLng &&
    !isNaN(riderLat) &&
    !isNaN(riderLng) &&
    riderLat &&
    riderLng
  ) {
    const dLat = ((riderLat - custLat) * Math.PI) / 180;
    const dLon = ((riderLng - custLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((custLat * Math.PI) / 180) *
        Math.cos((riderLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const calc = 6371 * c;
    distKm = isNaN(calc) ? 1.4 : Math.max(0.3, Number(calc.toFixed(1)));
    etaMins = Math.max(3, Math.round(distKm * 2.8 + 2));
    hasExactGPS = true;
  }

  const steps = [
    {
      id: "placed",
      title: "Order Placed",
      detail: "SubziQuick fresh batch locked",
      icon: Store,
    },
    {
      id: "packing",
      title: "Hand-Grading",
      detail: "Freshness inspected & packed",
      icon: Leaf,
    },
    {
      id: "transit",
      title: "Rider on Way",
      detail: hasExactGPS ? `${distKm} km away in Bhopal` : "Express fleet dispatched",
      icon: Truck,
    },
    {
      id: "delivered",
      title: "Doorstep Arrival",
      detail: "Inspect & pay at door",
      icon: Home,
    },
  ];

  const handleCopyOtp = () => {
    if (order.deliveryOtp?.code) {
      triggerHaptic("medium");
      navigator.clipboard.writeText(order.deliveryOtp.code);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2500);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden font-sans select-none">
      {/* 🌟 TOP RADAR HEADER BANNER */}
      <div className="relative bg-gradient-to-br from-[#062415] via-[#0a3d24] to-[#041d11] text-white p-4 sm:p-6 overflow-hidden">
        {/* Animated Background Radar Wave Rings */}
        <div className="absolute -right-8 -top-8 w-44 h-44 sm:w-56 sm:h-56 pointer-events-none opacity-40">
          <motion.div
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 3.5, delay: 0.8, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-amber-300"
          />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
        </div>

        {/* Ambient Top Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Live Delivery Pulse</span>
            </span>
            <span className="text-[11px] font-mono font-black text-amber-300">
              #SZQ-{String(order._id).slice(-6).toUpperCase()}
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Headline + ETA Counter */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight font-heading leading-tight">
              {isDelivered
                ? "Aapke Ghar Pahunch Gaya! 🎉"
                : isOutForDelivery
                ? "SubziQuick Rider Raaste Me Hai! 🛵"
                : isCancelled
                ? "Order Cancelled"
                : "SubziQuick Order Pack Ho Raha Hai 🌿"}
            </h2>
            <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
              {isDelivered
                ? "Taaza sabzi ka aanand lein. Shukriya!"
                : isOutForDelivery
                ? `Bhopal Express Route • ~${etaMins} Mins me doorstep par delivery`
                : "Aapke order ki sabziyan hand-grade hokar pack ki jaa rahi hain."}
            </p>
          </div>

          {!isDelivered && !isCancelled && (
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 self-start sm:self-auto shrink-0 shadow-inner">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-xs shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300 block">
                  ESTIMATED ARRIVAL
                </span>
                <span className="text-sm sm:text-base font-black text-white">
                  ~{etaMins} Mins
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 🛵 ANIMATED SCOOTER ROUTE TRACK (Visual Moving Delivery Partner) */}
        {!isCancelled && (
          <div className="relative z-10 mt-5 pt-3 border-t border-white/10">
            <div className="relative h-10 flex items-center">
              {/* Route Base Track Line */}
              <div className="absolute inset-x-2 h-1.5 bg-white/20 rounded-full" />

              {/* Active Pulsing Fill Track */}
              <motion.div
                className="absolute left-2 h-1.5 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-300 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                initial={{ width: "10%" }}
                animate={{
                  width:
                    stepIndex === 0
                      ? "12%"
                      : stepIndex === 1
                      ? "40%"
                      : stepIndex === 2
                      ? "75%"
                      : "98%",
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />

              {/* Start Point: SubziQuick Hub */}
              <div className="absolute left-0 -top-2 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-400 text-stone-950 flex items-center justify-center shadow-xs border-2 border-white">
                  <Store size={10} />
                </div>
                <span className="text-[8.5px] font-bold text-emerald-200 mt-0.5">SubziQuick Hub</span>
              </div>

              {/* Moving Electric Scooter with Headlight Pulse */}
              <motion.div
                className="absolute -top-3 z-20"
                initial={{ left: "10%" }}
                animate={{
                  left:
                    stepIndex === 0
                      ? "12%"
                      : stepIndex === 1
                      ? "38%"
                      : stepIndex === 2
                      ? ["70%", "74%", "70%"]
                      : "94%",
                }}
                transition={{
                  duration: stepIndex === 2 ? 3 : 1.2,
                  repeat: stepIndex === 2 ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <div className="relative">
                  {/* Scooter Icon Badge */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 flex items-center justify-center shadow-lg border-2 border-white">
                    <Truck size={15} className="stroke-[2.5]" />
                  </div>
                  {/* Glowing Headlight Beam */}
                  <div className="absolute top-2 -right-3 w-5 h-2 bg-gradient-to-r from-yellow-300/80 to-transparent blur-[1px] rounded-r-full" />
                </div>
              </motion.div>

              {/* End Point: Customer Home */}
              <div className="absolute right-0 -top-2 flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white ${
                    isDelivered ? "bg-emerald-400 text-stone-950" : "bg-white/30 text-white"
                  }`}
                >
                  <Home size={10} />
                </div>
                <span className="text-[8.5px] font-bold text-emerald-200 mt-0.5">Ghar</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📋 4-STAGE INTERACTIVE STEPPER */}
      <div className="p-4 sm:p-5 bg-[#faf9f5] border-b border-stone-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {steps.map((st, idx) => {
            const isPassed = idx <= stepIndex;
            const isCurrent = idx === stepIndex;
            const IconComp = st.icon;

            return (
              <div
                key={st.id}
                className={`p-2.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-white border-[#0a3d24] shadow-sm ring-1 ring-[#0a3d24]/20"
                    : isPassed
                    ? "bg-white/80 border-emerald-200"
                    : "bg-stone-100/70 border-stone-200 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isCurrent
                        ? "bg-[#0a3d24] text-white"
                        : isPassed
                        ? "bg-emerald-100 text-[#0a3d24]"
                        : "bg-stone-200 text-stone-500"
                    }`}
                  >
                    {isPassed && !isCurrent ? (
                      <Check size={12} className="stroke-[3]" />
                    ) : (
                      <IconComp size={12} />
                    )}
                  </div>
                  <span
                    className={`text-xs font-black truncate ${
                      isCurrent ? "text-[#0a3d24]" : isPassed ? "text-stone-900" : "text-stone-500"
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium line-clamp-1 pl-0.5">
                  {st.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔐 DOORSTEP OTP & RIDER DOCK */}
      <div className="p-4 sm:p-6 bg-white space-y-4">
        {/* Doorstep OTP Card (Only if order not completed) */}
        {!isDelivered && !isCancelled && order.deliveryOtp?.code && (
          <div className="bg-gradient-to-r from-emerald-950 via-[#0a3d24] to-emerald-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-sm border border-emerald-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                <ShieldCheck size={20} className="text-emerald-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[9.5px] font-black uppercase text-amber-300 bg-amber-400/10 border border-amber-300/30 px-2 py-0.2 rounded-full">
                  Doorstep Verification OTP
                </span>
                <h4 className="text-xs sm:text-sm font-black text-white mt-0.5">
                  Pehle Sabzi Check Karein, Fir OTP Dein
                </h4>
                <p className="text-[10.5px] text-emerald-200 font-medium">
                  Rider ko deliver hone par ye 4-digit security code bataayein.
                </p>
              </div>
            </div>

            {/* OTP Display + Copy Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                onClick={handleCopyOtp}
                className="bg-white hover:bg-emerald-50 text-stone-950 px-3.5 py-1.5 rounded-xl text-center cursor-pointer transition border-2 border-emerald-400 shadow-sm active:scale-95"
                title="Tap to copy OTP"
              >
                <span className="text-[8.5px] font-bold text-stone-400 block uppercase">
                  {copiedOtp ? "Copied!" : "Tap to Copy"}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-[#0a3d24]">
                  {order.deliveryOtp.code}
                </span>
              </div>

              {rider?.mobile && (
                <a
                  href={`https://wa.me/91${String(rider.mobile).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                    `*🌿 SubziQuick Delivery OTP*\n\nHi ${rider.name}, mera delivery OTP hai: *${order.deliveryOtp.code}* for Order #SZQ-${String(order._id).slice(-6).toUpperCase()}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white p-2.5 sm:px-3 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                  title="Share OTP on WhatsApp"
                >
                  <FaWhatsapp size={16} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 🛵 ASSIGNED RIDER & DIRECT ACTIONS */}
        {rider ? (
          <div className="bg-stone-50 rounded-2xl p-3.5 sm:p-4 border border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-[#0a3d24] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Truck size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase text-[#0a3d24] bg-emerald-100 px-2 py-0.2 rounded-full">
                    Verified Rider
                  </span>
                  <span className="text-[10.5px] text-stone-500 font-bold">
                    SubziQuick Bhopal Fleet
                  </span>
                </div>
                <h4 className="text-sm font-black text-stone-900 truncate mt-0.5">
                  {rider.name}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={`tel:${rider.mobile}`}
                className="flex-1 sm:flex-initial bg-[#0a3d24] hover:bg-[#072817] text-white px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <Phone size={13} />
                <span>Call Rider</span>
              </a>

              <a
                href={`https://wa.me/91${String(rider.mobile).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                  `Namaste ${rider.name}! SubziQuick order #SZQ-${String(order._id).slice(-6).toUpperCase()} ke baare me poochhna tha.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <FaWhatsapp size={15} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          !isDelivered &&
          !isCancelled && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock size={16} className="animate-pulse" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-stone-900">
                  Assigning Nearest Bhopal Delivery Partner...
                </h5>
                <p className="text-[11px] text-stone-500">
                  Order pack hote hi rider assign ho jayega (2-3 minutes).
                </p>
              </div>
            </div>
          )
        )}

        {/* 🌿 Bhopal Doorstep Freshness Promise */}
        <div className="pt-1 flex items-center justify-center gap-3 text-[10.5px] font-bold text-stone-500">
          <span className="flex items-center gap-1 text-[#0a3d24]">
            <ShieldCheck size={13} /> 100% Farm Fresh Taaza
          </span>
          <span>•</span>
          <span>No Chemicals / No Stale Stock</span>
        </div>
      </div>
    </div>
  );
}
