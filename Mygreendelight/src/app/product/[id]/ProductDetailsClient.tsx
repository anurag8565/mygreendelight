"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishlistSlice";
import { RootState } from "@/redux/store";
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
  Info,
  BadgeCheck,
  ShoppingBag,
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
  const dispatch = useDispatch();
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
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Monitor scroll for bottom sticky purchase bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Simulated MRP & discount
  const mrp = Math.round(currentPrice * 1.25);
  const discount = Math.round(((mrp - currentPrice) / mrp) * 100);

  // Cart item identification
  const cartItemId = hasVariations
    ? `${product._id}-${product.variations[selectedVarIndex].weight}`
    : product._id;

  const cartItem = cartdata.find((item: any) => item.cartItemId === cartItemId);
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
      `Check out fresh ${product.name} on MyGreenDelight Bhopal! 🥬🍎\n\nOrder here: ${window.location.href}`
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
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 sm:mb-6 overflow-x-auto pb-1 scrollbar-none">
          <Link href="/" className="hover:text-[#0f8646] transition flex items-center gap-1">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#0f8646] transition">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight size={12} />
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="hover:text-[#0f8646] transition"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-gray-900 font-bold truncate max-w-[220px]">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 bg-white border border-gray-200/80 rounded-3xl p-4 sm:p-10 shadow-xs mb-8 sm:mb-10">
          
          {/* Left: Product Image Container (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full aspect-square max-h-[280px] sm:max-h-[420px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-gray-50/80 to-white border border-gray-100 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-md"
              />

              {/* Floating 100% Organic Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-green-200 text-[#0f8646] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                <Leaf size={13} />
                <span>100% Farm Fresh</span>
              </div>

              {/* Out of Stock Sash */}
              {currentStock <= 0 && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-red-600 text-white font-extrabold text-xs uppercase px-4 py-1.5 rounded-full shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Farm Origin & WhatsApp Share */}
            <div className="flex items-center justify-between w-full mt-4 px-2">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <BadgeCheck size={14} className="text-[#0f8646]" /> Farm Verified
              </span>
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Share2 size={14} />
                <span>Share Item</span>
              </button>
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            {/* Delivery Speed Badge */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="bg-green-100 text-[#0f8646] text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Zap size={13} className="fill-[#0f8646]" /> 10-MIN EXPRESS DELIVERY
              </span>
              <span className="text-xs text-gray-400 font-medium">Bhopal Hub</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2.5">
              {product.name}
            </h1>

            {/* Rating & Category */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-extrabold">
                <Star size={13} className="fill-amber-500 text-amber-500" />
                <span>{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
                <span className="text-gray-400 font-normal">
                  ({product.numReviews || "12"} verified reviews)
                </span>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                {product.category}
              </span>
              {currentUnit && (
                <span className="text-xs font-extrabold text-[#0f8646] bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                  Standard Pack: {currentUnit}
                </span>
              )}
            </div>

            {/* Price Row */}
            <div className="mb-5 bg-green-50/50 border border-green-100/80 rounded-2xl p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-[#0f8646]">
                  ₹{currentPrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{mrp}
                </span>
                <span className="bg-[#0f8646] text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  {discount}% OFF
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-1">
                Inclusive of all taxes • Sourced directly from Bhopal local farms
              </p>
            </div>

            {/* Pack Sizes (Variations) if available */}
            {hasVariations && (
              <div className="mb-5">
                <h3 className="text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-2.5">
                  Select Pack Size
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variations.map((v: any, index: number) => {
                    const isSelected = selectedVarIndex === index;
                    const vMrp = Math.round(v.price * 1.25);
                    const vDiscount = Math.round(((vMrp - v.price) / vMrp) * 100);

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedVarIndex(index)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-[#0f8646] bg-green-50/60 shadow-xs"
                            : "border-gray-200 hover:border-green-300 bg-white"
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-sm text-gray-900 block">
                            {v.weight}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-extrabold text-xs text-[#0f8646]">
                              ₹{v.price}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{vMrp}
                            </span>
                            <span className="text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded">
                              {vDiscount}% OFF
                            </span>
                          </div>
                        </div>

                        <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                          {isSelected ? (
                            <Check size={14} className="text-[#0f8646] stroke-[3]" />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons (Add to Basket & Wishlist) - Immediately below price */}
            <div className="flex items-center gap-4 pt-2">
              {quantity > 0 ? (
                <div className="flex items-center bg-white border-2 border-[#0f8646] rounded-2xl h-12 w-40 overflow-hidden shadow-xs">
                  <button
                    onClick={() => dispatch(decreaseQuantity(cartItemId))}
                    className="w-12 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-lg"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="flex-1 text-center font-black text-base text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                    }}
                    disabled={quantity >= currentStock}
                    className={`w-12 h-full flex items-center justify-center transition font-black text-lg ${
                      quantity >= currentStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white"
                    }`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={currentStock <= 0}
                  className={`flex-1 h-12 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    currentStock > 0
                      ? "bg-[#0f8646] hover:bg-[#0c6a38] text-white shadow-green-700/20"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Zap size={16} />
                  <span>{currentStock > 0 ? "Add to Basket" : "Out of Stock"}</span>
                </motion.button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={async () => {
                  dispatch(toggleWishlist(product));
                  setShowWishlistToast(true);
                  setTimeout(() => setShowWishlistToast(false), 2500);
                  try {
                    await axios.post("/api/wishlist", { productId: product._id });
                  } catch (error) {
                    console.log("Error updating wishlist", error);
                  }
                }}
                className={`h-12 px-5 rounded-2xl border font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "text-red-500 fill-current" : "text-gray-400"}
                />
                <span className="hidden sm:inline">
                  {isWishlisted ? "Saved" : "Save for Later"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Trust Feature Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center gap-3.5 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-[#0f8646] shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                100% Quality Checked
              </h4>
              <p className="text-[10px] text-gray-500">From trusted local farms</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center gap-3.5 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-[#0f8646] shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                10-Min Fast Delivery
              </h4>
              <p className="text-[10px] text-gray-500">Across all Bhopal hubs</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center gap-3.5 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-[#0f8646] shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                FREE Delivery &gt; ₹499
              </h4>
              <p className="text-[10px] text-gray-500">No extra packaging fee</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center gap-3.5 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-[#0f8646] shrink-0">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                Easy Replacement
              </h4>
              <p className="text-[10px] text-gray-500">Instant return to rider</p>
            </div>
          </div>
        </div>

        {/* Product Information Accordions */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs mb-12">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <Info size={20} className="text-[#0f8646]" />
            <span>Product Specifications & Freshness</span>
          </h3>

          <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {/* About */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === "about" ? "" : "about")}
                className="w-full p-4.5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <span className="text-sm font-extrabold text-gray-900">
                  About {product.name}
                </span>
                {openSection === "about" ? <Minus size={16} /> : <Plus size={16} />}
              </button>
              {openSection === "about" && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed">
                  {product.description ||
                    `Farm-fresh ${product.name} sourced directly from verified local farmers around Bhopal. Packed with essential vitamins, minerals and rich natural taste for healthy daily cooking.`}
                </div>
              )}
            </div>

            {/* Sourcing */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === "sourcing" ? "" : "sourcing")}
                className="w-full p-4.5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <span className="text-sm font-extrabold text-gray-900">
                  Origin & Farm Sourcing
                </span>
                {openSection === "sourcing" ? <Minus size={16} /> : <Plus size={16} />}
              </button>
              {openSection === "sourcing" && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed">
                  {product.sourcing ||
                    `Harvested at 4:00 AM from agricultural belts near Bhopal. Cleaned using organic ozone wash to ensure zero harmful residues.`}
                </div>
              )}
            </div>

            {/* Storage */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === "storage" ? "" : "storage")}
                className="w-full p-4.5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <span className="text-sm font-extrabold text-gray-900">
                  Storage & Freshness Tips
                </span>
                {openSection === "storage" ? <Minus size={16} /> : <Plus size={16} />}
              </button>
              {openSection === "storage" && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed">
                  {product.storage ||
                    `Store in a cool, ventilated container or refrigerate at 4°C - 7°C to preserve natural crispness and freshness for up to 48 hours.`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Ratings & Reviews */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Customer Ratings & Feedback
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Real reviews from verified buyers in Bhopal
              </p>
            </div>

            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-2xl">
              <Star size={18} className="fill-amber-500 text-amber-500" />
              <span className="text-base font-black text-gray-900">
                {product.rating ? product.rating.toFixed(1) : "4.8"} / 5.0
              </span>
            </div>
          </div>

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {product.reviews.map((r: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-gray-900">
                        {r.name}
                      </span>
                      <span className="bg-green-100 text-[#0f8646] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Verified Buyer
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {"★".repeat(r.rating || 5)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 mb-8 italic">
              No customer reviews yet. Be the first to share your experience!
            </p>
          )}

          {/* Write a Review Form */}
          <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-5 sm:p-6">
            <h4 className="font-extrabold text-sm text-gray-900 mb-4">
              Write a Review
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Your Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#0f8646] bg-white cursor-pointer"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                  <option value="3">⭐⭐⭐ 3 - Average</option>
                  <option value="2">⭐⭐ 2 - Poor</option>
                  <option value="1">⭐ 1 - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Your Feedback
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="How was the freshness, delivery speed and taste?"
                  rows={3}
                  className="w-full border border-gray-300 rounded-2xl p-3 text-xs outline-none focus:border-[#0f8646] bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
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
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">
                You May Also Like
              </h3>
              <Link
                href="/shop"
                className="text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs flex items-center gap-1"
              >
                <span>View More</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((item) => (
                <Groceryitemcard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Purchase Bar on Scroll */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-14 sm:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-40 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-contain rounded-lg border border-gray-100 shrink-0"
                />
                <div className="truncate">
                  <h4 className="font-extrabold text-sm text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <span className="text-xs font-black text-[#0f8646]">
                    ₹{currentPrice}{" "}
                    <span className="text-gray-400 font-normal text-[10px]">
                      ({currentUnit})
                    </span>
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {quantity > 0 ? (
                  <div className="flex items-center bg-white border-2 border-[#0f8646] rounded-xl h-10 w-32 overflow-hidden">
                    <button
                      onClick={() => dispatch(decreaseQuantity(cartItemId))}
                      className="w-9 h-full flex items-center justify-center bg-green-50 text-[#0f8646] font-black text-sm"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center font-black text-xs text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                      }}
                      disabled={quantity >= currentStock}
                      className="w-9 h-full flex items-center justify-center bg-green-50 text-[#0f8646] font-black text-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer ${
                      currentStock > 0
                        ? "bg-[#0f8646] hover:bg-[#0c6a38] text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={14} />
                    <span>{currentStock > 0 ? "Add to Basket" : "Out of Stock"}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishlist Toast */}
      {showWishlistToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <Heart size={18} className="text-red-400 fill-current" />
          <span className="text-xs font-bold">Item added to your Wishlist!</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
