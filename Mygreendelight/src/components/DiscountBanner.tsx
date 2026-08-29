import { Percent } from "lucide-react";
import Link from "next/link";

export default function DiscountBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-6">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Background shapes for style */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>

        <div className="flex items-center gap-6 z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
            <Percent size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-1">Mega Monsoon Sale!</h2>
            <p className="text-orange-100 font-medium md:text-lg">Get up to <span className="text-white font-bold text-xl">50% OFF</span> on all Fresh Vegetables & Fruits.</p>
          </div>
        </div>

        <div className="z-10 shrink-0">
          <Link href="/shop?category=Vegetables" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50 hover:scale-105 transition-all">
            Grab Offer Now
          </Link>
        </div>
      </div>
    </div>
  );
}
