"use client";

import React, { useState } from "react";
import axios from "axios";
import { Star, X, CheckCircle2, Loader2, MessageSquareHeart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    image: string;
    unit?: string;
  };
  onSuccess?: () => void;
}

export default function ReviewProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!isOpen || typeof document === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg("Please write a short review / feedback.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await axios.post(`/api/grocery/${product._id}/review`, {
        rating,
        comment: comment.trim(),
      });

      if (res.status === 200 || res.data?.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2200);
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Failed to submit review. You might have already reviewed this item."
      );
    } finally {
      setSubmitting(false);
    }
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
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-gray-100"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-[#0f8646] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Thank You for Your Review!
              </h3>
              <p className="text-xs text-gray-500">
                Your feedback helps us provide the freshest organic produce in Bhopal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-50 text-[#0f8646] flex items-center justify-center shrink-0">
                  <MessageSquareHeart size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900 leading-tight">
                    Rate & Review Produce
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {product.name}
                  </p>
                </div>
              </div>

              {/* Star Selection */}
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 text-center">
                <span className="text-xs font-bold text-gray-700 block mb-2">
                  How fresh was this item?
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          size={28}
                          className={
                            active
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-extrabold text-amber-800 block mt-2">
                  {rating === 5
                    ? "⭐⭐⭐⭐⭐ Super Fresh!"
                    : rating === 4
                    ? "⭐⭐⭐⭐ Very Good"
                    : rating === 3
                    ? "⭐⭐⭐ Good"
                    : rating === 2
                    ? "⭐⭐ Average"
                    : "⭐ Needs Improvement"}
                </span>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="text-xs font-black uppercase text-gray-700 tracking-wider block mb-1.5">
                  Your Review / Experience
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about freshness, taste, packing, or delivery speed..."
                  className="w-full border border-gray-200 rounded-2xl p-3.5 text-xs sm:text-sm font-medium text-gray-800 outline-none focus:border-[#0f8646] bg-gray-50 focus:bg-white transition resize-none"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <span>Submit Verified Review ⭐</span>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
