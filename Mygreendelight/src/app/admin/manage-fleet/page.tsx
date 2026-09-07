"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Truck,
  Plus,
  UserCheck,
  ShieldAlert,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  X,
  Radio,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

interface Rider {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  isonline?: boolean;
  activeOrders?: number;
  completedOrders?: number;
  createdAt: string;
}

export default function ManageFleetPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const fetchFleet = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/fleet");
      if (res.data.success) {
        setRiders(res.data.riders || []);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: "Failed to load delivery fleet." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleCreateRider = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    try {
      const res = await axios.post("/api/admin/fleet", {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });

      if (res.data.success) {
        setToast({ type: "success", text: res.data.message });
        setIsModalOpen(false);
        setForm({ name: "", email: "", mobile: "", password: "" });
        fetchFleet();
      } else {
        setToast({ type: "error", text: res.data.message || "Failed to add rider" });
      }
    } catch (error: any) {
      setToast({
        type: "error",
        text: error.response?.data?.message || "Error creating delivery partner",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeRider = async (riderId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from Delivery Fleet? They will be changed to regular customer.`)) {
      return;
    }

    try {
      const res = await axios.put("/api/admin/fleet", {
        riderId,
        newRole: "user",
      });
      if (res.data.success) {
        setToast({ type: "success", text: `${name} has been removed from fleet.` });
        fetchFleet();
      }
    } catch (error: any) {
      setToast({ type: "error", text: "Failed to remove rider" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/60 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin"
                className="text-xs font-bold text-gray-500 hover:text-[#0f8646] flex items-center gap-1 transition"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-md">
                <Truck size={22} />
              </span>
              <span>Delivery Fleet & Partners</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Add verified delivery riders, assign order dispatchers, and monitor rider online status.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchFleet}
              disabled={loading}
              className="bg-white border border-gray-200 text-gray-700 hover:text-[#0f8646] hover:border-[#0f8646] px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#0f8646]" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-900/15 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Delivery Partner</span>
            </button>
          </div>
        </div>

        {toast && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block">
                Total Fleet Riders
              </span>
              <span className="text-2xl font-black text-gray-900">{riders.length}</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-50 text-[#0f8646] flex items-center justify-center">
              <Truck size={22} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block">
                Online & Active
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {riders.filter((r) => r.isonline !== false).length}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Radio size={22} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block">
                Security Policy
              </span>
              <span className="text-xs font-black text-gray-700">Admin Approved Only</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        {/* Riders Table */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-gray-900 uppercase tracking-wider">
              Active Delivery Personnel ({riders.length})
            </h3>
            <span className="text-xs text-gray-400">
              Assigned via Admin Control
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#0f8646] animate-spin mb-3" />
              <p className="text-xs font-bold">Loading delivery partners...</p>
            </div>
          ) : riders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Truck size={36} className="mx-auto mb-2 opacity-50 text-[#0f8646]" />
              <p className="text-sm font-black text-gray-900 mb-1">No Delivery Partners Added Yet</p>
              <p className="text-xs text-gray-400 mb-4">
                Click "Add Delivery Partner" to create a login for your delivery riders.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black transition"
              >
                + Add First Rider
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-wider">
                    <th className="p-4">Rider Info</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Active Deliveries</th>
                    <th className="p-4">Total Delivered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {riders.map((rider) => (
                    <tr key={rider._id} className="hover:bg-green-50/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0f8646] font-black flex items-center justify-center text-sm shadow-2xs">
                            {rider.name ? rider.name.charAt(0).toUpperCase() : "D"}
                          </div>
                          <div>
                            <span className="font-black text-gray-900 text-xs sm:text-sm block">
                              {rider.name || "Delivery Partner"}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              Joined: {new Date(rider.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                            <Phone size={12} className="text-[#0f8646]" />
                            <span>{rider.mobile || "No Mobile"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <Mail size={11} />
                            <span>{rider.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active Partner</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-black text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {rider.activeOrders || 0} Orders
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-black text-emerald-700">
                          {rider.completedOrders || 0} Delivered
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRevokeRider(rider._id, rider.name)}
                          className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add Delivery Partner */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-green-100 text-[#0f8646] flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-gray-900">
                      Add Delivery Partner
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Create login credentials for delivery personnel
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRider} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0f8646] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value.replace(/[^0-9]/g, "") })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0f8646] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.delivery@subziquick.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0f8646] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    Login Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Min 6 characters password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0f8646] transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl text-xs font-black transition shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Create Partner Account</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
