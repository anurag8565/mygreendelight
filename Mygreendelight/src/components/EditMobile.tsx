"use client";

import { Phone, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSession } from "next-auth/react";

function EditMobile() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { update } = useSession();

  // Indian 10-digit mobile validation (starts with 6,7,8,9)
  const cleanMobile = mobile.trim().replace(/[^0-9]/g, "");
  const isValidMobile = /^[6-9][0-9]{9}$/.test(cleanMobile);
  const canSave = isValidMobile && !loading;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSave) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await axios.post("/api/user/editrolemobile", {
        mobile: cleanMobile,
      });

      if (result.data) {
        await update();
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message ||
          "Could not save mobile number. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-green-100 shadow-xl"
      >
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-green-100 text-[#0f8646] flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Phone size={30} />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0f8646] bg-green-50 px-3 py-1 rounded-full border border-green-200 inline-flex items-center gap-1 mb-2">
            <Sparkles size={11} /> 1-Step Quick Setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
            Add Mobile Number
          </h1>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Enter your 10-digit mobile number for same-day delivery updates, live rider tracking, and OTP verification.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
              Mobile Number *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-600 font-black text-xs bg-gray-100 px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoFocus
                required
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => {
                  setErrorMsg("");
                  setMobile(e.target.value.replace(/[^0-9]/g, ""));
                }}
                className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base font-black text-gray-900 outline-none focus:border-[#0f8646] focus:bg-white tracking-wider transition"
              />
            </div>
            {!isValidMobile && cleanMobile.length > 0 && (
              <p className="text-rose-600 text-[11px] font-bold mt-1.5 pl-1">
                Please enter a valid 10-digit mobile number (e.g. 9981418565)
              </p>
            )}
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
            <ShieldCheck size={18} className="text-[#0f8646] shrink-0" />
            <span>100% Private & Safe. Used strictly for grocery delivery.</span>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={!canSave}
            className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              canSave
                ? "bg-[#0f8646] hover:bg-[#0c6a38] text-white shadow-emerald-900/15 hover:scale-[1.01] cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Mobile Number...</span>
              </div>
            ) : (
              <>
                <span>Continue to SubziQuick</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default EditMobile;