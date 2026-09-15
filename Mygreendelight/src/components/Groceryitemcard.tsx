"use client";

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist, setWishlist } from "@/redux/WishlistSlice";
import { triggerHaptic } from "@/utils/haptics";
import { AppDispatch, RootState } from "@/redux/store";
import { Heart, Plus, Minus, Bell, Zap, Sparkles, ChevronDown, ShoppingBag, Check } from "lucide-react";
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 25 }}
      className={`w-full bg-[#fbfaf7] hover:bg-[#f6f4ee] border border-stone-200/80 hover:border-[#0a3d24]/40 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between relative group font-sans select-none rounded-[26px] p-3.5 sm:p-4 ${
        isList
          ? "flex-row max-w-full gap-4 min-h-[145px]"
          : "h-[355px] sm:h-[375px]"
      }`}
    >
      {/* Top Section: Badges & Wishlist Header */}
      <div>
        <div className="flex items-center justify-between w-full relative z-10">
          {/* Top-Left: Warm Golden Pill Badge (Like Reference Design) */}
          <div className="flex items-center gap-1">
            {discountPercent > 0 ? (
              <span className="bg-[#f0c242] text-stone-950 text-[10px] sm:text-[10.5px] font-black px-2.5 py-0.5 rounded-full shadow-2xs tracking-tight">
                {discountPercent}% OFF
              </span>
            ) : (
              <span className="bg-[#f0c242] text-stone-950 text-[10px] sm:text-[10.5px] font-black px-2.5 py-0.5 rounded-full shadow-2xs tracking-tight">
                ₹{displayPrice} per {displayUnit}
              </span>
            )}
            {item.isFeatured && (
              <span className="bg-amber-100 text-amber-950 text-[8.5px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300/80 shadow-2xs">
                ★ TOP
              </span>
            )}
          </div>

          {/* Top-Right: Minimalist Round Wishlist Heart */}
          <motion.button
            whileTap={{ scale: 0.78 }}
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
                // Guest or offline
              }
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-rose-500 flex items-center justify-center shadow-2xs transition-all border border-stone-200/60 cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart
              size={13}
              className={`transition-colors duration-200 ${
                isLiked ? "text-rose-500 fill-rose-500 scale-110" : "text-stone-400 hover:text-rose-500"
              }`}
            />
          </motion.button>
        </div>

        {/* Center: Produce Photo with Soft Warm Ambient Glow */}
        <Link
          href={`/product/${item._id}`}
          className={`relative w-full flex items-center justify-center cursor-pointer overflow-hidden my-1 ${
            isList ? "w-[120px] h-[120px] shrink-0" : "h-[135px] sm:h-[150px]"
          }`}
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
            }}
            className="w-full h-full max-h-full max-w-full object-contain p-2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.09)] group-hover:scale-108 transition-transform duration-500 ease-out"
          />

          {/* Out of stock overlay */}
          {displayStock <= 0 && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center z-10 rounded-2xl">
              <span className="bg-stone-900 text-white font-black text-[9.5px] uppercase px-2.5 py-1 rounded-full shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Middle Section: Title, Delivery Time & Variation Dropdown */}
      <div className="flex flex-col justify-between flex-1 mt-1">
        <div>
          {/* Title (2-line clamp) */}
          <Link href={`/product/${item._id}`}>
            <h3 className="text-[13.5px] sm:text-[14.5px] font-extrabold text-stone-900 leading-snug line-clamp-2 h-[36px] sm:h-[38px] group-hover:text-[#0a3d24] transition-colors font-heading tracking-tight">
              {item.name}
            </h3>
          </Link>

          {/* Delivery speed subtitle */}
          <p className="text-[11px] text-stone-500 font-medium leading-none mt-1 flex items-center gap-1">
            <span>Delivery: 10–15 minutes</span>
          </p>

          {/* 🔽 VARIATION DROPDOWN (As requested by user!) */}
          <div className="mt-2">
            {item.variations && item.variations.length > 1 ? (
              <div className="relative w-full">
                <select
                  value={selectedVariation?.weight || item.variations[0]?.weight}
                  onChange={(e) => {
                    const v = item.variations?.find((varItem) => varItem.weight === e.target.value);
                    if (v) setSelectedVariation(v);
                  }}
                  className="w-full appearance-none bg-white hover:bg-stone-50 text-stone-800 text-[11px] font-bold py-1 pl-2.5 pr-6 rounded-xl border border-stone-200/90 hover:border-[#0a3d24]/50 outline-none focus:border-[#0a3d24] shadow-2xs transition-all cursor-pointer h-[26px]"
                >
                  {item.variations.map((v, i) => (
                    <option key={i} value={v.weight}>
                      {v.weight} — ₹{v.price} {v.stock <= 0 ? "(Sold out)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
              </div>
            ) : (
              <div className="h-[26px] flex items-center">
                <span className="text-[11px] font-bold text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded-lg">
                  {displayUnit}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Price & Action Controls (Matches Reference Image 1 & 2) */}
        <div className="mt-3 pt-1 border-t border-stone-200/50">
          {displayStock <= 0 ? (
            <button
              type="button"
              onClick={() => setShowAlertModal(true)}
              className="w-full h-[36px] rounded-xl flex items-center justify-center gap-1.5 font-bold text-[11px] transition-all bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell size={12} className="stroke-[2]" />
              <span>Notify Me</span>
            </button>
          ) : !cartitem ? (
            /* Unadded state: Big Bold Price on Left + Round Green Plus Button on Right (Image 2 style) */
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-lg sm:text-[20px] font-black text-stone-950 tracking-tight leading-none">
                  ₹{displayPrice}
                </span>
                {activeMRP > displayPrice && (
                  <span className="text-xs text-stone-400 line-through font-medium">
                    ₹{activeMRP}
                  </span>
                )}
              </div>

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
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0a3d24] hover:bg-[#072416] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(10,61,36,0.25)] cursor-pointer transition-all active:scale-90 shrink-0"
                aria-label="Add to cart"
                title="Add to cart"
              >
                <Plus size={18} className="stroke-[2.8]" />
              </motion.button>
            </div>
          ) : (
            /* Added state: Stepper Pill [ − qty + ] + Total on Left + Green Bag Button on Right (Image 1 style) */
            <div className="flex items-center justify-between gap-1.5 w-full">
              {/* Pill Stepper: [ −  qty  + ] */}
              <div className="bg-stone-200/90 rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-2xs shrink-0">
                <motion.button
                  whileTap={{ scale: 0.75 }}
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    dispatch(decreaseQuantity(currentCartItemId));
                  }}
                  className="w-6 h-6 rounded-full hover:bg-white text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} className="stroke-[2.5]" />
                </motion.button>

                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={cartitem.quantity}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="font-black text-xs sm:text-sm text-stone-950 px-1 min-w-[16px] text-center"
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
                  className="w-6 h-6 rounded-full hover:bg-white text-stone-800 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} className="stroke-[2.5]" />
                </motion.button>
              </div>

              {/* Total Calculation */}
              <div className="min-w-0 flex-1 text-center">
                <span className="text-[11.5px] font-black text-stone-800 tracking-tight block truncate">
                  Total: ₹{cartitem.quantity * displayPrice}
                </span>
              </div>

              {/* Shopping Bag Green Indicator */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0a3d24] text-white flex items-center justify-center shadow-xs shrink-0"
                title="Item in Cart"
              >
                <ShoppingBag size={14} className="stroke-[2.2]" />
              </div>
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
