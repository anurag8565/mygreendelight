"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist, setWishlist } from "@/redux/WishlistSlice";
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

  const cartitem = cartdata.find(
    (c) =>
      c.cartItemId === currentCartItemId ||
      (!c.cartItemId && c._id?.toString() === item._id?.toString())
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
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`w-full bg-white rounded-3xl border border-slate-100/90 hover:border-emerald-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(15,134,70,0.08)] transition-all duration-300 flex flex-col justify-between relative group font-sans ${
        isList
          ? "flex-row max-w-full gap-4 p-3.5 min-h-[130px]"
          : "h-[295px] sm:h-[315px] p-2.5 sm:p-3"
      }`}
    >
      {/* 1. TOP IMAGE BOX (Clean Minimalist Isolated Container) */}
      <Link
        href={`/product/${item._id}`}
        className={`relative bg-[#f8f9fa] rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden shrink-0 transition-colors duration-300 group-hover:bg-slate-50 ${
          isList
            ? "w-[105px] h-[105px] sm:w-[120px] sm:h-[120px]"
            : "w-full h-[135px] sm:h-[148px]"
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
          className="w-full h-full max-h-full max-w-full object-contain group-hover:scale-106 transition-transform duration-500 ease-out p-2"
        />

        {/* Minimalist Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#0f8646] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs">
              {discountPercent}% OFF
            </span>
          )}
          {item.isFeatured && (
            <span className="bg-amber-400 text-slate-950 text-[8.5px] font-black px-1.5 py-0.5 rounded-full shadow-2xs flex items-center gap-0.5">
              <span>★</span>
              <span>HOT</span>
            </span>
          )}
        </div>

        {/* Wishlist Button (Subtle Glassmorphic) */}
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
                unit: displayUnit,
                image: item.image,
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
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-xs rounded-full shadow-2xs hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer flex items-center justify-center border border-slate-100"
          aria-label="Wishlist"
        >
          <Heart
            size={13}
            className={`transition-colors duration-200 ${
              isLiked ? "text-rose-500 fill-rose-500 scale-110" : "text-slate-400 hover:text-rose-500"
            }`}
          />
        </motion.button>

        {/* Out of Stock Overlay */}
        {displayStock <= 0 && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center z-10">
            <span className="bg-slate-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* 2. MIDDLE CONTENT & BOTTOM ACTION (Figma App Layout) */}
      <div className="flex flex-col flex-1 justify-between mt-2 min-h-0">
        <div>
          {/* TITLE */}
          <Link href={`/product/${item._id}`}>
            <h3 className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#0f8646] transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* UNIT / WEIGHT & VARIATIONS */}
          <div className="mt-0.5">
            {item.variations && item.variations.length > 1 ? (
              <select
                className="w-full text-[10px] font-semibold py-0.5 px-1.5 border border-slate-200 hover:border-emerald-300 rounded-lg outline-none bg-slate-50 text-slate-700 h-[20px] cursor-pointer transition-colors"
                value={selectedVariation?.weight || item.variations[0]?.weight}
                onChange={(e) => {
                  const v = item.variations?.find((varItem) => varItem.weight === e.target.value);
                  if (v) setSelectedVariation(v);
                }}
              >
                {item.variations.map((v, i) => (
                  <option key={i} value={v.weight}>
                    {v.weight} - ₹{v.price} {v.stock <= 0 ? "(Out)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[10.5px] text-slate-400 font-medium truncate">
                {displayUnit}
              </p>
            )}
          </div>
        </div>

        {/* 3. PRICE & CIRCULAR ACTION ROW */}
        <div className="flex items-center justify-between mt-auto pt-2 gap-1">
          {/* Price Stack */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-slate-950">
                ₹{displayPrice}
              </span>
              {activeMRP > displayPrice && (
                <span className="text-[10px] text-slate-400 line-through">
                  ₹{activeMRP}
                </span>
              )}
            </div>
            {activeMRP > displayPrice && (
              <span className="text-[9px] font-extrabold text-[#0f8646] leading-none">
                Save ₹{activeMRP - displayPrice}
              </span>
            )}
          </div>

          {/* Action Trigger: Circular Green Button vs Stepper Pill */}
          <div className="shrink-0">
            {displayStock <= 0 ? (
              <button
                type="button"
                onClick={() => setShowAlertModal(true)}
                className="h-7 px-2 rounded-xl flex items-center justify-center gap-1 font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                title="Notify Me"
              >
                <Bell size={11} />
                <span>Notify</span>
              </button>
            ) : !cartitem ? (
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.08 }}
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
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0f8646] hover:bg-[#0c6a38] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer"
                title="Add to cart"
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus size={16} className="stroke-[3]" />
              </motion.button>
            ) : (
              <div className="flex items-center bg-[#0f8646] text-white rounded-full overflow-hidden h-7 sm:h-8 px-1 shadow-sm">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  className="w-5.5 sm:w-6 h-full flex items-center justify-center hover:bg-black/15 transition cursor-pointer"
                  onClick={() => {
                    if (typeof window !== "undefined" && navigator.vibrate) {
                      try { navigator.vibrate(15); } catch (e) {}
                    }
                    dispatch(decreaseQuantity(currentCartItemId));
                  }}
                  aria-label="Decrease"
                >
                  <Minus size={11} className="stroke-[3]" />
                </motion.button>
                <span className="w-5 text-center font-black text-xs text-white select-none">
                  {cartitem.quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  disabled={cartitem.quantity >= displayStock}
                  className={`w-5.5 sm:w-6 h-full flex items-center justify-center transition cursor-pointer ${
                    cartitem.quantity >= displayStock ? "opacity-40 cursor-not-allowed" : "hover:bg-black/15"
                  }`}
                  onClick={() => {
                    if (typeof window !== "undefined" && navigator.vibrate) {
                      try { navigator.vibrate(15); } catch (e) {}
                    }
                    dispatch(increaseQuantity(currentCartItemId));
                  }}
                  aria-label="Increase"
                >
                  <Plus size={11} className="stroke-[3]" />
                </motion.button>
              </div>
            )}
          </div>
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
