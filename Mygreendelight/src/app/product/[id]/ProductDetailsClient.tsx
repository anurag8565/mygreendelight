"use client";

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity } from "@/redux/CartSlice";
import { triggerHaptic } from "@/utils/haptics";
import { toggleWishlist, setWishlist } from "@/redux/WishlistSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  Minus,
  Plus,
  Heart,
  Clock,
  RefreshCw,
  Star,
  Zap,
  Truck,
  Leaf,
  ChevronRight,
  BadgeCheck,
  ShoppingBag,
  Info,
  ArrowLeft,
  ShoppingBasket,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Groceryitemcard from "@/components/Groceryitemcard";
import Footer from "@/components/Footer";
import axios from "axios";

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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  const isWishlisted = wishlistItems.some((item) => String(item._id) === String(product._id));
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

  // Active Realistic MRP & Discount
  const activeMRP = useMemo(() => {
    const selectedVar = hasVariations ? product.variations[selectedVarIndex] : null;
    if (selectedVar?.mrp && selectedVar.mrp > currentPrice) {
      return selectedVar.mrp;
    }
    if (product.mrp && product.price && product.mrp > product.price) {
      const baseRatio = product.mrp / product.price;
      return Math.round(currentPrice * baseRatio);
    }
    return Math.round(currentPrice * 1.22);
  }, [hasVariations, product.variations, selectedVarIndex, currentPrice, product.mrp, product.price]);

  const discountPercent = Math.max(
    1,
    Math.round(((activeMRP - currentPrice) / activeMRP) * 100)
  );

  // Cart item identification
  const safeProdId = String(product._id || "");
  const cartItemId = hasVariations
    ? `${safeProdId}-${product.variations[selectedVarIndex].weight}`
    : safeProdId;

  const cartItem = cartdata.find(
    (item: any) =>
      item.cartItemId === cartItemId ||
      (!hasVariations && !item.cartItemId && String(item._id) === safeProdId) ||
      (!hasVariations && String(item._id) === safeProdId)
  );
  const quantity = cartItem ? cartItem.quantity : 0;
  const totalCartCount = cartdata.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalCartValue = cartdata.reduce(
    (acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1),
    0
  );

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      triggerHaptic("error");
      return;
    }

    triggerHaptic("medium");
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

  const handleToggleWishlist = async () => {
    const rawId = userdata?._id || (userdata as any)?.id || null;
    const cleanUserId = rawId ? String(rawId) : null;
    dispatch(
      toggleWishlist({
        item: {
          _id: String(product._id),
          name: product.name,
          price: currentPrice,
          image: product.image,
          unit: currentUnit,
          category: product.category,
          stock: currentStock,
        },
        userId: cleanUserId,
      })
    );
    setShowWishlistToast(true);
    setTimeout(() => setShowWishlistToast(false), 2500);
    try {
      const res = await axios.post("/api/wishlist", { productId: String(product._id) });
      if (res.data?.success && Array.isArray(res.data?.wishlist) && res.data.wishlist.length > 0) {
        dispatch(setWishlist({ items: res.data.wishlist, userId: cleanUserId }));
      }
    } catch (error) {}
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
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 pb-32 sm:pb-16">
        
        {/* Top Minimalist Breadcrumbs & Action Bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="sm:hidden p-1.5 rounded-full bg-white border border-stone-200 text-stone-700 active:scale-90 mr-1 cursor-pointer shadow-2xs"
              title="Go Back"
            >
              <ArrowLeft size={14} />
            </button>
            <Link href="/" className="hover:text-[#0a3d24] transition font-medium shrink-0">
              Home
            </Link>
            <ChevronRight size={11} className="text-stone-400 shrink-0" />
            <Link href="/shop" className="hover:text-[#0a3d24] transition font-medium shrink-0">
              Store
            </Link>
            {product.category && (
              <>
                <ChevronRight size={11} className="text-stone-400 shrink-0" />
                <Link
                  href={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-[#0a3d24] transition font-medium capitalize shrink-0"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={11} className="text-stone-400 shrink-0" />
            <span className="text-stone-900 font-bold truncate max-w-[140px] sm:max-w-[240px]">
              {product.name}
            </span>
          </nav>

          {/* Quick Actions (Wishlist & WhatsApp Share) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleWishlist}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50 flex items-center justify-center transition cursor-pointer active:scale-90"
              title="Wishlist"
            >
              <Heart
                size={15}
                className={isWishlisted ? "text-rose-500 fill-rose-500" : "text-stone-400 hover:text-rose-500"}
              />
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-stone-200/90 shadow-2xs hover:bg-emerald-50 text-[#25D366] flex items-center justify-center transition cursor-pointer active:scale-90"
              title="Share on WhatsApp"
            >
              <FaWhatsapp size={16} />
            </button>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-4 sm:p-7 shadow-xs mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Left 5 Cols: Product Image Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full aspect-square max-h-[360px] sm:max-h-[420px] rounded-2xl bg-gradient-to-b from-stone-50 via-white to-emerald-50/20 border border-stone-100 p-6 sm:p-8 flex items-center justify-center relative overflow-hidden group">
                
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute top-3.5 left-3.5 bg-[#0a3d24] text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xs z-10">
                    {discountPercent}% OFF
                  </span>
                )}

                {/* Floating Image Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200 shadow-2xs flex items-center justify-center transition cursor-pointer active:scale-90 hover:bg-rose-50 z-10"
                  title="Wishlist"
                >
                  <Heart
                    size={16}
                    className={isWishlisted ? "text-rose-500 fill-rose-500" : "text-stone-400 hover:text-rose-500"}
                  />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
                  }}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                />

                {/* Out of Stock Overlay */}
                {currentStock <= 0 && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center z-20">
                    <span className="bg-red-600 text-white font-black text-xs uppercase px-4 py-1.5 rounded-full shadow-md">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Express Delivery Badge */}
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-stone-50 border border-stone-200/60 px-3.5 py-1.5 rounded-full">
                <Clock size={13} className="text-[#0a3d24]" />
                <span>Dispatches in <strong className="text-stone-900">10-15 mins</strong> in Bhopal</span>
              </div>
            </div>

            {/* Right 7 Cols: Product Details & Cart Actions */}
            <div className="lg:col-span-7 flex flex-col justify-start">
              
              {/* Category Pill & Assurance */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase text-[#0a3d24] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                  {product.category || "Fresh Produce"}
                </span>
                <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                  <BadgeCheck size={13} className="text-[#0a3d24]" /> Bhopal Farm Direct
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight mb-2 font-heading">
                {product.name}
              </h1>

              {/* Rating & Unit */}
              <div className="flex items-center gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md font-black">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating ? Number(product.rating).toFixed(1) : "4.8"}</span>
                  <span className="text-stone-400 font-medium">({product.numReviews || 24})</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 font-semibold">
                  Standard Pack: <strong className="text-stone-900">{currentUnit}</strong>
                </span>
              </div>

              {/* Price Line */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-stone-100 flex-wrap">
                <span className="text-3xl font-black text-stone-900">
                  ₹{currentPrice}
                </span>
                <span className="text-base text-stone-400 line-through font-medium">
                  ₹{activeMRP}
                </span>
                <span className="bg-emerald-100 text-[#0a3d24] text-xs font-black px-2.5 py-0.5 rounded-full">
                  Save ₹{activeMRP - currentPrice} ({discountPercent}% OFF)
                </span>
              </div>

              {/* Pack Sizes (Variations Chips) */}
              {hasVariations && (
                <div className="mb-5">
                  <span className="text-xs font-bold text-stone-500 block mb-2">
                    Choose Pack Size:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.variations.map((v: any, index: number) => {
                      const isSelected = selectedVarIndex === index;
                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedVarIndex(index)}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? "border-[#0a3d24] bg-[#0a3d24] text-white shadow-xs"
                              : "border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700"
                          }`}
                        >
                          <span>{v.weight}</span>
                          <span className={isSelected ? "text-emerald-200" : "text-[#0a3d24] font-black"}>
                            ₹{v.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons: Quantity / Add to Cart + Buy Now */}
              <div className="flex items-center gap-3 mb-5 flex-wrap sm:flex-nowrap">
                {quantity > 0 ? (
                  <div className="flex items-center bg-[#0a3d24] text-white rounded-xl h-11 w-32 overflow-hidden shadow-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(cartItemId))}
                      className="w-10 h-full flex items-center justify-center hover:bg-emerald-900 transition active:scale-90 cursor-pointer"
                    >
                      <Minus size={14} className="stroke-[3]" />
                    </button>
                    <span className="flex-1 text-center font-black text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                      }}
                      disabled={quantity >= currentStock}
                      className="w-10 h-full flex items-center justify-center hover:bg-emerald-900 transition active:scale-90 cursor-pointer disabled:opacity-40"
                    >
                      <Plus size={14} className="stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className={`h-11 px-6 rounded-xl font-black text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 ${
                      currentStock > 0
                        ? "bg-[#0a3d24] hover:bg-[#072817] text-white"
                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={16} />
                    <span>{currentStock > 0 ? "Add to Basket" : "Out of Stock"}</span>
                  </button>
                )}

                {currentStock > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("heavy");
                      if (quantity === 0) handleAddToCart();
                      router.push("/user/cart");
                    }}
                    className="h-11 px-6 flex-1 rounded-xl font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Zap size={15} className="fill-stone-950" />
                    <span>Buy Now</span>
                  </button>
                )}
              </div>

              {/* 3-Point Clean Assurance Strip */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100 text-center">
                <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-100">
                  <Truck size={16} className="mx-auto text-[#0a3d24] mb-1" />
                  <span className="text-[11px] font-bold text-stone-800 block">10-15 Min</span>
                  <span className="text-[10px] text-stone-500 font-medium">Bhopal Express</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-100">
                  <Leaf size={16} className="mx-auto text-[#0a3d24] mb-1" />
                  <span className="text-[11px] font-bold text-stone-800 block">Farm Fresh</span>
                  <span className="text-[10px] text-stone-500 font-medium">Daily Harvest</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-100">
                  <RefreshCw size={16} className="mx-auto text-[#0a3d24] mb-1" />
                  <span className="text-[11px] font-bold text-stone-800 block">Doorstep Check</span>
                  <span className="text-[10px] text-stone-500 font-medium">Instant Return</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Clean Specifications & About Card */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 sm:p-6 shadow-xs mb-6">
          <h2 className="text-base font-black text-stone-900 mb-2.5 flex items-center gap-2">
            <Info size={17} className="text-[#0a3d24]" />
            <span>Product Details &amp; Sourcing</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal mb-5">
            {product.description ||
              `Farm-fresh ${product.name} hand-picked from verified local growers around Bhopal. Thoroughly cleaned and graded to ensure premium quality, natural freshness, and rich taste in your daily cooking.`}
          </p>

          {/* 4 Clean Attribute Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
            <div className="bg-stone-50 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-stone-400 block tracking-wider mb-0.5">Sourcing</span>
              <span className="text-xs font-bold text-stone-900 block">{product.sourcing || "Local MP Farms"}</span>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-stone-400 block tracking-wider mb-0.5">Shelf Life</span>
              <span className="text-xs font-bold text-stone-900 block">2-3 Days</span>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-stone-400 block tracking-wider mb-0.5">Storage</span>
              <span className="text-xs font-bold text-stone-900 block">{product.storage || "Cool, dry place"}</span>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-stone-400 block tracking-wider mb-0.5">Quality</span>
              <span className="text-xs font-bold text-stone-900 block">100% Hand-Graded</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 sm:p-6 shadow-xs mb-6">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100 flex-wrap">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-black text-stone-900">
                Customer Reviews
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-lg text-xs font-black text-amber-900">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{product.rating ? Number(product.rating).toFixed(1) : "4.8"}</span>
                <span className="text-stone-400 font-medium">({product.numReviews || 0})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs font-black text-[#0a3d24] hover:text-[#072817] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              {showReviewForm ? "Close Form" : "Write a Review"}
            </button>
          </div>

          {/* Collapsible Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 mb-4 space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-stone-700">Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-stone-200 rounded-xl px-2.5 py-1 text-xs font-bold outline-none bg-white"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Good</option>
                  <option value="3">⭐⭐⭐ 3 - Average</option>
                  <option value="2">⭐⭐ 2 - Poor</option>
                  <option value="1">⭐ 1 - Very Bad</option>
                </select>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Share your experience with product quality and delivery speed..."
                rows={2}
                className="w-full border border-stone-200 rounded-xl p-2.5 text-xs outline-none bg-white font-medium text-stone-800"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#0a3d24] hover:bg-[#072817] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-2xs transition disabled:opacity-50 cursor-pointer"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>

              {reviewMsg && (
                <p className="text-xs font-bold text-[#0a3d24]">{reviewMsg}</p>
              )}
            </form>
          )}

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.reviews.map((rev: any, index: number) => (
                <div key={index} className="bg-stone-50/70 border border-stone-100 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-stone-900">
                      {rev.name || "Customer"}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i < (rev.rating || 5) ? "fill-amber-400 text-amber-400" : "text-stone-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 font-medium text-center py-4">
              No reviews yet. Be the first to share your experience!
            </p>
          )}
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base font-black text-gray-900">
                You May Also Need
              </h3>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category || "Vegetables")}`}
                className="text-[#0a3d24] hover:text-[#072817] font-bold text-xs flex items-center gap-0.5"
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

      {/* 📱 Sticky Mobile Bottom Bar (App-Style Quick Commerce Dual CTA with Cart Preview) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3.5 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex flex-col gap-1.5">
        {/* Floating Mini Basket Strip if other items in cart */}
        {totalCartCount > 0 && quantity === 0 && (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl text-[11px] font-bold text-emerald-900">
            <span className="flex items-center gap-1">
              <ShoppingBasket size={13} className="text-[#0a3d24]" />
              <span>{totalCartCount} in Cart (₹{totalCartValue})</span>
            </span>
            <Link href="/user/cart" className="text-[#0a3d24] font-black underline">
              View Cart →
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between gap-2.5">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-stone-500 font-medium leading-none truncate">
              {currentUnit}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-stone-900">
                ₹{currentPrice}
              </span>
              <span className="text-[10px] text-stone-400 line-through">
                ₹{activeMRP}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-1 justify-end">
            {quantity > 0 ? (
              <div className="flex items-center bg-[#0a3d24] text-white rounded-xl h-10 w-32 overflow-hidden shadow-xs shrink-0">
                <button
                  type="button"
                  onClick={() => dispatch(decreaseQuantity(cartItemId))}
                  className="w-10 h-full flex items-center justify-center font-black text-base active:scale-90 cursor-pointer"
                >
                  <Minus size={14} className="stroke-[3]" />
                </button>
                <span className="flex-1 text-center font-bold text-xs text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                  }}
                  disabled={quantity >= currentStock}
                  className="w-10 h-full flex items-center justify-center font-black text-base active:scale-90 disabled:opacity-50 cursor-pointer"
                >
                  <Plus size={14} className="stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className={`h-10 px-3.5 rounded-xl font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0 ${
                  currentStock > 0
                    ? "bg-[#0a3d24] hover:bg-[#072817] text-white"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={14} />
                <span>{currentStock > 0 ? "Add" : "Out"}</span>
              </button>
            )}

            {/* Instant Buy Now Button on Mobile */}
            {currentStock > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (quantity === 0) {
                    handleAddToCart();
                  }
                  router.push("/user/cart");
                }}
                className="h-10 px-3 flex-1 rounded-xl font-black text-xs bg-amber-400 text-stone-950 shadow-xs transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer truncate border border-amber-500/20"
              >
                <Zap size={13} className="fill-stone-950 shrink-0" />
                <span className="truncate">Buy Now</span>
              </button>
            )}
          </div>
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


