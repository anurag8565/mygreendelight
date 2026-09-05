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
    <div className={`flex items-center gap-2 select-none group ${className}`}>
      {/* 🌿 Speedy Fresh Basket + Leaf Badge Icon */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isCompact ? "w-8 h-8 rounded-xl" : "w-10 h-10 rounded-2xl"
        } ${
          isInvoice
            ? "bg-gray-900 text-white"
            : isWhite
            ? "bg-white/15 text-white border border-white/20 shadow-inner"
            : "bg-gradient-to-br from-[#0f8646] to-[#08522b] text-white shadow-md shadow-green-900/10"
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isCompact ? "w-5 h-5" : "w-6 h-6"}
        >
          {/* Shopping Basket Outline */}
          <path
            d="M6 13C6 11.8954 6.89543 11 8 11H24C25.1046 11 26 11.8954 26 13L24.2 23.2C23.85 25.3 22.05 27 19.9 27H12.1C9.95 27 8.15 25.3 7.8 23.2L6 13Z"
            fill="currentColor"
            fillOpacity={isInvoice ? "1" : "0.95"}
          />
          {/* Basket Handle */}
          <path
            d="M11 11V8C11 5.23858 13.2386 3 16 3C18.7614 3 21 5.23858 21 8V11"
            stroke={isWhite ? "#ffffff" : isInvoice ? "#ffffff" : "#fef08a"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Fresh Organic Sprout / Leaf overlay */}
          <path
            d="M16 14C16 14 18.5 14.5 19.5 17C17.5 18 15 17.5 15 17.5C15 17.5 14.5 19.5 12.5 20C12 18 13.5 15.5 16 14Z"
            fill={isWhite ? "#86efac" : isInvoice ? "#ffffff" : "#facc15"}
          />
          {/* Speed / Express Wind lines */}
          <line
            x1="3"
            y1="16"
            x2="5"
            y2="16"
            stroke={isWhite ? "#86efac" : isInvoice ? "#ffffff" : "#facc15"}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="20"
            x2="5.5"
            y2="20"
            stroke={isWhite ? "#86efac" : isInvoice ? "#ffffff" : "#facc15"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Small Lightning Express Dot */}
        {!isInvoice && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 text-gray-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs border border-white">
            ⚡
          </span>
        )}
      </div>

      {/* 🏷️ SubziQuick Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight ${
              isCompact ? "text-lg" : "text-xl sm:text-2xl"
            } ${isWhite ? "text-white" : isInvoice ? "text-gray-950" : "text-[#06351b]"}`}
          >
            Subzi
          </span>
          <span
            className={`font-black tracking-tight ${
              isCompact ? "text-lg" : "text-xl sm:text-2xl"
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
          <span className="text-[#0f8646] font-black text-xs ml-0.5">.in</span>
        </div>

        {showTagline && !isCompact && (
          <span
            className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
              isWhite
                ? "text-emerald-200"
                : isInvoice
                ? "text-gray-500"
                : "text-[#0f8646]"
            }`}
          >
            10-Min Farm Fresh • Bhopal
          </span>
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
