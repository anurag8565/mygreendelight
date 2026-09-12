"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Users,
  Search,
  Trash2,
  RefreshCw,
  ShoppingBag,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Loader2,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

interface Customer {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function ManageCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cleaningTestUsers, setCleaningTestUsers] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchCustomers = async (showToast = false) => {
    try {
      setRefreshing(true);
      const res = await axios.get(`/api/admin/customers?_t=${Date.now()}`);
      if (res.data?.success) {
        setCustomers(res.data.customers || []);
      }
      if (showToast) {
        setToastMsg("Customer directory refreshed!");
        setTimeout(() => setToastMsg(null), 2500);
      }
    } catch (err: any) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customer: Customer) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete customer ${customer.name} (${customer.email})?`
      )
    ) {
      return;
    }
    setDeletingId(customer._id);
    try {
      const res = await axios.delete(`/api/admin/customers?userId=${customer._id}`);
      if (res.data?.success) {
        setCustomers((prev) => prev.filter((c) => c._id !== customer._id));
        setToastMsg(`✓ Customer ${customer.name} deleted successfully.`);
        setTimeout(() => setToastMsg(null), 3000);
      } else {
        alert(res.data?.message || "Failed to delete customer");
      }
    } catch (err: any) {
      console.error("Delete customer error:", err);
      alert(err.response?.data?.message || "Failed to delete customer");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCleanTestCustomers = async () => {
    const confirmation = window.prompt(
      '⚠️ CAUTION: This will delete ALL test customer accounts who have NEVER placed a real order.\n\nCustomers with existing orders will be SAFELY PRESERVED.\n\nType "CLEAN" to confirm:'
    );
    if (confirmation !== "CLEAN") {
      if (confirmation !== null) {
        alert("Action cancelled. You must type 'CLEAN' to confirm.");
      }
      return;
    }

    setCleaningTestUsers(true);
    try {
      const res = await axios.delete("/api/admin/customers?cleanTestCustomers=true");
      if (res.data?.success) {
        setToastMsg(`✓ ${res.data.message}`);
        setTimeout(() => setToastMsg(null), 4000);
        fetchCustomers();
      } else {
        alert(res.data?.message || "Failed to clean test customers");
      }
    } catch (err: any) {
      console.error("Clean test users error:", err);
      alert(err.response?.data?.message || "Failed to clean test customers");
    } finally {
      setCleaningTestUsers(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      (c.name || "").toLowerCase().includes(term) ||
      (c.email || "").toLowerCase().includes(term) ||
      (c.mobile || "").includes(term)
    );
  });

  const customersWithOrders = customers.filter((c) => c.orderCount > 0).length;
  const totalCustomerSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                <Users className="text-[#0f8646]" size={24} />
                <span>Customer Directory</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Manage registered user accounts, order history, and clean dummy profiles
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fetchCustomers(true)}
                disabled={refreshing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin text-[#0f8646]" : ""}
                />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleCleanTestCustomers}
                disabled={customers.length === 0 || cleaningTestUsers}
                className="bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-40"
                title="Delete test customers who have 0 orders"
              >
                {cleaningTestUsers ? (
                  <Loader2 size={14} className="animate-spin text-rose-600" />
                ) : (
                  <Trash2 size={14} className="text-rose-600" />
                )}
                <span>Clean Test Customers</span>
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

          <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 flex-1">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase text-gray-400 tracking-wider">
                    Total Registered
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 block mt-1">
                    {customers.length}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Users size={22} />
                </div>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase text-gray-400 tracking-wider">
                    Customers with Orders
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 block mt-1">
                    {customersWithOrders}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center shrink-0">
                  <ShoppingBag size={22} />
                </div>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase text-gray-400 tracking-wider">
                    Total Lifetime Spend
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 block mt-1">
                    ₹{totalCustomerSpend}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <IndianRupee size={22} />
                </div>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-2xs flex items-center gap-3">
              <Search size={16} className="text-gray-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Search by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs font-bold border-0 outline-none bg-transparent placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="text-xs text-gray-400 hover:text-gray-700 font-bold px-2 py-0.5 rounded-lg bg-gray-100"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Customers Table / Grid */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
                <p className="text-xs font-bold text-gray-500">Loading Customers...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/80 shadow-xs max-w-md mx-auto">
                <Users size={36} className="text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-black text-gray-900 mb-1">
                  No customers found
                </h3>
                <p className="text-xs text-gray-400">
                  {searchTerm
                    ? "Try a different search term"
                    : "Registered users will appear here."}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3.5">Customer</th>
                        <th className="px-5 py-3.5">Contact Details</th>
                        <th className="px-5 py-3.5 text-center">Orders</th>
                        <th className="px-5 py-3.5 text-right">Total Spent</th>
                        <th className="px-5 py-3.5">Joined</th>
                        <th className="px-5 py-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredCustomers.map((customer) => {
                        const hasOrders = customer.orderCount > 0;
                        return (
                          <tr
                            key={customer._id}
                            className="hover:bg-[#fafcfa] transition-colors"
                          >
                            {/* Customer Avatar & Name */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-[#0f8646] font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                                  {customer.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-gray-900 text-xs truncate">
                                    {customer.name || "Unnamed Customer"}
                                  </p>
                                  {hasOrders ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0f8646] bg-emerald-50 px-1.5 py-0.2 rounded-md">
                                      Active Buyer
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-400 font-medium">
                                      Zero Orders
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Contact Details */}
                            <td className="px-5 py-4">
                              <div className="space-y-0.5">
                                <p className="text-gray-700 font-bold flex items-center gap-1.5">
                                  <Mail size={12} className="text-gray-400 shrink-0" />
                                  <span className="truncate max-w-[200px]">
                                    {customer.email}
                                  </span>
                                </p>
                                <p className="text-gray-500 text-[11px] flex items-center gap-1.5">
                                  <Phone size={11} className="text-gray-400 shrink-0" />
                                  <span>{customer.mobile}</span>
                                </p>
                              </div>
                            </td>

                            {/* Orders Count */}
                            <td className="px-5 py-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-xl text-xs font-black inline-block ${
                                  hasOrders
                                    ? "bg-emerald-50 text-[#0f8646] border border-emerald-200"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {customer.orderCount}
                              </span>
                            </td>

                            {/* Total Spent */}
                            <td className="px-5 py-4 text-right">
                              <span className="font-black text-sm text-gray-900">
                                ₹{customer.totalSpent}
                              </span>
                            </td>

                            {/* Registered On */}
                            <td className="px-5 py-4 text-gray-500 text-[11px]">
                              {customer.createdAt
                                ? new Date(customer.createdAt).toLocaleDateString("en-IN")
                                : "N/A"}
                            </td>

                            {/* Action: Delete */}
                            <td className="px-5 py-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomer(customer)}
                                disabled={deletingId === customer._id}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 mx-auto shadow-2xs"
                                title="Delete Customer Profile"
                              >
                                {deletingId === customer._id ? (
                                  <Loader2 size={12} className="animate-spin text-rose-600" />
                                ) : (
                                  <Trash2 size={12} className="text-rose-600" />
                                )}
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
