"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VipPassPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/offers");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-sm font-bold text-gray-500">
        Redirecting to SubziQuick Offers...
      </div>
    </div>
  );
}
