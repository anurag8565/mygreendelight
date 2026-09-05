"use client";

import React from "react";
import {
  Printer,
  X,
  Package,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs print:p-0 print:bg-white">
      {/* Slip Modal Container */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-gray-100 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        {/* Modal Top Controls (Hidden on Print) */}
        <div className="bg-gray-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#0f8646]" />
            <span className="font-extrabold text-sm">
              Bag Dispatch Slip #{orderShortId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
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
        <div className="p-6 overflow-y-auto flex-1 text-gray-800 font-sans print:p-2">
          {/* Brand Header */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3">
            <h2 className="text-lg font-black tracking-tight text-gray-900">
              SUBZIQUICK
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              10-15 Min Farm Fresh Grocery Bhopal
            </p>
            <div className="mt-2 bg-gray-100 py-1 px-3 rounded-lg inline-block text-xs font-black text-gray-900 border border-gray-200">
              BAG SLIP #{orderShortId}
            </div>
          </div>

          {/* Delivery & Customer Details */}
          <div className="space-y-1.5 text-xs border-b-2 border-dashed border-gray-300 pb-3 mb-3">
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Placed On:</span>
              <span className="font-bold text-gray-900">{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Customer:</span>
              <span className="font-extrabold text-gray-900">
                {order.address?.fullname || order.user?.name || "Customer"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Mobile:</span>
              <span className="font-extrabold text-gray-900">
                {order.address?.mobile || order.user?.mobile || "N/A"}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-gray-500 font-bold block text-[11px]">
                Drop Address:
              </span>
              <p className="font-extrabold text-gray-900 text-xs leading-snug mt-0.5">
                {order.address?.fulladress || "Bhopal, MP"}
              </p>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500 font-bold">Payment:</span>
              <span className="font-black text-gray-900 uppercase">
                {order.paymentmethod === "online" ? "PREPAID (ONLINE)" : `COLLECT ₹${order.totalamount} (COD)`}
              </span>
            </div>
          </div>

          {/* Item Checklist for Bag Packing */}
          <div className="border-b-2 border-dashed border-gray-300 pb-3 mb-3">
            <div className="flex justify-between text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">
              <span>Items Checklist ({order.items?.length || 0})</span>
              <span>Packed?</span>
            </div>

            <div className="space-y-2">
              {order.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs font-bold text-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-gray-400 print:border-black flex items-center justify-center shrink-0" />
                    <span>
                      {item.name}{" "}
                      <span className="text-[10px] text-gray-500 font-normal">
                        ({item.unit})
                      </span>
                    </span>
                  </div>
                  <span className="font-black text-gray-900">
                    × {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Rider & OTP Verification Box */}
          <div className="text-xs space-y-2 text-center bg-gray-50 p-3 rounded-2xl border border-gray-200 print:bg-white print:border-black">
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-600">
              <span>Assigned Fleet Rider:</span>
              <span className="font-extrabold text-gray-900">
                {order.assigneddelliveryboy?.name || "Fleet Dispatch"}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
              <span className="font-black text-xs text-gray-800">
                Customer Delivery OTP:
              </span>
              <div className="border border-dashed border-gray-400 px-3 py-1 rounded-lg text-xs font-mono font-black text-gray-900 bg-white">
                [ _ _ _ _ ]
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-center mt-3 text-[10px] text-gray-400 font-bold">
            *** Thank you for choosing SubziQuick Freshness! ***
          </div>
        </div>
      </div>
    </div>
  );
}
