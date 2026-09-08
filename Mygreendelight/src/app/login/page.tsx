"use client";

import {
  ArrowLeft,
  Leaf,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Clock,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

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
        // Fetch current user profile to determine role-based redirect
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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans p-4 sm:p-6 lg:p-8">
      
      {/* Background Ambient Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs backdrop-blur-md transition-all active:scale-95 text-xs font-bold"
      >
        <ArrowLeft size={16} />
        <span>Back to Store</span>
      </Link>

      {/* Main Responsive Split Auth Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Visual Hero Panel (Desktop & Tablet) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0a2e1d] via-[#0f4d30] to-[#072416] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Emblem */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 transition">
              <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                <Leaf size={15} />
              </div>
              <span className="font-black text-sm tracking-tight text-white">SubziQuick</span>
            </Link>

            <div className="mt-8 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-yellow-300 animate-pulse" />
                <span>Bhopal Farm Fresh</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                Fresh Produce, Delivered in 10-15 Mins.
              </h2>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                Directly harvested from local Madhya Pradesh farms to your doorstep with zero plastic waste.
              </p>
            </div>
          </div>

          {/* Value Perks List */}
          <div className="space-y-3.5 my-8 relative z-10">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <span className="font-bold text-xs text-white block leading-tight">Instant Express Delivery</span>
                <span className="text-[10.5px] text-emerald-200/70">10-15 min dispatch across Bhopal</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Leaf size={16} />
              </div>
              <div>
                <span className="font-bold text-xs text-white block leading-tight">100% Organically Sourced</span>
                <span className="text-[10.5px] text-emerald-200/70">Fresh 4 AM harvest batches daily</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <span className="font-bold text-xs text-white block leading-tight">Secure Doorstep OTP</span>
                <span className="text-[10.5px] text-emerald-200/70">Zero-fraud verified order handover</span>
              </div>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/70 font-semibold relative z-10">
            <span>🌿 5,000+ Happy Families</span>
            <span>⭐ 4.9/5 Rating</span>
          </div>
        </div>

        {/* Right Form Panel (Desktop & Mobile) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Mobile Brand Header */}
          <div className="text-center lg:text-left mb-6">
            <div className="inline-flex lg:hidden items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-2xl border border-emerald-200 mb-3 shadow-2xs">
              <Leaf size={14} className="text-[#0f8646]" />
              <span className="font-black text-xs">SubziQuick Bhopal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Sign in to manage your orders, wallet points & subscriptions
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200/90 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span className="font-bold flex-1 leading-tight">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-[#0f8646]/15 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-[#0f8646]/15 transition placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
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
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#0f8646] to-emerald-600 hover:from-[#0c6a38] hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-900/10 transition-all active:scale-98 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to SubziQuick</span>
              )}
            </button>
          </form>

          {/* Minimalist Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-slate-200/80" />
            <span className="px-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-1 border-t border-slate-200/80" />
          </div>

          {/* Official Google Login Button */}
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
            className="w-full flex items-center justify-center gap-3 border border-slate-200/90 py-3 rounded-2xl bg-white hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-98 disabled:opacity-70 shadow-2xs cursor-pointer font-bold text-xs text-slate-700"
          >
            {googleLoading ? (
              <>
                <Loader2 size={16} className="animate-spin text-[#0f8646]" />
                <span>Redirecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer Switch to Register */}
          <p className="text-center text-xs text-slate-500 font-medium mt-6">
            New to SubziQuick?{" "}
            <Link
              href="/register"
              className="text-[#0f8646] font-black hover:text-emerald-700 transition underline underline-offset-2"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
