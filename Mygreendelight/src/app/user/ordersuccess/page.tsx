"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/CartSlice";
import { useEffect } from "react";

export default function OrderSuccess() {
  useGetMe();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between font-sans">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-3xl mx-auto px-4 py-12 pb-32 sm:pb-16 w-full flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 shadow-sm w-full"
        >
          {/* Animated Success Badge */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-gradient-to-tr from-[#0f8646] to-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-700/20">
              <CheckCircle2 size={48} className="stroke-[2.5]" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-[#0f8646] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Sparkles size={14} /> ORDER CONFIRMED
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Thank You for Your Order!
          </h1>

          <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Your farm-fresh harvest is being handpicked and packed at our nearest Bhopal Hub. Our express rider will reach you in <strong>10–15 minutes!</strong>
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-left">
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-[#0f8646] mb-1">
                <Clock size={16} />
                <span className="font-extrabold text-xs text-gray-900">10-15 Mins</span>
              </div>
              <p className="text-[10px] text-gray-500">Express Delivery</p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-[#0f8646] mb-1">
                <ShieldCheck size={16} />
                <span className="font-extrabold text-xs text-gray-900">100% Organic</span>
              </div>
              <p className="text-[10px] text-gray-500">Farm Verified</p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-[#0f8646] mb-1">
                <Truck size={16} />
                <span className="font-extrabold text-xs text-gray-900">Live GPS</span>
              </div>
              <p className="text-[10px] text-gray-500">Rider Navigation</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/user/myorder"
              className="w-full sm:w-auto flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck size={16} />
              <span>Track Live Delivery</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto flex-1 bg-white border border-gray-300 hover:border-green-500 text-gray-700 hover:text-[#0f8646] py-3.5 px-6 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}