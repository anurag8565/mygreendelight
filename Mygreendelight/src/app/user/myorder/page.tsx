"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addMultipleToCart } from "@/redux/CartSlice";
import OrderInvoiceModal from "@/components/OrderInvoiceModal";
import {
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Phone,
  Truck,
  ArrowLeft,
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
} from "lucide-react";

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
  address: {
    fullname?: string;
    mobile?: string;
    fulladress: string;
    city?: string;
    state?: string;
    pincode?: string;
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
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderType | null>(null);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [cancelling, setCancelling] = useState(false);

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
        setToastMsg(`✓ Order #${cancelModalOrder._id.slice(-6).toUpperCase()} cancelled and produce stock restored.`);
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
    setToastMsg(`✓ Added ${cartItemsToAdd.length} produce item(s) to Cart! Taking you to checkout...`);
    setTimeout(() => {
      router.push("/user/cart");
    }, 1000);
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get("/api/user/myorder");
        const list = Array.isArray(res.data) ? res.data : [res.data];
        // Sort newest first
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

    getOrders();
  }, []);

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#0f8646] transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-extrabold">My Orders</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Order History & Deliveries
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Track active 10-minute deliveries and view past grocery invoices
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 bg-green-50 text-[#0f8646] hover:bg-green-100 px-4 py-2 rounded-xl text-xs font-extrabold transition"
          >
            <ShoppingBag size={14} />
            <span>Shop Fresh Produce</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#0f8646] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-500 font-bold">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 bg-green-50 text-[#0f8646] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={30} />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              When you order farm-fresh groceries, they will appear here with live GPS tracking.
            </p>
            <Link
              href="/shop"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-md transition inline-flex items-center gap-2"
            >
              <ShoppingBag size={14} />
              <span>Explore Farm Harvest</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isDelivered =
                order.status === "delivered" || order.status === "completed";
              const isOutForDelivery = order.status === "out of delivery";
              const isExpanded = openOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs hover:shadow-md transition-all"
                >
                  {/* Order Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-black text-base text-gray-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isDelivered
                              ? "bg-green-100 text-green-800"
                              : isOutForDelivery
                              ? "bg-blue-100 text-blue-800 animate-pulse"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.ispaid
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.ispaid ? "Paid" : "Pay on Delivery"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{new Date(order.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {/* Cancel Order Button (Only for Pending Orders) */}
                      {order.status === "pending" && (
                        <button
                          onClick={() => setCancelModalOrder(order)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Cancel this pending order"
                        >
                          <X size={13} />
                          <span>Cancel</span>
                        </button>
                      )}

                      {/* Repeat Order Button */}
                      <button
                        onClick={() => handleRepeatOrder(order)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-[#0f8646] border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Add all items from this order back to Cart"
                      >
                        <RotateCw size={13} />
                        <span>Repeat Order</span>
                      </button>

                      {/* Print Invoice Button */}
                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Download / Print Invoice"
                      >
                        <Printer size={13} className="text-[#0f8646]" />
                        <span>Invoice</span>
                      </button>

                      {/* Live Track CTA for Active Deliveries */}
                      {!isDelivered && (
                        <Link
                          href={`/track/${order._id}`}
                          className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck size={14} />
                          <span>Track Order</span>
                        </Link>
                      )}

                      {isDelivered && (
                        <Link
                          href={`/track/${order._id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-extrabold transition inline-flex items-center gap-1.5"
                        >
                          <span>Summary</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Rider Assignment Banner */}
                  {order.assigneddelliveryboy && !isDelivered && (
                    <div className="mb-4 bg-green-50/80 border border-green-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0f8646] text-white flex items-center justify-center">
                          <Truck size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-[#0f8646] uppercase block">
                            Rider On The Way
                          </span>
                          <span className="font-extrabold text-xs text-gray-900">
                            {order.assigneddelliveryboy.name}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`tel:${order.assigneddelliveryboy.mobile}`}
                        className="bg-white border border-green-300 text-[#0f8646] hover:bg-green-50 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition"
                      >
                        <Phone size={12} />
                        <span>Call Rider</span>
                      </a>
                    </div>
                  )}

                  {/* Delivery Address & Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 mb-4 bg-gray-50/60 rounded-2xl p-3.5 border border-gray-100">
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="text-[#0f8646] shrink-0 mt-0.5" />
                      <p className="line-clamp-2">
                        {order.address?.fulladress || "Bhopal Location"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:justify-end">
                      <CreditCard size={15} className="text-[#0f8646] shrink-0" />
                      <span>
                        Payment:{" "}
                        <strong className="text-gray-900 uppercase">
                          {order.paymentmethod}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Items Toggle */}
                  <button
                    onClick={() =>
                      setOpenOrder(isExpanded ? null : order._id)
                    }
                    className="w-full pt-2 flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#0f8646] transition cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? "Hide Item Details"
                        : `View ${order.items?.length || 0} produce items`}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50/70 p-3 rounded-2xl border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-contain rounded-xl bg-white border border-gray-100 p-1"
                              />
                            )}
                            <div>
                              <h4 className="font-extrabold text-xs text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-gray-500">
                                {item.quantity} × {item.variationWeight || item.unit}
                              </p>
                            </div>
                          </div>

                          <span className="font-black text-xs text-gray-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      Total Payable Amount
                    </span>
                    <span className="text-lg font-black text-[#0f8646]">
                      ₹{order.totalamount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in border border-gray-700">
          <Sparkles size={16} className="text-[#0f8646]" />
          <span>{toastMsg}</span>
        </div>
      )}

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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Cancel Order #{cancelModalOrder._id.slice(-6).toUpperCase()}?
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
                    name="cancelReason"
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
                onClick={() => setCancelModalOrder(null)}
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

      <Footer />
    </div>
  );
}