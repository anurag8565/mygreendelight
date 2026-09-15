"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist, setWishlist } from "@/redux/WishlistSlice";
import { triggerHaptic } from "@/utils/haptics";
import { AppDispatch, RootState } from "@/redux/store";
import { Heart, Plus, Minus, Bell, Zap, Sparkles, ChevronDown } from "lucide-react";
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

  // Dynamic Realistic MRP & Discount
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

  // Category micro-label formatting
  const catLabel = React.useMemo(() => {
    const raw = (item.category || "").toLowerCase();
    if (raw.includes("fruit")) return "Fresh Fruits";
    if (raw.includes("exotic")) return "Exotic Produce";
    if (raw.includes("combo")) return "Value Combo";
    return "Taaza Sabzi";
  }, [item.category]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={`w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 hover:border-emerald-600/40 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(10,61,36,0.1)] transition-all duration-300 flex flex-col justify-between relative group font-sans select-none overflow-hidden ${
        isList
          ? "flex-row max-w-full gap-4 p-3 sm:p-4 min-h-[145px]"
          : "h-[345px] sm:h-[365px] p-3 sm:p-3.5"
      }`}
    >
      {/* 1. TOP PRODUCE STAGE */}
      <Link
        href={`/product/${item._id}`}
        className={`relative bg-gradient-to-b from-stone-50/90 via-stone-50/40 to-emerald-50/20 group-hover:to-emerald-100/30 transition-all duration-500 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden shrink-0 border border-stone-100/90 ${
          isList
            ? "w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
            : "w-full h-[148px] sm:h-[162px]"
        }`}
      >
        {/* Crisp Product Photo with Subtle Shadow */}
        <img
          src={item.image}
          alt={`Fresh ${item.name} Online Delivery in Bhopal | SubziQuick`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
          }}
          className="w-full h-full max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out p-2.5 drop-shadow-[0_6px_12px_rgba(0,0,0,0.08)]"
        />

        {/* Top-Left Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#0a3d24] text-white text-[9px] sm:text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wide">
              {discountPercent}% OFF
            </span>
          )}
          {item.isFeatured && (
            <span className="bg-amber-100/95 border border-amber-300/80 text-amber-950 text-[8.5px] font-black px-1.5 py-0.5 rounded-full shadow-2xs flex items-center gap-0.5">
              <Sparkles size={8.5} className="text-amber-600" />
              <span>TOP PICK</span>
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart with Glassmorphism */}
        <motion.button
          whileTap={{ scale: 0.78 }}
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerHaptic("light");
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
            } catch {
              // Guest or offline
            }
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-2xs hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer border border-stone-200/60"
          aria-label="Save to Wishlist"
        >
          <Heart
            size={12.5}
            className={`transition-colors duration-200 ${
              isLiked ? "text-rose-500 fill-rose-500 scale-110" : "text-stone-400 hover:text-rose-500"
            }`}
          />
        </motion.button>

        {/* Bottom-Left 10-15 Min Speed Micro-Pill */}
        <div className="absolute bottom-1.5 left-2 z-10">
          <span className="bg-white/95 backdrop-blur-md text-[#0a3d24] font-black text-[8.5px] sm:text-[9px] px-1.5 py-0.5 rounded-md shadow-2xs border border-stone-100 flex items-center gap-1">
            <Zap size={9} className="text-amber-500 fill-amber-500" />
            <span>10-15 MINS</span>
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {displayStock <= 0 && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-rose-700 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* 2. PRODUCT DETAILS & PRICING */}
      <div className="flex flex-col flex-1 justify-between mt-2.5 min-h-0">
        <div>
          {/* Farm Category Micro-Tag */}
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-800/80 block leading-tight truncate">
            {catLabel}
          </span>

          {/* Product Title (Strict 2-line clamp) */}
          <Link href={`/product/${item._id}`}>
            <h3 className="text-xs sm:text-[13.5px] font-extrabold text-stone-900 leading-snug line-clamp-2 h-[34px] sm:h-[38px] group-hover:text-[#0a3d24] transition-colors mt-0.5 font-heading">
              {item.name}
            </h3>
          </Link>

          {/* Unit / Weight or Styled Variations Selector */}
          <div className="mt-1 h-[24px] flex items-center">
            {item.variations && item.variations.length > 1 ? (
              <div className="relative w-full">
                <select
                  className="w-full appearance-none text-[10px] font-bold py-0.5 pl-2 pr-5 border border-stone-200 hover:border-emerald-600/40 rounded-lg outline-none focus:border-[#0a3d24] bg-stone-50 text-stone-700 h-[24px] cursor-pointer shadow-2xs transition-colors"
                  value={selectedVariation?.weight || item.variations[0]?.weight}
                  onChange={(e) => {
                    const v = item.variations?.find((varItem) => varItem.weight === e.target.value);
                    if (v) setSelectedVariation(v);
                  }}
                >
                  {item.variations.map((v, i) => (
                    <option key={i} value={v.weight}>
                      {v.weight} • ₹{v.price} {v.stock <= 0 ? "(Sold Out)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            ) : (
              <span className="inline-flex items-center text-[10px] sm:text-[10.5px] font-bold text-stone-600 bg-stone-100/90 px-2 py-0.5 rounded-md border border-stone-200/50">
                {displayUnit}
              </span>
            )}
          </div>

          {/* Price Row & Savings Chip */}
          <div className="flex items-center gap-1.5 mt-1.5 h-[24px]">
            <span className="text-base sm:text-lg font-black text-stone-950 group-hover:text-[#0a3d24] transition-colors shrink-0 tracking-tight">
              ₹{displayPrice}
            </span>
            <span className="text-[11px] sm:text-[11.5px] text-stone-400 line-through font-normal shrink-0">
              ₹{activeMRP}
            </span>
            {activeMRP > displayPrice && (
              <span className="text-[9px] sm:text-[9.5px] font-black text-[#0a3d24] bg-emerald-50/95 border border-emerald-300/80 px-1.5 py-0.5 rounded-md ml-auto shrink-0 truncate max-w-[85px]">
                Save ₹{activeMRP - displayPrice}
              </span>
            )}
          </div>
        </div>

        {/* 3. PREMIUM ACTION BUTTON */}
        <div className="mt-auto pt-2.5">
          {displayStock <= 0 ? (
            <button
              type="button"
              onClick={() => setShowAlertModal(true)}
              className="w-full h-[36px] sm:h-[38px] rounded-xl flex items-center justify-center gap-1.5 font-bold text-[11px] transition-all bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell size={12} className="stroke-[2]" />
              <span>Notify Me</span>
            </button>
          ) : !cartitem ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
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
              className="w-full h-[36px] sm:h-[38px] rounded-xl flex items-center justify-center gap-1.5 font-black text-xs uppercase tracking-wider transition-all duration-200 border-1.5 border-[#0a3d24] cursor-pointer bg-white text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white hover:shadow-[0_6px_20px_rgba(10,61,36,0.22)] shadow-2xs active:scale-92 group/btn"
            >
              <Plus size={14} className="stroke-[3] text-[#0a3d24] group-hover/btn:text-white transition-colors" />
              <span>ADD</span>
            </motion.button>
          ) : (
            <div className="flex items-center justify-between bg-[#0a3d24] text-white rounded-xl overflow-hidden h-[36px] sm:h-[38px] shadow-[0_4px_14px_rgba(10,61,36,0.25)] ring-1 ring-[#0a3d24]/40">
              <motion.button
                whileTap={{ scale: 0.75 }}
                type="button"
                className="w-10 h-full flex items-center justify-center hover:bg-black/20 active:bg-black/30 transition-colors font-bold text-sm cursor-pointer"
                onClick={() => {
                  triggerHaptic("light");
                  dispatch(decreaseQuantity(currentCartItemId));
                }}
                aria-label="Decrease quantity"
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
                    className="font-black text-xs sm:text-sm text-white select-none inline-block font-heading"
                  >
                    {cartitem.quantity}
                  </motion.span>
                </AnimatePresence>
              </div>

              <motion.button
                whileTap={{ scale: 0.75 }}
                type="button"
                disabled={cartitem.quantity >= displayStock}
                className={`w-10 h-full flex items-center justify-center transition-colors font-bold text-sm ${
                  cartitem.quantity >= displayStock
                    ? "bg-black/25 text-white/50 cursor-not-allowed"
                    : "hover:bg-black/20 active:bg-black/30 cursor-pointer text-white"
                }`}
                onClick={(e) => {
                  triggerHaptic("light");
                  const rect = e.currentTarget.getBoundingClientRect();
                  triggerFlyToCart(item.image, rect);
                  dispatch(increaseQuantity(currentCartItemId));
                }}
                aria-label="Increase quantity"
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
