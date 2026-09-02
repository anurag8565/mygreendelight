"use client";

import React, { useState, useEffect } from "react";
import { Zap, ShoppingBag, Check, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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

  if (
    loading ||
    !data ||
    !data.hasPastOrder ||
    !data.items ||
    data.items.length === 0 ||
    !data.totalCurrentPrice ||
    data.totalCurrentPrice <= 0
  ) {
    return null; // Cleanly hide if no previous order
  }

  const availableItems = data.items.filter((i: any) => i.inStock);

  const handleReorderAll = () => {
    if (availableItems.length === 0) return;

    availableItems.forEach((item: any) => {
      const cartItemId =
        item._id.toString() + (item.variationWeight ? `-${item.variationWeight}` : "");
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
    <div className="w-full py-3.5 sm:py-5 bg-gradient-to-r from-emerald-50/90 via-green-50/60 to-emerald-50/90 border-y border-emerald-100/90 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xs border border-emerald-200/90 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 overflow-hidden">
          
          {/* Left / Top Info Area */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between sm:justify-start gap-2 mb-1.5 flex-wrap">
              <span className="bg-emerald-100 text-[#0f8646] font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-2xs">
                <Zap size={12} className="fill-[#0f8646]" />
                <span>1-Click Fast Reorder</span>
              </span>
              <span className="text-[10.5px] sm:text-[11px] text-gray-400 font-medium">
                Last ordered on {new Date(data.orderDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
              </span>
            </div>

            <h3 className="text-sm sm:text-lg font-black text-gray-900 leading-tight">
              Repeat Your Regular Fresh Produce Basket ({data.items.length} items)
            </h3>

            {/* Produce Thumbnails Carousel (100% Mobile Safe Scroll) */}
            <div className="w-full max-w-full overflow-x-auto pb-1.5 pt-2.5 flex items-center gap-2 scrollbar-none">
              {data.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border shrink-0 shadow-2xs transition ${
                    item.inStock
                      ? "bg-gray-50/80 border-gray-200"
                      : "bg-red-50/50 border-red-200 opacity-60"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded-xl object-cover bg-white shrink-0 border border-gray-100"
                  />
                  <div className="text-[10.5px] leading-tight min-w-0">
                    <span className="font-black text-gray-900 truncate block max-w-[85px] sm:max-w-[110px]">
                      {item.name}
                    </span>
                    <span className="text-[9.5px] text-gray-500 font-medium block mt-0.5">
                      {item.orderedQuantity}x • <span className="text-[#0f8646] font-black">₹{item.currentPrice}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right / Bottom Action Row */}
          <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 shrink-0">
            <div className="text-left lg:text-right shrink-0">
              <span className="text-[9.5px] sm:text-[10px] text-gray-400 font-black uppercase tracking-wider block">
                Basket Total
              </span>
              <span className="text-lg sm:text-2xl font-black text-[#0f8646] leading-none">
                ₹{data.totalCurrentPrice}
              </span>
            </div>

            <button
              type="button"
              onClick={handleReorderAll}
              disabled={availableItems.length === 0}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 shrink-0 ${
                isAdded
                  ? "bg-emerald-800 text-white"
                  : "bg-[#0f8646] hover:bg-[#0c6a38] text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={15} className="stroke-[3]" />
                  <span>Basket Loaded! 🎉</span>
                </>
              ) : (
                <>
                  <Zap size={15} className="fill-current" />
                  <span>1-Click Reorder</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
