"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishlistSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Heart, Plus, Minus, Bell, Zap } from "lucide-react";
import mongoose from "mongoose";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import StockAlertModal from "./StockAlertModal";

interface IGrosery {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  stock: number;
  variations?: { weight: string; price: number; stock: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Groceryitemcard({
  item,
  isList = false,
}: {
  item: IGrosery;
  isList?: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const [selectedVariation, setSelectedVariation] = React.useState(
    item.variations && item.variations.length > 0 ? item.variations[0] : null
  );
  const [showAlertModal, setShowAlertModal] = React.useState(false);

  const displayPrice = selectedVariation ? selectedVariation.price : item.price;
  const displayUnit = selectedVariation ? selectedVariation.weight : item.unit;
  const displayStock = selectedVariation ? selectedVariation.stock : item.stock;
  const currentCartItemId =
    item._id.toString() + (selectedVariation ? "-" + selectedVariation.weight : "");

  const cartitem = cartdata.find(
    (c) =>
      c.cartItemId === currentCartItemId ||
      (!c.cartItemId && c._id?.toString() === item._id?.toString())
  );

  // Dynamic MRP & Discount
  const activeMRP =
    (item as any).mrp && (item as any).mrp > displayPrice
      ? (item as any).mrp
      : Math.round(displayPrice * 1.25);
  const discountPercent = Math.max(
    1,
    Math.round(((activeMRP - displayPrice) / activeMRP) * 100)
  );

  const isLiked = wishlistItems.some((w) => w._id === item._id.toString());

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className={`w-full bg-white rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-emerald-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between relative group font-sans ${
        isList
          ? "flex-row max-w-full gap-4 p-3.5 min-h-[135px]"
          : "h-[320px] sm:h-[340px] p-2.5 sm:p-3"
      }`}
    >
      {/* 1. TOP IMAGE BOX */}
      <Link
        href={`/product/${item._id}`}
        className={`relative bg-[#f8f9fa] rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden shrink-0 border border-gray-100/80 ${
          isList
            ? "w-[110px] h-[110px] sm:w-[130px] sm:h-[130px]"
            : "w-full h-[130px] sm:h-[145px]"
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-[#0c831f] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* 10 Min Delivery Tag */}
        <span className="absolute bottom-1.5 left-2 bg-white/95 backdrop-blur-xs text-gray-800 text-[8.5px] font-black px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5 border border-gray-200/50">
          <Zap size={9} className="text-amber-500 fill-amber-500" />
          <span>10 MINS</span>
        </span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(toggleWishlist(item as any));
            try {
              await axios.post("/api/wishlist", { productId: item._id });
            } catch (error) {
              console.log("Error updating wishlist", error);
            }
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-2xs hover:bg-white transition-colors z-10 cursor-pointer border border-gray-100 active:scale-90"
        >
          <Heart
            size={13}
            className={
              isLiked ? "text-rose-500 fill-rose-500" : "text-gray-400 hover:text-rose-500"
            }
          />
        </button>

        {/* Out of Stock Overlay */}
        {displayStock <= 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center z-10">
            <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* 2. MIDDLE CONTENT */}
      <div className="flex flex-col flex-1 justify-between mt-2.5 min-h-0">
        <div>
          {/* TITLE (Strict 2-line clamp) */}
          <Link href={`/product/${item._id}`}>
            <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 h-[34px] sm:h-[36px] group-hover:text-[#0c831f] transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* UNIT / WEIGHT & VARIATIONS SELECTOR */}
          <div className="mt-1 min-h-[24px]">
            {item.variations && item.variations.length > 1 ? (
              <select
                className="w-full text-[10px] font-semibold py-0.5 px-2 border border-gray-200 rounded-lg outline-none focus:border-[#0c831f] bg-gray-50 text-gray-700 h-[22px] cursor-pointer shadow-2xs"
                value={selectedVariation?.weight || item.variations[0]?.weight}
                onChange={(e) => {
                  const v = item.variations?.find((varItem) => varItem.weight === e.target.value);
                  if (v) setSelectedVariation(v);
                }}
              >
                {item.variations.map((v, i) => (
                  <option key={i} value={v.weight}>
                    {v.weight} - ₹{v.price} {v.stock <= 0 ? "(Out of stock)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] text-gray-400 font-medium truncate h-[22px] flex items-center">
                {displayUnit}
              </p>
            )}
          </div>

          {/* PRICE ROW & SAVINGS */}
          <div className="flex items-baseline gap-1.5 mt-1 h-[20px]">
            <span className="text-sm sm:text-base font-black text-gray-950">
              ₹{displayPrice}
            </span>
            <span className="text-[11px] text-gray-400 line-through font-normal">
              ₹{activeMRP}
            </span>
          </div>
        </div>

        {/* 3. BOTTOM BUTTON (Zepto / Blinkit Style ADD vs Counter) */}
        <div className="mt-auto pt-2">
          {displayStock <= 0 ? (
            <button
              type="button"
              onClick={() => setShowAlertModal(true)}
              className="w-full h-[34px] rounded-xl flex items-center justify-center gap-1 font-bold text-[11px] transition-all bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell size={12} className="stroke-[2.5]" />
              <span>Notify Me</span>
            </button>
          ) : !cartitem ? (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && navigator.vibrate) {
                  try { navigator.vibrate(20); } catch (e) {}
                }
                dispatch(
                  addToCart({
                    ...item,
                    price: displayPrice,
                    unit: displayUnit,
                    cartItemId: currentCartItemId,
                    variation: selectedVariation
                      ? {
                          weight: selectedVariation.weight,
                          price: selectedVariation.price,
                          stock: selectedVariation.stock,
                        }
                      : undefined,
                    quantity: 1,
                  })
                );
              }}
              className="w-full h-[34px] rounded-xl flex items-center justify-center gap-1 font-black text-xs transition-all border border-[#0c831f] cursor-pointer bg-white text-[#0c831f] hover:bg-[#0c831f] hover:text-white shadow-2xs active:scale-95"
            >
              <Plus size={13} className="stroke-[3]" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#0c831f] text-white rounded-xl overflow-hidden h-[34px] shadow-xs">
              <button
                type="button"
                className="w-9 h-full flex items-center justify-center hover:bg-black/15 transition font-black text-sm active:scale-90 cursor-pointer"
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.vibrate) {
                    try { navigator.vibrate(15); } catch (e) {}
                  }
                  dispatch(decreaseQuantity(currentCartItemId));
                }}
              >
                <Minus size={13} className="stroke-[3]" />
              </button>
              <span className="flex-1 text-center font-black text-xs text-white">
                {cartitem.quantity}
              </span>
              <button
                type="button"
                disabled={cartitem.quantity >= displayStock}
                className={`w-9 h-full flex items-center justify-center transition font-black text-sm active:scale-90 ${
                  cartitem.quantity >= displayStock
                    ? "bg-black/25 text-white/50 cursor-not-allowed"
                    : "hover:bg-black/15 cursor-pointer text-white"
                }`}
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.vibrate) {
                    try { navigator.vibrate(15); } catch (e) {}
                  }
                  dispatch(increaseQuantity(currentCartItemId));
                }}
              >
                <Plus size={13} className="stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>

      <StockAlertModal
        grocery={item as any}
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />
    </motion.div>
  );
}
