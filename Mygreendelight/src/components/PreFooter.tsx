import React from 'react';
import { Lock, ThumbsUp, Headset, Banknote, ShieldCheck } from 'lucide-react';

export default function PreFooter() {
  const services = [
    {
      icon: <Lock className="text-[#0f8646]" size={18} />,
      title: "Secure UPI & Cards",
      desc: "100% encrypted checkout",
      bg: "bg-emerald-50/80 border-emerald-100"
    },
    {
      icon: <ThumbsUp className="text-[#0f8646]" size={18} />,
      title: "Fresh or Refund",
      desc: "Instant doorstep replacement",
      bg: "bg-green-50/80 border-green-100"
    },
    {
      icon: <Headset className="text-[#0f8646]" size={18} />,
      title: "24/7 Bhopal Help",
      desc: "Call or WhatsApp support",
      bg: "bg-teal-50/80 border-teal-100"
    },
    {
      icon: <Banknote className="text-[#0f8646]" size={18} />,
      title: "Pay on Delivery",
      desc: "Cash or UPI at doorstep",
      bg: "bg-amber-50/80 border-amber-100"
    }
  ];

  return (
    <div className="w-full bg-white border-t border-gray-100 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {services.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 sm:gap-3.5 p-2.5 sm:p-4 rounded-2xl border ${s.bg} shadow-2xs`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-2xs">
                {s.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-black text-[11px] sm:text-sm text-gray-900 leading-tight">
                  {s.title}
                </span>
                <span className="text-[9px] sm:text-xs text-gray-500 font-medium leading-tight mt-0.5">
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
