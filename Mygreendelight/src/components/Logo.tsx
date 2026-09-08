"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "white" | "compact" | "invoice" | "icon" | "full";
  className?: string;
  showTagline?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
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
  const isIconOnly = variant === "icon";

  // Height configurations for smooth responsive scaling
  const heightClass =
    size === "sm" || variant === "compact"
      ? "h-8 sm:h-9"
      : size === "lg"
      ? "h-13 sm:h-15"
      : size === "xl"
      ? "h-20 sm:h-24"
      : "h-10 sm:h-12"; // default md size

  let Content = null;

  if (isIconOnly) {
    Content = (
      <div className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}>
        <img
          src="/logo-icon.png"
          alt="SubziQuick Emblem"
          className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs`}
        />
      </div>
    );
  } else {
    // Official Full SubziQuick.IN Logo (3D Metallic Leaf + Gold Bag + Typography)
    Content = (
      <div className={`inline-flex items-center shrink-0 group select-none ${className}`}>
        <img
          src="/logo.png"
          alt="SubziQuick.IN"
          className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
            isWhite
              ? "filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)] brightness-110"
              : isInvoice
              ? "filter contrast-125"
              : "filter drop-shadow-xs"
          }`}
        />
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center cursor-pointer transition-opacity hover:opacity-95">
        {Content}
      </Link>
    );
  }

  return Content;
}
