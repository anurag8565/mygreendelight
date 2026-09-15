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
import LiveOrderPulseTracker from "@/components/LiveOrderPulseTracker";

const Livemap = dynamic(() => import("@/components/Livemap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 sm:h-72 w-full bg-emerald-50/50 rounded-2xl flex flex-col items-center justify-center text-emerald-800 font-bold text-xs gap-2 border border-emerald-100">
      <Loader2 size={24} className="animate-spin text-[#0a3d24]" />
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
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-[#0a3d24] flex items-center justify-center mb-4 shadow-2xs border border-emerald-200">
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
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-[#0a3d24] bg-white hover:bg-emerald-50/60 px-3 py-1.5 rounded-xl border border-gray-200/80 transition shadow-2xs cursor-pointer"
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
              <Printer size={13} className="text-[#0a3d24]" />
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

        {/* 1. Hyper-Attractive Live Animated Pulse Radar & 4-Stage Stepper */}
        <div className="mb-5">
          <LiveOrderPulseTracker
            order={order}
            customerLocation={data?.customerLocation}
          />
        </div>

        {/* 3. Live GPS Rider Dock & Realtime Map Section */}
        {deliveryBoy && !isCancelled ? (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs mb-5">
            
            {/* Rider Identity Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#0a3d24] flex items-center justify-center font-bold text-lg shadow-2xs border border-emerald-200/80 shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] font-black text-[#0a3d24] uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
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
                  className="bg-[#0a3d24] hover:bg-[#072817] active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Phone size={13} />
                  <span>Call Rider ({deliveryBoy.mobile})</span>
                </a>
              </div>
            </div>

            {/* Live Distance & ETA Radar Badge */}
            {(() => {
              // Support both object { latitude, longitude } and array [lat, lng] / [lng, lat]
              const rawCust = data?.customerLocation;
              const custLat = Number(rawCust?.latitude ?? (Array.isArray(rawCust) ? rawCust[0] : null));
              const custLng = Number(rawCust?.longitude ?? (Array.isArray(rawCust) ? rawCust[1] : null));

              const riderCoords = deliveryBoy?.location?.coordinates;
              const riderLng = Number(Array.isArray(riderCoords) ? riderCoords[0] : (deliveryBoy?.location as any)?.longitude);
              const riderLat = Number(Array.isArray(riderCoords) ? riderCoords[1] : (deliveryBoy?.location as any)?.latitude);

              let distKm = 1.2;
              let etaMins = 8;
              let hasExactGPS = false;

              if (
                !isNaN(custLat) && !isNaN(custLng) && custLat && custLng &&
                !isNaN(riderLat) && !isNaN(riderLng) && riderLat && riderLng
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
                const calcDist = 6371 * c;
                distKm = isNaN(calcDist) ? 1.2 : Math.max(0.2, Number(calcDist.toFixed(1)));
                etaMins = Math.max(3, Math.round(distKm * 2.8 + 2));
                hasExactGPS = true;
              }

              return (
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 sm:p-3.5 mb-4 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#0a3d24] text-white flex items-center justify-center shrink-0">
                      <Navigation size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-xs sm:text-sm text-gray-900 truncate">
                        Rider is <span className="text-[#0a3d24] font-black">{hasExactGPS ? `${distKm} km away` : "On the way in Bhopal"}</span>
                      </p>
                      <span className="text-[10.5px] text-gray-500 font-medium block">
                        Estimated Arrival: ~{etaMins} Mins • 10-15 Min Express Route
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-[10.5px] font-black text-emerald-900 bg-white border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{hasExactGPS ? "Live GPS" : "Assigned"}</span>
                  </div>
                </div>
              );
            })()}

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
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0a3d24] flex items-center justify-center shrink-0">
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
                  <Package size={16} className="text-[#0a3d24]" />
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
                          className="text-[10px] font-black text-[#0a3d24] hover:text-[#072817] bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 transition cursor-pointer flex items-center gap-1 shadow-2xs"
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
                  <span className="text-[10px] font-black uppercase text-[#0a3d24] tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-2.5">
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
                    <MapPin size={14} className="text-[#0a3d24]" />
                    <span>Destination</span>
                  </h3>
                  <span className="text-[9.5px] font-black uppercase text-[#0a3d24] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
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
                    <Phone size={11} className="text-[#0a3d24]" /> {order.address?.mobile}
                  </p>
                </div>
              </div>

              {/* Bill & Payment Summary */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-[#0a3d24]" />
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
                        ? `✅ Payment Verified & Received (₹${order.totalamount})`
                        : order.paymentmethod === "upi"
                        ? order.paymentProofImage || order.paymentId
                          ? "📱 Online UPI Submitted (Verification at delivery)"
                          : "🟠 Verification Pending"
                        : `🟡 Pay ₹${order.totalamount} Cash/UPI at Doorstep`}
                    </span>
                  </div>

                  {order.paymentmethod === "upi" && !order.ispaid && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                      <p className="font-bold flex items-center gap-1 text-amber-800 mb-0.5">
                        <span>📱 Online UPI Payment Submitted</span>
                      </p>
                      <p>
                        Aapka payment screenshot submit ho gaya hai. Rider aane par apna 4-digit OTP share karein, koi extra cash pay na karein.
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
                    <span className="text-base font-black text-[#0a3d24]">
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
