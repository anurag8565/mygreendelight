"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishlistSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ShoppingCart, Heart, Plus, Minus, Bell, Zap, Sparkles } from "lucide-react";
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`w-full bg-white rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group ${
        isList
          ? "flex-row max-w-full gap-4 p-4 min-h-[140px]"
          : "h-[325px] sm:h-[345px] p-3 sm:p-3.5"
      }`}
    >
      {/* 1. TOP IMAGE BOX */}
      <Link
        href={`/product/${item._id}`}
        className={`relative bg-gray-50/80 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden shrink-0 border border-gray-100 ${
          isList
            ? "w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
            : "w-full h-[130px] sm:h-[145px]"
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 p-2"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-emerald-600 to-[#0f8646] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs border border-white/40">
            {discountPercent}% OFF
          </span>
        )}

        {/* 10 Min Delivery Tag */}
        <span className="absolute bottom-1.5 left-2 bg-white/95 backdrop-blur-xs text-gray-800 text-[8.5px] font-black px-1.5 py-0.2 rounded-md shadow-2xs flex items-center gap-0.5 border border-gray-200/60">
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
          className="absolute top-2 right-2 p-1.5 bg-white/95 backdrop-blur-xs rounded-full shadow-2xs hover:bg-gray-100 transition-colors z-10 cursor-pointer border border-gray-200/60 active:scale-90"
        >
          <Heart
            size={14}
            className={
              isLiked ? "text-rose-500 fill-rose-500" : "text-gray-400 hover:text-rose-500"
            }
          />
        </button>

        {/* Out of Stock Overlay */}
        {displayStock <= 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center z-10">
            <span className="bg-red-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
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
            <h3 className="text-xs sm:text-[13px] font-black text-gray-900 leading-snug line-clamp-2 h-[34px] sm:h-[36px] group-hover:text-[#0f8646] transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* UNIT / WEIGHT */}
          <p className="text-[10.5px] text-gray-400 font-bold truncate mt-0.5 h-[16px]">
            {displayUnit}
          </p>

          {/* VARIATIONS SELECTOR */}
          <div className="h-[26px] mt-1">
            {item.variations && item.variations.length > 0 ? (
              <select
                className="w-full text-[10px] sm:text-[11px] font-bold py-0.5 px-2 border border-gray-200 rounded-xl outline-none focus:border-[#0f8646] bg-gray-50 text-gray-800 h-[24px] cursor-pointer shadow-2xs"
                value={selectedVariation?.weight}
                onChange={(e) => {
                  const v = item.variations?.find((varItem) => varItem.weight === e.target.value);
                  if (v) setSelectedVariation(v);
                }}
              >
                {item.variations.map((v, i) => (
                  <option key={i} value={v.weight}>
                    {v.weight} - ₹{v.price} {v.stock <= 0 ? "(OOS)" : ""}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          {/* PRICE ROW & SAVINGS */}
          <div className="flex items-baseline gap-1.5 mt-1.5 h-[22px]">
            <span className="text-sm sm:text-base font-black text-gray-950">
              ₹{displayPrice}
            </span>
            <span className="text-[11px] text-gray-400 line-through font-medium">
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
              className="w-full h-[36px] rounded-xl flex items-center justify-center gap-1 font-black text-[11px] transition-all bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell size={12} className="stroke-[2.5]" />
              <span>🔔 Notify Me</span>
            </button>
          ) : !cartitem ? (
            <button
              type="button"
              onClick={() =>
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
                )
              }
              className="w-full h-[36px] rounded-xl flex items-center justify-center gap-1 font-black text-xs transition-all border border-[#0f8646] cursor-pointer bg-emerald-50/70 text-[#0f8646] hover:bg-[#0f8646] hover:text-white shadow-2xs active:scale-95 group/btn"
            >
              <Plus size={14} className="stroke-[3] group-hover/btn:rotate-90 transition-transform" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#0f8646] text-white rounded-xl overflow-hidden h-[36px] shadow-sm">
              <button
                type="button"
                className="w-10 h-full flex items-center justify-center hover:bg-black/15 transition font-black text-sm active:scale-90 cursor-pointer"
                onClick={() => dispatch(decreaseQuantity(currentCartItemId))}
              >
                <Minus size={14} className="stroke-[3]" />
              </button>
              <span className="flex-1 text-center font-black text-xs text-white">
                {cartitem.quantity}
              </span>
              <button
                type="button"
                disabled={cartitem.quantity >= displayStock}
                className={`w-10 h-full flex items-center justify-center transition font-black text-sm active:scale-90 ${
                  cartitem.quantity >= displayStock
                    ? "bg-black/25 text-white/50 cursor-not-allowed"
                    : "hover:bg-black/15 cursor-pointer text-white"
                }`}
                onClick={() => dispatch(increaseQuantity(currentCartItemId))}
              >
                <Plus size={14} className="stroke-[3]" />
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
