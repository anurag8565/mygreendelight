"use client";

import React from "react";
import {
  Printer,
  X,
  Package,
  CheckSquare,
  Clock,
  MapPin,
  Phone,
  User,
  Truck,
  ShieldCheck,
  QrCode,
  BellOff,
} from "lucide-react";

interface OrderPackingSlipModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderPackingSlipModal({
  order,
  isOpen,
  onClose,
}: OrderPackingSlipModalProps) {
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
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const isPrepaid =
    order.paymentmethod === "online" ||
    order.paymentmethod === "upi" ||
    order.ispaid;

  const totalItemQuantity = (order.items || []).reduce(
    (acc: number, it: any) => acc + (Number(it.quantity) || 1),
    0
  );

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(
    `SUBZIQUICK-ORDER-${order._id}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/75 backdrop-blur-xs print:p-0 print:bg-white print:static">
      {/* Slip Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-gray-100 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Top Controls (Hidden on Print) */}
        <div className="bg-gray-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0f8646] flex items-center justify-center text-white">
              <Package size={16} />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Bag Packing & Dispatch Slip</span>
              <span className="text-[10px] text-gray-400 font-mono">Order #{orderShortId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs hover:shadow-md"
            >
              <Printer size={14} />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Bag Slip Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 text-gray-800 font-sans print:p-3 print:overflow-visible text-xs">
          
          {/* Brand & Order ID Header */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <div className="w-5 h-5 rounded-md bg-[#0f8646] flex items-center justify-center text-white text-[11px] font-black">
                SQ
              </div>
              <h2 className="text-lg font-black tracking-tight text-gray-900">
                SUBZIQUICK
              </h2>
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
              Bhopal Farm Fresh • Dispatch Center
            </p>
            
            <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
              <span className="bg-gray-900 text-white font-mono text-xs font-black px-3 py-1 rounded-lg">
                ORDER #{orderShortId}
              </span>
              <span className="bg-emerald-50 text-[#0f8646] border border-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                {order.deliverySlot || "Instant Fresh Dispatch"}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium block mt-1">
              Placed: {orderDate}
            </span>
          </div>

          {/* Payment Directive Banner */}
          <div className="mb-3">
            {isPrepaid ? (
              <div className="bg-green-100 border-2 border-green-500 rounded-xl p-2.5 text-center font-black text-green-900 text-xs">
                ✓ PREPAID ORDER ({order.paymentmethod?.toUpperCase() || "ONLINE"}) — DO NOT COLLECT CASH
              </div>
            ) : (
              <div className="bg-amber-100 border-2 border-amber-500 rounded-xl p-2.5 text-center font-black text-amber-950 text-xs">
                💵 COLLECT CASH ON DELIVERY: ₹{order.totalamount}
              </div>
            )}
          </div>

          {/* Delivery & Customer Details */}
          <div className="space-y-1.5 bg-gray-50/80 rounded-2xl p-3.5 border border-gray-200 mb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-bold text-[11px]">Customer:</span>
              <span className="font-black text-gray-900 text-xs sm:text-sm">
                {order.address?.fullname || order.user?.name || "Customer"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-bold text-[11px]">Contact No:</span>
              <span className="font-mono font-black text-[#0f8646] text-xs sm:text-sm">
                +91 {order.address?.mobile || order.user?.mobile || "N/A"}
              </span>
            </div>

            <div className="pt-1 border-t border-gray-200/80">
              <span className="text-gray-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
                Delivery Address:
              </span>
              <p className="font-bold text-gray-900 leading-snug">
                {order.address?.fulladress || "Bhopal, MP"}
              </p>
            </div>

            {/* Special Instructions / Quiet Drop */}
            {order.isSilentDelivery && (
              <div className="mt-1 bg-amber-50 border border-amber-200 rounded-lg p-1.5 text-[10px] font-bold text-amber-900 flex items-center gap-1.5">
                <BellOff size={13} className="shrink-0 text-amber-700" />
                <span>🔕 Quiet Drop: Do not ring doorbell. {order.deliveryInstructions || "Leave bag at door."}</span>
              </div>
            )}
          </div>

          {/* Item Checklist for Packers */}
          <div className="border-b-2 border-dashed border-gray-300 pb-3.5 mb-3.5">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-wider mb-2 bg-gray-100 p-1.5 rounded-lg">
              <span>Item Description ({order.items?.length || 0} unique)</span>
              <span>Packed?</span>
            </div>

            <div className="space-y-2">
              {order.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-gray-200/90 p-2 rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md border-2 border-gray-700 print:border-black flex items-center justify-center shrink-0 bg-white" />
                    <div>
                      <span className="font-extrabold text-gray-900 block leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        Unit: {item.variationWeight || item.unit || "1 pack"}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                    × {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total units count */}
            <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-gray-200 text-[11px] font-black text-gray-700">
              <span>Total Produce Items: {totalItemQuantity}</span>
              <span>Total Bag(s) Packed: [ ___ ]</span>
            </div>
          </div>

          {/* Assigned Rider & Customer Delivery OTP Box */}
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-2.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-emerald-900 font-bold flex items-center gap-1">
                <Truck size={13} className="text-[#0f8646]" />
                <span>Assigned Fleet Rider:</span>
              </span>
              <span className="font-black text-gray-900">
                {order.assigneddelliveryboy?.name
                  ? `${order.assigneddelliveryboy.name} (${order.assigneddelliveryboy.mobile || "Assigned"})`
                  : "SubziQuick Hub Express Rider"}
              </span>
            </div>

            <div className="border-t border-emerald-200/80 pt-2 flex items-center justify-between">
              <div>
                <span className="font-black text-xs text-gray-900 block">
                  Delivery Verification OTP:
                </span>
                <span className="text-[9px] text-gray-500">Collect from customer at doorstep</span>
              </div>
              <div className="border-2 border-dashed border-gray-700 px-3 py-1.5 rounded-xl font-mono font-black text-sm text-gray-900 bg-white tracking-widest">
                [ _ _ _ _ ]
              </div>
            </div>
          </div>

          {/* Quality & Packing Verification Footer */}
          <div className="grid grid-cols-2 gap-2 pt-3 text-[10px] text-gray-500">
            <div className="border-t border-gray-200 pt-1">
              <span>Packed By: _______________</span>
            </div>
            <div className="border-t border-gray-200 pt-1 text-right">
              <span>Quality Check: [ ✓ ] Pass</span>
            </div>
          </div>

          <div className="text-center mt-3 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
            *** SubziQuick Farm Fresh Produce • Same Day Bhopal Delivery ***
          </div>
        </div>
      </div>
    </div>
  );
}
