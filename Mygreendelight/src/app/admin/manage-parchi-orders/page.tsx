"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  FileText,
  Camera,
  Phone,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  X,
  ExternalLink,
  Search,
  RefreshCw,
  Send,
  MapPin,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import axios from "axios";

export default function ManageParchiOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>("pending");
  const [editNotes, setEditNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchParchiOrders();
  }, []);

  const fetchParchiOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/parchi-orders");
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err: any) {
      console.error(err);
      setMsg({ type: "error", text: "Failed to load parchi orders" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (order: any) => {
    setEditingOrder(order);
    setEditAmount(order.finalAmount || order.estimatedAmount || 0);
    setEditStatus(order.status || "pending");
    setEditNotes(order.adminNotes || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      setSubmitting(true);
      const res = await axios.patch(`/api/admin/parchi-orders/${editingOrder._id}`, {
        status: editStatus,
        finalAmount: Number(editAmount),
        adminNotes: editNotes,
      });

      if (res.data?.success) {
        setMsg({ type: "success", text: "Parchi order updated successfully!" });
        setEditingOrder(null);
        fetchParchiOrders();
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err: any) {
      setMsg({ type: "error", text: "Failed to update order" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parchi order?")) return;

    try {
      const res = await axios.delete(`/api/admin/parchi-orders/${id}`);
      if (res.data?.success) {
        setMsg({ type: "success", text: "Order deleted" });
        fetchParchiOrders();
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to delete" });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    const matchesSearch =
      (o.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.mobile || "").includes(search) ||
      (o.address || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex bg-[#faf9f5] min-h-screen font-sans">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                <FileText size={20} />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                Bhopal Parchi & WhatsApp Orders
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
              Incoming hand-written lists & WhatsApp parchi orders from Bhopal households.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchParchiOrders}
            className="self-start sm:self-auto bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Message Banner */}
        {msg && (
          <div
            className={`mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {msg.type === "success" ? <CheckCircle2 size={16} /> : <X size={16} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-3.5 sm:p-4 mb-5 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, phone, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 pl-8.5 pr-3 text-xs font-semibold outline-none focus:bg-white focus:border-[#0a3d24]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {["all", "pending", "reviewed", "confirmed", "completed"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer shrink-0 ${
                  filterStatus === st
                    ? "bg-[#0a3d24] text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Parchi Orders List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-stone-400">
            Loading Bhopal parchi orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
            <FileText size={32} className="mx-auto text-amber-500 mb-2 opacity-60" />
            <h3 className="font-bold text-sm text-stone-800">No Parchi Orders Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Customer submissions from the homepage will appear here live.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Status & Date */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        ord.status === "pending"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : ord.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : ord.status === "completed"
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {ord.status}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <h3 className="font-extrabold text-sm text-stone-900">
                    {ord.customerName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 font-bold mt-0.5">
                    <Phone size={12} className="text-[#0a3d24]" />
                    <span>{ord.mobile}</span>
                  </div>

                  <p className="text-xs text-stone-500 font-medium mt-1 line-clamp-2">
                    <MapPin size={11} className="inline mr-1 text-stone-400" />
                    {ord.address}
                  </p>

                  {/* Parchi Content: Photo OR Written List */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100">
                    {ord.parchiImageUrl ? (
                      <div
                        onClick={() => setPreviewImage(ord.parchiImageUrl)}
                        className="relative w-full h-28 rounded-xl overflow-hidden bg-stone-100 border border-amber-200 cursor-pointer group"
                      >
                        <img
                          src={ord.parchiImageUrl}
                          alt="Parchi"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <Eye size={14} />
                          <span>View Full Photo</span>
                        </div>
                      </div>
                    ) : ord.listText ? (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-xs text-stone-800 font-medium whitespace-pre-wrap max-h-24 overflow-y-auto">
                        {ord.listText}
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">No text or image</span>
                    )}
                  </div>

                  {ord.finalAmount > 0 && (
                    <div className="mt-2 text-xs font-black text-[#0a3d24]">
                      Bill Amount: ₹{ord.finalAmount}
                    </div>
                  )}
                </div>

                {/* Bottom Quick Contact & Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Call Customer */}
                    <a
                      href={`tel:${ord.mobile}`}
                      className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
                      title="Call Customer"
                    >
                      <Phone size={14} />
                    </a>

                    {/* WhatsApp Customer with Pre-filled Bill / Confirmation Message */}
                    <a
                      href={`https://wa.me/91${ord.mobile}?text=${encodeURIComponent(
                        `Namaste ${ord.customerName}! SubziQuick Bhopal store se bol rahe hain. Aapka parchi order receive ho gaya hai. Total bill ₹${
                          ord.finalAmount || 0
                        } hai. Delivery dispatch ho rahi hai.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition"
                      title="WhatsApp Customer"
                    >
                      <FaWhatsapp size={15} />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ord)}
                      className="bg-[#0a3d24] text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-[#072416] transition cursor-pointer"
                    >
                      Process / Bill
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ord._id)}
                      className="p-1.5 text-stone-300 hover:text-red-500 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* 🖼️ IMAGE PREVIEW FULL-SCREEN MODAL */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-3xl p-2 overflow-hidden">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X size={16} />
            </button>
            <img src={previewImage} alt="Parchi HD" className="w-full h-full object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* 📝 PROCESS / BILL MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-sm sm:text-base text-stone-900">
                Process Parchi Order: {editingOrder.customerName}
              </h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Bill / Total Amount (₹)
                </label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-black text-stone-900 outline-none focus:border-[#0a3d24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Order Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold text-stone-900 outline-none focus:border-[#0a3d24]"
                >
                  <option value="pending">Pending (Reviewing)</option>
                  <option value="reviewed">Reviewed / Packed</option>
                  <option value="confirmed">Confirmed & Dispatched</option>
                  <option value="completed">Completed / Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Store Notes / Packed Items
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. 1kg Aloo, 500g Tamatar, 250g Mirchi packed. Rider Ramesh assigned."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-medium text-stone-900 outline-none focus:border-[#0a3d24]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0a3d24] hover:bg-[#072416] text-white px-5 py-2 rounded-xl text-xs font-black transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save & Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
