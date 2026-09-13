"use client";

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity } from "@/redux/CartSlice";
import { toggleWishlist, setWishlist } from "@/redux/WishlistSlice";
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
  Timer,
  ShoppingBasket,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
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
  const cartItemId = hasVariations
    ? `${product._id}-${product.variations[selectedVarIndex].weight}`
    : product._id;

  const cartItem = cartdata.find(
    (item: any) =>
      item.cartItemId === cartItemId ||
      (!item.cartItemId && item._id?.toString() === product._id?.toString())
  );
  const quantity = cartItem ? cartItem.quantity : 0;
  const totalCartCount = cartdata.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalCartValue = cartdata.reduce(
    (acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1),
    0
  );

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
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 pb-32 sm:pb-16">
        
        {/* Top Breadcrumb & Mobile Back Navigation */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 overflow-x-auto scrollbar-none py-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="sm:hidden p-1.5 rounded-full bg-white border border-gray-200 text-gray-700 active:scale-90 mr-1 cursor-pointer shadow-2xs"
              title="Go Back"
            >
              <ArrowLeft size={14} />
            </button>
            <Link href="/" className="hover:text-[#0a3d24] transition font-semibold shrink-0">
              Home
            </Link>
            <ChevronRight size={11} className="text-gray-400 shrink-0" />
            <Link href="/shop" className="hover:text-[#0a3d24] transition font-semibold shrink-0">
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight size={11} className="text-gray-400 shrink-0" />
                <Link
                  href={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-[#0a3d24] transition font-semibold capitalize shrink-0"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={11} className="text-gray-400 shrink-0" />
            <span className="text-gray-900 font-bold truncate max-w-[140px] sm:max-w-[250px]">
              {product.name}
            </span>
          </nav>

          {/* Top Quick Actions (Wishlist & WhatsApp Share) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={async () => {
                const rawId = userdata?._id || (userdata as any)?.id || null;
                const cleanUserId = rawId ? String(rawId) : null;
                dispatch(toggleWishlist({
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
                }));
                setShowWishlistToast(true);
                setTimeout(() => setShowWishlistToast(false), 2500);
                try {
                  const res = await axios.post("/api/wishlist", { productId: String(product._id) });
                  if (res.data?.success && Array.isArray(res.data?.wishlist) && res.data.wishlist.length > 0) {
                    dispatch(setWishlist({ items: res.data.wishlist, userId: cleanUserId }));
                  }
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
              <FaWhatsapp size={16} />
            </button>
          </div>
        </div>

        {/* Main Product Showcase Card (Inspired by Top D2C & Modern Grocery UIs) */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-3.5 sm:p-7 shadow-xs mb-5 overflow-hidden">
          {/* Top D2C Announcement Strip */}
          <div className="mb-4 -mx-3.5 -mt-3.5 sm:-mx-7 sm:-mt-7 bg-gradient-to-r from-[#072817] via-[#0a3d24] to-[#072817] text-white px-4 py-2 flex items-center justify-between text-[11px] sm:text-xs font-semibold overflow-x-auto no-scrollbar gap-4">
            <span className="flex items-center gap-1.5 shrink-0">
              <Truck size={13} className="text-emerald-300" />
              <span>Free Delivery on Orders &gt; ₹199</span>
            </span>
            <span className="hidden sm:inline-block text-emerald-300/60">•</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <Leaf size={13} className="text-emerald-300" />
              <span>5:00 AM Direct Mandi Harvest</span>
            </span>
            <span className="hidden sm:inline-block text-emerald-300/60">•</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <ShieldCheck size={13} className="text-emerald-300" />
              <span>100% Safe & Graded Quality</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            
            {/* Left 5 Cols: Product Image Frame with Floating Wishlist & Live Dispatch Banner */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative lg:sticky lg:top-24">
              <div className="w-full aspect-square max-h-[350px] sm:max-h-[440px] rounded-3xl bg-gradient-to-b from-stone-50 via-white to-emerald-50/20 border border-stone-200/90 p-6 sm:p-9 flex items-center justify-center relative overflow-hidden group shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                
                <img
                  src={product.image}
                  alt={`Fresh ${product.name} - 100% Farm Fresh Delivery in Bhopal | SubziQuick`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
                  }}
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-sm p-1"
                />

                {/* Top Luxury Badges */}
                <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-10">
                  <span className="bg-[#0a3d24] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles size={11} className="text-emerald-300" />
                    <span>Best Seller</span>
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-amber-400 text-stone-950 text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Floating Image Wishlist Button */}
                <button
                  type="button"
                  onClick={async () => {
                    const rawId = userdata?._id || (userdata as any)?.id || null;
                    const cleanUserId = rawId ? String(rawId) : null;
                    dispatch(toggleWishlist({
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
                    }));
                    setShowWishlistToast(true);
                    setTimeout(() => setShowWishlistToast(false), 2500);
                    try {
                      const res = await axios.post("/api/wishlist", { productId: String(product._id) });
                      if (res.data?.success && Array.isArray(res.data?.wishlist) && res.data.wishlist.length > 0) {
                        dispatch(setWishlist({ items: res.data.wishlist, userId: cleanUserId }));
                      }
                    } catch (error) {}
                  }}
                  className="absolute top-3.5 right-3.5 w-9.5 h-9.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-xs flex items-center justify-center transition cursor-pointer active:scale-90 hover:bg-rose-50 z-10"
                  title="Wishlist"
                >
                  <Heart
                    size={17}
                    className={isWishlisted ? "text-rose-500 fill-rose-500" : "text-stone-400 hover:text-rose-500"}
                  />
                </button>

                {/* Bottom Center Freshness Guarantee Pill */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 backdrop-blur-md border border-stone-200/90 text-stone-700 text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Leaf size={12} className="text-[#0a3d24]" />
                    <span>Harvested at 5:00 AM • Bhopal Mandi</span>
                  </span>
                </div>

                {/* Out of Stock Overlay */}
                {currentStock <= 0 && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center z-20">
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
                <span className="text-[11px] font-black uppercase text-[#0a3d24] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                  {product.category || "Fresh Produce"}
                </span>
                <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                  <BadgeCheck size={13} className="text-[#0a3d24]" /> Bhopal Farm Direct
                </span>
              </div>

              {/* Product Title (Luxury Serif / Bold Heading) */}
              <h1 className="text-xl sm:text-3xl font-black text-stone-900 leading-tight mb-1.5 tracking-tight font-heading">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-3 mb-3.5 pb-2.5 border-b border-stone-100 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-lg text-xs font-black">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
                  <span className="text-stone-400 font-bold ml-0.5">
                    ({product.numReviews || "124"} reviews)
                  </span>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  Selected Pack: <strong className="text-stone-900">{currentUnit}</strong>
                </span>
              </div>

              {/* Price & Live Express Status Block */}
              <div className="mb-4 bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-3 sm:p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-black text-stone-900">
                        ₹{currentPrice}
                      </span>
                      <span className="text-sm sm:text-base text-stone-400 line-through font-medium">
                        ₹{activeMRP}
                      </span>
                      <span className="bg-[#0a3d24] text-white text-[10.5px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                        SAVE ₹{activeMRP - currentPrice} ({discountPercent}% OFF)
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-1">
                      Tax included • Free shipping on orders over ₹199 in Bhopal
                    </p>
                  </div>

                  {/* Live Dispatch Timer Pill */}
                  <div className="flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span className="text-[11px] font-black text-[#0a3d24]">
                      ⚡ In Stock • Dispatches in 10-15m
                    </span>
                  </div>
                </div>
              </div>

              {/* Pack Sizes (Variations Chips) */}
              {hasVariations && (
                <div className="mb-4">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-stone-500 tracking-wider block mb-2">
                    Select Size:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.variations.map((v: any, index: number) => {
                      const isSelected = selectedVarIndex === index;
                      const vMrp = Math.round(v.price * 1.25);

                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedVarIndex(index)}
                          className={`px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? "border-[#0a3d24] bg-[#0a3d24] text-white shadow-xs"
                              : "border-stone-200 hover:border-emerald-300 bg-stone-50 text-stone-700"
                          }`}
                        >
                          <span className="font-black text-xs">
                            {v.weight}
                          </span>
                          <span className={`text-xs font-bold ${isSelected ? "text-emerald-200" : "text-[#0a3d24]"}`}>
                            ₹{v.price}
                          </span>
                          {isSelected && <Check size={12} className="text-white stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dual Action CTAs: Add to Basket + Instant Buy Now */}
              <div className="space-y-2.5 mb-5">
                <div className="flex items-center gap-2.5">
                  {/* Quantity Controller */}
                  {quantity > 0 ? (
                    <div className="flex items-center bg-white border border-[#0a3d24] rounded-2xl h-12 w-36 overflow-hidden shadow-xs shrink-0">
                      <button
                        type="button"
                        onClick={() => dispatch(decreaseQuantity(cartItemId))}
                        className="w-11 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-base cursor-pointer active:scale-90"
                      >
                        <Minus size={15} className="stroke-[3]" />
                      </button>
                      <span className="flex-1 text-center font-black text-sm text-stone-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (quantity < currentStock) dispatch(increaseQuantity(cartItemId));
                        }}
                        disabled={quantity >= currentStock}
                        className="w-11 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-base active:scale-90 cursor-pointer disabled:opacity-40"
                      >
                        <Plus size={15} className="stroke-[3]" />
                      </button>
                    </div>
                  ) : null}

                  {/* Add to Basket Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className={`flex-1 h-12 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                      currentStock > 0
                        ? quantity > 0
                          ? "bg-emerald-50 border border-emerald-300 text-[#0a3d24] hover:bg-emerald-100"
                          : "bg-[#0a3d24] hover:bg-[#072817] text-white shadow-emerald-950/20"
                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={16} />
                    <span>{currentStock > 0 ? (quantity > 0 ? `Added in Basket (${quantity})` : `Add to Basket • ₹${currentPrice}`) : "Out of Stock"}</span>
                  </button>
                </div>

                {/* Instant Buy Now Button (1-Click Express Checkout) */}
                {currentStock > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (quantity === 0) {
                        handleAddToCart();
                      }
                      router.push("/user/cart");
                    }}
                    className="w-full h-11 rounded-2xl font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-amber-500/30"
                  >
                    <Zap size={15} className="fill-stone-950 text-stone-950" />
                    <span>⚡ Buy It Now • 10-15 Min Express Delivery</span>
                  </button>
                )}
              </div>

              {/* 'Why You'll Love It' - 4 Feature Highlights Grid (From Inspiration UI) */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider block mb-2.5">
                  Why you&apos;ll love it:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-2.5 flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0a3d24] flex items-center justify-center mb-1">
                      <Leaf size={14} />
                    </div>
                    <span className="text-[10.5px] font-black text-stone-900 leading-tight">100% Farm Fresh</span>
                    <span className="text-[9px] text-stone-500 font-medium">Daily sunrise harvest</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-2.5 flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
                      <ShieldCheck size={14} />
                    </div>
                    <span className="text-[10.5px] font-black text-stone-900 leading-tight">No Wax or Polish</span>
                    <span className="text-[9px] text-stone-500 font-medium">Naturally graded safe</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-2.5 flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
                      <Clock size={14} />
                    </div>
                    <span className="text-[10.5px] font-black text-stone-900 leading-tight">10-15M Express</span>
                    <span className="text-[9px] text-stone-500 font-medium">Doorstep in Bhopal</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-2.5 flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-1">
                      <RefreshCw size={14} />
                    </div>
                    <span className="text-[10.5px] font-black text-stone-900 leading-tight">Instant Replace</span>
                    <span className="text-[9px] text-stone-500 font-medium">Doorstep verification</span>
                  </div>
                </div>
              </div>

              {/* Guaranteed Safe Checkout Badges (From Inspiration UI) */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#0a3d24]" /> Guaranteed Safe Checkout
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-[9.5px] font-black text-stone-700">UPI</span>
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-[9.5px] font-black text-stone-700">GooglePay</span>
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-[9.5px] font-black text-stone-700">PhonePe</span>
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-[9.5px] font-black text-stone-700">Paytm</span>
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-[9.5px] font-black text-stone-700">Cash on Delivery</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Product Information Accordions (Clean, Readable & Enriched) */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-xs mb-5">
          <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-stone-100">
            <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
              <Info size={16} className="text-[#0a3d24]" />
              <span>Product Description & Specifications</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles size={11} className="text-[#0a3d24]" />
              <span>100% Quality Graded</span>
            </span>
          </div>

          {/* Quick Nutrition & Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Harvest Time</span>
              <span className="text-xs font-black text-[#0a3d24]">5:00 AM Today</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Dietary</span>
              <span className="text-xs font-black text-[#0a3d24]">100% Pure Vegan</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Grade</span>
              <span className="text-xs font-black text-[#0a3d24]">Grade A Produce</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Preservatives</span>
              <span className="text-xs font-black text-[#0a3d24]">Zero Chemicals</span>
            </div>
          </div>

          <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
            {/* 1. About Produce */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "about" ? "" : "about")}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50/80 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                  <span>🥬</span> About {product.name}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-stone-400 transition-transform ${openSection === "about" ? "rotate-180 text-[#0a3d24]" : ""}`}
                />
              </button>
              {openSection === "about" && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed font-medium bg-stone-50/30">
                  <p className="mb-2.5">
                    {product.description ||
                      `Farm-fresh ${product.name} sourced directly from verified local farmers around Bhopal. Packed with essential vitamins, minerals and rich natural taste for healthy daily cooking.`}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2.5 border-t border-stone-100 text-[11px]">
                    <div>
                      <span className="text-stone-400 block font-bold">Category:</span>
                      <span className="font-black text-stone-800">{product.category || "Fresh Vegetable"}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-bold">Standard Pack:</span>
                      <span className="font-black text-stone-800">{currentUnit}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-bold">Best Used For:</span>
                      <span className="font-black text-stone-800">Daily Cooking & Salads</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Origin & Sourcing */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "sourcing" ? "" : "sourcing")}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50/80 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                  <span>🚜</span> Farm Origin & Harvest Sourcing
                </span>
                <ChevronDown
                  size={15}
                  className={`text-stone-400 transition-transform ${openSection === "sourcing" ? "rotate-180 text-[#0a3d24]" : ""}`}
                />
              </button>
              {openSection === "sourcing" && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed font-medium bg-stone-50/30">
                  <p>
                    {product.sourcing ||
                      `Harvested daily at 4:30 AM from agricultural contract farms near Bhopal. Hand-graded and naturally cleaned to ensure complete safety and kitchen-ready freshness.`}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Storage */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "storage" ? "" : "storage")}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50/80 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                  <span>❄️</span> Freshness & Storage Tips
                </span>
                <ChevronDown
                  size={15}
                  className={`text-stone-400 transition-transform ${openSection === "storage" ? "rotate-180 text-[#0a3d24]" : ""}`}
                />
              </button>
              {openSection === "storage" && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed font-medium bg-stone-50/30">
                  <p>
                    {product.storage ||
                      `Store in a cool, ventilated container or refrigerate at 4°C - 7°C to preserve natural crispness and freshness for up to 48 hours.`}
                  </p>
                </div>
              )}
            </div>

            {/* 4. Bhopal Delivery Guarantee */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "delivery" ? "" : "delivery")}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50/80 transition cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                  <span>⚡</span> 10-15 Min Bhopal Delivery & Doorstep Guarantee
                </span>
                <ChevronDown
                  size={15}
                  className={`text-stone-400 transition-transform ${openSection === "delivery" ? "rotate-180 text-[#0a3d24]" : ""}`}
                />
              </button>
              {openSection === "delivery" && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed font-medium space-y-1.5 bg-stone-50/30">
                  <p>
                    • <strong>Express Dispatch</strong>: Packed and dispatched fresh within 10-15 minutes across Bhopal societies.
                  </p>
                  <p>
                    • <strong>Covered Localities</strong>: Arera Colony (E1-E8), Kolar Road, MP Nagar, Bawadiya Kalan, Katara Hills, Shahpura, Chunabhatti, Trilanga, Gulmohar, Hoshangabad Road, and all major Bhopal societies.
                  </p>
                  <p>
                    • <strong>100% Hand-Graded & Cleaned</strong>: Triple quality check ensures zero damaged produce, dirt, or dust before dispatch.
                  </p>
                  <p>
                    • <strong>Doorstep Guarantee</strong>: Check freshness at your door. If unsatisfied, return immediately for an instant UPI refund or replacement.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Ratings & Reviews (Directly from Database) */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-xs mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 font-heading">
                Customer Ratings & Reviews
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Verified feedback from real buyers
              </p>
            </div>

            <div className="flex items-center gap-3">
              {product.numReviews > 0 ? (
                <>
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-stone-900">
                      {Number(product.rating || 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-stone-400 font-bold">/ 5.0</span>
                  </div>
                  <span className="text-xs font-bold text-stone-500">
                    ({product.numReviews} {product.numReviews === 1 ? "review" : "reviews"})
                  </span>
                </>
              ) : (
                <span className="text-xs font-semibold text-stone-400 bg-stone-100 px-3 py-1 rounded-xl">
                  No ratings yet
                </span>
              )}
            </div>
          </div>

          {/* Real Customer Reviews List from Database */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {product.reviews.map((rev: any, index: number) => (
                <div key={index} className="bg-stone-50/70 border border-stone-200/80 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0a3d24] text-white flex items-center justify-center font-bold text-xs uppercase">
                        {(rev.name || "U")[0]}
                      </div>
                      <div>
                        <span className="font-black text-xs text-stone-900 block leading-tight">
                          {rev.name || "Customer"}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {rev.date ? new Date(rev.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Verified Buyer"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < (rev.rating || 5) ? "fill-amber-400 text-amber-400" : "text-stone-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 mb-5">
              <p className="text-xs font-bold text-stone-600">Abhi tak is product par koi customer review nahi aaya hai.</p>
              <p className="text-[11px] text-stone-400 mt-1">Pehle khareedkar apna taaza anubhav niche share karein!</p>
            </div>
          )}

          {/* Write a Review Form */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 sm:p-4">
            <h4 className="font-black text-xs text-stone-900 uppercase tracking-wider mb-2.5">
              Leave a Verified Customer Review
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-2.5">
              <div>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-[#0a3d24] bg-white cursor-pointer shadow-2xs"
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
                  className="w-full border border-stone-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#0a3d24] bg-white resize-none font-medium text-stone-800"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#0a3d24] hover:bg-[#072817] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-2xs transition disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>

              {reviewMsg && (
                <p className="text-xs font-bold text-[#0a3d24] mt-1">{reviewMsg}</p>
              )}
            </form>
          </div>
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


