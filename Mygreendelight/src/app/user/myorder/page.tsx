"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addMultipleToCart } from "@/redux/CartSlice";
import OrderInvoiceModal from "@/components/OrderInvoiceModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Phone,
  Truck,
  Package,
  ShoppingBag,
  Clock,
  Sparkles,
  ChevronRight,
  Printer,
  RotateCw,
  X,
  AlertCircle,
  Loader2,
  Star,
  Search,
  Check,
  ShieldCheck,
  Zap,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";


interface OrderItem {
  grocery: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  variationWeight?: string;
}

interface OrderType {
  _id: string;
  assigneddelliveryboy?: {
    _id: string;
    name: string;
    mobile: string;
  };
  items: OrderItem[];
  totalamount: number;
  paymentmethod: string;
  status: string;
  ispaid: boolean;
  paymentId?: string;
  paymentProofImage?: string;
  address: {
    fullname?: string;
    mobile?: string;
    fulladress: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  deliveryOtp?: {
    code?: string;
    verified?: boolean;
  };
  createdAt: string;
}

export default function MyOrder() {
  useGetMe();
  const router = useRouter();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state: RootState) => state.user);
  
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "delivered" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderType | null>(null);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [cancelling, setCancelling] = useState(false);

  // 💬 Customer Complaint & Help Modal State
  const [helpModalOrder, setHelpModalOrder] = useState<OrderType | null>(null);
  const [helpIssueType, setHelpIssueType] = useState("Damaged / Rotten Produce");
  const [helpDetails, setHelpDetails] = useState("");
  const [submittingHelp, setSubmittingHelp] = useState(false);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/user/myorder?_t=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      const list = Array.isArray(res.data) ? res.data : res.data?.orders || [res.data];
      list.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(list.filter(Boolean));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    setCancelling(true);
    try {
      const res = await axios.post("/api/user/cancel-order", {
        orderId: cancelModalOrder._id,
        reason: cancelReason,
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === cancelModalOrder._id ? { ...o, status: "cancelled" } : o
          )
        );
        showToast(`✓ Order #${cancelModalOrder._id.slice(-6).toUpperCase()} cancelled`);
        setCancelModalOrder(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  const handleRepeatOrder = (order: OrderType) => {
    if (!order.items || order.items.length === 0) return;

    const cartItemsToAdd: any[] = order.items.map((item: any) => {
      const weight = item.variationWeight || item.unit || "1 kg";
      const cartItemId = `${item.grocery || item._id}-${weight}`;
      return {
        _id: item.grocery || item._id,
        cartItemId,
        name: item.name,
        price: item.price,
        unit: weight,
        image: item.image,
        quantity: item.quantity || 1,
        stock: 50,
        category: "Produce",
        variation: {
          weight,
          price: item.price,
          stock: 50,
        },
      };
    });

    dispatch(addMultipleToCart(cartItemsToAdd));
    showToast(`✓ Added ${cartItemsToAdd.length} items to cart. Redirecting...`);
    setTimeout(() => {
      router.push("/user/cart");
    }, 800);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleWhatsAppHelp = () => {
    if (!helpModalOrder) return;
    const shortId = helpModalOrder._id.slice(-6).toUpperCase();
    const customerName = userdata?.name || helpModalOrder.address?.fullname || "Customer";
    const text = `*🌿 SubziQuick Customer Complaint / Help*\n\n*Order ID:* #SZQ-${shortId}\n*Customer:* ${customerName}\n*Issue:* ${helpIssueType}\n*Details:* ${helpDetails.trim() || "Need urgent resolution for this order."}\n\nPlease help me resolve this.`;
    window.open(`https://wa.me/919981418565?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleSubmitSupportTicket = async () => {
    if (!helpModalOrder) return;
    setSubmittingHelp(true);
    try {
      const shortId = helpModalOrder._id.slice(-6).toUpperCase();
      const customerName = userdata?.name || helpModalOrder.address?.fullname || "Customer";
      const customerPhone = userdata?.mobile || helpModalOrder.address?.mobile || "N/A";
      const customerEmail = userdata?.email || "customer@subziquick.in";

      await axios.post("/api/contact", {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        subject: `Order #${shortId} Issue: ${helpIssueType}`,
        message: helpDetails.trim() || `Customer reported: ${helpIssueType} for Order #${shortId}. Immediate action requested.`,
      });

      showToast("✅ Support complaint ticket submitted! Our Bhopal team will contact you shortly.");
      setHelpModalOrder(null);
      setHelpDetails("");
    } catch (err) {
      showToast("Failed to submit ticket. Please chat on WhatsApp.");
    } finally {
      setSubmittingHelp(false);
    }
  };


  // Filtered orders list based on active tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Tab filter
      const isDelivered = o.status === "delivered" || o.status === "completed";
      const isCancelled = o.status === "cancelled";
      const isActive = !isDelivered && !isCancelled;

      if (activeFilter === "active" && !isActive) return false;
      if (activeFilter === "delivered" && !isDelivered) return false;
      if (activeFilter === "cancelled" && !isCancelled) return false;

      // 2. Search query filter (Order ID or Produce Name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = o._id.toLowerCase().includes(query);
        const matchesItem = o.items?.some((i) =>
          i.name.toLowerCase().includes(query)
        );
        return matchesId || matchesItem;
      }

      return true;
    });
  }, [orders, activeFilter, searchQuery]);

  const activeCount = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "completed" && o.status !== "cancelled"
  ).length;

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-5xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 pb-32 sm:pb-16 w-full flex-1">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-emerald-50 text-[#0f8646] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                  <Zap size={11} className="fill-[#0f8646]" /> 10-15 Min Express Delivery
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] font-bold text-gray-500">
                  Bhopal, MP
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                My Orders & Deliveries
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Track live orders, repeat farm-fresh baskets & download invoices
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/shop"
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4.5 py-2.5 rounded-2xl font-black text-xs shadow-xs hover:shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <ShoppingBag size={14} />
                <span>Shop Fresh Produce</span>
              </Link>
            </div>
          </div>

          {/* Quick Tabs & Search Bar */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeFilter === "all"
                    ? "bg-gray-900 text-white shadow-2xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span>All Orders</span>
                <span className="text-[10px] opacity-75">({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveFilter("active")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeFilter === "active"
                    ? "bg-[#0f8646] text-white shadow-2xs"
                    : "bg-emerald-50 hover:bg-emerald-100 text-[#0f8646]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping inline-block" />
                <span>In-Transit / Active</span>
                {activeCount > 0 && (
                  <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {activeCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveFilter("delivered")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                  activeFilter === "delivered"
                    ? "bg-gray-900 text-white shadow-2xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span>Delivered</span>
              </button>

              <button
                onClick={() => setActiveFilter("cancelled")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                  activeFilter === "cancelled"
                    ? "bg-red-600 text-white shadow-2xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span>Cancelled</span>
              </button>
            </div>

            {/* Micro Search Input */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search order # or produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0f8646]/20 focus:border-[#0f8646] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Orders State Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
            <Loader2 size={32} className="animate-spin text-[#0f8646] mb-3" />
            <p className="text-xs font-bold text-gray-500">Loading your farm harvest orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs max-w-md mx-auto">
            <div className="w-14 h-14 bg-emerald-50 text-[#0f8646] rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-emerald-100 shadow-2xs">
              <Package size={26} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">
              {searchQuery ? "No matching orders found" : "No orders in this category"}
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed font-medium">
              {searchQuery
                ? `No orders matched "${searchQuery}". Try searching with another keyword or order ID.`
                : "Your fresh grocery deliveries and past receipts will show up here."}
            </p>
            <Link
              href="/shop"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>Explore Farm Produce</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isDelivered =
                order.status === "delivered" || order.status === "completed";
              const isOutForDelivery = order.status === "out of delivery";
              const isCancelled = order.status === "cancelled";
              const isPending = order.status === "pending";
              const isExpanded = openOrder === order._id;
              const totalItemsCount = (order.items || []).reduce(
                (acc, it) => acc + (it.quantity || 1),
                0
              );

              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isOutForDelivery
                      ? "border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20"
                      : "border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-gray-300"
                  }`}
                >
                  {/* 1. Header Strip: Order ID, Status, Payment, Date, and Amount */}
                  <div className="p-4 sm:p-5 pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                      
                      {/* Left: ID + Badges + Date */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-black text-sm sm:text-base text-gray-900 tracking-tight">
                            #SZQ-{order._id.slice(-6).toUpperCase()}
                          </span>

                          {/* Order Status Badge */}
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
                            {order.status}
                          </span>

                          {/* Payment Method Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                              order.ispaid
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : order.paymentmethod === "upi"
                                ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.ispaid
                              ? `✅ Paid (${(order.paymentmethod || "Online").toUpperCase()})`
                              : order.paymentmethod === "upi"
                              ? order.paymentProofImage || order.paymentId
                                ? `📱 UPI Submitted (Ref: ${String(order.paymentId || "Proof Attached").replace("UTR_", "")})`
                                : "🟠 UPI Verification Pending"
                              : "💵 Cash on Delivery"}
                          </span>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(order.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}</span>
                        </div>
                      </div>

                      {/* Right: Total Price */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">
                          Total Bill
                        </span>
                        <span className="text-lg sm:text-xl font-black text-[#0f8646] tracking-tight">
                          ₹{order.totalamount}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* 2. Visual Produce Preview Rail */}
                  <div className="px-4 sm:px-5 py-2.5 bg-gray-50/70 border-t border-b border-gray-100/90 flex items-center justify-between gap-3">
                    
                    {/* Item Thumbnails Scroll */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative w-11 h-11 rounded-xl bg-white border border-gray-200/80 shrink-0 p-1 flex items-center justify-center shadow-2xs group"
                          title={`${item.name} (${item.quantity}x)`}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80";
                              }}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <Package size={16} className="text-gray-400" />
                          )}
                          <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                            {item.quantity}
                          </span>
                        </div>
                      ))}

                      {/* Line Item Text summary */}
                      <div className="text-xs text-gray-600 font-bold pl-1.5 truncate max-w-[200px] sm:max-w-xs">
                        {order.items?.map((i) => i.name).slice(0, 2).join(", ")}
                        {(order.items?.length || 0) > 2 && (
                          <span className="text-gray-400 font-medium ml-1">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Accordion Toggle */}
                    <button
                      onClick={() => setOpenOrder(isExpanded ? null : order._id)}
                      className="text-xs font-black text-gray-500 hover:text-[#0f8646] flex items-center gap-1 shrink-0 py-1 px-2 rounded-lg hover:bg-white transition cursor-pointer"
                    >
                      <span className="hidden sm:inline">{isExpanded ? "Hide" : "Details"}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                  </div>

                  {/* 3. Rider Dock (Visible only if assigned & active) */}
                  {order.assigneddelliveryboy && !isDelivered && !isCancelled && (
                    <div className="mx-4 sm:mx-5 my-3 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#0f8646] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Truck size={17} />
                        </div>
                        <div>
                          <span className="text-[9.5px] font-black text-[#0f8646] uppercase tracking-wider block">
                            SubziQuick Express Rider
                          </span>
                          <span className="font-extrabold text-xs text-gray-900">
                            {order.assigneddelliveryboy.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.deliveryOtp?.code && !order.deliveryOtp?.verified && (
                          <div className="bg-white border-2 border-emerald-500 text-emerald-950 px-3 py-1 rounded-xl shadow-2xs flex items-center gap-1.5" title="Doorstep Verification OTP">
                            <span className="text-[9px] font-black uppercase text-emerald-700">OTP</span>
                            <span className="font-mono text-sm font-black tracking-widest text-[#0f8646]">{order.deliveryOtp.code}</span>
                          </div>
                        )}
                        <a
                          href={`tel:${order.assigneddelliveryboy.mobile}`}
                          className="bg-white border border-emerald-300 text-[#0f8646] hover:bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                        >
                          <Phone size={12} />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 4. Action Buttons Toolbar */}
                  <div className="p-4 sm:p-5 pt-3 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    
                    {/* Primary Action Button */}
                    {!isDelivered && !isCancelled ? (
                      <Link
                        href={`/track/${order._id}`}
                        className="flex-1 bg-[#0f8646] hover:bg-[#0c6a38] active:scale-98 text-white py-2.5 px-4 rounded-xl text-xs font-black shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Truck size={14} />
                        <span>Track Live Delivery</span>
                      </Link>
                    ) : isDelivered ? (
                      <Link
                        href={`/track/${order._id}`}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 active:scale-98 text-amber-900 border border-amber-200 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 text-center shadow-2xs"
                      >
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        <span>Rate & View Bill</span>
                      </Link>
                    ) : (
                      <div className="flex-1 bg-gray-100 text-gray-400 py-2.5 px-4 rounded-xl text-xs font-bold text-center cursor-default">
                        Order Cancelled
                      </div>
                    )}

                    {/* Secondary 1: Quick Repeat Basket */}
                    <button
                      onClick={() => handleRepeatOrder(order)}
                      className="bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-[#0f8646] border border-emerald-200 py-2.5 px-3.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Reorder fresh basket"
                    >
                      <RotateCw size={13} />
                      <span className="font-extrabold">Reorder</span>
                    </button>

                    {/* Secondary 2: Tax Invoice */}
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 border border-gray-200 py-2.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="View Invoice"
                    >
                      <Printer size={13} className="text-[#0f8646]" />
                      <span className="hidden sm:inline">Receipt</span>
                    </button>

                    {/* Secondary 3: Need Help / Report Issue */}
                    <button
                      onClick={() => setHelpModalOrder(order)}
                      className="bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 border border-amber-200 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                      title="Report an issue or complaint for this order"
                    >
                      <HelpCircle size={13} className="text-amber-600" />
                      <span>Need Help?</span>
                    </button>

                    {/* Secondary 4: Cancel Order (Only if Pending) */}
                    {isPending && (
                      <button
                        onClick={() => setCancelModalOrder(order)}
                        className="bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 border border-rose-200 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                        title="Cancel Order"
                      >
                        <X size={13} />
                        <span>Cancel</span>
                      </button>
                    )}


                  </div>

                  {/* 5. Expanded Line-Item Details Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-5 space-y-3"
                      >
                        {/* Address Pill */}
                        <div className="text-[11px] text-gray-600 bg-white rounded-xl p-3 flex items-start gap-2.5 border border-gray-200/80 shadow-2xs">
                          <MapPin size={14} className="text-[#0f8646] shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-gray-900 block mb-0.5">
                              Delivery Destination:
                            </span>
                            <p className="text-gray-600 leading-relaxed">
                              {order.address?.fulladress || "Bhopal, MP"}
                            </p>
                          </div>
                        </div>

                        {/* Line Items List */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block px-1">
                            Items in Order ({order.items?.length || 0})
                          </span>
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-100 text-xs shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 object-contain rounded-lg bg-gray-50 border border-gray-100 p-0.5"
                                  />
                                )}
                                <div>
                                  <h5 className="font-bold text-gray-900">{item.name}</h5>
                                  <p className="text-[10px] text-gray-500">
                                    {item.quantity} × {item.variationWeight || item.unit}
                                  </p>
                                </div>
                              </div>
                              <span className="font-black text-gray-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        )}

      </main>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-gray-950 text-white px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-gray-800"
          >
            <Sparkles size={15} className="text-emerald-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <OrderInvoiceModal
          order={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrder && (
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
              Cancel Order #SZQ-{cancelModalOrder._id.slice(-6).toUpperCase()}?
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Are you sure you want to cancel this order? Produce stock will be immediately released.
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
                    name="cancelReason"
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
                onClick={() => setCancelModalOrder(null)}
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

      {/* 💬 Order Help & Complaint Resolution Modal */}
      {helpModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Need Help with Order #SZQ-{helpModalOrder._id.slice(-6).toUpperCase()}?
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Bhopal Customer Support & Instant Resolution
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3 font-medium">
              What issue did you experience with this delivery?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {[
                { label: "Damaged / Rotten Produce", icon: "🥬" },
                { label: "Missing Item in Delivery", icon: "📦" },
                { label: "Delivery Delay / Rider Issue", icon: "🛵" },
                { label: "Refund / Payment Inquiry", icon: "💳" },
                { label: "Wrong Item Delivered", icon: "🔄" },
                { label: "General Feedback", icon: "💬" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setHelpIssueType(item.label)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left flex items-center gap-2.5 transition cursor-pointer ${
                    helpIssueType === item.label
                      ? "border-[#0f8646] bg-emerald-50 text-[#0f8646] shadow-2xs font-extrabold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                Additional Details / Description (Optional):
              </label>
              <textarea
                value={helpDetails}
                onChange={(e) => setHelpDetails(e.target.value)}
                placeholder="E.g., 500g tomatoes were squashed, or rider arrived late..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] focus:ring-1 focus:ring-[#0f8646] transition resize-none text-gray-800"
              />
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Direct WhatsApp Chat */}
              <button
                type="button"
                onClick={handleWhatsAppHelp}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <FaWhatsapp size={16} />
                <span>Instant WhatsApp Resolution (&lt; 2 Mins)</span>
              </button>

              {/* Option 2: Submit in-app support ticket */}
              <button
                type="button"
                onClick={handleSubmitSupportTicket}
                disabled={submittingHelp}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submittingHelp ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[#0f8646]" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={14} className="text-[#0f8646]" />
                    <span>Submit Formal Support Ticket</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>

  );
}