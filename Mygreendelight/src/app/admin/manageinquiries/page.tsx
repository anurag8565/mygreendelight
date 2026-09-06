"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Trash2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Filter,
  User,
  RefreshCw,
  Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageInquiriesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "unread" | "read" | "resolved"
  >("all");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/contact");
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await axios.put(`/api/admin/contact/${id}`, {
        status: newStatus,
      });
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer inquiry?")) return;
    try {
      const res = await axios.delete(`/api/admin/contact/${id}`);
      if (res.data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (error) {
      alert("Failed to delete message");
    }
  };

  const filtered = messages.filter((m) => {
    if (filterStatus === "all") return true;
    return m.status === filterStatus;
  });

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Customer Inquiries & Support
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review and reply to customer tickets submitted via Contact Us form
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMessages}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Status Filters */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs flex items-center gap-2 overflow-x-auto">
            {(["all", "unread", "read", "resolved"] as const).map((st) => {
              const isActive = filterStatus === st;
              const count =
                st === "all"
                  ? messages.length
                  : messages.filter((m) => m.status === st).length;

              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-black capitalize transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#0f8646] text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
              <p className="text-xs font-bold text-gray-500">Loading Support Tickets...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/80 shadow-xs max-w-md mx-auto">
              <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-900 mb-1">
                No inquiries in this tab
              </h3>
              <p className="text-xs text-gray-400">
                Customer support messages and feedback will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-2xs hover:shadow-xs transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-green-50 text-[#0f8646] flex items-center justify-center font-black text-sm">
                        {msg.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900">
                          {msg.name}
                        </h3>
                        <span className="text-[11px] text-gray-400">
                          {new Date(msg.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Status:</span>
                      <select
                        value={msg.status || "unread"}
                        onChange={(e) =>
                          handleStatusUpdate(msg._id, e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                          msg.status === "resolved"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : msg.status === "read"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read / In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition ml-2"
                        title="Delete Ticket"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subject Tag */}
                  <div className="mb-3">
                    <span className="bg-green-100 text-[#0f8646] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                      Subject: {msg.subject || "General Inquiry"}
                    </span>
                  </div>

                  {/* Message Content */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/70 p-4 rounded-2xl border border-gray-100 mb-4 font-medium">
                    "{msg.message}"
                  </p>

                  {/* Quick Contact Links */}
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600">
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}`}
                        className="flex items-center gap-1.5 hover:text-[#0f8646] transition"
                      >
                        <Mail size={14} className="text-[#0f8646]" />
                        <span>{msg.email}</span>
                      </a>
                    )}
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="flex items-center gap-1.5 hover:text-[#0f8646] transition"
                      >
                        <Phone size={14} className="text-[#0f8646]" />
                        <span>{msg.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  </div>
);
}
