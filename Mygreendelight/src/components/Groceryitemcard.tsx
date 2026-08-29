'use client'

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishlistSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ShoppingCart, Heart } from "lucide-react";
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
  variations?: { weight: string, price: number, stock: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Groceryitemcard({ item, isList = false }: { item: IGrosery, isList?: boolean }) {
  const dispatch = useDispatch<AppDispatch>()
  const {cartdata}=useSelector((state:RootState)=>state.cart)
  const {items: wishlistItems}=useSelector((state:RootState)=>state.wishlist)

  const [selectedVariation, setSelectedVariation] = React.useState(
    item.variations && item.variations.length > 0 ? item.variations[0] : null
  );

  const displayPrice = selectedVariation ? selectedVariation.price : item.price;
  const displayUnit = selectedVariation ? selectedVariation.weight : item.unit;
  const displayStock = selectedVariation ? selectedVariation.stock : item.stock;
  const currentCartItemId = item._id.toString() + (selectedVariation ? '-' + selectedVariation.weight : '');

  const cartitem = cartdata.find((cartitem) => cartitem.cartItemId === currentCartItemId);

  // Dynamic or simulated MRP
  const activeMRP = (item as any).mrp && (item as any).mrp > displayPrice 
    ? (item as any).mrp 
    : Math.round(displayPrice * 1.25);
  const discountPercent = Math.max(1, Math.round(((activeMRP - displayPrice) / activeMRP) * 100));

  const isLiked = wishlistItems.some(w => w._id === item._id.toString());

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`w-full bg-white rounded-2xl shadow-xs hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 overflow-hidden border border-gray-200/90 flex ${isList ? 'flex-row max-w-full gap-4 p-4' : 'flex-col p-3 sm:p-3.5'}`}
    >
      {/* IMAGE BOX */}
      <Link href={`/product/${item._id}`} className={`relative bg-gray-50/50 rounded-xl flex items-center justify-center cursor-pointer group ${isList ? 'w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] shrink-0' : 'w-full h-[130px] sm:h-[150px]'}`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 p-2"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-[#0f8646] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
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
          className="absolute top-0 right-0 p-1.5 bg-gray-50/90 backdrop-blur-xs rounded-full shadow-xs hover:bg-gray-100 transition-colors z-10"
        >
          <Heart 
            size={16} 
            className={isLiked ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-400"} 
          />
        </motion.button>

        {/* Out of Stock Sash */}
        {displayStock <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center overflow-hidden rounded-lg">
             <div className="absolute top-3 -left-8 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider py-1 px-8 -rotate-45 shadow-md z-20">
                Out of Stock
             </div>
          </div>
        )}
      </Link>

      {/* CONTENT */}
      <div className={`flex flex-col flex-1 ${isList ? 'justify-center' : 'justify-between mt-3'}`}>

        <div>
          {/* TITLE */}
          <Link href={`/product/${item._id}`}>
            <h2 className={`${isList ? 'text-[16px]' : 'text-[14px] line-clamp-1'} font-bold text-gray-900 leading-snug cursor-pointer hover:text-[#0f8646] transition-colors`}>
              {item.name}
            </h2>
          </Link>

          {/* UNIT */}
          <p className="text-[12px] text-gray-500 mt-0.5">
            {displayUnit}
          </p>

          {/* VARIATIONS DROPDOWN */}
          {item.variations && item.variations.length > 0 && (
            <select
              className={`text-[11px] font-medium p-1 mt-2 border border-gray-200 rounded-lg outline-none focus:border-[#0f8646] bg-white text-gray-700 ${isList ? 'w-48' : 'w-full'}`}
              value={selectedVariation?.weight}
              onChange={(e) => {
                const v = item.variations?.find(v => v.weight === e.target.value);
                if (v) setSelectedVariation(v);
              }}
            >
              {item.variations.map((v, i) => (
                <option key={i} value={v.weight}>{v.weight} - ₹{v.price} {v.stock <= 0 ? '(OOS)' : ''}</option>
              ))}
            </select>
          )}

          {/* PRICE ROW */}
          <div className="flex items-center gap-2 mt-2.5 mb-2 flex-wrap">
            <span className="text-[16px] font-extrabold text-[#0f8646]">
              ₹{displayPrice}
            </span>
            <span className="text-[12px] text-gray-400 line-through">
              ₹{activeMRP}
            </span>
            <span className="text-[10px] bg-green-100 text-[#0f8646] font-extrabold px-1.5 py-0.5 rounded-md">
              {discountPercent}% OFF
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <div className={isList ? 'w-40 mt-2' : ''}>
          {!cartitem ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={displayStock <= 0}
              className={`gap-2 ${isList ? '' : 'mt-2'} flex items-center justify-center w-full rounded-xl py-2 cursor-pointer text-[13px] font-extrabold transition-all border ${
                displayStock <= 0 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-white text-[#0f8646] border-[#0f8646] hover:bg-[#0f8646] hover:text-white shadow-2xs hover:shadow-md'
              }`}
              onClick={() => dispatch(addToCart({ 
                ...item, 
                price: displayPrice,
                unit: displayUnit,
                cartItemId: currentCartItemId,
                variation: selectedVariation ? { weight: selectedVariation.weight, price: selectedVariation.price, stock: selectedVariation.stock } : undefined,
                quantity: 1 
              }))}
            >
              <ShoppingCart size={14} />
              {displayStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
          ) : (
            <div className={`${isList ? '' : 'mt-2'} flex items-center justify-between bg-white border border-[#0f8646] rounded-xl overflow-hidden h-[36px] shadow-xs`}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="w-9 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-base"
                onClick={() => dispatch(decreaseQuantity(currentCartItemId))}
              >
                −
              </motion.button>
              <span className="flex-1 text-center font-extrabold text-sm text-gray-800">
                {cartitem.quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                disabled={cartitem.quantity >= displayStock}
                className={`w-9 h-full flex items-center justify-center transition font-black text-base ${
                  cartitem.quantity >= displayStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white'
                }`}
                onClick={() => dispatch(increaseQuantity(currentCartItemId))}
              >
                +
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}