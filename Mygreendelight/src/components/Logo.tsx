"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "white" | "compact" | "invoice" | "icon" | "full";
  className?: string;
  showTagline?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  variant = "default",
  className = "",
  showTagline = true,
  href = "/",
  size = "md",
}: LogoProps) {
  const isWhite = variant === "white";
  const isInvoice = variant === "invoice";
  const isCompact = variant === "compact";
  const isIconOnly = variant === "icon";
  const isFullImage = variant === "full";

  // If full banner logo is requested
  if (isFullImage) {
    const fullImg = (
      <img
        src="/logo.png"
        alt="SubziQuick.IN Logo"
        className={`object-contain max-h-12 w-auto transition-transform hover:scale-105 ${className}`}
      />
    );
    return href ? <Link href={href}>{fullImg}</Link> : fullImg;
  }

  // Dimension sizes for the 3D emblem
  const iconSizeClass =
    size === "sm" || isCompact
      ? "w-8 h-8 rounded-xl"
      : size === "lg"
      ? "w-12 h-12 rounded-2xl"
      : "w-9.5 h-9.5 sm:w-10.5 sm:h-10.5 rounded-2xl";

  const Content = (
    <div className={`flex items-center gap-2.5 select-none group ${className}`}>
      {/* 🌿 Master 3D Metallic Leaf & Gold Bag Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconSizeClass} ${
          isInvoice
            ? "bg-slate-900 shadow-xs"
            : isWhite
            ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-md shadow-emerald-950/20"
            : "bg-gradient-to-tr from-emerald-50 via-white to-amber-50/60 shadow-md shadow-emerald-950/10 border border-emerald-500/20"
        }`}
      >
        <img
          src="/logo-icon.png"
          alt="SubziQuick"
          className="w-full h-full object-contain p-1 rounded-xl filter drop-shadow-xs"
        />

        {/* ⚡ Express Delivery Pulse Dot */}
        {!isInvoice && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs border border-white">
            ⚡
          </span>
        )}
      </div>

      {/* Wordmark (if not icon only) */}
      {!isIconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline tracking-tight">
            <span
              className={`font-black tracking-[-0.03em] ${
                isCompact ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl sm:text-[22px]"
              } ${isWhite ? "text-white" : isInvoice ? "text-slate-950" : "text-[#052e16]"}`}
            >
              Subzi
            </span>
            <span
              className={`font-black tracking-[-0.03em] ${
                isCompact ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl sm:text-[22px]"
              } ${
                isWhite
                  ? "text-yellow-300"
                  : isInvoice
                  ? "text-slate-600"
                  : "text-[#0f8646]"
              }`}
            >
              Quick
            </span>
            <span
              className={`font-black text-[9.5px] sm:text-[10px] px-1 py-0.5 ml-1 rounded-md tracking-wider uppercase ${
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
                className={`text-[8px] sm:text-[8.5px] font-black tracking-wider uppercase ${
                  isWhite
                    ? "text-emerald-200"
                    : isInvoice
                    ? "text-slate-400"
                    : "text-[#0f8646]"
                }`}
              >
                Farm Fresh
              </span>
              <span className={`text-[7px] ${isWhite ? "text-emerald-300" : "text-emerald-400"}`}>•</span>
              <span
                className={`text-[8px] sm:text-[8.5px] font-bold tracking-wider uppercase ${
                  isWhite
                    ? "text-emerald-100/80"
                    : isInvoice
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Bhopal
              </span>
            </div>
          )}
        </div>
      )}
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
