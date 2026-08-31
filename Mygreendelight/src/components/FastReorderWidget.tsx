"use client";

import React, { useState, useEffect } from "react";
import { Zap, ShoppingBag, Check, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FastReorderWidget() {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    axios
      .get("/api/user/reorder-basket")
      .then((res) => {
        if (res.data?.success && res.data.hasPastOrder) {
          setData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data || !data.items || data.items.length === 0) {
    return null; // Cleanly hide if no previous order
  }

  const availableItems = data.items.filter((i: any) => i.inStock);

  const handleReorderAll = () => {
    if (availableItems.length === 0) return;

    availableItems.forEach((item: any) => {
      const cartItemId = item._id.toString() + (item.variationWeight ? `-${item.variationWeight}` : "");
      dispatch(
        addToCart({
          _id: item._id,
          name: item.name,
          price: item.currentPrice,
          unit: item.unit,
          image: item.image,
          category: item.category,
          stock: item.currentStock,
          quantity: item.orderedQuantity || 1,
          cartItemId,
        } as any)
      );
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="w-full py-4 bg-gradient-to-r from-emerald-50 via-green-50/60 to-emerald-50 border-y border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-emerald-100 text-[#0f8646] font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                <Zap size={12} className="fill-[#0f8646]" />
                <span>1-Click Fast Reorder</span>
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                Last ordered on {new Date(data.orderDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
              Repeat Your Regular Fresh Produce Basket ({data.items.length} items)
            </h3>

            {/* Produce Thumbnails Carousel */}
            <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1 max-w-2xl scrollbar-none">
              {data.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-2xl border shrink-0 ${
                    item.inStock
                      ? "bg-gray-50 border-gray-200"
                      : "bg-red-50/50 border-red-200 opacity-60"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded-xl object-cover bg-white shrink-0"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-gray-900 truncate block max-w-[90px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {item.orderedQuantity}x • <span className="text-[#0f8646] font-bold">₹{item.currentPrice}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center justify-between md:flex-col md:items-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Basket Total</span>
              <span className="text-xl sm:text-2xl font-black text-[#0f8646]">
                ₹{data.totalCurrentPrice}
              </span>
            </div>

            <button
              type="button"
              onClick={handleReorderAll}
              disabled={availableItems.length === 0}
              className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isAdded
                  ? "bg-emerald-800 text-white"
                  : "bg-[#0f8646] hover:bg-[#0c6a38] text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  <span>Basket Loaded to Cart! 🎉</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>1-Click Reorder Basket</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
