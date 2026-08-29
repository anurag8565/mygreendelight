"use client";

import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Truck, MapPin, Clock, Zap, CheckCircle2 } from "lucide-react";

export default function ShippingPolicyPage() {
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center mb-4">
            <Truck size={24} />
          </div>
          <span className="text-xs font-black uppercase text-[#0f8646] tracking-wider block mb-1">
            Fast Delivery Promise
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            10-15 Min Express & Slot-Based Dispatch Across Bhopal, MP
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs space-y-8 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Zap size={18} className="text-[#0f8646]" />
              <span>1. Delivery Speed & Time Slots</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                <span className="font-extrabold text-[#0f8646] block text-sm mb-1">Instant Express</span>
                <p className="text-gray-600">Dispatched in 10-15 mins. Delivered in under 30-45 minutes straight from nearest hub.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="font-extrabold text-amber-800 block text-sm mb-1">Morning Mandi Batch</span>
                <p className="text-gray-600">Fresh morning harvest delivered between 7:00 AM - 9:00 AM.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="font-extrabold text-blue-800 block text-sm mb-1">Evening Fresh Batch</span>
                <p className="text-gray-600">Dinner preparation produce delivered between 5:00 PM - 8:00 PM.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-[#0f8646]" />
              <span>2. Delivery Coverage Area</span>
            </h2>
            <p>
              MyGreenDelight currently operates hyper-local delivery hubs covering all major Bhopal zones:
            </p>
            <p className="text-xs text-gray-600">
              <strong>Covered Areas:</strong> MP Nagar (Zone I & II), Arera Colony (E1-E8), Kolar Road, Shahpura, Gulmohar, Bittan Market, Hoshangabad Road, TT Nagar, New Market, Shivaji Nagar, Chunabhatti, Saket Nagar, and surrounding Bhopal localities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-[#0f8646]" />
              <span>3. Delivery Charges & Free Shipping Threshold</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li><strong>FREE Delivery:</strong> Available on all orders with cart subtotal above <strong>₹299</strong> (or ₹499 depending on promotion).</li>
              <li><strong>Nominal Partner Fee:</strong> A flat ₹30-₹40 delivery fee applies to small basket orders below the threshold to support our local Bhopal delivery fleet.</li>
              <li><strong>Zero Packaging Surcharge:</strong> We use eco-friendly kraft paper and reusable produce bags with no extra packing cost.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
