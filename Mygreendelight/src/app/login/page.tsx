"use client";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  Leaf,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        try {
          const checkRes = await fetch("/api/me");
          if (checkRes.ok) {
            const meData = await checkRes.json();
            if (meData?.role === "admin") {
              window.location.href = "/admin";
              return;
            } else if (meData?.role === "deliveryboy") {
              window.location.href = "/deliveryboy";
              return;
            }
          }
        } catch (_) {}

        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl");
        window.location.href = callbackUrl || "/";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f4] flex flex-col justify-between relative overflow-x-hidden font-sans">
      {/* Background Soft Glow Accents for Desktop / Tablet */}
      <div className="hidden sm:block absolute -top-28 -left-28 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute -bottom-28 -right-28 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Back to Store Pill */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-stone-800 text-xs font-bold shadow-xs border border-white/60 backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowLeft size={14} className="text-[#0a3d24]" />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Main Container - Responsive across Mobile, Tablet, Desktop */}
      <div className="flex-1 flex items-center justify-center sm:p-6 md:p-8 lg:p-10 w-full">
        <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-4xl bg-white sm:rounded-[32px] sm:shadow-[0_20px_50px_-15px_rgba(10,61,36,0.15)] sm:border sm:border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-screen sm:min-h-0">
          
          {/* ============================================================== */}
          {/* 1. MOBILE TOP ORGANIC WAVE HEADER (Visible on Mobile & Tablet) */}
          {/* ============================================================== */}
          <div className="lg:hidden relative bg-gradient-to-b from-[#072817] via-[#0a3d24] to-[#0d4a2d] text-white pt-14 pb-10 px-6 overflow-hidden flex flex-col items-center text-center">
            {/* Ambient Background Blur Rings */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

            {/* Pattern/Icon watermark overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Brand Logo & Emblem */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/15 shadow-lg flex items-center justify-center mb-3">
                <Image
                  src="/logo-icon.png"
                  alt="SubziQuick Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  priority
                  unoptimized
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight font-[family-name:var(--font-brand-serif),serif] text-white">
                  Subzi<span className="text-emerald-300">Quick</span>
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-200/80 tracking-wide uppercase mt-0.5">
                Bhopal • Farm Fresh in 10-15 Mins
              </span>
            </div>

            {/* Inspiring Subtitle */}
            <div className="relative z-10 mt-5">
              <h2 className="text-lg sm:text-xl font-black text-white">Welcome Back! 👋</h2>
              <p className="text-xs text-emerald-100/70 mt-0.5 max-w-xs font-medium">
                Log in to order fresh farm produce & check order status
              </p>
            </div>

            {/* SVG Organic Wave Divider at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
              <svg
                viewBox="0 0 500 40"
                preserveAspectRatio="none"
                className="w-full h-6 text-white fill-current"
              >
                <path d="M0,25 C150,50 350,0 500,25 L500,40 L0,40 Z" />
              </svg>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. DESKTOP LEFT VISUAL BRAND PANEL (Visible on Desktop >= 1024px) */}
          {/* ============================================================== */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#062013] via-[#0a3d24] to-[#082e1b] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
            {/* Glowing Accent Orbs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Logo & Branding */}
            <div className="relative z-10">
              <Logo variant="white" />
              <div className="mt-8 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider text-emerald-300">
                  <Sparkles size={12} className="text-amber-300 animate-pulse" />
                  <span>Bhopal Farm Direct</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Taaza Sabzi. <br />
                  Direct Kisan Fresh Rates.
                </h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                  Directly harvested at 4:30 AM and delivered in 10-15 minutes across Bhopal societies.
                </p>
              </div>
            </div>

            {/* Value Perks */}
            <div className="space-y-3 my-6 relative z-10">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block leading-tight">10-15 Min Express Dispatch</span>
                  <span className="text-[10.5px] text-emerald-200/70">Arera, Kolar, MP Nagar & across Bhopal</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Leaf size={16} />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block leading-tight">100% Hand-Graded & Cleaned</span>
                  <span className="text-[10.5px] text-emerald-200/70">Zero rotten pieces, pure farm fresh</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block leading-tight">Doorstep Quality Guarantee</span>
                  <span className="text-[10.5px] text-emerald-200/70">Check at door or get instant UPI refund</span>
                </div>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/70 font-semibold relative z-10">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>5,000+ Happy Families</span>
              </span>
              <span>⭐ 4.9/5 Rating</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. RIGHT / MAIN FORM PANEL (Mobile, Tablet, Desktop) */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
            
            {/* Desktop Brand Header */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Enter your registered details to access your account & cart
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle size={15} className="text-rose-600 shrink-0" />
                <span className="font-bold flex-1 leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 outline-none focus:bg-white focus:border-[#0a3d24] focus:ring-2 focus:ring-[#0a3d24]/15 transition placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-11 py-3 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 outline-none focus:bg-white focus:border-[#0a3d24] focus:ring-2 focus:ring-[#0a3d24]/15 transition placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3.5 rounded-2xl bg-[#0a3d24] hover:bg-[#072817] text-white font-black text-xs sm:text-sm shadow-md shadow-[#0a3d24]/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-stone-200" />
              <span className="px-3 text-stone-400 text-[10.5px] font-bold uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-1 border-t border-stone-200" />
            </div>

            {/* Google Authentication Button */}
            <button
              onClick={async () => {
                try {
                  setGoogleLoading(true);
                  await signIn("google", {
                    callbackUrl: "/",
                  });
                } catch (error) {
                  console.error("Google signin error:", error);
                  setGoogleLoading(false);
                }
              }}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2.5 border border-stone-200 py-3 rounded-2xl bg-white hover:bg-stone-50 hover:border-stone-300 transition-all active:scale-[0.98] disabled:opacity-70 shadow-2xs cursor-pointer font-bold text-xs sm:text-sm text-stone-700"
            >
              {googleLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#0a3d24]" />
                  <span>Connecting Google...</span>
                </>
              ) : (
                <>
                  <FcGoogle className="w-4 h-4 text-base shrink-0" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Switch to Register */}
            <p className="text-center text-xs text-stone-500 font-medium mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#0a3d24] font-black hover:underline underline-offset-2"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

