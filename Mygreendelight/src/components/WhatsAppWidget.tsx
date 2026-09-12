"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppWidget() {
  const phoneNumber = "919981418565"; 
  const message = "Hi, I need some help with my order on SubziQuick.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-28 right-3.5 z-40 md:bottom-8 md:right-8 group flex items-center justify-center w-11 h-11 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp Support"
    >
      <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-gray-800 text-sm font-bold rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
        Need Help?
        <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-[6px] border-transparent border-l-white"></div>
      </div>
    </a>
  );
}