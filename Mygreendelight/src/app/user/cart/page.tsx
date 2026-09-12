"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  hydrateCart,
} from "@/redux/CartSlice";
import {
  Trash2,
  ShoppingBag,
  Tag,
  X,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Lock,
  Gift,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: session } = useSession();
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [addOnProducts, setAddOnProducts] = useState<any[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<{
    deliveryFee: number;
    freeDeliveryThreshold: number;
    isFreeDeliveryActive: boolean;
    minOrderAmount: number;
    deliveryNotice?: string;
  }>({
    deliveryFee: 30,
    freeDeliveryThreshold: 199,
    isFreeDeliveryActive: false,
    minOrderAmount: 0,
    deliveryNotice: "",
  });

  const rawUserId =
    userdata?._id ||
    (userdata as any)?.id ||
    (session?.user as any)?._id ||
    (session?.user as any)?.id ||
    null;
  const cleanUserId = rawUserId ? String(rawUserId) : null;

  useEffect(() => {
    dispatch(hydrateCart({ userId: cleanUserId }));
    axios
      .get("/api/groceries?limit=12&sort=price_asc")
      .then((res) => {
        if (res.data?.success && res.data.groceries) {
          setAddOnProducts(res.data.groceries);
        }
      })
      .catch(() => {});

    axios
      .get("/api/settings")
      .then((res) => {
        if (res.data?.success) {
          setDeliverySettings({
            deliveryFee: res.data.deliveryFee ?? 30,
            freeDeliveryThreshold: res.data.freeDeliveryThreshold ?? 199,
            isFreeDeliveryActive: Boolean(res.data.isFreeDeliveryActive),
            minOrderAmount: res.data.minOrderAmount ?? 0,
            deliveryNotice: res.data.deliveryNotice || "",
          });
        }
      })
      .catch(() => {});
  }, [dispatch, cleanUserId]);

  const { cartdata, couponCode, discountAmount } = useSelector(
    (state: RootState) => state.cart
  );

  const subtotal = cartdata.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const freeDeliveryThreshold = deliverySettings.freeDeliveryThreshold || 199;
  const isFreeDelivery =
    deliverySettings.isFreeDeliveryActive ||
    deliverySettings.deliveryFee === 0 ||
    subtotal >= freeDeliveryThreshold;
  const deliveryFee =
    subtotal === 0 ? 0 : isFreeDelivery ? 0 : deliverySettings.deliveryFee;
  const remainingForFreeDelivery = isFreeDelivery
    ? 0
    : Math.max(0, freeDeliveryThreshold - subtotal);

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);
  const totalItemCount = cartdata.reduce((a, b) => a + b.quantity, 0);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await axios.post("/api/coupons/validate", {
        code,
        subtotal,
      });
      if (res.data.success) {
        dispatch(
          applyCoupon({
            couponCode: res.data.couponCode,
            discountAmount: res.data.discount,
          })
        );
        setCouponError("");
        setCouponInput("");
      }
    } catch (error: any) {
      setCouponError(error?.response?.data?.message || "Invalid coupon code");
      dispatch(removeCoupon());
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponInput("");
    setCouponError("");
  };

  const handleProceed = () => {
    const isLoggedIn = Boolean(session?.user || userdata?._id);
    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/user/checkout");
    } else {
      router.push("/user/checkout");
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen flex flex-col justify-between font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32 lg:pb-12 w-full flex-1">
        {/* Minimalist Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-5 border-b border-slate-200/80 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Link href="/" className="hover:text-emerald-700 transition">
                Home
              </Link>
              <ChevronRight size={12} />
              <Link href="/shop" className="hover:text-emerald-700 transition">
                Shop
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-800 font-bold">Cart</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Review Your Basket
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {cartdata.length} distinct item{cartdata.length !== 1 ? "s" : ""} • 10-15 Min Express Delivery across Bhopal
            </p>
          </div>

          <Link
            href="/shop"
            className="text-emerald-800 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 transition self-start sm:self-auto py-1 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/70"
          >
            <span>+ Add More Produce</span>
          </Link>
        </div>

        {/* Guest Login Hint (Minimal Banner) */}
        {cartdata.length > 0 && !Boolean(session?.user || userdata?._id) && (
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0">
                <Lock size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Logged out? Quick sign-in saves your delivery address & order history.
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  Instant Google 1-Tap or mobile OTP login.
                </p>
              </div>
            </div>
            <Link
              href="/login?callbackUrl=/user/checkout"
              className="bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-2xs shrink-0 flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {cartdata.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-md mx-auto shadow-2xs my-8">
            <div className="w-16 h-16 bg-emerald-50 text-[#0f8646] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-1.5">
              Your basket is empty
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-xs mx-auto">
              Fresh 5:00 AM mandi harvest, exotic herbs, and daily saver combos are waiting for you.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-2xs transition active:scale-95"
            >
              Explore Fresh Produce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Items & Addons (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Free Delivery Status Strip */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Truck size={15} className="text-[#0f8646] shrink-0" />
                    {isFreeDelivery ? (
                      <span className="text-[#0f8646]">
                        FREE Delivery Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-[#0f8646]">₹{remainingForFreeDelivery}</strong> more for FREE Delivery
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Target: ₹{freeDeliveryThreshold}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#0f8646] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 divide-y divide-slate-100 shadow-2xs">
                {cartdata.map((item) => {
                  const itemId = item.cartItemId || item._id?.toString();
                  const itemWeight = item.variation?.weight || item.unit;

                  return (
                    <div
                      key={itemId}
                      className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5 sm:gap-4 justify-between"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                          {item.name}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                          {itemWeight}
                        </span>

                        <div className="flex items-center gap-1.5 mt-1">
                          {item.price === 0 ? (
                            <span className="bg-emerald-100/70 text-[#0f8646] font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Gift size={11} />
                              <span>Free Gift</span>
                            </span>
                          ) : (
                            <>
                              <span className="text-xs sm:text-sm font-black text-slate-900">
                                ₹{item.price * item.quantity}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[10px] text-slate-400">
                                  (₹{item.price} each)
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Stepper + Delete */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-7 sm:h-8">
                          <button
                            type="button"
                            onClick={() => dispatch(decreaseQuantity(itemId))}
                            className="w-7 h-full flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(increaseQuantity(itemId))}
                            className="w-7 h-full flex items-center justify-center text-[#0f8646] hover:bg-emerald-50 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(itemId))}
                          className="text-slate-300 hover:text-red-500 p-1 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Minimal Cross-Sell Add-ons */}
              {(() => {
                const suggestedAddons = addOnProducts
                  .filter(
                    (p) =>
                      !cartdata.some(
                        (c) =>
                          String(c._id) === String(p._id) ||
                          c.cartItemId === String(p._id)
                      )
                  )
                  .slice(0, 4);

                if (suggestedAddons.length === 0) return null;

                return (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#0f8646]" />
                      <span>Recommended Add-ons</span>
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {suggestedAddons.map((product) => (
                        <div
                          key={product._id}
                          className="bg-slate-50/70 rounded-2xl p-2.5 border border-slate-100 flex flex-col justify-between items-center text-center hover:border-emerald-200 transition"
                        >
                          <div className="w-12 h-12 relative flex items-center justify-center mb-1 bg-white rounded-xl overflow-hidden border border-slate-100">
                            <img
                              src={product.image || "/placeholder.png"}
                              alt={product.name}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e: any) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80";
                              }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-900 line-clamp-1">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {product.unit} • ₹{product.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(
                                addToCart({
                                  ...product,
                                  quantity: 1,
                                  cartItemId: String(product._id),
                                })
                              );
                            }}
                            className="mt-2 w-full py-1 rounded-lg font-bold text-[10px] bg-white text-[#0f8646] hover:bg-[#0f8646] hover:text-white border border-emerald-200 transition cursor-pointer shadow-2xs active:scale-95"
                          >
                            + ADD
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Trust Badge */}
              <div className="flex items-center gap-2.5 px-2 text-xs text-slate-500 font-medium">
                <ShieldCheck size={16} className="text-[#0f8646] shrink-0" />
                <span>100% Quality & Freshness Guaranteed. Instant return or replacement at doorstep.</span>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout (5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              
              {/* Promo Code Input Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs">
                <h3 className="font-extrabold text-[11px] uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag size={12} className="text-[#0f8646]" />
                  <span>Promo Code & Coupons</span>
                </h3>

                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                    <div>
                      <span className="font-black text-xs text-[#0f8646] block uppercase tracking-wider">
                        {couponCode} APPLIED
                      </span>
                      <span className="text-[11px] text-emerald-800 font-medium">
                        You saved ₹{discountAmount} on this order
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-full hover:bg-emerald-200/50 text-slate-500 hover:text-red-600 transition"
                      title="Remove coupon"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="COUPON CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#0f8646] bg-slate-50"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-slate-900 hover:bg-black text-white px-4 rounded-xl text-xs font-bold disabled:opacity-50 transition cursor-pointer"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] font-bold text-red-500 mt-1.5">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bill Details Summary Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
                <h3 className="font-extrabold text-xs text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Bill Summary</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {totalItemCount} Items
                  </span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Partner Fee</span>
                    <span className="font-bold text-slate-900">
                      {deliveryFee === 0 ? (
                        <span className="text-[#0f8646] font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#0f8646] font-bold bg-emerald-50 p-2 rounded-xl text-xs">
                      <span>Promo Discount ({couponCode})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-slate-950 block">
                        To Pay
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Inclusive of all taxes
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#0f8646]">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Primary Proceed CTA */}
                <button
                  onClick={handleProceed}
                  className="w-full mt-5 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {Boolean(session?.user || userdata?._id) ? (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={15} />
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Sign In & Order (₹{total})</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Mobile Sticky Floating Bar */}
        {cartdata.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {totalItemCount} Items • Total
              </span>
              <span className="text-xl font-black text-[#0f8646]">
                ₹{total}
              </span>
            </div>
            <button
              onClick={handleProceed}
              className="flex-1 bg-[#0f8646] active:scale-98 hover:bg-[#0c6a38] text-white py-3 px-5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
