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
            Daily 6:00 AM to 1:00 PM Fresh Morning Deliveries from Amrai, Bagsewaniya, Bhopal
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs space-y-8 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Zap size={18} className="text-[#0f8646]" />
              <span>1. Daily Delivery Slots & Operational Hours</span>
            </h2>
            <p className="text-xs text-gray-600">
              Hamara store subah <strong>6:00 AM se dopehar 1:00 PM</strong> tak active rehta hai taaki aapko subah ka sabse taaza harvest mile:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                <span className="font-extrabold text-[#0f8646] block text-sm mb-1">Slot 1: Early Morning</span>
                <p className="text-gray-600">6:00 AM – 8:30 AM (Sunrise Pooja & Breakfast Essentials)</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="font-extrabold text-amber-800 block text-sm mb-1">Slot 2: Mid Morning</span>
                <p className="text-gray-600">8:30 AM – 11:00 AM (Daily Kitchen & Lunch Produce)</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="font-extrabold text-blue-800 block text-sm mb-1">Slot 3: Afternoon Express</span>
                <p className="text-gray-600">11:00 AM – 1:00 PM (Quick Top-Up & Daily Staples)</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-[#0f8646]" />
              <span>2. Store Location & Delivery Coverage Area</span>
            </h2>
            <p>
              <strong>Central Store Address:</strong> Amrai, Bagsewaniya, Bhopal, MP - 462043.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Covered Areas in Bhopal:</strong> Bagsewaniya, Amrai, AIIMS, Saket Nagar, Hoshangabad Road, MP Nagar, Arera Colony, Gulmohar, Kolar Road, Shahpura, Chunabhatti, aur aas-paas ke sabhi Bhopal sectors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-[#0f8646]" />
              <span>3. Delivery Charges & Free Shipping Threshold</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li><strong>FREE Delivery:</strong> Available on all orders with cart subtotal above <strong>₹199</strong>.</li>
              <li><strong>Nominal Partner Fee:</strong> A small fee applies on smaller orders to support our delivery fleet.</li>
              <li><strong>Zero Packaging Surcharge:</strong> Clean, hygienic, eco-friendly produce packaging with zero hidden charges.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
