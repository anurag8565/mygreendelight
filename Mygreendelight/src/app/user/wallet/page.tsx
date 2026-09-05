"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Plus,
  ArrowRight,
  Gift,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UserWalletPage() {
  const [balance, setBalance] = useState(0);
  const [totalCashback, setTotalCashback] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAmount, setAddingAmount] = useState<number | "">("");
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const rechargePacks = [
    {
      id: "p1",
      amount: 200,
      bonus: 10,
      total: 210,
      tag: "5% Extra",
      badgeClass: "bg-blue-100 text-blue-700",
    },
    {
      id: "p2",
      amount: 500,
      bonus: 50,
      total: 550,
      tag: "🔥 10% Bonus (Popular)",
      badgeClass: "bg-orange-100 text-orange-700 font-black",
    },
    {
      id: "p3",
      amount: 1000,
      bonus: 150,
      total: 1150,
      tag: "👑 15% Mega Bonus",
      badgeClass: "bg-emerald-100 text-emerald-800 font-black",
    },
  ];

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await axios.get("/api/user/wallet");
      if (res.data.success) {
        setBalance(res.data.balance || 0);
        setTotalCashback(res.data.totalCashback || 0);
        setTransactions(res.data.transactions || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (amount: number, bonus: number = 0) => {
    if (!amount || amount < 10) {
      alert("Minimum top-up amount is ₹10");
      return;
    }
    setIsProcessing(true);
    setMsg(null);

    try {
      const res = await axios.post("/api/user/wallet/initiate", {
        amount,
        packBonus: bonus,
      });

      if (res.data.gateway === "paytm") {
        // Submit Paytm form securely
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `https://securegw.paytm.in/theia/api/v1/showPaymentPage?mid=${res.data.mid}&orderId=${res.data.orderId}`;

        const txnTokenInput = document.createElement("input");
        txnTokenInput.type = "hidden";
        txnTokenInput.name = "txnToken";
        txnTokenInput.value = res.data.txnToken;
        form.appendChild(txnTokenInput);

        const midInput = document.createElement("input");
        midInput.type = "hidden";
        midInput.name = "mid";
        midInput.value = res.data.mid;
        form.appendChild(midInput);

        const orderIdInput = document.createElement("input");
        orderIdInput.type = "hidden";
        orderIdInput.name = "orderId";
        orderIdInput.value = res.data.orderId;
        form.appendChild(orderIdInput);

        document.body.appendChild(form);
        form.submit();
        return;
      }

      if (res.data.success) {
        setMsg({ type: "success", text: res.data.message });
        setBalance(res.data.balance);
        setAddingAmount("");
        setSelectedPack(null);
        fetchWallet();
      }
    } catch (error: any) {
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Failed to initiate payment",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof addingAmount === "number" && addingAmount >= 10) {
      handleTopUp(addingAmount, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-md">
                <Wallet size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  MGD Green Wallet
                </h1>
                <p className="text-xs text-gray-500">
                  0-Second Instant 1-Click Payments + Extra Cashback on every top-up
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
            {msg.type === "success" ? (
              <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Balance Card Banner */}
        <div className="bg-gradient-to-r from-[#07321a] via-[#0b542c] to-[#0f8646] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-green-200/90 block mb-1">
                Available Wallet Balance
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
                ₹{balance.toFixed(2)}
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-300">
                <Gift size={14} />
                <span>Total Lifetime Farm Cashback: ₹{totalCashback.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs">
                <span className="font-bold text-white block">100% Safe & Instant</span>
                <span className="text-[10px] text-green-200">Zero OTP/Bank delays at checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top-up Packs Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs mb-8">
          <h3 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <span>Select Instant Top-up Pack (Extra Cashback Bonus)</span>
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Recharge your wallet and get free extra money credited instantly!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
            {rechargePacks.map((pack) => (
              <div
                key={pack.id}
                onClick={() => setSelectedPack(pack)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPack?.id === pack.id
                    ? "border-[#0f8646] bg-green-50/60 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <div>
                  <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-md inline-block mb-2 ${pack.badgeClass}`}>
                    {pack.tag}
                  </span>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-black text-gray-900">₹{pack.amount}</span>
                    <span className="text-xs font-bold text-green-600">+₹{pack.bonus} Free</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    You get ₹{pack.total} in wallet
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTopUp(pack.amount, pack.bonus);
                  }}
                  disabled={isProcessing}
                  className="mt-3 w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-2 rounded-xl text-xs font-black transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing && selectedPack?.id === pack.id ? "Adding..." : `Add ₹${pack.amount}`}
                </button>
              </div>
            ))}
          </div>

          {/* Custom Amount Form */}
          <form onSubmit={handleCustomTopUp} className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
            <div className="relative flex-1 w-full">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min={10}
                placeholder="Or enter custom amount (e.g. 300)"
                value={addingAmount}
                onChange={(e) => setAddingAmount(e.target.value ? Number(e.target.value) : "")}
                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0f8646] transition"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing || !addingAmount}
              className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isProcessing && !selectedPack ? "Processing..." : "Recharge Wallet"}
            </button>
          </form>
        </div>

        {/* ♻️ Zero-Plastic Eco-Bag Return Mission Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-emerald-700/60 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/20">
              ♻️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-300 text-gray-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                  Zero Plastic Mission
                </span>
                <span className="text-xs text-emerald-200 font-bold">Auto-Wallet Credit</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Return Old Eco-Bags & Earn ₹10 Cashback Every Time!
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed mt-0.5">
                Hand over your previous SubziQuick bags to the delivery partner on arrival. Rider verifies and ₹10 per bag is instantly credited to your GreenPoints Wallet balance.
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="shrink-0 bg-yellow-300 hover:bg-yellow-400 text-gray-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Order Fresh Produce</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Transaction History Log */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs">
          <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-gray-600" />
            <span>Wallet Transaction History</span>
          </h3>

          {transactions.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No wallet transactions yet. Top up today to get welcome bonus!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx: any, idx: number) => (
                <div key={tx._id || idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                        tx.type === "credit"
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {tx.type === "credit" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                        {tx.description}
                      </h4>
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        {new Date(tx.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-sm sm:text-base font-black ${
                      tx.type === "credit" ? "text-green-600" : "text-rose-600"
                    }`}
                  >
                    {tx.type === "credit" ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
