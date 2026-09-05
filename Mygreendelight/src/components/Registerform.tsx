"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
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
  Loader2,
  LogOut,
  UserCheck,
} from "lucide-react";
import Logo from "@/components/Logo";

interface RegisterformProps {
  onBack?: () => void;
}

function RegisterFormContent({ onBack }: RegisterformProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { data: session, status } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authError = searchParams.get("error");

  // Handle URL auth errors (e.g. from OAuth callbacks)
  useEffect(() => {
    if (authError) {
      if (authError === "Configuration") {
        setErrorMessage("Google OAuth setup is pending in Vercel settings. Please create your account with email/password below.");
      } else if (authError.includes("OAuth") || authError === "Callback" || authError === "AccessDenied") {
        setErrorMessage(`Google Sign-Up failed (${authError}). Please create your account with name, email and password below.`);
      } else {
        setErrorMessage(`Authentication error: ${authError}. Please try again.`);
      }
    }
  }, [authError]);

  // If already authenticated, show friendly session card with sign out & proceed options
  if (status === "authenticated" && session?.user) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Background Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-green-400/15 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100/90 text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#0f8646] flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-inner overflow-hidden">
            {session.user.image ? (
              <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCheck size={36} />
            )}
          </div>

          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200 mb-2">
            ✓ Currently Signed In
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Welcome, {session.user.name || "Customer"}!
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-6">
            Signed in as <span className="font-bold text-gray-800">{session.user.email}</span>
          </p>

          <div className="space-y-3">
            <Link
              href={callbackUrl}
              className="w-full py-3.5 rounded-2xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Shopping ➔</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.reload();
              }}
              className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-transparent text-gray-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Log Out / Create New Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          window.location.href = callbackUrl;
        } else {
          router.push(callbackUrl !== "/" ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login");
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
        <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-green-400/15 rounded-full blur-3xl" />
      </div>

      {/* Main Split Authentication Card */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-5xl bg-white rounded-3xl lg:rounded-[32px] shadow-xl sm:shadow-2xl border border-gray-100/90 overflow-hidden grid lg:grid-cols-12 relative z-10">
        
        {/* ================= LEFT COLUMN: HERO & BRAND STORY (Desktop only / lg:flex) ================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#063319] via-[#094824] to-[#0f8646] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
          
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
          <div className="my-8 space-y-3 relative z-10">
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

        {/* ================= RIGHT COLUMN: COMPACT & CLEAN SIGNUP (Mobile + Desktop) ================= */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 flex flex-col justify-between bg-white">
          
          <div>
            {/* Mobile-Only Header Brand Bar */}
            <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <Link href="/" className="inline-block">
                <Logo variant="default" showTagline={false} />
              </Link>
              <span className="text-[10px] font-black uppercase tracking-wide bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/60">
                Bhopal Express
              </span>
            </div>

            {/* Top Switcher & Home Button */}
            <div className="flex items-center justify-between gap-2 mb-5">
              {/* Tabs Switcher */}
              <div className="flex items-center bg-gray-100/90 p-1 rounded-xl sm:rounded-2xl border border-gray-200/70 text-xs font-black">
                <Link
                  href={callbackUrl !== "/" ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-gray-500 hover:text-gray-900 transition text-xs font-bold"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white text-gray-900 shadow-xs cursor-default text-xs font-bold"
                >
                  Create Account
                </button>
              </div>

              {/* Back to Home Link */}
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0f8646] transition bg-gray-50 hover:bg-emerald-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-gray-200/80"
              >
                <Home size={14} />
                <span className="hidden sm:inline">Store</span>
              </Link>
            </div>

            {/* Form Title */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                Create Account 🌱
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Join SubziQuick for fresh mandi produce at wholesale prices
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-shake shadow-2xs">
                <span className="w-4 h-4 rounded-full bg-red-200 text-red-800 flex items-center justify-center shrink-0 text-[10px] font-black">
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
                  await signIn("google", { callbackUrl });
                } catch (error) {
                  setGoogleLoading(false);
                }
              }}
              disabled={googleLoading}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all hover:shadow-sm cursor-pointer disabled:opacity-60 mb-4 sm:mb-5"
            >
              {googleLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0f8646] border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  {/* Official Multi-colored Google Vector Logo */}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Sign up with Google</span>
                </>
              )}
            </button>

            {/* Clean Divider */}
            <div className="flex items-center my-3.5 sm:my-5">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-2.5 text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Or sign up with email
              </span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-3.5">
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-9 sm:pl-10 pr-10 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] focus:ring-2 focus:ring-emerald-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account ➔</span>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Help & Switch to Login */}
          <div className="mt-5 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-100 text-center space-y-1.5">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                href={callbackUrl !== "/" ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
                className="font-black text-[#0f8646] hover:underline"
              >
                Sign In Instead
              </Link>
            </p>

            <div className="flex items-center justify-center gap-3 text-[10px] sm:text-[11px] text-gray-400 pt-0.5">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#0f8646]" /> 100% Data Privacy
              </span>
              <span>•</span>
              <a
                href="https://wa.me/919981418565"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 font-medium"
              >
                WhatsApp Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Registerform(props: RegisterformProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
          <div className="flex items-center gap-2 text-[#0f8646] font-bold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading SubziQuick...</span>
          </div>
        </div>
      }
    >
      <RegisterFormContent {...props} />
    </Suspense>
  );
}