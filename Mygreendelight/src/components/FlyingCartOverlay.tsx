"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function triggerFlyToCart(image: string, startRect: DOMRect) {
  if (typeof window === "undefined") return;

  // Determine target cart button (prefer mobile bottom dock if visible, else desktop header)
  const mobileCart = document.getElementById("mobile-bottom-cart-btn");
  const desktopCart = document.getElementById("desktop-header-cart-btn");

  let targetRect: DOMRect | null = null;
  if (mobileCart && mobileCart.offsetParent !== null) {
    targetRect = mobileCart.getBoundingClientRect();
  } else if (desktopCart && desktopCart.offsetParent !== null) {
    targetRect = desktopCart.getBoundingClientRect();
  }

  // Fallback target if not found
  const endX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth / 2;
  const endY = targetRect ? targetRect.top + targetRect.height / 2 : window.innerHeight - 40;

  const event = new CustomEvent("fly-to-cart", {
    detail: {
      image,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX,
      endY,
    },
  });
  window.dispatchEvent(event);
}

export default function FlyingCartOverlay() {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  useEffect(() => {
    const handleFly = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      const newItem: FlyingItem = {
        id: `${Date.now()}-${Math.random()}`,
        image: detail.image,
        startX: detail.startX,
        startY: detail.startY,
        endX: detail.endX,
        endY: detail.endY,
      };

      setFlyingItems((prev) => [...prev.slice(-4), newItem]); // Max 5 concurrent to prevent lag

      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 750);
    };

    window.addEventListener("fly-to-cart", handleFly);
    return () => window.removeEventListener("fly-to-cart", handleFly);
  }, []);

  if (flyingItems.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item) => {
          // Midpoint apex for dramatic natural jump
          const midX = (item.startX + item.endX) / 2;
          const midY = Math.min(item.startY, item.endY) - 60;

          return (
            <motion.div
              key={item.id}
              initial={{
                x: item.startX - 22,
                y: item.startY - 22,
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: [item.startX - 22, midX - 18, item.endX - 12],
                y: [item.startY - 22, midY, item.endY - 12],
                scale: [1, 1.25, 0.25],
                opacity: [1, 1, 0.8, 0],
                rotate: [0, -15, 30],
              }}
              transition={{
                duration: 0.7,
                ease: [0.2, 0.8, 0.25, 1], // Buttery cubic-bezier curve
                times: [0, 0.45, 1],
              }}
              className="absolute w-11 h-11 rounded-full bg-white p-1 shadow-[0_8px_25px_rgba(10,61,36,0.4)] border-2 border-emerald-500 overflow-hidden flex items-center justify-center pointer-events-none"
            >
              <img
                src={item.image}
                alt="flying-item"
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
