"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Tag,
  Plus,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "199",
    maxDiscount: "100",
    expiryDate: "",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/coupons");
      if (res.data.success) setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await axios.post("/api/admin/coupons", {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        expiryDate: form.expiryDate,
      });

      if (res.data.success) {
        alert("Coupon created successfully!");
        setIsModalOpen(false);
        setForm({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minOrderValue: "199",
          maxDiscount: "100",
          expiryDate: "",
        });
        fetchCoupons();
      } else {
        alert(res.data.message || "Error creating coupon");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error creating coupon");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await axios.put(`/api/admin/coupons/${id}`, {
        isActive: !currentStatus,
      });
      if (res.data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;
    try {
      const res = await axios.delete(`/api/admin/coupons/${id}`);
      if (res.data.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex">
      <AdminSidebar />

      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Coupons & Promo Codes
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Create and manage customer discounts, flash deals & featured promo banners
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCoupons}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create New Coupon</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
              <p className="text-xs font-bold text-gray-500">Loading Promo Coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/80 shadow-xs max-w-md mx-auto">
              <Tag size={36} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-900 mb-1">
                No active coupons found
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Create a promo code like WELCOME20 to boost sales on checkout!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0f8646] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                + Create Promo Code
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coupons.map((coupon) => {
                const isExpired = new Date(coupon.expiryDate) < new Date();

                return (
                  <div
                    key={coupon._id}
                    className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Code Pill & Toggle */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-green-50 border border-green-300 text-[#0f8646] px-3 py-1 rounded-xl font-black text-sm tracking-wider uppercase">
                          {coupon.code}
                        </span>

                        <button
                          onClick={() => toggleActive(coupon._id, coupon.isActive)}
                          className="flex items-center gap-1.5 cursor-pointer text-xs font-extrabold"
                        >
                          {coupon.isActive ? (
                            <span className="text-[#0f8646] flex items-center gap-1">
                              <ToggleRight size={24} className="fill-[#0f8646]" /> Active
                            </span>
                          ) : (
                            <span className="text-gray-400 flex items-center gap-1">
                              <ToggleLeft size={24} /> Disabled
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Value Display */}
                      <div className="mb-4">
                        <h3 className="text-2xl font-black text-gray-900">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} FLAT OFF`}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          Min. Order: ₹{coupon.minOrderValue || 0}
                          {coupon.maxDiscount ? ` • Max Cap: ₹${coupon.maxDiscount}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Expiry Date & Delete */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                        <Calendar size={13} className="text-[#0f8646]" />
                        <span>
                          {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                        </span>
                        {isExpired && (
                          <span className="text-[10px] text-red-500 font-extrabold uppercase">
                            (Expired)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => deleteCoupon(coupon._id, coupon.code)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Coupon"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-lg font-black text-gray-900">Create New Coupon</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] uppercase font-black bg-gray-50/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={form.discountType === "percentage" ? "20" : "50"}
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm({ ...form, discountValue: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="199"
                    value={form.minOrderValue}
                    onChange={(e) =>
                      setForm({ ...form, minOrderValue: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={form.maxDiscount}
                    onChange={(e) =>
                      setForm({ ...form, maxDiscount: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 rounded-xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-extrabold shadow-md disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
