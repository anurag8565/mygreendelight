import React from 'react';
import { Lock, ThumbsUp, Headset, Banknote } from 'lucide-react';

export default function PreFooter() {
  const services = [
    {
      icon: <Lock className="text-[#0f8646]" size={24} />,
      title: "Secure Payments",
      desc: "100% secure transactions"
    },
    {
      icon: <ThumbsUp className="text-[#0f8646]" size={24} />,
      title: "100% Satisfaction",
      desc: "Satisfaction guaranteed"
    },
    {
      icon: <Headset className="text-[#0f8646]" size={24} />,
      title: "24/7 Support",
      desc: "We're here to help"
    },
    {
      icon: <Banknote className="text-[#0f8646]" size={24} />,
      title: "Cash on Delivery",
      desc: "Available on all orders"
    }
  ];

  return (
    <div className="w-full bg-green-50 border-t border-b border-green-100 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div key={i} className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-900">{s.title}</span>
                <span className="text-xs text-gray-500 mt-0.5">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
