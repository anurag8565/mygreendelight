"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Star,
  Sparkles,
  Leaf,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Hero({ banner }: { banner?: any }) {
  const title = banner?.title || "Daily Fresh Essentials";
  const subtitle = banner?.subtitle || "Delivered to Your Doorstep";
  const image = banner?.image || "/hero_basket.jpg";
  const btnText = banner?.btnText || "Shop Now";
  const link = banner?.link || "/shop";

  return (
    <div className="w-full bg-gradient-to-b from-[#f2f9f5] via-[#f7fcf9] to-white overflow-hidden relative min-h-auto sm:min-h-[500px] flex items-center py-6 sm:py-12 border-b border-green-100/60">
      {/* Decorative ambient background glows */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-10 w-[480px] h-[480px] bg-green-200/40 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-10 w-[380px] h-[380px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row items-center justify-between relative z-10 gap-6 sm:gap-10">
        
        {/* Left Content with Staggered Entry */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 flex flex-col items-start z-20 max-w-2xl"
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white border border-green-200 text-[#0f8646] text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 sm:mb-6 shadow-xs"
          >
            <Zap size={14} className="fill-[#0f8646] animate-pulse text-[#0f8646]" />
            <span>Fast Grocery Delivery in Bhopal</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.2] sm:leading-[1.15] mb-3 sm:mb-5 tracking-tight"
          >
            {title} <br />
            <span className="text-[#0f8646]">{subtitle}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-600 text-sm sm:text-base mb-8 max-w-lg leading-relaxed"
          >
            Get 100% farm-fresh vegetables, organic fruits, dairy & daily household groceries delivered safely at honest prices.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <Link href={link}>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-green-700/20 hover:shadow-green-700/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                {btnText} <ArrowRight size={18} />
              </motion.button>
            </Link>

            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white hover:bg-green-50 text-gray-700 hover:text-[#0f8646] border border-gray-200 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-xs cursor-pointer"
              >
                About Us
              </motion.button>
            </Link>
          </motion.div>

          {/* Features Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-green-200/60 w-full"
          >
            <div className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white border border-green-100 flex items-center justify-center text-[#0f8646] shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs sm:text-sm text-gray-900">100% Fresh</span>
                <span className="text-[10px] text-gray-500">Quality Checked</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white border border-green-100 flex items-center justify-center text-[#0f8646] shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                <Truck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs sm:text-sm text-gray-900">On-Time</span>
                <span className="text-[10px] text-gray-500">Fast Delivery</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white border border-green-100 flex items-center justify-center text-[#0f8646] shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs sm:text-sm text-gray-900">Best Price</span>
                <span className="text-[10px] text-gray-500">Direct from Farms</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Hero Visual with Continuous Floating Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 flex justify-center items-center relative"
        >
          <div className="relative w-full max-w-[460px]">
            {/* Main Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-3 rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-auto max-h-[380px] object-cover rounded-2xl"
              />
            </motion.div>

            {/* Continuous Floating Badge 1: Customer Rating */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Star size={20} className="fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  4.9 / 5.0 Rating
                </p>
                <p className="text-[10px] text-gray-500">10,000+ Happy Customers</p>
              </div>
            </motion.div>

            {/* Continuous Floating Badge 2: Free Delivery */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-3 -right-3 bg-[#0f8646] text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-extrabold flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-yellow-300" />
              <span>FREE Delivery &gt; ₹499</span>
            </motion.div>

            {/* Continuous Floating Badge 3: 100% Organic */}
            <motion.div
              animate={{ x: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -left-6 bg-white/95 border border-green-100 px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-extrabold text-[#0f8646] hidden sm:flex items-center gap-1.5"
            >
              <Leaf size={14} /> 100% Organic
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}