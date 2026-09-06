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
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
      setReviewMsg(res.data?.message || "Review submitted successfully!");
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
    <div className="bg-[#f8faf9] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-5 pb-28 sm:pb-16">
        
        {/* Top Breadcrumb & Mobile Back Navigation */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 overflow-x-auto scrollbar-none py-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="sm:hidden p-1.5 rounded-full bg-white border border-gray-200 text-gray-700 active:scale-90 mr-1 cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft size={14} />
            </button>
            <Link href="/" className="hover:text-[#0c831f] transition font-semibold shrink-0">
              Home
            </Link>
            <ChevronRight size={11} className="text-gray-400 shrink-0" />
            <Link href="/shop" className="hover:text-[#0c831f] transition font-semibold shrink-0">
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight size={11} className="text-gray-400 shrink-0" />
                <Link
                  href={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-[#0c831f] transition font-semibold capitalize shrink-0"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={11} className="text-gray-400 shrink-0" />
            <span className="text-gray-900 font-bold truncate max-w-[150px] sm:max-w-[250px]">
              {product.name}
            </span>
          </nav>

          {/* Top Quick Actions (Desktop & Mobile) */}
          <div className="flex items-center gap-1.5 shrink-0">
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
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-gray-50 flex items-center justify-center transition cursor-pointer active:scale-90"
              title="Wishlist"
            >
              <Heart
                size={15}
                className={isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400 hover:text-rose-500"}
              />
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-emerald-50 text-[#25D366] flex items-center justify-center transition cursor-pointer active:scale-90"
              title="Share on WhatsApp"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-3.5 sm:p-7 shadow-xs mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            
            {/* Left 5 Cols: Product Image Frame */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="w-full aspect-square max-h-[340px] sm:max-h-[420px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-emerald-50/50 via-white to-gray-50/30 border border-gray-100 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden group shadow-2xs">
                
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
                  }}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="bg-[#0c831f] text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Leaf size={10} />
                    <span>100% Farm Fresh</span>
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-rose-600 text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Mandi Fresh Tag */}
                <span className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-emerald-900 text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1 border border-emerald-200/80">
                  <span>🌿</span>
                  <span>Karond Mandi • Same-Day</span>
                </span>

                {/* Out of Stock Overlay */}
                {currentStock <= 0 && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center z-10">
                    <span className="bg-red-600 text-white font-black text-xs uppercase px-4 py-1.5 rounded-full shadow-md">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 7 Cols: Product Details & Cart Actions */}
            <div className="lg:col-span-7 flex flex-col justify-start">
              
              {/* Category & Verified Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-black uppercase text-[#0c831f] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                  {product.category || "Fresh Produce"}
                </span>
                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <BadgeCheck size={13} className="text-[#0c831f]" /> Bhopal Farm Direct
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-3xl font-black text-gray-900 leading-tight mb-1.5 tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Fast Info */}
              <div className="flex items-center gap-3 mb-3.5 pb-2.5 border-b border-gray-100 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-lg text-xs font-black">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
                  <span className="text-gray-400 font-bold ml-0.5">
                    ({product.numReviews || "89"})
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  Unit Pack: <strong className="text-gray-800">{currentUnit}</strong>
                </span>
              </div>

              {/* Price Block */}
              <div className="mb-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-gray-950">
                      ₹{currentPrice}
                    </span>
                    <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                      ₹{activeMRP}
                    </span>
                    <span className="bg-[#0c831f] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                      SAVE ₹{activeMRP - currentPrice} ({discountPercent}% OFF)
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-1">
                    Inclusive of all taxes • 100% Ozone-Washed & Chemical-Free
                  </p>
                </div>
              </div>

              {/* Pack Sizes (Variations Chips) */}
              {hasVariations && (
                <div className="mb-5">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-gray-500 tracking-wider block mb-2">
                    Choose Pack Size:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variations.map((v: any, index: number) => {
                      const isSelected = selectedVarIndex === index;
                      const vMrp = Math.round(v.price * 1.25);
                      const vDiscount = Math.round(((vMrp - v.price) / vMrp) * 100);

                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedVarIndex(index)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-[#0c831f] bg-emerald-50 text-gray-950 shadow-2xs ring-2 ring-emerald-400/40"
                              : "border-gray-200 hover:border-emerald-300 bg-white text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-black text-xs block truncate">
                              {v.weight}
                            </span>
                            {isSelected && <Check size={13} className="text-[#0c831f] stroke-[3]" />}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-black text-xs sm:text-sm text-[#0c831f]">
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

              {/* Action Buttons Row (Desktop & Main View) */}
              <div className="flex items-center gap-3 pt-1 w-full">
                {quantity > 0 ? (
                  <div className="flex items-center bg-[#0c831f] text-white rounded-2xl h-12 sm:h-13 w-full sm:w-52 overflow-hidden shadow-md">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(cartItemId))}
                      className="w-14 h-full flex items-center justify-center hover:bg-black/15 transition font-black text-lg cursor-pointer active:scale-90"
                    >
                      <Minus size={16} className="stroke-[3]" />
                    </button>
                    <span className="flex-1 text-center font-black text-sm sm:text-base text-white">
                      {quantity} in Basket
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                      }}
                      disabled={quantity >= currentStock}
                      className={`w-14 h-full flex items-center justify-center transition font-black text-lg active:scale-90 ${
                        quantity >= currentStock
                          ? "bg-black/25 text-white/50 cursor-not-allowed"
                          : "hover:bg-black/15 cursor-pointer text-white"
                      }`}
                    >
                      <Plus size={16} className="stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className={`w-full h-12 sm:h-13 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                      currentStock > 0
                        ? "bg-[#0c831f] hover:bg-[#0a6c1a] text-white shadow-emerald-700/20"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={16} />
                    <span>{currentStock > 0 ? `Add to Basket • ₹${currentPrice}` : "Out of Stock"}</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* 4 Trust Feature Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0c831f] flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">100% Quality Checked</h4>
              <p className="text-[10px] text-gray-500 font-medium">Ozone-washed & graded</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">10-15 Min Express</h4>
              <p className="text-[10px] text-gray-500 font-medium">Delivered fresh in Bhopal</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Truck size={16} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">Free Delivery &gt; ₹199</h4>
              <p className="text-[10px] text-gray-500 font-medium">Zero hidden packaging charges</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <RefreshCw size={16} />
            </div>
            <div>
              <h4 className="font-black text-xs text-gray-900">Instant Replacement</h4>
              <p className="text-[10px] text-gray-500 font-medium">No-questions-asked refund</p>
            </div>
          </div>
        </div>

        {/* Product Information Accordions */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-xs mb-5">
          <h3 className="text-sm sm:text-base font-black text-gray-900 mb-3 flex items-center gap-2">
            <Info size={16} className="text-[#0c831f]" />
            <span>Product Details & Freshness Guarantee</span>
          </h3>

          <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {/* About */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "about" ? "" : "about")}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-gray-900">
                  About {product.name}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform ${openSection === "about" ? "rotate-180 text-[#0c831f]" : ""}`}
                />
              </button>
              {openSection === "about" && (
                <div className="px-3.5 pb-3.5 text-xs text-gray-600 leading-relaxed font-medium">
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
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-gray-900">
                  Origin & Farm Sourcing
                </span>
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform ${openSection === "sourcing" ? "rotate-180 text-[#0c831f]" : ""}`}
                />
              </button>
              {openSection === "sourcing" && (
                <div className="px-3.5 pb-3.5 text-xs text-gray-600 leading-relaxed font-medium">
                  {product.sourcing ||
                    `Harvested daily at 4:30 AM from agricultural contract farms near Bhopal. Cleaned using 100% chemical-free organic ozone wash to ensure complete safety.`}
                </div>
              )}
            </div>

            {/* Storage */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "storage" ? "" : "storage")}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-gray-900">
                  Storage & Freshness Tips
                </span>
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform ${openSection === "storage" ? "rotate-180 text-[#0c831f]" : ""}`}
                />
              </button>
              {openSection === "storage" && (
                <div className="px-3.5 pb-3.5 text-xs text-gray-600 leading-relaxed font-medium">
                  {product.storage ||
                    `Store in a cool, ventilated container or refrigerate at 4°C - 7°C to preserve natural crispness and freshness for up to 48 hours.`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Ratings & Reviews */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-xs mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-gray-900">
                Customer Ratings & Feedback
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Verified reviews from Bhopal households
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl w-fit">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-gray-900">
                {product.rating ? product.rating.toFixed(1) : "4.8"} / 5.0
              </span>
            </div>
          </div>

          {/* Write a Review Form */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 sm:p-4">
            <h4 className="font-black text-xs text-gray-900 uppercase tracking-wider mb-2.5">
              Rate this Produce
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-2.5">
              <div>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold outline-none focus:border-[#0c831f] bg-white cursor-pointer shadow-2xs"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent Freshness</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Good Quality</option>
                  <option value="3">⭐⭐⭐ 3 - Average</option>
                  <option value="2">⭐⭐ 2 - Poor</option>
                  <option value="1">⭐ 1 - Needs Improvement</option>
                </select>
              </div>

              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="How was the farm freshness, packaging and delivery speed?"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#0c831f] bg-white resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#0c831f] hover:bg-[#0a6c1a] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-2xs transition disabled:opacity-50 cursor-pointer"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>

              {reviewMsg && (
                <p className="text-xs font-bold text-emerald-700 mt-1">{reviewMsg}</p>
              )}
            </form>
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base font-black text-gray-900">
                You May Also Need
              </h3>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category || "Vegetables")}`}
                className="text-[#0c831f] hover:text-[#0a6c1a] font-bold text-xs flex items-center gap-0.5"
              >
                <span>View More</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.map((item) => (
                <Groceryitemcard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 📱 Sticky Mobile Bottom Cart Bar (App-Style Quick Commerce) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium leading-none">
            {currentUnit}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-gray-950">
              ₹{currentPrice}
            </span>
            <span className="text-[10px] text-gray-400 line-through">
              ₹{activeMRP}
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-[190px]">
          {quantity > 0 ? (
            <div className="flex items-center bg-[#0c831f] text-white rounded-xl h-10 w-full overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => dispatch(decreaseQuantity(cartItemId))}
                className="w-10 h-full flex items-center justify-center font-black text-base active:scale-90"
              >
                <Minus size={14} className="stroke-[3]" />
              </button>
              <span className="flex-1 text-center font-black text-xs text-white">
                {quantity} in Cart
              </span>
              <button
                type="button"
                onClick={() => {
                  if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                }}
                disabled={quantity >= currentStock}
                className="w-10 h-full flex items-center justify-center font-black text-base active:scale-90 disabled:opacity-50"
              >
                <Plus size={14} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={currentStock <= 0}
              className={`w-full h-10 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 ${
                currentStock > 0
                  ? "bg-[#0c831f] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ShoppingBag size={14} />
              <span>{currentStock > 0 ? "Add to Cart" : "Out of Stock"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Wishlist Toast Notification */}
      {showWishlistToast && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-50 text-xs font-bold animate-bounce">
          <Heart size={13} className="text-rose-400 fill-rose-400" />
          <span>Added to your Wishlist!</span>
        </div>
      )}

      <Footer />
    </div>
  );
}

