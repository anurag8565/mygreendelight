"use client";

import React, { useState } from "react";
import { Bell, X, Check, Loader2, Sparkles } from "lucide-react";
import axios from "axios";

interface StockAlertModalProps {
  grocery: { _id: string; name: string; image?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function StockAlertModal({ grocery, isOpen, onClose }: StockAlertModalProps) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.post("/api/user/stock-alert", {
        groceryId: grocery._id,
        mobile,
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
          setMobile("");
        }, 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to set alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cursor-default bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition border border-gray-200 cursor-pointer"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Notify on Fresh Harvest</h3>
            <p className="text-[11px] text-gray-500 truncate max-w-[200px]">{grocery.name}</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
            <div className="w-8 h-8 bg-[#0f8646] text-white rounded-full flex items-center justify-center mx-auto mb-2">
              <Check size={16} />
            </div>
            <p className="text-xs font-bold text-green-900">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-xs text-gray-500">
              This farm item is currently sold out. We will instantly message you when the new morning harvest arrives!
            </p>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Your WhatsApp / Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646] focus:bg-white"
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] font-bold text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  <Bell size={14} />
                  <span>Set Harvest Restock Alert</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
