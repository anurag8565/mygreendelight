"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Truck,
  Package,
  ShieldCheck,
  CreditCard,
  User as UserIcon,
  Sparkles,
  Printer,
  X,
  AlertCircle,
  ShieldAlert,
  Loader2,
  Star,
  MessageCircle,
  ChevronRight,
  Zap,
  Check,
  Navigation,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";
import OrderInvoiceModal from "@/components/OrderInvoiceModal";
import { segregateOrderProduce } from "@/lib/bagSegregation";
import ReviewProductModal from "@/components/ReviewProductModal";

const Livemap = dynamic(() => import("@/components/Livemap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 sm:h-72 w-full bg-emerald-50/50 rounded-2xl flex flex-col items-center justify-center text-emerald-800 font-bold text-xs gap-2 border border-emerald-100">
      <Loader2 size={24} className="animate-spin text-[#0f8646]" />
      <span>Connecting to Live Bhopal GPS...</span>
    </div>
  ),
});

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { userdata } = useSelector((state: RootState) => state.user);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [cancelling, setCancelling] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<any>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  const fetchTracking = async () => {
    try {
      const result = await axios.get(`/api/user/trackorder/${params.id}`);
      setData(result.data);
    } catch (error) {
      console.error("Track order error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!data?.order?._id) return;
    setCancelling(true);
    try {
      const res = await axios.post("/api/user/cancel-order", {
        orderId: data.order._id,
        reason: cancelReason,
      });
      if (res.data.success) {
        setData((prev: any) => ({
          ...prev,
          order: { ...prev.order, status: "cancelled" },
        }));
        setShowCancelModal(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    fetchTracking();

    const interval = setInterval(() => {
      // ⚡ Battery & Bandwidth Optimization: Only poll when tab is active and order is ongoing
      if (document.visibilityState === "visible") {
        if (data?.order?.status !== "delivered" && data?.order?.status !== "cancelled") {
          fetchTracking();
        }
      }
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTracking();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [params.id, data?.order?.status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
        <Nav user={(userdata as any) || { role: "user" }} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-[#0f8646] flex items-center justify-center mb-4 shadow-2xs border border-emerald-200">
            <Loader2 size={28} className="animate-spin stroke-[2.5]" />
          </div>
          <h2 className="text-base font-black text-gray-900">Connecting to Bhopal Live Transit...</h2>
          <p className="text-xs text-gray-500 mt-1">Fetching driver coordinates & order status</p>
        </div>
        <Footer />
      </div>
    );
  }

  const order = data?.order;
  const status = data?.status || order?.status || "pending";
  const deliveryBoy = data?.deliveryBoy || order?.assigneddelliveryboy;
  const isDelivered = status === "delivered" || status === "completed";
  const isOutForDelivery = status === "out of delivery";
  const isCancelled = status === "cancelled";

  const steps = [
    { title: "Placed", desc: "Received", done: true },
    {
      title: "Packing",
      desc: "Hand Graded",
      done: status === "out of delivery" || isDelivered,
    },
    {
      title: "In-Transit",
      desc: "Rider on Way",
      done: status === "out of delivery" || isDelivered,
    },
    {
      title: "Delivered",
      desc: "At Doorstep",
      done: isDelivered,
    },
  ];

  // Calculate current active step index (0 to 3)
  const currentStepIndex = isCancelled
    ? -1
    : isDelivered
    ? 3
    : isOutForDelivery
    ? 2
    : status === "pending"
    ? 0
    : 1;

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 py-5 sm:py-7 pb-32 sm:pb-16 w-full flex-1">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Link
            href="/user/myorder"
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-[#0f8646] bg-white hover:bg-emerald-50/60 px-3 py-1.5 rounded-xl border border-gray-200/80 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>All Orders</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvoice(true)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border border-gray-200 cursor-pointer"
              title="View Invoice"
            >
              <Printer size={13} className="text-[#0f8646]" />
              <span className="hidden sm:inline">Bill / Receipt</span>
            </button>

            {order && (
              <a
                href={`https://wa.me/919981418565?text=${encodeURIComponent(
                  `Hello SubziQuick Support, I need help with my Order #${params.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <FaWhatsapp size={14} />
                <span className="hidden sm:inline">WhatsApp Help</span>
              </a>
            )}
          </div>
        </div>

        {/* 1. Hero Status Card & Interactive Stepper */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs mb-5 overflow-hidden relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono font-black text-sm sm:text-base text-gray-900 tracking-tight">
                  #SZQ-{String(params.id).slice(-6).toUpperCase()}
                </span>
                
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                    isDelivered
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : isOutForDelivery
                      ? "bg-emerald-600 text-white shadow-2xs animate-pulse"
                      : isCancelled
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-900 border border-amber-200"
                  }`}
                >
                  {isDelivered && <Check size={10} className="stroke-[3]" />}
                  {isOutForDelivery && <Truck size={10} />}
                  {status}
                </span>

                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {order?.createdAt &&
                    new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {isDelivered
                  ? "Delivered to your Doorstep! 🎉"
                  : isOutForDelivery
                  ? "Out for Express Delivery 🛵"
                  : isCancelled
                  ? "Order Cancelled"
                  : "Harvest Packed & Assigning Rider 🌿"}
              </h1>
            </div>

            {/* Total Amount Pill */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 px-4 py-2 rounded-2xl flex items-center gap-3 self-start sm:self-auto shrink-0">
              <div>
                <span className="text-[9.5px] uppercase font-black tracking-wider text-emerald-900/60 block">
                  Total Bill
                </span>
                <span className="text-base sm:text-lg font-black text-[#0f8646]">
                  ₹{order?.totalamount || 0}
                </span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${
                order?.ispaid
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : order?.paymentmethod === "upi"
                  ? "bg-amber-50 text-amber-900 border-amber-300 animate-pulse"
                  : "bg-white text-gray-800 border-gray-200"
              }`}>
                {order?.ispaid
                  ? "✅ PAID ONLINE"
                  : order?.paymentmethod === "upi"
                  ? "🟠 UPI AWAITING VERIFICATION"
                  : "💵 CASH ON DELIVERY"}
              </span>
            </div>
          </div>

          {/* Stepper Timeline with Connecting Fill Bar */}
          {!isCancelled ? (
            <div className="py-2">
              <div className="relative flex items-center justify-between">
                
                {/* Background Track */}
                <div className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-gray-100 w-full z-0 rounded-full" />
                
                {/* Active Progress Bar */}
                <div
                  className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-[#0f8646] transition-all duration-500 z-0 rounded-full"
                  style={{
                    width:
                      currentStepIndex === 0
                        ? "10%"
                        : currentStepIndex === 1
                        ? "38%"
                        : currentStepIndex === 2
                        ? "70%"
                        : "100%",
                  }}
                />

                {steps.map((step, idx) => {
                  const isPassed = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center relative z-10"
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-2xs ${
                          isCurrent
                            ? "bg-[#0f8646] text-white ring-4 ring-emerald-100 scale-110"
                            : isPassed
                            ? "bg-[#0f8646] text-white"
                            : "bg-white text-gray-400 border border-gray-200"
                        }`}
                      >
                        {isPassed ? <Check size={14} className="stroke-[3]" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10.5px] sm:text-xs mt-2 font-black ${
                          isPassed ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[9.5px] text-gray-400 font-medium hidden sm:block">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center text-rose-800 text-xs font-bold">
              This order has been cancelled. Produce stock was returned to store inventory.
            </div>
          )}

        </div>

        {/* 2. Live Doorstep Delivery OTP Card (Only if order not finished) */}
        {!isDelivered && !isCancelled && order?.deliveryOtp?.code && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-950 via-[#032312] to-emerald-900 text-white rounded-3xl p-5 sm:p-6 mb-5 shadow-md border border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                <ShieldCheck size={22} className="text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                  <span className="text-[9.5px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full tracking-wider border border-emerald-400/20">
                    Doorstep Verification
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Share OTP with rider upon delivery arrival
                </h3>
                <p className="text-[11px] text-emerald-200/80 font-medium">
                  Inspect your farm-fresh harvest first, then share this 4-digit security code.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center sm:justify-end">
              {/* Main OTP Pill */}
              <div
                onClick={() => {
                  if (order.deliveryOtp?.code) {
                    navigator.clipboard.writeText(order.deliveryOtp.code);
                    setCopiedOtp(true);
                    setTimeout(() => setCopiedOtp(false), 2500);
                  }
                }}
                className="bg-white text-[#0f8646] px-4 py-2 rounded-2xl shadow-md border-2 border-emerald-400 text-center cursor-pointer hover:bg-emerald-50/50 transition group"
                title="Click to copy OTP"
              >
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-gray-400">
                    DELIVERY OTP
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-md">
                    {copiedOtp ? "✓ Copied!" : "Click to Copy"}
                  </span>
                </div>
                <span className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-emerald-950 block">
                  {order.deliveryOtp.code}
                </span>
              </div>

              {/* 1-Click WhatsApp OTP to Rider */}
              {deliveryBoy?.mobile && (
                <a
                  href={`https://wa.me/91${deliveryBoy.mobile.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                    `*🌿 SubziQuick Delivery OTP*\n\nHi ${deliveryBoy.name}, my 4-digit Delivery OTP is: *${order.deliveryOtp.code}* for Order #SZQ-${String(params.id).slice(-6).toUpperCase()}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-[10.5px] font-black px-3 py-3 rounded-2xl border border-emerald-500 transition cursor-pointer flex flex-col items-center justify-center gap-0.5 shadow-2xs"
                  title="Send OTP to Rider on WhatsApp"
                >
                  <FaWhatsapp size={15} />
                  <span>WhatsApp</span>
                </a>
              )}

              {/* Resend Email OTP */}
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(`/api/delivery/send-delivery-otp/${params.id}`);
                    alert(res.data.message || "OTP sent to your email & phone!");
                  } catch (e: any) {
                    alert(e.response?.data?.message || "Failed to resend OTP");
                  }
                }}
                className="bg-emerald-800/90 hover:bg-emerald-700 active:scale-95 text-white text-[10.5px] font-black px-3 py-3 rounded-2xl border border-emerald-600/80 transition cursor-pointer flex flex-col items-center justify-center gap-0.5 shadow-2xs"
                title="Resend OTP to Email / SMS"
              >
                <span>📩</span>
                <span>Resend</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. Live GPS Rider Dock & Realtime Map Section */}
        {deliveryBoy && !isCancelled ? (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs mb-5">
            
            {/* Rider Identity Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-bold text-lg shadow-2xs border border-emerald-200/80 shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] font-black text-[#0f8646] uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Assigned Rider
                    </span>
                    <span className="text-[10.5px] font-bold text-gray-500">
                      SubziQuick Bhopal Fleet
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 text-base mt-0.5">
                    {deliveryBoy.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${deliveryBoy.mobile}`}
                  className="bg-[#0f8646] hover:bg-[#0c6a38] active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Phone size={13} />
                  <span>Call Rider ({deliveryBoy.mobile})</span>
                </a>
              </div>
            </div>

            {/* Live Distance & ETA Radar Badge */}
            {data?.customerLocation && deliveryBoy?.location?.coordinates && (
              (() => {
                const lat1 = data.customerLocation[0];
                const lon1 = data.customerLocation[1];
                const lat2 = deliveryBoy.location.coordinates[1];
                const lon2 = deliveryBoy.location.coordinates[0];
                
                const dLat = ((lat2 - lat1) * Math.PI) / 180;
                const dLon = ((lon2 - lon1) * Math.PI) / 180;
                const a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos((lat1 * Math.PI) / 180) *
                    Math.cos((lat2 * Math.PI) / 180) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distKm = Math.max(0.3, Number((6371 * c).toFixed(1)));
                const etaMins = Math.max(2, Math.round(distKm * 2.8 + 2));

                return (
                  <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 sm:p-3.5 mb-4 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#0f8646] text-white flex items-center justify-center shrink-0">
                        <Navigation size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-xs sm:text-sm text-gray-900 truncate">
                          Rider is <span className="text-[#0f8646] font-black">{distKm} km away</span>
                        </p>
                        <span className="text-[10.5px] text-gray-500 font-medium block">
                          Estimated Arrival: ~{etaMins} Mins • 10-15 Min Express Route
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-[10.5px] font-black text-emerald-900 bg-white border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Live GPS</span>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Live Interactive Map */}
            {data?.customerLocation && deliveryBoy?.location?.coordinates && (
              <div className="rounded-2xl overflow-hidden border border-gray-200/90 shadow-inner h-64 sm:h-72 mb-3">
                <Livemap
                  customerLocation={data.customerLocation}
                  deliveryLocation={{
                    latitude: deliveryBoy.location.coordinates[1],
                    longitude: deliveryBoy.location.coordinates[0],
                  }}
                />
              </div>
            )}

          </div>
        ) : (
          /* Waiting for Delivery Partner */
          !isDelivered && !isCancelled && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs mb-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0f8646] flex items-center justify-center shrink-0">
                <Clock size={24} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-gray-900">
                  Assigning Nearest Bhopal Rider...
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  We are hand-sorting and packing your fresh harvest. A rider will be assigned in 2-3 minutes.
                </p>
              </div>
            </div>
          )
        )}

        {/* 4. Two-Column Details Grid (Produce Items + Address & Bill Summary) */}
        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Produce Items & Multi-Bag Segregation (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <Package size={16} className="text-[#0f8646]" />
                  <span>Items in this Harvest ({order.items?.length || 0})</span>
                </h3>
                <span className="text-[11px] font-bold text-gray-500">
                  Total: {order.items?.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0)} Units
                </span>
              </div>

              <div className="space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white border border-gray-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80";
                          }}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-gray-900 text-xs truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10.5px] text-gray-500">
                          {item.quantity} × {item.variationWeight || item.unit || "unit"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-black text-xs sm:text-sm text-gray-900">
                        ₹{item.price * item.quantity}
                      </span>
                      {isDelivered && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReviewProduct({
                              _id: item.grocery || item._id,
                              name: item.name,
                              image: item.image,
                              unit: item.variationWeight || item.unit,
                            })
                          }
                          className="text-[10px] font-black text-[#0f8646] hover:text-[#0c6a38] bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span>Rate</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Multi-Bag Quality Segregation */}
              {order?.items && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[10px] font-black uppercase text-[#0f8646] tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-2.5">
                    📦 Multi-Bag Packing
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {(() => {
                      const bags = segregateOrderProduce(order.items);
                      return (
                        <>
                          {bags.bag1_leafy.length > 0 && (
                            <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                              <span className="font-black text-[10.5px] text-emerald-950 block mb-0.5">
                                🥬 Bag 1: Leafy Greens
                              </span>
                              <span className="text-[10px] text-emerald-800">
                                {bags.bag1_leafy.map((i) => i.name).join(", ")}
                              </span>
                            </div>
                          )}
                          {bags.bag2_heavy.length > 0 && (
                            <div className="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                              <span className="font-black text-[10.5px] text-amber-950 block mb-0.5">
                                🥔 Bag 2: Heavy Staples
                              </span>
                              <span className="text-[10px] text-amber-800">
                                {bags.bag2_heavy.map((i) => i.name).join(", ")}
                              </span>
                            </div>
                          )}
                          {bags.bag3_dairy.length > 0 && (
                            <div className="p-2.5 bg-blue-50/60 border border-blue-200/80 rounded-xl">
                              <span className="font-black text-[10.5px] text-blue-950 block mb-0.5">
                                🥛 Bag 3: Chilled Dairy
                              </span>
                              <span className="text-[10px] text-blue-800">
                                {bags.bag3_dairy.map((i) => i.name).join(", ")}
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Address & Bill Summary (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Delivery Address Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#0f8646]" />
                    <span>Destination</span>
                  </h3>
                  <span className="text-[9.5px] font-black uppercase text-[#0f8646] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
                    {order.deliverySlot || "10-15 Min Express"}
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-0.5">
                  <p className="font-bold text-gray-900">{order.address?.fullname || "Customer"}</p>
                  <p className="leading-relaxed text-gray-600">{order.address?.fulladress}</p>
                  <p className="text-gray-400 text-[11px]">
                    {order.address?.city || "Bhopal"}, {order.address?.state || "MP"} {order.address?.pincode}
                  </p>
                  <p className="text-gray-600 flex items-center gap-1 pt-1.5 font-bold">
                    <Phone size={11} className="text-[#0f8646]" /> {order.address?.mobile}
                  </p>
                </div>
              </div>

              {/* Bill & Payment Summary */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-[#0f8646]" />
                  <span>Payment Breakdown</span>
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Payment Mode:</span>
                    <span className="font-black uppercase text-gray-900">
                      {order.paymentmethod || "COD"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Payment Status:</span>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border ${
                      order.ispaid
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : order.paymentmethod === "upi"
                        ? "bg-amber-50 text-amber-900 border-amber-300"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}>
                      {order.ispaid
                        ? "✅ Payment Verified & Received"
                        : order.paymentmethod === "upi"
                        ? "🟠 Verification Pending (Admin checking screenshot)"
                        : "🟡 Unpaid (Pay Cash / UPI at Doorstep)"}
                    </span>
                  </div>

                  {order.paymentmethod === "upi" && !order.ispaid && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                      <p className="font-bold flex items-center gap-1 text-amber-800 mb-0.5">
                        <span>⚠️ Payment Verification in Progress</span>
                      </p>
                      <p>
                        Aapka screenshot admin verify kar raha hai. Agar screenshot match nahi hota, toh rider aane par doorstep par pay karna hoga.
                      </p>
                    </div>
                  )}

                  {order.discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold">
                      <span>Promo Discount {order.couponCode && `(${order.couponCode})`}:</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2.5 border-t border-gray-100 text-sm font-black text-gray-900">
                    <span>Amount Payable:</span>
                    <span className="text-base font-black text-[#0f8646]">
                      ₹{order.totalamount || 0}
                    </span>
                  </div>
                </div>

                {/* Cancel Button (Only if Pending) */}
                {order.status === "pending" && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full mt-4 bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 border border-rose-200 py-2.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <X size={13} />
                    <span>Cancel This Order</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Floating Chat Button */}
      {userdata?._id && deliveryBoy?._id && !isCancelled && (
        <ChatButton
          orderId={String(params.id)}
          userId={userdata._id}
          deliveryBoyId={deliveryBoy._id}
        />
      )}

      {/* Invoice Modal */}
      {order && (
        <OrderInvoiceModal
          order={order}
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      )}

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && order && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3.5">
              <AlertCircle size={22} />
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Cancel Order #SZQ-{order._id.slice(-6).toUpperCase()}?
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Are you sure you want to cancel? All reserved fresh produce will be released.
            </p>

            <div className="space-y-2 mb-5">
              <label className="block text-[11px] font-black uppercase text-gray-400 tracking-wider">
                Reason for cancellation:
              </label>
              {[
                "Ordered by mistake",
                "Want to change delivery time slot",
                "Need to add more produce items",
                "Address changed",
                "Other",
              ].map((reason) => (
                <label
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition ${
                    cancelReason === reason
                      ? "border-rose-500 bg-rose-50/60 text-rose-900"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{reason}</span>
                  <input
                    type="radio"
                    name="trackCancelReason"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="accent-rose-600"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Cancel Order</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review Product Modal */}
      {selectedReviewProduct && (
        <ReviewProductModal
          isOpen={!!selectedReviewProduct}
          product={selectedReviewProduct}
          onClose={() => setSelectedReviewProduct(null)}
          onSuccess={() => {
            fetchTracking();
          }}
        />
      )}

      <Footer />
    </div>
  );
}