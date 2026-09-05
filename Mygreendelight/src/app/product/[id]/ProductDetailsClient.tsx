"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishlistSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  ShieldCheck,
  Clock,
  RefreshCw,
  Check,
  Star,
  Zap,
  Truck,
  Leaf,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  ShoppingBag,
  Info,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Groceryitemcard from "@/components/Groceryitemcard";
import Footer from "@/components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailsClient({
  product,
  relatedProducts = [],
}: {
  product: any;
  relatedProducts?: any[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { userdata } = useSelector((state: RootState) => state.user);

  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string>("about");
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);
  const hasVariations = product.variations && product.variations.length > 0;
  const currentPrice = hasVariations
    ? product.variations[selectedVarIndex].price
    : product.price;
  const currentUnit = hasVariations
    ? product.variations[selectedVarIndex].weight
    : product.unit;
  const currentStock = hasVariations
    ? product.variations[selectedVarIndex].stock
    : product.stock;

  // Active MRP & Discount
  const activeMRP =
    product.mrp && product.mrp > currentPrice
      ? product.mrp
      : Math.round(currentPrice * 1.25);
  const discountPercent = Math.max(
    1,
    Math.round(((activeMRP - currentPrice) / activeMRP) * 100)
  );

  // Cart item identification
  const cartItemId = hasVariations
    ? `${product._id}-${product.variations[selectedVarIndex].weight}`
    : product._id;

  const cartItem = cartdata.find(
    (item: any) =>
      item.cartItemId === cartItemId ||
      (!item.cartItemId && item._id?.toString() === product._id?.toString())
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (currentStock <= 0) return;

    dispatch(
      addToCart({
        ...product,
        price: currentPrice,
        unit: currentUnit,
        cartItemId: cartItemId,
        quantity: 1,
        variation: hasVariations
          ? {
              weight: product.variations[selectedVarIndex].weight,
              price: currentPrice,
              stock: currentStock,
            }
          : undefined,
      } as any)
    );
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out fresh ${product.name} on SubziQuick Bhopal! 🥬🍎\n\nOrder here: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userdata) {
      setReviewMsg("Please login to write a review");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await axios.post(`/api/grocery/${product._id}/review`, {
        rating,
        comment,
      });
      setReviewMsg(res.data.message);
      if (res.status === 201) {
        window.location.reload();
      }
    } catch (error: any) {
      setReviewMsg(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-3 sm:py-6 pb-28 sm:pb-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 overflow-x-auto pb-1 scrollbar-none">
          <Link href="/" className="hover:text-[#0f8646] transition font-bold">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#0f8646] transition font-bold">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight size={12} />
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="hover:text-[#0f8646] transition font-bold"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-gray-900 font-black truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-4 sm:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Left 5 Cols: Luxury Image Frame */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="w-full aspect-square max-h-[360px] sm:max-h-[440px] rounded-3xl bg-gradient-to-br from-emerald-50/40 via-green-50/20 to-white border border-gray-100 p-6 flex items-center justify-center relative overflow-hidden group shadow-inner">
                
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
                  }}
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-md"
                />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="bg-[#0f8646] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Leaf size={11} />
                    <span>100% Farm Fresh</span>
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Floating Actions (Heart & Share) */}
                <div className="absolute top-3.5 right-3.5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      dispatch(toggleWishlist(product));
                      setShowWishlistToast(true);
                      setTimeout(() => setShowWishlistToast(false), 2500);
                      try {
                        await axios.post("/api/wishlist", { productId: product._id });
                      } catch (error) {}
                    }}
                    className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/80 shadow-xs hover:bg-gray-100 flex items-center justify-center transition cursor-pointer active:scale-90"
                    title="Wishlist"
                  >
                    <Heart
                      size={16}
                      className={isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400 hover:text-rose-500"}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/80 shadow-xs hover:bg-emerald-50 text-[#25D366] flex items-center justify-center transition cursor-pointer active:scale-90"
                    title="Share on WhatsApp"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                {/* Mandi Fresh Produce Tag */}
                <span className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 border border-emerald-200/80">
                  <span className="text-xs">🌿</span>
                  <span>Mandi Fresh • Same-Day Bhopal</span>
                </span>

                {/* Out of Stock Overlay */}
                {currentStock <= 0 && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center z-10">
                    <span className="bg-red-600 text-white font-black text-xs uppercase px-4 py-1.5 rounded-full shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 7 Cols: Product Details & Cart Actions */}
            <div className="lg:col-span-7 flex flex-col justify-start">
              
              {/* Category & Speed Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {product.category || "Fresh Produce"}
                </span>
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <BadgeCheck size={14} className="text-[#0f8646]" /> Farm Verified
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Fast Info */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-black">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
                  <span className="text-gray-400 font-bold ml-1">
                    ({product.numReviews || "12"} ratings)
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  Standard Pack: <strong>{currentUnit}</strong>
                </span>
              </div>

              {/* Price Block */}
              <div className="mb-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-gray-950">
                      ₹{currentPrice}
                    </span>
                    <span className="text-base text-gray-400 line-through font-medium">
                      ₹{activeMRP}
                    </span>
                    <span className="bg-[#0f8646] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                      SAVE ₹{activeMRP - currentPrice} ({discountPercent}% OFF)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">
                    Inclusive of all taxes • Sourced directly from Bhopal local farms
                  </p>
                </div>
              </div>

              {/* Pack Sizes (Variations) */}
              {hasVariations && (
                <div className="mb-6">
                  <span className="text-xs font-black uppercase text-gray-500 tracking-wider block mb-2.5">
                    Select Pack Size:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {product.variations.map((v: any, index: number) => {
                      const isSelected = selectedVarIndex === index;
                      const vMrp = Math.round(v.price * 1.25);
                      const vDiscount = Math.round(((vMrp - v.price) / vMrp) * 100);

                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedVarIndex(index)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-[#0f8646] bg-emerald-50 text-gray-950 shadow-xs ring-2 ring-emerald-300"
                              : "border-gray-200 hover:border-emerald-300 bg-white text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-xs block truncate">
                              {v.weight}
                            </span>
                            {isSelected && <Check size={14} className="text-[#0f8646] stroke-[3]" />}
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-black text-sm text-[#0f8646]">
                              ₹{v.price}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{vMrp}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-2 w-full">
                {quantity > 0 ? (
                  <div className="flex items-center bg-[#0f8646] text-white rounded-2xl h-14 w-full sm:w-48 overflow-hidden shadow-md">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(cartItemId))}
                      className="w-14 h-full flex items-center justify-center hover:bg-black/15 transition font-black text-xl cursor-pointer active:scale-90"
                    >
                      <Minus size={18} className="stroke-[3]" />
                    </button>
                    <span className="flex-1 text-center font-black text-base text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                      }}
                      disabled={quantity >= currentStock}
                      className={`w-14 h-full flex items-center justify-center transition font-black text-xl active:scale-90 ${
                        quantity >= currentStock
                          ? "bg-black/25 text-white/50 cursor-not-allowed"
                          : "hover:bg-black/15 cursor-pointer text-white"
                      }`}
                    >
                      <Plus size={18} className="stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className={`w-full h-14 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                      currentStock > 0
                        ? "bg-[#0f8646] hover:bg-[#0c6a38] text-white shadow-emerald-700/20"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={18} />
                    <span>{currentStock > 0 ? `Add to Basket • ₹${currentPrice}` : "Out of Stock"}</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* 4 Trust Feature Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">100% Quality Checked</h4>
              <p className="text-[10px] text-gray-500 font-medium">Ozone-washed & sorted</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">Same-Day Fresh Delivery</h4>
              <p className="text-[10px] text-gray-500 font-medium">Morning & Evening slots across Bhopal</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">FREE Delivery &gt; ₹199</h4>
              <p className="text-[10px] text-gray-500 font-medium">Zero packing charges</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">Easy Replacement</h4>
              <p className="text-[10px] text-gray-500 font-medium">Instant doorstep check</p>
            </div>
          </div>
        </div>

        {/* Product Information Accordions */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-7 shadow-xs mb-8">
          <h3 className="text-base sm:text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Info size={18} className="text-[#0f8646]" />
            <span>Product Specifications & Freshness</span>
          </h3>

          <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {/* About */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "about" ? "" : "about")}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-gray-900">
                  About {product.name}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${openSection === "about" ? "rotate-180 text-[#0f8646]" : ""}`}
                />
              </button>
              {openSection === "about" && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed font-medium">
                  {product.description ||
                    `Farm-fresh ${product.name} sourced directly from verified local farmers around Bhopal. Packed with essential vitamins, minerals and rich natural taste for healthy daily cooking.`}
                </div>
              )}
            </div>

            {/* Sourcing */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "sourcing" ? "" : "sourcing")}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-gray-900">
                  Origin & Farm Sourcing
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${openSection === "sourcing" ? "rotate-180 text-[#0f8646]" : ""}`}
                />
              </button>
              {openSection === "sourcing" && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed font-medium">
                  {product.sourcing ||
                    `Harvested at 4:30 AM from agricultural belts near Bhopal. Cleaned using organic ozone wash to ensure zero harmful residues.`}
                </div>
              )}
            </div>

            {/* Storage */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "storage" ? "" : "storage")}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-gray-900">
                  Storage & Freshness Tips
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${openSection === "storage" ? "rotate-180 text-[#0f8646]" : ""}`}
                />
              </button>
              {openSection === "storage" && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed font-medium">
                  {product.storage ||
                    `Store in a cool, ventilated container or refrigerate at 4°C - 7°C to preserve natural crispness and freshness for up to 48 hours.`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Ratings & Reviews */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-7 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                Customer Ratings & Feedback
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Real reviews from verified buyers in Bhopal
              </p>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl w-fit">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-black text-gray-900">
                {product.rating ? product.rating.toFixed(1) : "4.8"} / 5.0
              </span>
            </div>
          </div>

          {/* Write a Review Form */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5">
            <h4 className="font-black text-xs text-gray-900 uppercase tracking-wider mb-3">
              Write a Review
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-[#0f8646] bg-white cursor-pointer shadow-2xs"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                  <option value="3">⭐⭐⭐ 3 - Average</option>
                  <option value="2">⭐⭐ 2 - Poor</option>
                  <option value="1">⭐ 1 - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Feedback
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="How was the freshness, delivery speed and taste?"
                  rows={2}
                  className="w-full border border-gray-300 rounded-2xl p-3 text-xs outline-none focus:border-[#0f8646] bg-white resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>

              {reviewMsg && (
                <p className="text-xs font-bold text-red-500 mt-2">{reviewMsg}</p>
              )}
            </form>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                You May Also Like
              </h3>
              <Link
                href="/shop"
                className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs flex items-center gap-0.5"
              >
                <span>View More</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.map((item) => (
                <Groceryitemcard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Wishlist Toast */}
      {showWishlistToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-bounce text-xs font-black">
          <Heart size={15} className="text-rose-400 fill-rose-400" />
          <span>Added to your Wishlist!</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
