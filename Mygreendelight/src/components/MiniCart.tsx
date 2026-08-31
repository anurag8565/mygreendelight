"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "@/redux/CartSlice";
import { useRouter } from "next/navigation";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartdata = useSelector((state: RootState) => state.cart.cartdata);

  const cartTotal = cartdata.reduce((total, item) => total + item.price * item.quantity, 0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="minicart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[1000]"
          />
          <motion.div
            key="minicart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white z-[1001] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-green-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="text-[#0f8646]" />
                My Cart <span className="text-sm font-medium text-gray-500">({cartdata.length} items)</span>
              </h2>
              <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 shadow-sm">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Smart Cart Health & Freshness Meter */}
            {cartdata.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white px-4 py-2 text-xs flex items-center justify-between shadow-inner">
                <span className="flex items-center gap-1 font-bold">
                  <span>🥗 Farm Freshness Meter</span>
                </span>
                <span className="bg-yellow-300 text-gray-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                  100% Ozone Clean
                </span>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {cartdata.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={48} className="text-gray-300" />
                  </div>
                  <p className="font-semibold text-lg">Your cart is empty</p>
                  <button 
                    onClick={() => { onClose(); router.push('/shop'); }}
                    className="text-[#0f8646] font-bold border border-[#0f8646] px-6 py-2 rounded-lg hover:bg-green-50"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartdata.map((item) => (
                  <div key={item.cartItemId} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm relative">
                    <button 
                      onClick={() => dispatch(removeFromCart(item.cartItemId!))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200"
                    >
                      <X size={12} />
                    </button>
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex flex-col flex-1 py-1 justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.variation?.weight || item.unit}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-extrabold text-[#0f8646]">₹{item.price * item.quantity}</span>
                        
                        <div className="flex items-center bg-green-50 rounded-lg border border-green-200">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item.cartItemId!))}
                            className="w-7 h-7 flex items-center justify-center text-[#0f8646] hover:bg-green-100 rounded-l-lg transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#0f8646]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item.cartItemId!))}
                            className="w-7 h-7 flex items-center justify-center text-[#0f8646] hover:bg-green-100 rounded-r-lg transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartdata.length > 0 && (
              <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_15px_-10px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total Amount</span>
                  <span className="text-xl font-extrabold text-gray-900">₹{cartTotal}</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/user/cart');
                  }}
                  className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}