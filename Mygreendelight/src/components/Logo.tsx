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
      {/* 🌿 Country Delight / Otipy Pure Organic Sprout Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isCompact ? "w-8 h-8 rounded-full" : "w-10 h-10 sm:w-11 sm:h-11 rounded-full"
        } ${
          isInvoice
            ? "bg-gray-900 text-white"
            : isWhite
            ? "bg-white/20 text-white border border-white/30 backdrop-blur-md"
            : "bg-emerald-50 text-[#16a34a] border border-emerald-200/80 shadow-xs"
        }`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isCompact ? "w-5 h-5" : "w-6 h-6 sm:w-6.5 sm:h-6.5"}
        >
          <defs>
            <linearGradient id="otipyLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="otipyLeafSoft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Pure Organic Main Sprout Leaf */}
          <path
            d="M18 29C18 29 18 19 25 12C25 12 25 21 18 29Z"
            fill={isInvoice ? "#ffffff" : isWhite ? "#ffffff" : "url(#otipyLeafGrad)"}
          />

          {/* Secondary Organic Sprout Leaf */}
          <path
            d="M18 29C18 29 18 20 11 15C11 15 11 23 18 29Z"
            fill={isInvoice ? "#d1d5db" : isWhite ? "#bbf7d0" : "url(#otipyLeafSoft)"}
          />

          {/* Fresh Morning Dewdrop */}
          <circle
            cx="21.5"
            cy="11.5"
            r="2"
            fill={isInvoice ? "#ffffff" : isWhite ? "#ffffff" : "#38bdf8"}
          />

          {/* Smooth Root Stem */}
          <path
            d="M18 23V30"
            stroke={isInvoice ? "#ffffff" : isWhite ? "#ffffff" : "#15803d"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 🏷️ Pure Clean Organic Typography (Country Delight / Otipy Style) */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center tracking-tight">
          <span
            className={`font-black text-xl sm:text-[22px] tracking-[-0.02em] ${
              isWhite ? "text-white" : isInvoice ? "text-gray-950" : "text-[#111827]"
            }`}
          >
            Subzi
          </span>
          <span
            className={`font-black text-xl sm:text-[22px] tracking-[-0.02em] ${
              isWhite ? "text-emerald-300" : isInvoice ? "text-gray-700" : "text-[#16a34a]"
            }`}
          >
            Quick
          </span>
          <span
            className={`font-bold text-[9px] sm:text-[10px] px-1 py-0.2 ml-1 rounded-md tracking-wide ${
              isWhite
                ? "bg-white/20 text-emerald-100"
                : "bg-emerald-50 text-[#15803d] border border-emerald-200"
            }`}
          >
            .in
          </span>
        </div>

        {/* Pure Farm-Fresh Subtitle */}
        {showTagline && !isCompact && (
          <div className="flex items-center gap-1 -mt-0.5">
            <span
              className={`text-[8.5px] sm:text-[9px] font-bold tracking-wider uppercase ${
                isWhite
                  ? "text-emerald-200/90"
                  : isInvoice
                  ? "text-gray-400"
                  : "text-[#16a34a]"
              }`}
            >
              Farm Fresh Direct
            </span>
            <span className={`text-[7px] ${isWhite ? "text-emerald-300" : "text-emerald-400"}`}>•</span>
            <span
              className={`text-[8.5px] sm:text-[9px] font-medium tracking-wider uppercase ${
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

