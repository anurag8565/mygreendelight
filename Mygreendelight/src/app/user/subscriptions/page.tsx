"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/myorder");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-sm font-bold text-gray-500">
        Redirecting to orders...
      </div>
    </div>
  );
}
