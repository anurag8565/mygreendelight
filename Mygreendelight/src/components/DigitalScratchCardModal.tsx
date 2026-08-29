"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Gift, X, Sparkles, Copy, Check, ArrowRight, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ScratchModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: {
    _id: string;
    couponCode: string;
    discountAmount: number;
    minOrderAmount: number;
    isScratched?: boolean;
    expiresAt?: string;
  };
  onSuccess?: () => void;
}

export default function DigitalScratchCardModal({
  isOpen,
  onClose,
  reward,
  onSuccess,
}: ScratchModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(reward?.isScratched || false);
  const [copied, setCopied] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(reward?.isScratched ? 100 : 0);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined" || isScratched) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw luxurious golden/silver scratch overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e2e8f0");
    gradient.addColorStop(0.3, "#cbd5e1");
    gradient.addColorStop(0.5, "#94a3b8");
    gradient.addColorStop(0.7, "#cbd5e1");
    gradient.addColorStop(1, "#64748b");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative pattern & text on scratch card
    ctx.fillStyle = "#334155";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎁 SCRATCH HERE", width / 2, height / 2 - 10);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("Scratch to reveal your cashback", width / 2, height / 2 + 15);

    const getTouchPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      checkScratched();
    };

    const checkScratched = () => {
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        let transparentPixels = 0;
        const totalPixels = imgData.data.length / 4;

        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) {
            transparentPixels += 4;
          }
        }

        const percent = Math.floor((transparentPixels / totalPixels) * 100);
        setScratchPercent(percent);

        if (percent > 40 && !isScratched) {
          handleRevealPrize();
        }
      } catch (e) {}
    };

    const handleRevealPrize = async () => {
      setIsScratched(true);
      setScratchPercent(100);
      try {
        await axios.post("/api/user/rewards", { rewardId: reward._id });
        if (onSuccess) onSuccess();
      } catch (err) {}
    };

    const startDraw = (e: any) => {
      isDrawing.current = true;
      const { x, y } = getTouchPos(e);
      scratch(x, y);
    };

    const draw = (e: any) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const { x, y } = getTouchPos(e);
      scratch(x, y);
    };

    const stopDraw = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDraw);

    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("touchend", stopDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      window.removeEventListener("touchend", stopDraw);
    };
  }, [isOpen, isScratched]);

  if (!isOpen || typeof document === "undefined" || !reward) return null;

  const copyCoupon = () => {
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl z-10 border border-amber-200 text-center overflow-hidden"
        >
          {/* Confetti & Glow Background */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-green-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Header Title */}
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <PartyPopper size={20} className="text-amber-500" />
            <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
              ORDER REWARD UNLOCKED
            </span>
          </div>

          <h2 className="text-xl font-black text-gray-900 mb-4">
            Scratch & Win Cashback! 🎁
          </h2>

          {/* Scratch Area Wrapper */}
          <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-inner border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 via-green-50 to-emerald-100 flex flex-col items-center justify-center p-4 mb-5">
            {/* Hidden Prize underneath */}
            <div className="flex flex-col items-center justify-center text-center select-none">
              <span className="text-3xl font-black text-[#0f8646] tracking-tight">
                FLAT ₹{reward.discountAmount} OFF
              </span>
              <span className="text-xs text-gray-600 font-bold mt-1">
                On orders above ₹{reward.minOrderAmount || 199}
              </span>

              {/* Revealed Coupon Pill */}
              <div className="mt-3 bg-white border border-green-300 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs">
                <span className="font-mono font-black text-sm text-[#0f8646] tracking-wider">
                  {reward.couponCode}
                </span>
                <button
                  type="button"
                  onClick={copyCoupon}
                  className="p-1 text-gray-500 hover:text-[#0f8646] transition cursor-pointer"
                  title="Copy Coupon"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Canvas Scratch Surface (Covers the prize until scratched) */}
            {!isScratched && (
              <canvas
                ref={canvasRef}
                width={320}
                height={192}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              />
            )}
          </div>

          {/* Scratch Progress or Congratulations */}
          {isScratched ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200">
                🎉 Coupon activated! Valid for 7 days on your next order.
              </p>

              <button
                type="button"
                onClick={copyCoupon}
                className="w-full py-3.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Coupon Code Copied!" : `Copy Code: ${reward.couponCode}`}</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-500 font-medium">
              👉 Drag your finger or mouse across the grey box to reveal your discount coupon!
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
