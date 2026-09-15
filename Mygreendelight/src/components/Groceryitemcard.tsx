"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist, setWishlist } from "@/redux/WishlistSlice";
import { triggerHaptic } from "@/utils/haptics";
import { AppDispatch, RootState } from "@/redux/store";
import { Heart, Plus, Minus, Bell, ChevronDown } from "lucide-react";
import mongoose from "mongoose";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import StockAlertModal from "./StockAlertModal";
import { triggerFlyToCart } from "./FlyingCartOverlay";

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

  // Dynamic MRP & Discount
  const activeMRP = React.useMemo(() => {
    if (selectedVariation?.mrp && selectedVariation.mrp > displayPrice) {
      return selectedVariation.mrp;
    }
    if (item.mrp && item.price && item.mrp > item.price) {
      const baseRatio = item.mrp / item.price;
      return Math.round(displayPrice * baseRatio);
    }
    return Math.round(displayPrice * 1.2);
  }, [selectedVariation, item.mrp, item.price, displayPrice]);

  const discountPercent = Math.max(
    0,
    Math.round(((activeMRP - displayPrice) / activeMRP) * 100)
  );

  const isLiked = wishlistItems.some((w) => String(w._id) === String(item._id));

  return (
    <div
      className={`w-full bg-white rounded-2xl sm:rounded-[22px] p-3 sm:p-3.5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-stone-200/80 transition-all duration-300 flex flex-col justify-between relative group font-sans select-none ${
        isList
          ? "flex-row max-w-full gap-4 min-h-[120px]"
          : "h-[255px] sm:h-[275px]"
      }`}
    >
      {/* 1. PRODUCT IMAGE WITH UNIFORM PHOTO STAGE */}
      <div className="relative w-full">
        <Link
          href={`/product/${item._id}`}
          className={`relative w-full flex items-center justify-center cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-[#f6f5f2] group-hover:bg-[#f0ede6] transition-colors duration-300 border border-stone-200/50 ${
            isList ? "w-[100px] h-[100px] shrink-0" : "h-[120px] sm:h-[135px]"
          }`}
        >
          {/* Floating Heart & Discount inside the stage */}
          <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between z-10 pointer-events-none">
            {discountPercent > 5 ? (
              <span className="bg-[#f0c242] text-stone-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md shadow-2xs pointer-events-auto">
                {discountPercent}% OFF
              </span>
            ) : (
              <span />
            )}

            <motion.button
              whileTap={{ scale: 0.8 }}
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerHaptic("light");
                const rawId = userdata?._id || (userdata as any)?.id || null;
                const cleanUserId = rawId ? String(rawId) : null;
                dispatch(
                  toggleWishlist({
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
                  })
                );
                try {
                  const res = await axios.post("/api/wishlist", { productId: String(item._id) });
                  if (res.data?.success && Array.isArray(res.data?.wishlist) && res.data.wishlist.length > 0) {
                    dispatch(setWishlist({ items: res.data.wishlist, userId: cleanUserId }));
                  }
                } catch {
                  // guest
                }
              }}
              className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white text-stone-400 hover:text-rose-500 flex items-center justify-center shadow-2xs transition-all pointer-events-auto cursor-pointer border border-stone-100"
              aria-label="Wishlist"
            >
              <Heart
                size={12}
                className={`transition-colors ${
                  isLiked ? "text-rose-500 fill-rose-500 scale-110" : "text-stone-400 hover:text-rose-500"
                }`}
              />
            </motion.button>
          </div>

          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
            }}
            className="w-full h-full max-h-full max-w-full object-contain p-2 mix-blend-multiply drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] group-hover:scale-106 transition-transform duration-300"
          />

          {displayStock <= 0 && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center rounded-xl z-20">
              <span className="bg-stone-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. TITLE & VARIATION DROPDOWN */}
      <div className="flex flex-col justify-between flex-1 mt-1 min-h-0">
        <div>
          {/* Simple Clean Title (Matches Reference Image) */}
          <Link href={`/product/${item._id}`}>
            <h3 className="text-[13px] sm:text-[14px] font-bold text-stone-900 leading-tight line-clamp-1 group-hover:text-[#0a3d24] transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* Unit or Clean Dropdown for Variations */}
          <div className="mt-1">
            {item.variations && item.variations.length > 1 ? (
              <div className="relative w-full">
                <select
                  value={selectedVariation?.weight || item.variations[0]?.weight}
                  onChange={(e) => {
                    const v = item.variations?.find((varItem) => varItem.weight === e.target.value);
                    if (v) setSelectedVariation(v);
                  }}
                  className="w-full appearance-none bg-stone-50 hover:bg-stone-100/90 text-stone-600 text-[10.5px] font-medium py-0.5 pl-2 pr-5 rounded-md border border-stone-200/70 outline-none focus:border-[#0a3d24] transition-all cursor-pointer h-[22px]"
                >
                  {item.variations.map((v, i) => (
                    <option key={i} value={v.weight}>
                      {v.weight} - ₹{v.price} {v.stock <= 0 ? "(Sold out)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={10}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 font-medium leading-none h-[22px] flex items-center">
                {displayUnit}
              </p>
            )}
          </div>
        </div>

        {/* 3. BOTTOM ROW: PRICE ON LEFT, CIRCULAR BUTTON ON RIGHT (Exactly like Screenshot 2) */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100/80">
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] sm:text-[17.5px] font-extrabold text-stone-900 tracking-tight leading-none">
              ₹{displayPrice}
            </span>
            {activeMRP > displayPrice && (
              <span className="text-[11px] text-stone-400 line-through font-normal">
                ₹{activeMRP}
              </span>
            )}
          </div>

          {displayStock <= 0 ? (
            <button
              type="button"
              onClick={() => setShowAlertModal(true)}
              className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-full border border-amber-200"
            >
              Notify
            </button>
          ) : !cartitem ? (
            /* Circular Dark '+' Button (Clean minimal style from user's screenshot) */
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.88 }}
              type="button"
              onClick={(e) => {
                triggerHaptic("medium");
                const rect = e.currentTarget.getBoundingClientRect();
                triggerFlyToCart(item.image, rect);
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
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-[#1e2924] hover:bg-[#0a3d24] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer active:scale-90"
              aria-label="Add to cart"
            >
              <Plus size={15} className="stroke-[2.6]" />
            </motion.button>
          ) : (
            /* Stepper Pill [ − qty + ] */
            <div className="h-7.5 sm:h-8 bg-[#1e2924] text-white rounded-full px-1.5 flex items-center gap-1 shadow-xs">
              <motion.button
                whileTap={{ scale: 0.75 }}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  dispatch(decreaseQuantity(currentCartItemId));
                }}
                className="w-5 h-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
                aria-label="Decrease"
              >
                <Minus size={11} className="stroke-[2.5]" />
              </motion.button>

              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={cartitem.quantity}
                  initial={{ y: 4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -4, opacity: 0 }}
                  className="font-extrabold text-xs text-white min-w-[14px] text-center"
                >
                  {cartitem.quantity}
                </motion.span>
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.75 }}
                type="button"
                disabled={cartitem.quantity >= displayStock}
                onClick={(e) => {
                  triggerHaptic("light");
                  const rect = e.currentTarget.getBoundingClientRect();
                  triggerFlyToCart(item.image, rect);
                  dispatch(increaseQuantity(currentCartItemId));
                }}
                className="w-5 h-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer disabled:opacity-40"
                aria-label="Increase"
              >
                <Plus size={11} className="stroke-[2.5]" />
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
    </div>
  );
}
