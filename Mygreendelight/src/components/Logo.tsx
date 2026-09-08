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

      {/* 🏷️ SubziQuick Balanced Modern Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-black tracking-[-0.03em] ${
              isCompact ? "text-lg" : "text-xl sm:text-[22px]"
            } ${isWhite ? "text-white" : isInvoice ? "text-gray-950" : "text-[#052e16]"}`}
          >
            Subzi
          </span>
          <span
            className={`font-black tracking-[-0.03em] ${
              isCompact ? "text-lg" : "text-xl sm:text-[22px]"
            } ${
              isWhite
                ? "text-yellow-300"
                : isInvoice
                ? "text-gray-700"
                : "text-[#0f8646]"
            }`}
          >
            Quick
          </span>
          <span
            className={`font-black text-[9px] sm:text-[10px] px-1 py-0.5 ml-1 rounded-md tracking-wider uppercase ${
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
                  ? "text-gray-400"
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




