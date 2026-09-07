import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "white" | "compact" | "invoice";
  className?: string;
  showTagline?: boolean;
  href?: string;
}

export default function Logo({
  variant = "default",
  className = "",
  showTagline = true,
  href = "/",
}: LogoProps) {
  const isWhite = variant === "white";
  const isInvoice = variant === "invoice";
  const isCompact = variant === "compact";

  const Content = (
    <div className={`flex items-center gap-2.5 select-none group ${className}`}>
      {/* 🌿 Master Emblem: Fresh Farm Sprout & Morning Sunrise Basket */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isCompact ? "w-8 h-8 rounded-xl" : "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl"
        } ${
          isInvoice
            ? "bg-gray-900 text-white"
            : isWhite
            ? "bg-white/15 text-white border border-white/20 backdrop-blur-md shadow-inner"
            : "bg-gradient-to-br from-[#10b981] via-[#0f8646] to-[#043419] text-white shadow-md shadow-emerald-950/20 border border-emerald-400/30"
        }`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isCompact ? "w-5 h-5" : "w-6 h-6 sm:w-6.5 sm:h-6.5"}
        >
          <defs>
            <linearGradient id="sqLeafGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="sqSunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Minimalist Shopping Basket Wire */}
          <path
            d="M8 15C8 13.9 8.9 13 10 13H26C27.1 13 28 13.9 28 15L26.2 24.5C25.9 26.5 24.2 28 22.2 28H13.8C11.8 28 10.1 26.5 9.8 24.5L8 15Z"
            fill={isInvoice ? "#ffffff" : isWhite ? "#ffffff" : "#ffffff"}
            fillOpacity={isInvoice ? "1" : isWhite ? "0.9" : "0.95"}
          />

          {/* Elegant Basket Arch Handle */}
          <path
            d="M13 13V9C13 6.24 15.24 4 18 4C20.76 4 23 6.24 23 9V13"
            stroke={isWhite ? "#ffffff" : isInvoice ? "#ffffff" : "url(#sqSunGlow)"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Vibrant Twin Organic Sprout Leaves */}
          <path
            d="M18 16C18 16 21 16.5 22 19C20 20 17.5 19.5 17.5 19.5C17.5 19.5 17 21.5 15 22C14.5 20 16 17.5 18 16Z"
            fill={isInvoice ? "#111827" : isWhite ? "#86efac" : "url(#sqLeafGlow)"}
          />
        </svg>

        {/* ⚡ Express Delivery Spark Dot */}
        {!isInvoice && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-gray-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs border border-white">
            ⚡
          </span>
        )}
      </div>

      {/* 🏷️ SubziQuick Balanced Modern Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-black tracking-[-0.03em] ${
              isCompact ? "text-lg" : "text-xl sm:text-[23px]"
            } ${isWhite ? "text-white" : isInvoice ? "text-gray-950" : "text-[#052e16]"}`}
          >
            Subzi
          </span>
          <span
            className={`font-black tracking-[-0.03em] ${
              isCompact ? "text-lg" : "text-xl sm:text-[23px]"
            } ${
              isWhite
                ? "text-yellow-300"
                : isInvoice
                ? "text-gray-600"
                : "text-[#0f8646]"
            }`}
          >
            Quick
          </span>
          <span
            className={`font-black text-[9.5px] sm:text-[10.5px] px-1 py-0.5 ml-1 rounded-md tracking-wider uppercase ${
              isWhite
                ? "bg-white/20 text-emerald-100 border border-white/20"
                : "bg-emerald-100 text-[#075225] border border-emerald-200"
            }`}
          >
            .in
          </span>
        </div>

        {/* Minimalist Micro Tagline */}
        {showTagline && !isCompact && (
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className={`text-[8.5px] sm:text-[9px] font-black tracking-wider uppercase ${
                isWhite
                  ? "text-emerald-200"
                  : isInvoice
                  ? "text-gray-400"
                  : "text-[#0f8646]"
              }`}
            >
              Farm Fresh
            </span>
            <span className={`text-[7px] ${isWhite ? "text-emerald-300" : "text-emerald-400"}`}>•</span>
            <span
              className={`text-[8.5px] sm:text-[9px] font-bold tracking-wider uppercase ${
                isWhite
                  ? "text-emerald-100/80"
                  : isInvoice
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Bhopal
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block cursor-pointer">
        {Content}
      </Link>
    );
  }

  return Content;
}



