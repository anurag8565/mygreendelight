"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Phone,
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  Truck,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Radio,
  UserCheck,
} from "lucide-react";
import { socket } from "@/lib/socket";
import AdminSidebar from "@/components/AdminSidebar";
import OrderInvoiceModal from "@/components/OrderInvoiceModal";
import { Printer } from "lucide-react";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
}

interface DeliveryBoy {
  _id: string;
  name: string;
  mobile?: string;
  email?: string;
}

interface OrderType {
  _id: string;
  totalamount: number;
  paymentmethod: string;
  status: string;
  ispaid: boolean;
  createdAt: string;
  assigneddelliveryboy?: {
    _id: string;
    name: string;
    mobile: string;
  };
  assigment?: any;
  items: OrderItem[];
  address: {
    fullname: string;
    mobile: string;
    fulladress: string;
    city?: string;
  };
  user: {
    name: string;
    email: string;
  };
}

export default function ManageOrder() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [filterTab, setFilterTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const result = await axios.get("/api/admin/manageorder");
      if (result.data) {
        const list = Array.isArray(result.data) ? result.data : result.data.orders || [];
        setOrders(list);
        if (result.data.deliveryBoys) {
          setDeliveryBoys(result.data.deliveryBoys);
        }

        const initialStatuses: Record<string, string> = {};
        list.forEach((order: OrderType) => {
          initialStatuses[order._id] = order.status;
        });
        setStatuses(initialStatuses);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Live Socket.IO listener for new orders
  useEffect(() => {
    socket.connect();

    socket.on("new-order", (order) => {
      setOrders((prev) => [order, ...prev]);
      setStatuses((prev) => ({
        ...prev,
        [order._id]: order.status,
      }));
      setToastMsg(`⚡ New Order Received: #${order._id.slice(-6).toUpperCase()}`);
      setTimeout(() => setToastMsg(null), 4000);
    });

    return () => {
      socket.off("new-order");
    };
  }, []);

  const updateStatus = async (orderid: string, status: string) => {
    setUpdatingId(orderid);
    try {
      const res = await axios.post(`/api/admin/updateorderststus/${orderid}`, {
        status,
      });

      setStatuses((prev) => ({
        ...prev,
        [orderid]: status,
      }));

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderid ? { ...o, status } : o))
      );

      setToastMsg(`✓ Order #${orderid.slice(-6).toUpperCase()} updated to "${status}"`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchOrders();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const assignDriver = async (orderId: string, driverId: string) => {
    if (!driverId) return;
    setAssigningId(orderId);
    try {
      const res = await axios.post("/api/admin/assign-driver", {
        orderId,
        driverId,
      });

      if (res.data.success) {
        setToastMsg(`🚚 Driver Assigned: ${res.data.message}`);
        setTimeout(() => setToastMsg(null), 3000);
        fetchOrders();
      } else {
        alert(res.data.message || "Failed to assign driver");
      }
    } catch (error: any) {
      console.error("Assign driver error:", error);
      alert(error.response?.data?.message || "Driver assignment failed.");
    } finally {
      setAssigningId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const currentStatus = statuses[order._id] || order.status;
    const matchesFilter =
      filterTab === "all"
        ? true
        : filterTab === "pending"
        ? currentStatus === "pending"
        : filterTab === "out of delivery"
        ? currentStatus === "out of delivery"
        : filterTab === "completed"
        ? currentStatus === "delivered" || currentStatus === "completed"
        : true;

    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.mobile?.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Manage Orders & Dispatch Fleet
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live order assignment, direct rider allocation & delivery dispatching
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in border border-gray-700">
            <Sparkles size={16} className="text-[#0f8646]" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Controls Bar: Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: "all", label: "All Orders", count: orders.length },
                {
                  id: "pending",
                  label: "Pending",
                  count: orders.filter((o) => (statuses[o._id] || o.status) === "pending").length,
                },
                {
                  id: "out of delivery",
                  label: "Out for Delivery",
                  count: orders.filter((o) => (statuses[o._id] || o.status) === "out of delivery").length,
                },
                {
                  id: "completed",
                  label: "Delivered",
                  count: orders.filter((o) => ["delivered", "completed"].includes(statuses[o._id] || o.status)).length,
                },
              ].map((tab) => {
                const isActive = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[#0f8646] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by ID, name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-bold border border-gray-200 rounded-xl outline-none focus:border-[#0f8646] bg-gray-50/60"
              />
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
              <p className="text-xs font-bold text-gray-500">Loading Orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/80 shadow-xs max-w-md mx-auto">
              <Package size={36} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-900 mb-1">
                No orders match your filter
              </h3>
              <p className="text-xs text-gray-400">
                New incoming orders will appear here automatically in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const currentStatus = statuses[order._id] || order.status;
                const isDelivered =
                  currentStatus === "delivered" || currentStatus === "completed";
                const isOutForDelivery = currentStatus === "out of delivery";
                const isExpanded = openOrder === order._id;
                const isAssigned = !!order.assigneddelliveryboy;

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all"
                  >
                    {/* Order Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-black text-base text-gray-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isDelivered
                                ? "bg-green-100 text-green-800"
                                : isOutForDelivery
                                ? "bg-blue-100 text-blue-800 animate-pulse"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {currentStatus}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              order.ispaid
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {order.ispaid ? "Paid" : "Unpaid (COD)"}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                          Placed on: {new Date(order.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Status Selector & Invoice Print */}
                      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border border-gray-200"
                          title="Print Customer Bill / Tax Invoice"
                        >
                          <Printer size={13} className="text-[#0f8646]" />
                          <span>Bill / Invoice</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 hidden sm:inline">
                            Status:
                          </span>
                          <select
                            value={currentStatus}
                            disabled={updatingId === order._id}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border outline-none cursor-pointer transition ${
                              currentStatus === "pending"
                                ? "bg-amber-50 text-amber-900 border-amber-300"
                                : isOutForDelivery
                                ? "bg-blue-50 text-blue-900 border-blue-300"
                                : "bg-green-50 text-green-900 border-green-300"
                            }`}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="out of delivery">🚀 Out For Delivery</option>
                            <option value="completed">✓ Completed & Delivered</option>
                            <option value="cancelled">✕ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-50/70 rounded-2xl p-4 border border-gray-100 text-xs text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-[#0f8646] shrink-0" />
                        <span className="font-bold truncate">
                          {order.address?.fullname || order.user?.name || "Customer"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone size={15} className="text-[#0f8646] shrink-0" />
                        <a
                          href={`tel:${order.address?.mobile}`}
                          className="font-bold hover:text-[#0f8646] transition"
                        >
                          {order.address?.mobile || "N/A"}
                        </a>
                      </div>

                      <div className="flex items-start gap-2 sm:col-span-2">
                        <MapPin size={15} className="text-[#0f8646] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {order.address?.fulladress || "Bhopal Location"}
                        </span>
                      </div>
                    </div>

                    {/* Rider Assignment Strip */}
                    {isAssigned ? (
                      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-xs shrink-0">
                            <Truck size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-[#0f8646] uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-md">
                                Assigned Rider Active
                              </span>
                            </div>
                            <span className="font-black text-sm text-gray-900 block mt-0.5">
                              {order.assigneddelliveryboy?.name} ({order.assigneddelliveryboy?.mobile || "No Mobile"})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {order.assigneddelliveryboy?.mobile && (
                            <a
                              href={`tel:${order.assigneddelliveryboy.mobile}`}
                              className="bg-white border border-emerald-300 text-[#0f8646] hover:bg-emerald-100 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-2xs"
                            >
                              <Phone size={13} />
                              <span>Call Rider</span>
                            </a>
                          )}

                          {/* Reassign Dropdown */}
                          <select
                            onChange={(e) => assignDriver(order._id, e.target.value)}
                            defaultValue=""
                            disabled={assigningId === order._id}
                            className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl outline-none cursor-pointer hover:border-[#0f8646] transition"
                          >
                            <option value="" disabled>Change Rider</option>
                            {deliveryBoys.map((db) => (
                              <option key={db._id} value={db._id}>
                                Reassign to: {db.name} ({db.mobile || db.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      /* Unassigned or Broadcasted State */
                      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                            {isOutForDelivery ? <Radio size={20} className="animate-pulse" /> : <Truck size={20} />}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                              {isOutForDelivery ? "Broadcasted to Fleet — Awaiting Rider" : "Rider Not Assigned Yet"}
                            </span>
                            <span className="text-xs font-bold text-amber-900">
                              {isOutForDelivery
                                ? "Waiting for rider to accept or manually allocate a driver below"
                                : "Assign an active delivery boy to dispatch this order"}
                            </span>
                          </div>
                        </div>

                        {/* Direct Driver Allocation Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            onChange={(e) => assignDriver(order._id, e.target.value)}
                            defaultValue=""
                            disabled={assigningId === order._id}
                            className="bg-white border border-amber-300 text-amber-950 text-xs font-black px-3.5 py-2 rounded-xl outline-none cursor-pointer shadow-2xs hover:border-[#0f8646] transition"
                          >
                            <option value="" disabled>
                              ⚡ Direct Assign Driver ({deliveryBoys.length} Available)
                            </option>
                            {deliveryBoys.map((db) => (
                              <option key={db._id} value={db._id}>
                                🛵 {db.name} ({db.mobile || db.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Items Dropdown Button */}
                    <button
                      onClick={() => setOpenOrder(isExpanded ? null : order._id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-gray-600 hover:text-[#0f8646] pt-1 transition cursor-pointer"
                    >
                      <span>
                        {isExpanded
                          ? "Hide Item Breakdown"
                          : `View ${order.items?.length || 0} produce item(s)`}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expanded Items Breakdown */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
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
                                  {item.quantity} × {item.unit}
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

                    {/* Card Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Mode: {order.paymentmethod}
                      </span>
                      <span className="text-base font-black text-[#0f8646]">
                        Total: ₹{order.totalamount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <OrderInvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}