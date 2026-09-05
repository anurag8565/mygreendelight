"use client";

import React, { useRef } from "react";
import {
  Printer,
  X,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode,
  Clock,
  User,
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
  const invoiceNumber = `INV-SZQ-${orderShortId}`;
  
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
  const calculatedTotal = subtotal + deliveryFee;
  const discount = Math.max(0, calculatedTotal - (order.totalamount || calculatedTotal));
  const finalTotal = order.totalamount ?? calculatedTotal;
  const totalSavings = discount + (deliveryFee === 0 ? 30 : 0);

  const isPrepaid =
    order.paymentmethod === "online" ||
    order.paymentmethod === "upi" ||
    order.ispaid;

  const verificationUrl = `https://subziquick.in/track/${order._id}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
    verificationUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/75 backdrop-blur-xs print:p-0 print:bg-white print:static">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-gray-100 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-900 text-white flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0f8646] flex items-center justify-center text-white">
              <FileText size={16} />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Tax Invoice & Delivery Receipt</span>
              <span className="text-[10px] text-gray-400 font-mono">Order #{orderShortId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer hover:shadow-md"
            >
              <Printer size={14} />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div
          ref={invoiceRef}
          id="printable-invoice"
          className="p-6 sm:p-8 md:p-10 overflow-y-auto flex-1 bg-white font-sans text-gray-800 print:p-4 print:overflow-visible"
        >
          {/* Top Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-emerald-600/90">
            <div>
              <Logo showTagline={true} />
              <div className="mt-2.5 space-y-0.5 text-[11px] text-gray-500">
                <p className="font-bold text-gray-700">SubziQuick Fresh Retail & Logistics</p>
                <p>Amrai, Bagsewaniya, Bhopal, Madhya Pradesh - 462043</p>
                <p className="font-mono text-[10px] text-gray-400">
                  GSTIN: 23AABCS1234F1Z0 • FSSAI Lic: 11424850000123
                </p>
                <p className="text-[10px] text-gray-500">
                  Customer Care: <strong>+91 99814 18565</strong> • anuragsinghas098@gmail.com
                </p>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-2">
              <span className="bg-emerald-50 text-[#0f8646] border border-emerald-300 font-black text-xs uppercase tracking-widest px-3.5 py-1 rounded-xl shadow-2xs">
                TAX INVOICE
              </span>
              <div className="text-left sm:text-right space-y-0.5">
                <p className="text-sm font-black text-gray-900 font-mono tracking-tight">
                  {invoiceNumber}
                </p>
                <p className="text-xs text-gray-500 font-medium flex items-center sm:justify-end gap-1">
                  <Calendar size={12} className="text-gray-400" />
                  <span>{orderDate}</span>
                </p>
                <div className="pt-1">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md inline-block border ${
                      isPrepaid
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {isPrepaid
                      ? `PAID VIA ${order.paymentmethod?.toUpperCase() || "ONLINE"}`
                      : "CASH ON DELIVERY (COD)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Section + Order QR */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-emerald-50/30 rounded-2xl p-4 sm:p-5 border border-emerald-100/90 my-5 text-xs">
            {/* Customer Details (7 Cols) */}
            <div className="sm:col-span-7 space-y-1.5">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                BILLED & DELIVERED TO:
              </span>
              <p className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                <User size={14} className="text-[#0f8646]" />
                <span>{order.address?.fullname || order.user?.name || "Valued Customer"}</span>
              </p>
              <p className="font-bold text-gray-700 flex items-center gap-1.5">
                <Phone size={13} className="text-[#0f8646]" />
                <span>+91 {order.address?.mobile || order.user?.mobile || "N/A"}</span>
              </p>
              <div className="flex items-start gap-1.5 pt-0.5 text-gray-600 leading-relaxed">
                <MapPin size={13} className="text-[#0f8646] shrink-0 mt-0.5" />
                <span>
                  {order.address?.fulladress || "Bhopal, Madhya Pradesh - 462xxx"}
                </span>
              </div>
            </div>

            {/* Dispatch & Delivery Meta (5 Cols) */}
            <div className="sm:col-span-5 sm:border-l border-emerald-200/80 sm:pl-4 space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                  DISPATCH LOGISTICS:
                </span>
                <p className="text-gray-700 mt-1">
                  <strong>Slot:</strong>{" "}
                  <span className="text-[#0f8646] font-bold">
                    {order.deliverySlot || "Instant Mandi Fresh Express"}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>Rider:</strong>{" "}
                  <span className="font-bold">
                    {order.assigneddelliveryboy?.name
                      ? `${order.assigneddelliveryboy.name} (${order.assigneddelliveryboy.mobile || "Assigned"})`
                      : "SubziQuick Fleet Dispatch"}
                  </span>
                </p>
                {order.paymentId && (
                  <p className="text-gray-700 font-mono text-[11px] truncate">
                    <strong>Ref/UTR:</strong> {order.paymentId}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-emerald-200/60">
                <img
                  src={qrCodeApiUrl}
                  alt="Order QR Code"
                  className="w-12 h-12 rounded-lg border border-emerald-300 bg-white p-0.5 shrink-0"
                />
                <div className="text-[10px] text-gray-500 leading-tight">
                  <span className="font-bold text-gray-800 block">Scan to Track</span>
                  <span>Official SubziQuick Digital Receipt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Produce Table */}
          <div className="mb-5 overflow-hidden rounded-2xl border border-gray-200 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/90 text-[10px] font-black uppercase text-gray-700 border-b border-gray-200">
                  <th className="py-2.5 px-3.5 text-center w-10">#</th>
                  <th className="py-2.5 px-3.5">Produce Item</th>
                  <th className="py-2.5 px-3.5">Pack / Weight</th>
                  <th className="py-2.5 px-3.5 text-right">Price</th>
                  <th className="py-2.5 px-3.5 text-center">Qty</th>
                  <th className="py-2.5 px-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.items || []).map((item: any, idx: number) => {
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const lineTotal = itemPrice * itemQty;

                  return (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="py-2 px-3.5 text-center text-gray-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3.5 font-bold text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-2 px-3.5 text-gray-600 font-medium">
                        {item.variationWeight || item.unit || "1 pack"}
                      </td>
                      <td className="py-2 px-3.5 text-right text-gray-700 font-medium">
                        ₹{itemPrice}
                      </td>
                      <td className="py-2 px-3.5 text-center font-black text-gray-900">
                        {itemQty}
                      </td>
                      <td className="py-2 px-3.5 text-right font-black text-gray-900">
                        ₹{lineTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals, Savings & Farm Guarantee Section */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2 items-start">
            {/* Guarantee & Notes (7 Cols) */}
            <div className="sm:col-span-7 space-y-3">
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/90 text-xs">
                <div className="flex items-center gap-1.5 font-black text-[#0f8646] uppercase text-[10px] tracking-wider mb-1">
                  <ShieldCheck size={14} />
                  <span>100% KAROND MANDI FRESHNESS GUARANTEE</span>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  All vegetables & fruits are handpicked daily from Karond Mandi & sorted under strict quality checks. 
                  If you are unsatisfied with any produce, instant replacement or refund is available via WhatsApp helpline.
                </p>
              </div>

              {totalSavings > 0 && (
                <div className="bg-green-100/70 border border-green-300 rounded-2xl p-3 flex items-center gap-2.5 text-xs font-black text-green-900">
                  <Sparkles size={16} className="text-green-700 shrink-0" />
                  <span>🎉 You saved a total of ₹{totalSavings} on this order!</span>
                </div>
              )}
            </div>

            {/* Calculations Breakdown (5 Cols) */}
            <div className="sm:col-span-5 bg-gray-50/80 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Items Subtotal:</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Partner Fee:</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-[#0f8646] font-bold bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
                      FREE
                    </span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Special Discount:</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              {order.walletDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>GreenPoints Redeemed:</span>
                  <span>-₹{order.walletDiscount}</span>
                </div>
              )}

              {order.bagReturnCashback > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-100/70 p-1.5 rounded-lg border border-emerald-200 text-[10px]">
                  <span>♻️ Eco-Bag Cashback:</span>
                  <span>-₹{order.bagReturnCashback}</span>
                </div>
              )}

              <div className="flex justify-between text-sm sm:text-base font-black text-gray-900 pt-2 border-t-2 border-gray-900">
                <span>Grand Total:</span>
                <span className="text-[#0f8646] text-lg font-black">
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Legal & Gratitude */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200 text-[10px] text-gray-400 space-y-1">
            <p className="font-bold text-gray-600">
              Thank you for trusting SubziQuick — Delivering Bhopal&apos;s Freshest Harvest!
            </p>
            <p className="font-mono text-gray-400">
              This is a computer-generated tax invoice. No physical signature is required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
