"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { FileText, Search, Clock, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function ManageListOrdersPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/list-orders")
      .then((res) => {
        if (res.data.success) {
          setInquiries(res.data.inquiries || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Customer Grocery List & Parchi Orders Ledger
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live log of handwritten list queries matched with store produce
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Raw List Text</th>
                  <th className="py-3 px-3">Matched Items</th>
                  <th className="py-3 px-3">Est. Amount</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      No list inquiries recorded yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-3 font-bold text-gray-900">
                        {inq.user?.name || inq.guestId || "Guest"}
                      </td>
                      <td className="py-3 px-3 max-w-xs font-mono text-[11px] text-gray-600 whitespace-pre-line">
                        {inq.rawText}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {inq.matchedItems?.length || 0} items
                        </span>
                      </td>
                      <td className="py-3 px-3 font-black text-[#0f8646]">
                        ₹{inq.totalEstimatedAmount}
                      </td>
                      <td className="py-3 px-3 text-gray-400">
                        {new Date(inq.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
