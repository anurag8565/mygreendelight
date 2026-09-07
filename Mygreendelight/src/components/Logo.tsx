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
      {/* 🌿 Sleek Minimalist Emblem (Organic Leaf + Express Basket Fusion) */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1 ${
          isCompact ? "w-8 h-8 rounded-xl" : "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl"
        } ${
          isInvoice
            ? "bg-gray-900 text-white shadow-xs"
            : isWhite
            ? "bg-white/15 text-white border border-white/25 backdrop-blur-md shadow-inner"
            : "bg-gradient-to-br from-[#0e9f4f] via-[#0c831f] to-[#065026] text-white shadow-md shadow-emerald-950/20 border border-emerald-400/30"
        }`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isCompact ? "w-5 h-5" : "w-6 h-6 sm:w-6.5 sm:h-6.5"}
        >
          {/* Subtle Glow Defs */}
          <defs>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
            <linearGradient id="basketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Minimalist Basket Silhouette */}
          <path
            d="M8 15.5C8 14.12 9.12 13 10.5 13H29.5C30.88 13 32 14.12 32 15.5L30 28C29.6 30.2 27.7 32 25.5 32H14.5C12.3 32 10.4 30.2 10 28L8 15.5Z"
            fill={isInvoice ? "#ffffff" : isWhite ? "#ffffff" : "url(#basketGrad)"}
            fillOpacity={isInvoice ? "1" : "0.95"}
          />

          {/* Elegant Curved Handle */}
          <path
            d="M14 13V9.5C14 6.46 16.46 4 19.5 4H20.5C23.54 4 26 6.46 26 9.5V13"
            stroke={isWhite ? "#ffffff" : isInvoice ? "#ffffff" : "#fef08a"}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Organic Sprout Leaf Accent */}
          <path
            d="M20 16.5C20 16.5 23.5 17 25 20.5C22.5 22 19 21 19 21C19 21 18 23.5 15.5 24C15 21.5 17 18.5 20 16.5Z"
            fill={isInvoice ? "#111827" : isWhite ? "#86efac" : "url(#leafGrad)"}
          />

          {/* ⚡ Dynamic Speed Arc Lines */}
          <path
            d="M4.5 19.5H7M3 24H6.5"
            stroke={isWhite ? "#86efac" : isInvoice ? "#ffffff" : "#fef08a"}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        {/* ⚡ Express Sunlight Glow Badge */}
        {!isInvoice && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-black shadow-xs border border-white/80 animate-pulse">
            ⚡
          </span>
        )}
      </div>

      {/* 🏷️ SubziQuick Modern Minimalist Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-tight">
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
                ? "text-gray-700"
                : "text-[#0c831f]"
            }`}
          >
            Quick
          </span>
          <span
            className={`font-black text-[10px] sm:text-[11px] px-1 py-0.5 ml-1 rounded-md tracking-wider uppercase ${
              isWhite
                ? "bg-white/20 text-emerald-100"
                : "bg-emerald-100/90 text-[#075225]"
            }`}
          >
            .in
          </span>
        </div>

        {/* Subtle Minimalist Tagline */}
        {showTagline && !isCompact && (
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className={`text-[8.5px] sm:text-[9px] font-extrabold tracking-wider uppercase ${
                isWhite
                  ? "text-emerald-200/90"
                  : isInvoice
                  ? "text-gray-400"
                  : "text-[#0c831f]"
              }`}
            >
              Farm Fresh
            </span>
            <span className={`text-[7px] ${isWhite ? "text-emerald-300" : "text-emerald-400"}`}>•</span>
            <span
              className={`text-[8.5px] sm:text-[9px] font-extrabold tracking-wider uppercase ${
                isWhite
                  ? "text-emerald-200/90"
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

