"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist, setWishlist } from "@/redux/WishlistSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Heart, Plus, Minus, Bell, Zap, Sparkles } from "lucide-react";
import mongoose from "mongoose";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import StockAlertModal from "./StockAlertModal";

interface IGrosery {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  mrp?: number;
  unit: string;
  image: string;
  category: string;
  stock: number;
  isFeatured?: boolean;
  status?: string;
  variations?: { weight: string; price: number; stock: number; mrp?: number }[];
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
  const { userdata } = useSelector((state: RootState) => state.user);

  const [selectedVariation, setSelectedVariation] = React.useState(
    item.variations && item.variations.length > 0 ? item.variations[0] : null
  );
  const [showAlertModal, setShowAlertModal] = React.useState(false);

  const displayPrice = Number(selectedVariation ? selectedVariation.price : item.price) || 0;
  const displayUnit = selectedVariation ? selectedVariation.weight : (item.unit || "kg");
  const displayStock = typeof (selectedVariation ? selectedVariation.stock : item.stock) === "number"
    ? (selectedVariation ? selectedVariation.stock : item.stock)
    : 50;
  const safeItemId = String(item._id || "");
  const currentCartItemId = safeItemId + (selectedVariation ? "-" + selectedVariation.weight : "");

  const isVariationItem = Boolean(item.variations && item.variations.length > 0);
  const cartitem = cartdata.find(
    (c) =>
      c.cartItemId === currentCartItemId ||
      (!isVariationItem && !c.cartItemId && c._id?.toString() === item._id?.toString())
  );

  // Dynamic Realistic MRP & Discount
  // If variation has its own MRP, use it. Otherwise, if base item has MRP and price, apply the exact same discount ratio to this variation.
  const activeMRP = React.useMemo(() => {
    if (selectedVariation?.mrp && selectedVariation.mrp > displayPrice) {
      return selectedVariation.mrp;
    }
    if (item.mrp && item.price && item.mrp > item.price) {
      const baseRatio = item.mrp / item.price;
      return Math.round(displayPrice * baseRatio);
    }
    return Math.round(displayPrice * 1.22);
  }, [selectedVariation, item.mrp, item.price, displayPrice]);

  const discountPercent = Math.max(
    1,
    Math.round(((activeMRP - displayPrice) / activeMRP) * 100)
  );

  const isLiked = wishlistItems.some((w) => String(w._id) === String(item._id));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 hover:border-[#0a3d24]/50 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(10,61,36,0.08)] transition-all duration-300 flex flex-col justify-between relative group font-sans ${
        isList
          ? "flex-row max-w-full gap-4 p-3.5 min-h-[140px]"
          : "h-[330px] sm:h-[350px] p-3 sm:p-3.5"
      }`}
    >
      {/* 1. TOP IMAGE BOX */}
      <Link
        href={`/product/${item._id}`}
        className={`relative bg-stone-50/80 group-hover:bg-emerald-50/20 transition-colors duration-300 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden shrink-0 border border-stone-100 ${
          isList
            ? "w-[115px] h-[115px] sm:w-[135px] sm:h-[135px]"
            : "w-full h-[140px] sm:h-[155px]"
        }`}
      >
        <img
          src={item.image}
          alt={`Fresh ${item.name} Online Delivery in Bhopal | SubziQuick`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
          }}
          className="w-full h-full max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out p-2"
        />

        {/* Minimalist Consistent Pill Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {item.isFeatured && (
            <span className="bg-amber-50/90 border border-amber-200/90 text-amber-900 text-[8.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 tracking-wide">
              <Sparkles size={9} className="text-amber-600" />
              <span>Featured</span>
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#0a3d24] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs tracking-wide">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const rawId = userdata?._id || (userdata as any)?.id || null;
            const cleanUserId = rawId ? String(rawId) : null;
            dispatch(toggleWishlist({
              item: {
                _id: String(item._id),
                name: item.name,
                price: displayPrice,
                image: item.image,
                unit: displayUnit,
                category: item.category,
                stock: displayStock,
              },
              userId: cleanUserId,
            }));
            try {
              const res = await axios.post("/api/wishlist", { productId: String(item._id) });
              if (res.data?.success && Array.isArray(res.data?.wishlist) && res.data.wishlist.length > 0) {
                dispatch(setWishlist({ items: res.data.wishlist, userId: cleanUserId }));
              }
            } catch (error) {
              // Guest or offline
            }
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-2xs hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer border border-gray-100"
        >
          <Heart
            size={13}
            className={`transition-colors duration-200 ${
              isLiked ? "text-rose-500 fill-rose-500 scale-110" : "text-gray-400 hover:text-rose-500"
            }`}
          />
        </motion.button>

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
            <h3 className="text-xs sm:text-[13.5px] font-bold text-stone-900 leading-snug line-clamp-2 h-[34px] sm:h-[38px] group-hover:text-[#0a3d24] transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* UNIT / WEIGHT & VARIATIONS SELECTOR */}
          <div className="mt-1 min-h-[24px]">
            {item.variations && item.variations.length > 1 ? (
              <select
                className="w-full text-[10px] font-semibold py-0.5 px-2 border border-stone-200 hover:border-[#0a3d24]/50 rounded-lg outline-none focus:border-[#0a3d24] bg-stone-50 text-stone-700 h-[22px] cursor-pointer shadow-2xs transition-colors"
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
              <p className="text-[11px] text-stone-400 font-medium truncate h-[22px] flex items-center">
                {displayUnit}
              </p>
            )}
          </div>

          {/* PRICE ROW & SAVINGS */}
          <div className="flex items-center gap-1.5 mt-1.5 h-[22px]">
            <span className="text-sm sm:text-base font-extrabold text-stone-950 group-hover:text-[#0a3d24] transition-colors shrink-0">
              ₹{displayPrice}
            </span>
            <span className="text-[11px] text-stone-400 line-through font-normal shrink-0">
              ₹{activeMRP}
            </span>
            {activeMRP > displayPrice && (
              <span className="text-[9.5px] font-bold text-[#0a3d24] bg-emerald-50/90 border border-emerald-200/70 px-1.5 py-0.5 rounded-md ml-auto shrink-0 truncate max-w-[75px]">
                Save ₹{activeMRP - displayPrice}
              </span>
            )}
          </div>
        </div>

        {/* 3. BOTTOM BUTTON (SubziQuick 1-Click ADD vs Counter) */}
        <div className="mt-auto pt-2.5">
          {displayStock <= 0 ? (
            <button
              type="button"
              onClick={() => setShowAlertModal(true)}
              className="w-full h-[38px] rounded-xl flex items-center justify-center gap-1.5 font-bold text-[11px] transition-all bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell size={12} className="stroke-[2]" />
              <span>Notify Me</span>
            </button>
          ) : !cartitem ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
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
              className="w-full h-[38px] rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all duration-200 border-1.5 border-[#0a3d24] cursor-pointer bg-white text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white hover:shadow-[0_4px_14px_rgba(10,61,36,0.2)] shadow-2xs active:scale-95"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>ADD</span>
            </motion.button>
          ) : (
            <div className="flex items-center justify-between bg-[#0a3d24] text-white rounded-xl overflow-hidden h-[38px] shadow-[0_4px_12px_rgba(10,61,36,0.25)] ring-1 ring-[#0a3d24]/30">
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                className="w-10 h-full flex items-center justify-center hover:bg-black/20 active:bg-black/30 transition-colors font-bold text-sm cursor-pointer"
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.vibrate) {
                    try { navigator.vibrate(15); } catch (e) {}
                  }
                  dispatch(decreaseQuantity(currentCartItemId));
                }}
              >
                <Minus size={14} className="stroke-[2.5]" />
              </motion.button>
              
              <div className="flex-1 h-full flex items-center justify-center overflow-hidden relative">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={cartitem.quantity}
                    initial={{ y: 8, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -8, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="font-extrabold text-xs sm:text-sm text-white select-none inline-block"
                  >
                    {cartitem.quantity}
                  </motion.span>
                </AnimatePresence>
              </div>

              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                disabled={cartitem.quantity >= displayStock}
                className={`w-10 h-full flex items-center justify-center transition-colors font-bold text-sm ${
                  cartitem.quantity >= displayStock
                    ? "bg-black/25 text-white/50 cursor-not-allowed"
                    : "hover:bg-black/20 active:bg-black/30 cursor-pointer text-white"
                }`}
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.vibrate) {
                    try { navigator.vibrate(15); } catch (e) {}
                  }
                  dispatch(increaseQuantity(currentCartItemId));
                }}
              >
                <Plus size={14} className="stroke-[2.5]" />
              </motion.button>
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
