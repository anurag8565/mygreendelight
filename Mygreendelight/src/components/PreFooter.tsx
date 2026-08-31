import React from 'react';
import { Lock, ThumbsUp, Headset, Banknote, ShieldCheck } from 'lucide-react';

export default function PreFooter() {
  const services = [
    {
      icon: <Lock className="text-[#0f8646]" size={20} />,
      title: "100% Secure Payments",
      desc: "UPI, Cards & NetBanking",
      bg: "bg-emerald-50/80 border-emerald-100"
    },
    {
      icon: <ThumbsUp className="text-[#0f8646]" size={20} />,
      title: "Freshness Guaranteed",
      desc: "Or instant 100% refund",
      bg: "bg-green-50/80 border-green-100"
    },
    {
      icon: <Headset className="text-[#0f8646]" size={20} />,
      title: "24/7 Bhopal Support",
      desc: "Call or WhatsApp anytime",
      bg: "bg-teal-50/80 border-teal-100"
    },
    {
      icon: <Banknote className="text-[#0f8646]" size={20} />,
      title: "Pay On Delivery",
      desc: "Cash or UPI at doorstep",
      bg: "bg-amber-50/80 border-amber-100"
    }
  ];

  return (
    <div className="w-full bg-white border-t border-gray-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {services.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-2xl border ${s.bg} shadow-2xs`}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-2xs">
                {s.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-xs sm:text-sm text-gray-900 truncate">
                  {s.title}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 truncate font-medium">
                  {s.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
