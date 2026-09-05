"use client";

import React, { useRef } from "react";
import {
  Printer,
  X,
  Download,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";

interface OrderInvoiceModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderInvoiceModal({
  order,
  isOpen,
  onClose,
}: OrderInvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const orderShortId = String(order._id).slice(-6).toUpperCase();
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const subtotal = (order.items || []).reduce(
    (acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const deliveryFee = subtotal >= 199 ? 0 : 30;
  const discount = Math.max(0, subtotal + deliveryFee - (order.totalamount || subtotal));
  const finalTotal = order.totalamount || subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs print:p-0 print:bg-white">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-gray-100 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        {/* Modal Action Header (Hidden during Print) */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#0f8646]" />
            <span className="font-black text-sm">Tax Invoice & Delivery Receipt</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div
          ref={invoiceRef}
          id="printable-invoice"
          className="p-8 sm:p-10 overflow-y-auto flex-1 bg-white font-sans text-gray-800 print:p-6"
        >
          {/* Company & Invoice Header */}
          <div className="flex justify-between items-start border-b-2 border-green-700/80 pb-6 mb-6">
            <div>
              <Logo showTagline={true} />
              <p className="text-[11px] text-gray-400 mt-2">
                Amrai, Bagsewaniya, Bhopal, MP - 462043
              </p>
              <p className="text-[11px] text-gray-400 font-mono">
                GSTIN: 23AABCK8901M1Z5 • FSSAI: 11424850000123 • Daily 6:00 AM – 1:00 PM • support@subziquick.in
              </p>
            </div>

            <div className="text-right">
              <span className="bg-emerald-50 text-[#0f8646] border border-emerald-300 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-lg inline-block mb-2">
                TAX INVOICE
              </span>
              <p className="text-sm font-black text-gray-900">
                Invoice #: <span className="font-mono">INV-{orderShortId}</span>
              </p>
              <p className="text-xs text-gray-500 font-medium">{orderDate}</p>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                  order.ispaid
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                Payment: {order.ispaid ? "PAID ONLINE" : "CASH ON DELIVERY (COD)"}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50/80 rounded-2xl p-4 border border-gray-200 mb-6 text-xs">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                BILLED & DELIVERED TO:
              </span>
              <p className="font-black text-gray-900 text-sm">
                {order.address?.fullname || order.user?.name || "Customer"}
              </p>
              <p className="font-bold text-gray-600 mt-0.5 flex items-center gap-1">
                <Phone size={12} className="text-[#0f8646]" />
                <span>{order.address?.mobile || "N/A"}</span>
              </p>
              <p className="text-gray-600 mt-1 leading-relaxed">
                {order.address?.fulladress || "Bhopal, Madhya Pradesh"}
              </p>
            </div>

            <div className="border-l border-gray-200 pl-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                ORDER DISPATCH INFO:
              </span>
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span className="capitalize font-black text-[#0f8646]">
                  {order.status}
                </span>
              </p>
              <p className="text-gray-700 mt-0.5">
                <strong>Delivery Rider:</strong>{" "}
                {order.assigneddelliveryboy?.name ? (
                  <span>
                    {order.assigneddelliveryboy.name} (
                    {order.assigneddelliveryboy.mobile})
                  </span>
                ) : (
                  <span className="text-gray-400 italic">SubziQuick Express Fleet</span>
                )}
              </p>
              <p className="text-gray-700 mt-0.5">
                <strong>Delivery Slot:</strong>{" "}
                <span className="text-[#0f8646] font-bold">
                  {order.deliverySlot || "Instant Express (30-45 Mins)"}
                </span>
              </p>
              <p className="text-gray-700 mt-0.5">
                <strong>Delivery Type:</strong> Same-Day Bhopal Mandi Fresh Dispatch
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/90 text-[10px] font-black uppercase text-gray-600 border-b border-gray-200">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Produce Item</th>
                  <th className="py-2.5 px-3">Pack / Size</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.items || []).map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-2 px-3 text-gray-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-gray-900">{item.name}</td>
                    <td className="py-2 px-3 text-gray-500 font-medium">{item.variationWeight || item.unit || "1 kg"}</td>
                    <td className="py-2 px-3 text-right font-medium">₹{item.price}</td>
                    <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-2 px-3 text-right font-black text-gray-900">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes Section */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Payment & Barcode Note */}
            <div className="bg-green-50/50 rounded-2xl p-4 border border-green-200/80 text-xs">
              <span className="font-extrabold text-[#0f8646] uppercase text-[10px] tracking-wider block mb-1">
                FARM DIRECT QUALITY GUARANTEE
              </span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                100% natural, sorted directly from Bhopal Mandi & local organic farms.
                For inquiries or quick support, WhatsApp us at{" "}
                <span className="font-bold text-gray-900">+91 99814 18565</span>.
              </p>
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Items Subtotal:</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Charges:</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-[#0f8646] font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon / Promo Discount:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              {order.walletDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>GreenPoints Wallet Redeemed:</span>
                  <span>-₹{order.walletDiscount}</span>
                </div>
              )}
              {order.bagReturnCashback > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 text-[11px]">
                  <span>♻️ Eco-Bag Cashback ({order.bagsReturned} Bags):</span>
                  <span>+₹{order.bagReturnCashback} (Credited)</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t-2 border-gray-900">
                <span>Grand Total:</span>
                <span className="text-[#0f8646] text-lg font-black">
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-400">
            <p>Thank you for supporting local Madhya Pradesh farmers and choosing SubziQuick!</p>
            <p className="font-mono mt-0.5">Computer Generated Invoice • No Physical Signature Required</p>
          </div>
        </div>
      </div>
    </div>
  );
}
