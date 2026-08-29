"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishlistSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import mongoose from "mongoose";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

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

  const displayPrice = selectedVariation ? selectedVariation.price : item.price;
  const displayUnit = selectedVariation ? selectedVariation.weight : item.unit;
  const displayStock = selectedVariation ? selectedVariation.stock : item.stock;
  const currentCartItemId =
    item._id.toString() + (selectedVariation ? "-" + selectedVariation.weight : "");

  const cartitem = cartdata.find((c) => c.cartItemId === currentCartItemId);

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
      transition={{ duration: 0.2 }}
      className={`w-full bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
        isList
          ? "flex-row max-w-full gap-4 p-4 min-h-[140px]"
          : "h-[300px] sm:h-[320px] p-2.5 sm:p-3"
      }`}
    >
      {/* 1. TOP IMAGE BOX */}
      <Link
        href={`/product/${item._id}`}
        className={`relative bg-gray-50/70 rounded-xl flex items-center justify-center cursor-pointer group shrink-0 ${
          isList
            ? "w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
            : "w-full h-[120px] sm:h-[135px]"
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-[#0f8646] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

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
          className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur-xs rounded-full shadow-xs hover:bg-gray-100 transition-colors z-10 cursor-pointer"
        >
          <Heart
            size={15}
            className={
              isLiked ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-400"
            }
          />
        </button>

        {/* Out of Stock Overlay */}
        {displayStock <= 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* 2. MIDDLE CONTENT (Uniform Height) */}
      <div className="flex flex-col flex-1 justify-between mt-2 min-h-0">
        <div>
          {/* TITLE (Strict 2-line clamp + fixed height) */}
          <Link href={`/product/${item._id}`}>
            <h3 className="text-[12px] sm:text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 h-[34px] sm:h-[36px] hover:text-[#0f8646] transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* UNIT / WEIGHT */}
          <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5 h-[16px]">
            {displayUnit}
          </p>

          {/* VARIATIONS SELECTOR (Or invisible spacer if no variations) */}
          <div className="h-[26px] mt-1">
            {item.variations && item.variations.length > 0 ? (
              <select
                className="w-full text-[10px] sm:text-[11px] font-bold py-0.5 px-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#0f8646] bg-gray-50 text-gray-700 h-[24px]"
                value={selectedVariation?.weight}
                onChange={(e) => {
                  const v = item.variations?.find((varItem) => varItem.weight === e.target.value);
                  if (v) setSelectedVariation(v);
                }}
              >
                {item.variations.map((v, i) => (
                  <option key={i} value={v.weight}>
                    {v.weight} - ?{v.price} {v.stock <= 0 ? "(OOS)" : ""}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          {/* PRICE ROW */}
          <div className="flex items-baseline gap-1.5 mt-1 h-[22px]">
            <span className="text-[14px] sm:text-[15px] font-black text-[#0f8646]">
              ?{displayPrice}
            </span>
            <span className="text-[11px] text-gray-400 line-through">
              ?{activeMRP}
            </span>
          </div>
        </div>

        {/* 3. BOTTOM BUTTON (Pinned at bottom) */}
        <div className="mt-auto pt-1.5">
          {!cartitem ? (
            <button
              type="button"
              disabled={displayStock <= 0}
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
              className={`w-full h-[34px] rounded-xl flex items-center justify-center gap-1 font-black text-[12px] transition-all border cursor-pointer ${
                displayStock <= 0
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-[#0f8646] border-[#0f8646] hover:bg-[#0f8646] hover:text-white shadow-2xs"
              }`}
            >
              <Plus size={14} className="stroke-[3]" />
              <span>{displayStock <= 0 ? "OOS" : "ADD"}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-white border border-[#0f8646] rounded-xl overflow-hidden h-[34px] shadow-xs">
              <button
                type="button"
                className="w-9 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-sm"
                onClick={() => dispatch(decreaseQuantity(currentCartItemId))}
              >
                <Minus size={13} className="stroke-[3]" />
              </button>
              <span className="flex-1 text-center font-black text-xs text-gray-900">
                {cartitem.quantity}
              </span>
              <button
                type="button"
                disabled={cartitem.quantity >= displayStock}
                className={`w-9 h-full flex items-center justify-center transition font-black text-sm ${
                  cartitem.quantity >= displayStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white"
                }`}
                onClick={() => dispatch(increaseQuantity(currentCartItemId))}
              >
                <Plus size={13} className="stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
