"use client";

import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RotateCcw, CheckCircle2, AlertCircle, Coins, Clock } from "lucide-react";

export default function RefundPolicyPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center mb-4">
            <RotateCcw size={24} />
          </div>
          <span className="text-xs font-black uppercase text-[#0f8646] tracking-wider block mb-1">
            Customer Guarantee
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Refund, Return & Cancellation Policy
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            No-Questions-Asked Fresh Farm Guarantee • Bhopal Fast Resolution
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs space-y-8 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-[#0f8646]" />
              <span>1. Order Cancellation Policy</span>
            </h2>
            <p>
              We believe in complete convenience for our Bhopal customers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li><strong>Self-Cancellation Before Dispatch:</strong> You can cancel any pending order with a single click from your <strong>My Orders</strong> page or live tracking screen prior to rider dispatch.</li>
              <li><strong>Automatic Stock Restoration:</strong> When an order is cancelled, all reserved fresh produce items are automatically returned to available inventory.</li>
              <li><strong>Instant Wallet Refund:</strong> If you redeemed GreenPoints wallet balance, the exact amount is instantly credited back to your wallet.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <RotateCcw size={18} className="text-[#0f8646]" />
              <span>2. Return & Doorstep Quality Check</span>
            </h2>
            <p>
              Fresh produce is perishable; therefore, we offer a <strong>Doorstep Quality Check</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li>When the delivery partner arrives, you may inspect your fruits, vegetables, and greens.</li>
              <li>If any item does not meet your quality expectations (e.g. damaged, spoiled, or incorrect unit), you may return that specific item to the rider immediately.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Coins size={18} className="text-[#0f8646]" />
              <span>3. Refund Processing Timelines</span>
            </h2>
            <p>
              Refunds are issued based on your payment mode:
            </p>
            <div className="overflow-hidden rounded-2xl border border-gray-200 text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100/80 font-black text-gray-700 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3">Refund Destination</th>
                    <th className="p-3">Estimated Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="p-3 font-bold text-gray-900">GreenPoints Wallet</td>
                    <td className="p-3">MyGreenDelight Wallet Balance</td>
                    <td className="p-3 font-bold text-[#0f8646]">Instant (0 seconds)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-900">Online UPI / GPay / Paytm</td>
                    <td className="p-3">Original Bank Account / VPA</td>
                    <td className="p-3">2-4 Business Hours (Max 24h)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-900">Debit / Credit Cards</td>
                    <td className="p-3">Issuing Bank Account</td>
                    <td className="p-3">3-5 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-[#0f8646]" />
              <span>4. Quick WhatsApp Support</span>
            </h2>
            <p>
              For any refund issues or produce replacement requests, send a photo of the item to our official Bhopal WhatsApp helpline at <strong>+91 99814 18565</strong>. Our team resolves quality complaints in under 15 minutes!
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
