"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import ChatButton from "@/components/ChatButton";
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
  Coins,
  X,
  AlertCircle,
  Loader2,
  Star,
} from "lucide-react";
import Link from "next/link";
import OrderInvoiceModal from "@/components/OrderInvoiceModal";
import { segregateOrderProduce } from "@/lib/bagSegregation";
import ReviewProductModal from "@/components/ReviewProductModal";

const Livemap = dynamic(() => import("@/components/Livemap"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full bg-green-50 rounded-2xl flex items-center justify-center text-gray-400 font-medium">
      Loading Live Map...
    </div>
  ),
});

export default function TrackOrderPage() {
  const params = useParams();
  const { userdata } = useSelector((state: RootState) => state.user);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [cancelling, setCancelling] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<any>(null);

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
        alert("Order cancelled successfully. Stock has been restored.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50/50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-bold text-sm">Fetching Live Order Details...</p>
      </div>
    );
  }

  const order = data?.order;
  const status = data?.status || order?.status || "pending";
  const deliveryBoy = data?.deliveryBoy || order?.assigneddelliveryboy;

  const steps = [
    { title: "Order Placed", done: true },
    {
      title: "Preparing Order",
      done: status === "out of delivery" || status === "delivered" || status === "completed",
    },
    {
      title: "Out for Delivery",
      done: status === "out of delivery" || status === "delivered" || status === "completed",
    },
    {
      title: "Delivered",
      done: status === "delivered" || status === "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 via-white to-green-50/40 p-3.5 sm:p-4 md:p-8 pb-36 sm:pb-20 w-full max-w-full overflow-x-hidden font-sans">
      <div className="max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl transition mb-6 shadow-xs font-semibold text-sm"
        >
          <ArrowLeft size={16} /> Back To Home
        </Link>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200/80 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
            <div>
              <span className="text-xs font-extrabold text-[#0f8646] uppercase tracking-wider bg-green-100/70 px-3 py-1 rounded-full">
                LIVE ORDER TRACKING
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                Order #{String(params.id).slice(-6).toUpperCase()}
              </h1>
              {order?.createdAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {order && (
                <>
                  <a
                    href={`https://wa.me/919981418565?text=${encodeURIComponent(
                      `Hello SubziQuick Support! 🌿\n\nI need help regarding my Order #${String(
                        params.id
                      ).slice(-6).toUpperCase()}.\nAmount: ₹${order?.totalamount || 0}\nStatus: ${status.toUpperCase()}\n\nLive Tracking: https://subziquick.in/track/${params.id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#0c6a38] px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition shadow-2xs cursor-pointer border border-[#25D366]/30"
                    title="Chat with SubziQuick Support on WhatsApp"
                  >
                    <span className="text-sm">💬</span>
                    <span>WhatsApp Support</span>
                  </a>

                  <button
                    onClick={() => setShowInvoice(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition shadow-2xs cursor-pointer border border-gray-200"
                    title="View and Print Order Receipt"
                  >
                    <Printer size={14} className="text-[#0f8646]" />
                    <span>Invoice / Bill</span>
                  </button>
                </>
              )}

              <span
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${
                  status === "delivered" || status === "completed"
                    ? "bg-green-100 text-green-800"
                    : status === "out of delivery"
                    ? "bg-blue-100 text-blue-800 animate-pulse"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <Truck size={14} /> {status}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      step.done
                        ? "bg-[#0f8646] text-white"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {step.done ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs mt-2 font-semibold ${
                      step.done ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Completed Message */}
        {(status === "delivered" || status === "completed") && (
          <div className="bg-green-600 text-white rounded-3xl p-6 mb-6 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Order Delivered Successfully!</h3>
              <p className="text-green-100 text-xs mt-0.5">
                Thank you for choosing SubziQuick. Enjoy your farm-fresh groceries!
              </p>
            </div>
          </div>
        )}

        {/* Live Delivery Partner & Map Section */}
        {deliveryBoy ? (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#0f8646] flex items-center justify-center font-bold text-lg shadow-xs">
                  <Truck size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#0f8646] uppercase bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                    Delivery Partner Assigned
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mt-0.5">
                    {deliveryBoy.name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone size={12} /> {deliveryBoy.mobile}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${deliveryBoy.mobile}`}
                  className="inline-flex items-center gap-1.5 bg-green-50 text-[#0f8646] border border-green-200 hover:bg-[#0f8646] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Phone size={14} /> Call Rider
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
                  <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0f8646] text-white flex items-center justify-center font-black animate-pulse shrink-0">
                        <Truck size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase text-[#0f8646] bg-emerald-100 px-2 py-0.2 rounded-md">
                            Live GPS Transit
                          </span>
                          <span className="text-[11px] font-bold text-gray-500">
                            Speed: ~25 km/h
                          </span>
                        </div>
                        <p className="font-black text-xs sm:text-sm text-gray-900 mt-0.5">
                          Rider is <span className="text-[#0f8646]">{distKm} km away</span> • Doorstep Arrival in ~{etaMins} Mins
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-white border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Live Tracking</span>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Live Map */}
            {data?.customerLocation && deliveryBoy?.location?.coordinates && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner h-72 mb-4">
                <Livemap
                  customerLocation={data.customerLocation}
                  deliveryLocation={{
                    latitude: deliveryBoy.location.coordinates[1],
                    longitude: deliveryBoy.location.coordinates[0],
                  }}
                />
              </div>
            )}

            {/* Delivery OTP Prompt */}
            {order?.deliveryOtp?.code && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-amber-600" /> Delivery Verification OTP
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Share this code with the delivery partner upon arrival.
                  </p>
                </div>
                <div className="bg-white border-2 border-dashed border-amber-400 px-4 py-1.5 rounded-xl font-extrabold text-lg text-amber-800 tracking-widest">
                  {order.deliveryOtp.code}
                </div>
              </div>
            )}

            {/* ♻️ Zero-Plastic Eco-Bag Return Mission Card */}
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-base shrink-0">
                  ♻️
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>Return Old Eco-Bags & Earn ₹10 Cashback!</span>
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Hand over any previous SubziQuick cloth/eco-bags to the rider. Rider will mark it and ₹10 per bag will be instantly added to your GreenPoints Wallet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Waiting for Delivery Partner */
          status !== "delivered" &&
          status !== "completed" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200/80 mb-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-green-50 border-2 border-green-200 flex items-center justify-center text-[#0f8646] shrink-0 animate-pulse">
                <Clock size={32} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Assigning Delivery Partner...
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                  Our store team is currently picking and packing your fresh items. A delivery partner from SubziQuick Store will be assigned shortly!
                </p>
              </div>
            </div>
          )
        )}

        {/* Order Details & Summary */}
        {order && (
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Items List (7 Cols) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
              <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#0f8646]" /> Items in this Order ({order.items?.length || 0})
              </h3>

              <div className="space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl bg-white border border-gray-100"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{item.name}</h4>
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.quantity} × {item.variationWeight || item.unit || "unit"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="font-extrabold text-xs sm:text-sm text-gray-900">
                        ₹{item.price * item.quantity}
                      </span>
                      {(status === "delivered" || status === "completed") && (
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
                          className="text-[10px] font-black text-[#0f8646] hover:text-[#0c6a38] bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded-lg border border-green-200 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span>Rate ⭐</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 📦 Multi-Bag Freshness Packing Segregation */}
              {order?.items && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="text-[10px] font-black uppercase text-[#0f8646] tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                      📦 Multi-Bag Quality Segregation
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {(() => {
                      const bags = segregateOrderProduce(order.items);
                      return (
                        <>
                          {bags.bag1_leafy.length > 0 && (
                            <div className="p-2.5 bg-green-50/70 border border-green-200 rounded-xl">
                              <span className="font-black text-[11px] text-green-900 block mb-0.5">
                                🥬 Bag 1 (Soft / Leafy)
                              </span>
                              <span className="text-[10px] text-green-800">
                                {bags.bag1_leafy.map((i) => i.name).join(", ")}
                              </span>
                            </div>
                          )}
                          {bags.bag2_heavy.length > 0 && (
                            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                              <span className="font-black text-[11px] text-amber-900 block mb-0.5">
                                🥔 Bag 2 (Heavy Staples)
                              </span>
                              <span className="text-[10px] text-amber-800">
                                {bags.bag2_heavy.map((i) => i.name).join(", ")}
                              </span>
                            </div>
                          )}
                          {bags.bag3_dairy.length > 0 && (
                            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                              <span className="font-black text-[11px] text-blue-900 block mb-0.5">
                                🥛 Bag 3 (Chilled Dairy)
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

            {/* Address & Total (5 Cols) */}
            <div className="md:col-span-5 space-y-6">
              {/* Delivery Address & Time Slot */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                    <MapPin size={18} className="text-[#0f8646] shrink-0" /> Delivery Address
                  </h3>
                  <span className="text-[10px] font-black uppercase text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto max-w-full truncate">
                    {order.deliverySlot || "Same-Day Express Dispatch"}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-bold text-gray-900">{order.address?.fullname}</p>
                  <p className="break-words">{order.address?.fulladress}</p>
                  <p className="text-gray-500">
                    {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                  </p>
                  <p className="text-gray-500 flex items-center gap-1 pt-1">
                    <Phone size={12} className="shrink-0" /> {order.address?.mobile}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs">
                <h3 className="font-extrabold text-gray-900 text-base mb-3 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#0f8646] shrink-0" /> Payment Summary
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Payment Mode:</span>
                    <span className="font-bold uppercase text-gray-900">{order.paymentmethod}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-bold">
                      <span>Discount {order.couponCode && `(${order.couponCode})`}:</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                  {order.walletDiscount > 0 && (
                    <div className="flex justify-between items-center text-[#0f8646] font-bold">
                      <span>GreenPoints Wallet:</span>
                      <span>-₹{order.walletDiscount}</span>
                    </div>
                  )}
                  {order.bagReturnCashback > 0 && (
                    <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-xs">
                      <span>♻️ Eco-Bag Cashback ({order.bagsReturned} Bags):</span>
                      <span>+₹{order.bagReturnCashback}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-sm font-extrabold text-gray-900">
                    <span>Total Amount:</span>
                    <span className="text-[#0f8646] text-base font-black">
                      ₹{order.totalamount !== undefined && order.totalamount !== null && order.totalamount > 0
                        ? order.totalamount
                        : (order.items?.reduce((sum: number, i: any) => sum + ((Number(i.price) || 0) * (Number(i.quantity) || 1)), 0) || 0)}
                    </span>
                  </div>
                </div>

                {/* Cancel Button if still Pending */}
                {order.status === "pending" && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <X size={14} />
                    <span>Cancel This Order</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat with Delivery Partner */}
      {userdata?._id && deliveryBoy?._id && (
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Cancel Order #{order._id.slice(-6).toUpperCase()}?
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Are you sure you want to cancel this order? All reserved produce stock will be restored to Bhopal inventory.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-gray-700">
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
                      ? "border-red-500 bg-red-50/60 text-red-900"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{reason}</span>
                  <input
                    type="radio"
                    name="trackCancelReason"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="accent-red-600"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
              >
                No, Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel Order</span>
                )}
              </button>
            </div>
          </div>
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
    </div>
  );
}