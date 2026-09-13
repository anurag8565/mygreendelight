"use client";

import React from "react";

export default function ProduceCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/70 p-3 sm:p-3.5 flex flex-col justify-between h-[330px] sm:h-[350px] animate-pulse shadow-2xs"
        >
          {/* Produce Image Box Skeleton */}
          <div className="w-full h-[140px] sm:h-[155px] rounded-xl sm:rounded-2xl bg-stone-100/90 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Typography Skeleton */}
          <div className="space-y-2 mt-2.5">
            <div className="h-4 bg-stone-100 rounded-md w-3/4" />
            <div className="h-3 bg-stone-100 rounded-md w-1/2" />
            <div className="h-6 bg-stone-100/70 rounded-lg w-full mt-1" />
          </div>

          {/* Price & Action Row Skeleton */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-stone-200/80 rounded w-16" />
              <div className="h-4 bg-stone-100 rounded w-12" />
            </div>
            <div className="h-9 bg-stone-100 rounded-xl w-full" />
          </div>
        </div>
      ))}
    </>
  );
}
