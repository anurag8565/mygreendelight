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
      {/* ⚡ Iconic 'S' Leaf-Speed Monogram Badge */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isCompact ? "w-8 h-8 rounded-xl" : "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl"
        } ${
          isInvoice
            ? "bg-gray-900 text-white shadow-xs"
            : isWhite
            ? "bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-inner"
            : "bg-gradient-to-br from-[#10b981] via-[#0c831f] to-[#064e28] text-white shadow-md shadow-emerald-950/20 border border-emerald-300/40"
        }`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isCompact ? "w-5 h-5" : "w-6 h-6 sm:w-6.5 sm:h-6.5"}
        >
          <defs>
            <linearGradient id="sqSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
            <linearGradient id="sqLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>
          </defs>

          {/* Organic Curved Upper Leaf (Forms top loop of 'S') */}
          <path
            d="M8 12C8 7.58 11.58 4 16 4H21C25.42 4 29 7.58 29 12C29 15.5 26.8 18.5 23.5 19.5L13.5 20.5"
            stroke={isInvoice ? "#ffffff" : isWhite ? "#ffffff" : "url(#sqLeafGrad)"}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Organic Curved Lower Basket / Leaf (Forms bottom loop of 'S') */}
          <path
            d="M28 24C28 28.42 24.42 32 20 32H15C10.58 32 7 28.42 7 24C7 20.5 9.2 17.5 12.5 16.5L22.5 15.5"
            stroke={isInvoice ? "#ffffff" : isWhite ? "#ffffff" : "url(#sqLeafGrad)"}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Central Energetic Gold Lightning Flash */}
          <path
            d="M19.5 8L13 19H19L16.5 28L25 16H18.5L21.5 8H19.5Z"
            fill={isInvoice ? "#ffffff" : isWhite ? "#fef08a" : "url(#sqSunGrad)"}
          />
        </svg>

        {/* Live Express Pulse Dot */}
        {!isInvoice && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 text-gray-950 rounded-full flex items-center justify-center text-[7.5px] font-black shadow-xs border border-white">
            ⚡
          </span>
        )}
      </div>

      {/* 🏷️ SubziQuick Modern Minimalist Wordmark */}
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
                  : "text-[#0c831f]"
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
              Express Bhopal
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
