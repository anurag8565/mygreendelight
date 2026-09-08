import React from "react";
import Link from "next/link";
import Image from "next/image";

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
      {/* 🌿 Master Logo Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isCompact ? "w-8 h-8" : "w-9 h-9 sm:w-10 sm:h-10"
        }`}
      >
        <Image
          src="/logo-icon.png"
          alt="SubziQuick Logo"
          width={isCompact ? 32 : 40}
          height={isCompact ? 32 : 40}
          className="w-full h-full object-contain drop-shadow-xs"
          priority
        />
      </div>

      {/* 🏷️ SubziQuick Serif Brand Wordmark */}
      <div className="flex flex-col leading-none font-[family-name:var(--font-brand-serif),serif]">
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-semibold tracking-[-0.01em] ${
              isCompact ? "text-xl" : "text-2xl sm:text-[25px]"
            } ${
              isWhite
                ? "text-white drop-shadow-xs"
                : isInvoice
                ? "text-gray-950"
                : "text-[#083621]"
            }`}
          >
            SubziQuick
          </span>
          <span
            className={`font-bold tracking-wider uppercase ml-0.5 ${
              isCompact ? "text-sm" : "text-base sm:text-lg"
            } ${
              isInvoice
                ? "text-amber-700"
                : "bg-gradient-to-b from-[#e5be7a] via-[#c49335] to-[#805710] bg-clip-text text-transparent drop-shadow-xs"
            }`}
          >
            .IN
          </span>
        </div>

        {/* Refined Micro Tagline */}
        {showTagline && !isCompact && (
          <div className="flex items-center gap-1.5 mt-0.5 font-sans">
            <span
              className={`text-[8px] sm:text-[8.5px] font-bold tracking-wider uppercase ${
                isWhite
                  ? "text-emerald-200"
                  : isInvoice
                  ? "text-gray-400"
                  : "text-[#0f8646]"
              }`}
            >
              Farm Fresh
            </span>
            <span className={`text-[6px] ${isWhite ? "text-emerald-300" : "text-emerald-500"}`}>•</span>
            <span
              className={`text-[8px] sm:text-[8.5px] font-semibold tracking-wider uppercase ${
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




