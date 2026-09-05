"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  Home,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/Logo";

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
        // Auto sign-in right after registration
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

  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-400/15 rounded-full blur-3xl" />
      </div>

      {/* Main Split Authentication Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-gray-100/80 overflow-hidden grid lg:grid-cols-12 relative z-10">
        
        {/* ================= LEFT COLUMN: HERO & BRAND STORY (5 Cols) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#063319] via-[#094824] to-[#0f8646] text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle background decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <Link href="/" className="inline-block mb-6">
              <Logo variant="white" showTagline={true} />
            </Link>

            <div className="space-y-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-emerald-200 border border-white/10">
                <Sparkles size={13} className="text-yellow-300" />
                <span>Create Your Account</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Fresh Farm Produce, <br />
                <span className="text-emerald-300">Direct to Your Kitchen.</span>
              </h2>
              <p className="text-xs sm:text-sm text-green-100/80 leading-relaxed pt-1">
                Join thousands of happy Bhopal households getting farm-fresh veggies & fruits at authentic wholesale rates.
              </p>
            </div>
          </div>

          {/* Member Benefits Highlights */}
          <div className="my-8 space-y-3.5 relative z-10">
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Leaf size={16} />
              </div>
              <div>
                <span className="font-extrabold text-xs text-white block">100% Ozone-Washed Produce</span>
                <span className="text-[10px] text-green-200/70">Cleaned & graded at Karond Mandi hub</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Truck size={16} />
              </div>
              <div>
                <span className="font-extrabold text-xs text-white block">Morning & Evening Delivery</span>
                <span className="text-[10px] text-green-200/70">Delivered right to your doorstep across Bhopal</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <span className="font-extrabold text-xs text-white block">Zero Risk Guarantee</span>
                <span className="text-[10px] text-green-200/70">Instant refund or replacement on handoff</span>
              </div>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-green-200/70 relative z-10">
            <span>Amrai, Bagsewaniya, Bhopal</span>
            <span className="font-mono text-emerald-300 font-bold">+91 99814 18565</span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE SIGNUP FORM (7 Cols) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          
          {/* Top Switcher & Home Button */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-6">
              {/* Tabs Switcher */}
              <div className="flex items-center bg-gray-100/90 p-1 rounded-2xl border border-gray-200/70 text-xs font-black">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-gray-500 hover:text-gray-900 transition"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-white text-gray-900 shadow-xs cursor-default"
                >
                  Create Account
                </button>
              </div>

              {/* Back to Home Link */}
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0f8646] transition bg-gray-50 hover:bg-emerald-50 px-3 py-2 rounded-xl border border-gray-200/80"
              >
                <Home size={14} />
                <span className="hidden sm:inline">Store</span>
              </Link>
            </div>

            {/* Form Title */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Get Started with SubziQuick 🌱
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Create an account to order fresh mandi produce with fast same-day delivery
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl flex items-center gap-2.5 animate-shake shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center shrink-0 text-[11px] font-black">
                  !
                </span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1-Click Google OAuth Button */}
            <button
              type="button"
              onClick={async () => {
                try {
                  setGoogleLoading(true);
                  await signIn("google", { callbackUrl: "/" });
                } catch (error) {
                  setGoogleLoading(false);
                }
              }}
              disabled={googleLoading}
              className="w-full py-3.5 px-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-black flex items-center justify-center gap-3 transition-all hover:shadow-md cursor-pointer disabled:opacity-60 mb-5"
            >
              {googleLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-[#0f8646] border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  {/* Official Multi-colored Google Vector Logo */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Sign up with Google (1-Click)</span>
                </>
              )}
            </button>

            {/* Clean Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Or sign up with email
              </span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Anurag Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 pl-10 pr-11 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-emerald-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create SubziQuick Account ➔</span>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Help & Switch to Login */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-black text-[#0f8646] hover:underline"
              >
                Sign In Instead
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#0f8646]" /> 100% Data Privacy
              </span>
              <span>•</span>
              <a
                href="https://wa.me/919981418565"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600"
              >
                Need Help? WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}