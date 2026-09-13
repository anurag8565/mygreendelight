"use client";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Sparkles,
  Clock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Gift,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

interface RegisterformProps {
  onBack?: () => void;
}

export default function Registerform({ onBack }: RegisterformProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      const result = await axios.post("/api/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password,
      });

      if (result.data) {
        // Auto-sign in user right after registration
        const res = await signIn("credentials", {
          redirect: false,
          email: cleanEmail,
          password,
        });

        if (res?.ok) {
          window.location.href = "/";
        } else {
          router.push("/login");
        }
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please check your details.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f4] flex flex-col justify-between relative overflow-x-hidden font-sans">
      {/* Background Soft Glow Accents */}
      <div className="hidden sm:block absolute -top-28 -left-28 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute -bottom-28 -right-28 w-96 h-96 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Back Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-stone-800 text-xs font-bold shadow-xs border border-white/60 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={14} className="text-[#0a3d24]" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center sm:p-6 md:p-8 lg:p-10 w-full">
        <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-4xl bg-white sm:rounded-[32px] sm:shadow-[0_20px_50px_-15px_rgba(10,61,36,0.15)] sm:border sm:border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-screen sm:min-h-0">
          
          {/* ============================================================== */}
          {/* 1. MOBILE TOP ORGANIC WAVE HEADER (Visible on Mobile & Tablet) */}
          {/* ============================================================== */}
          <div className="lg:hidden relative bg-gradient-to-b from-[#072817] via-[#0a3d24] to-[#0d4a2d] text-white pt-14 pb-10 px-6 overflow-hidden flex flex-col items-center text-center">
            {/* Background Blur Rings */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/20 rounded-full blur-xl pointer-events-none" />

            {/* Pattern watermark overlay */}
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

            {/* Subtitle */}
            <div className="relative z-10 mt-5">
              <h2 className="text-lg sm:text-xl font-black text-white">Join SubziQuick 🌱</h2>
              <p className="text-xs text-emerald-100/70 mt-0.5 max-w-xs font-medium">
                Create a free account to unlock farm rates & fast delivery
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
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-green-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Logo & Branding */}
            <div className="relative z-10">
              <Logo variant="white" />
              <div className="mt-8 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider text-emerald-300">
                  <Sparkles size={12} className="text-amber-300 animate-pulse" />
                  <span>Join & Unlock Perks</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Farm Fresh Living <br />
                  Starts Right Here.
                </h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                  Create your free account to enjoy instant 10-15 min deliveries, zero platform fees, and fresh harvest.
                </p>
              </div>
            </div>

            {/* Value Perks */}
            <div className="space-y-3 my-6 relative z-10">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Gift size={16} />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block leading-tight">Member Welcome Discounts</span>
                  <span className="text-[10.5px] text-emerald-200/70">Save extra on first 3 orders</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block leading-tight">10-15 Min Express Dispatch</span>
                  <span className="text-[10.5px] text-emerald-200/70">Sunrise farm harvest daily</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block leading-tight">Doorstep Quality Guarantee</span>
                  <span className="text-[10.5px] text-emerald-200/70">Check at door or instant UPI refund</span>
                </div>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/70 font-semibold relative z-10">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>100% Bhopal Local</span>
              </span>
              <span>🌱 Chemical Safe</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. RIGHT / MAIN FORM PANEL (Mobile, Tablet, Desktop) */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
            
            {/* Desktop Brand Header */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Join SubziQuick to start ordering fresh produce & groceries
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle size={15} className="text-rose-600 shrink-0" />
                <span className="font-bold flex-1 leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Anurag Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 outline-none focus:bg-white focus:border-[#0a3d24] focus:ring-2 focus:ring-[#0a3d24]/15 transition placeholder:text-stone-400"
                  />
                </div>
              </div>

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
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3.5 rounded-2xl bg-[#0a3d24] hover:bg-[#072817] text-white font-black text-xs sm:text-sm shadow-md shadow-[#0a3d24]/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Free Account</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-stone-200" />
              <span className="px-3 text-stone-400 text-[10.5px] font-bold uppercase tracking-wider">
                Or Register With
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
                  console.error("Google register error:", error);
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

            {/* Switch to Login */}
            <p className="text-center text-xs text-stone-500 font-medium mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#0a3d24] font-black hover:underline underline-offset-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
