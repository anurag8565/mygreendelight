"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GiftBasketPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shop");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-sm font-bold text-gray-500">
        Redirecting to shop...
      </div>
    </div>
  );
}
