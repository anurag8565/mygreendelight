"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Milk,
  Egg,
  Salad,
  X,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [frequency, setFrequency] = useState<"daily" | "alternate_days" | "weekdays">("daily");
  const [address, setAddress] = useState({
    fullname: "",
    mobile: "",
    fulladress: "",
    city: "Bhopal",
    pincode: "462001",
  });
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "cod">("wallet");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const curatedPacks = [
    {
      id: "pack-milk",
      name: "Daily A2 Cow Milk & Breakfast Basket",
      tag: "🔥 Most Popular in Bhopal",
      badgeColor: "bg-orange-100 text-orange-700",
      icon: <Milk className="text-blue-600" size={24} />,
      price: 115,
      items: [
        { name: "Desi A2 Gir Cow Milk (Pouch)", unit: "1 Litre", price: 65, quantity: 1, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80" },
        { name: "Fresh Artisanal Brown Bread", unit: "1 Loaf (400g)", price: 35, quantity: 1, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80" },
        { name: "Farm Fresh Brown Eggs", unit: "6 Pcs", price: 50, quantity: 1, image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=300&q=80" },
      ],
      desc: "Taaza A2 Doodh, bread aur eggs roz subah 7:00 AM aapke doorstep par delivered.",
    },
    {
      id: "pack-greens",
      name: "Daily Morning Farm Veggie Basket",
      tag: "🥬 100% Pesticide-Free",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: <Salad className="text-emerald-600" size={24} />,
      price: 65,
      items: [
        { name: "Sehore Desi Palak (Spinach)", unit: "250 g", price: 18, quantity: 1, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80" },
        { name: "Farm Fresh Dhaniya & Hari Mirch", unit: "100 g", price: 15, quantity: 1, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80" },
        { name: "Red Ripe Desi Tomatoes", unit: "500 g", price: 20, quantity: 1, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" },
        { name: "Fresh Hybrid Lemon", unit: "2 Pcs", price: 12, quantity: 1, image: "https://images.unsplash.com/photo-1534856966150-c832f7b7f09a?auto=format&fit=crop&w=300&q=80" },
      ],
      desc: "Roz ki taaza sabziyan aur masala kit har subah bina manually order kiye.",
    },
    {
      id: "pack-protein",
      name: "High Protein Fitness & Paneer Pack",
      tag: "💪 Gym & Healthy Living",
      badgeColor: "bg-purple-100 text-purple-700",
      icon: <Egg className="text-amber-600" size={24} />,
      price: 185,
      items: [
        { name: "Desi A2 Gir Cow Milk", unit: "1 Litre", price: 65, quantity: 1, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80" },
        { name: "Fresh A2 Malai Paneer", unit: "200 g", price: 85, quantity: 1, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80" },
        { name: "Farm Free-Range Eggs", unit: "6 Pcs", price: 50, quantity: 1, image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=300&q=80" },
      ],
      desc: "Clean farm protein power delivered fresh every morning before your workout.",
    },
  ];

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get("/api/user/subscriptions");
      if (res.data.success) {
        setSubscriptions(res.data.subscriptions || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const res = await axios.patch("/api/user/subscriptions", {
        id,
        status: newStatus,
      });
      if (res.data.success) {
        setMsg({ type: "success", text: res.data.message });
        fetchSubscriptions();
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to update status" });
    }
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPack) return;
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await axios.post("/api/user/subscriptions", {
        planName: selectedPack.name,
        items: selectedPack.items,
        frequency,
        deliveryAddress: address,
        paymentMethod,
        totalPerDelivery: selectedPack.price,
      });

      if (res.data.success) {
        setMsg({ type: "success", text: res.data.message });
        setIsModalOpen(false);
        fetchSubscriptions();
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to start subscription" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-md">
                <Milk size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Subah 7:00 AM Morning Subscriptions
                </h1>
                <p className="text-xs text-gray-500">
                  Taaza A2 Doodh, bread, eggs & green vegetables recurring doorstep delivery in Bhopal
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="bg-white border border-gray-200 hover:border-[#0f8646] text-gray-800 hover:text-[#0f8646] px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>Shop Produce</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {msg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Active Subscriptions List */}
        {subscriptions.length > 0 && (
          <div className="mb-10">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-[#0f8646]" />
              <span>My Active Morning Plans</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className={`p-5 rounded-3xl border-2 transition-all bg-white shadow-2xs ${
                    sub.status === "active" ? "border-emerald-500/80" : "border-gray-200 opacity-80"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-1.5 ${
                          sub.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {sub.status === "active" ? "🟢 Active Delivery" : "⏸️ Paused"}
                      </span>
                      <h3 className="font-black text-sm text-gray-900">{sub.planName}</h3>
                      <span className="text-xs text-gray-500 font-medium">
                        Slot: {sub.deliveryTimeSlot}
                      </span>
                    </div>

                    <span className="text-base font-black text-[#0f8646]">
                      ₹{sub.totalPerDelivery}/delivery
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3 mb-4 space-y-1.5 border border-gray-100 text-xs">
                    {sub.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-gray-700 font-medium">
                        <span>
                          {item.quantity}x {item.name} ({item.unit})
                        </span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-400 font-medium">
                      Next: {new Date(sub.nextDeliveryDate).toLocaleDateString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(sub._id, sub.status)}
                      className={`px-3 py-1.5 rounded-xl font-black transition-all flex items-center gap-1 cursor-pointer ${
                        sub.status === "active"
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-green-50 hover:bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {sub.status === "active" ? (
                        <>
                          <PauseCircle size={14} /> <span>Pause Plan</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle size={14} /> <span>Resume Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curated Plans Carousel */}
        <div className="mb-10">
          <div className="mb-4">
            <h2 className="text-base sm:text-xl font-black text-gray-900">
              Select Your Subah 7:00 AM Morning Plan
            </h2>
            <p className="text-xs text-gray-500">
              Pure farm harvest, zero packaging fee, cancel or pause anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {curatedPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs flex flex-col justify-between hover:border-[#0f8646] hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-2xs">
                      {pack.icon}
                    </div>
                    <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${pack.badgeColor}`}>
                      {pack.tag}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-gray-900 mb-1 leading-snug">
                    {pack.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">{pack.desc}</p>

                  <div className="space-y-2 mb-4">
                    {pack.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-800">{item.name}</span>
                        <span className="font-black text-[#0f8646]">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-bold uppercase">Daily Cost</span>
                    <span className="text-2xl font-black text-gray-900">₹{pack.price}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPack(pack);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-2.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Start 7 AM Subscription</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Modal */}
        {isModalOpen && selectedPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#0f8646] block">
                    Confirm Morning Plan
                  </span>
                  <h3 className="text-base font-black text-gray-900">{selectedPack.name}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubscription} className="space-y-3.5">
                {/* Frequency Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "daily", label: "Daily (Roz)" },
                      { id: "alternate_days", label: "Alternate Days" },
                      { id: "weekdays", label: "Mon - Fri Only" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFrequency(f.id as any)}
                        className={`p-2 rounded-xl text-[11px] font-black border transition cursor-pointer ${
                          frequency === f.id
                            ? "bg-[#0f8646] text-white border-[#0f8646]"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Form */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">Bhopal Delivery Address</label>
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={address.fullname}
                    onChange={(e) => setAddress({ ...address, fullname: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Mobile Number"
                    value={address.mobile}
                    onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No, Apartment, Locality (e.g. Arera Colony, MP Nagar)"
                    value={address.fulladress}
                    onChange={(e) => setAddress({ ...address, fulladress: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("wallet")}
                      className={`p-2.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                        paymentMethod === "wallet"
                          ? "bg-green-50 text-[#0f8646] border-[#0f8646]"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      💳 MGD Wallet (Auto-Pay)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-2.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                        paymentMethod === "cod"
                          ? "bg-green-50 text-[#0f8646] border-[#0f8646]"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      💵 Cash on Delivery
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">Daily Plan Total</span>
                    <span className="text-lg font-black text-gray-900">₹{selectedPack.price}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Activating..." : "Confirm & Start 7 AM Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
