"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserWalletPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/offers");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="animate-pulse text-xs font-bold text-gray-400">
        Redirecting to SubziQuick Offers...
      </div>
    </div>
  );
}
