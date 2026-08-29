"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  applyCoupon,
  removeCoupon,
} from "@/redux/CartSlice";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Tag,
  X,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { motion } from "framer-motion";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useGetMe();
  const { userdata } = useSelector((state: RootState) => state.user);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const { cartdata, couponCode, discountAmount } = useSelector(
    (state: RootState) => state.cart
  );

  const subtotal = cartdata.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const freeDeliveryThreshold = 499;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 40;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

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

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#0f8646] transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#0f8646] transition">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-extrabold">My Cart</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center text-[#0f8646]">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Your Fresh Basket
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {cartdata.length} unique produce item{cartdata.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs sm:text-sm flex items-center gap-1 transition"
          >
            <span>+ Add More Items</span>
          </Link>
        </div>

        {cartdata.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
            <div className="w-20 h-20 bg-green-50 text-[#0f8646] rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              Your basket is empty
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Explore our freshly harvested vegetables, seasonal fruits and daily essentials.
            </p>
            <Link href="/shop">
              <button className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition">
                Start Shopping Produce
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Free Delivery Bar */}
              <div className="bg-white border border-green-200 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-gray-900 flex items-center gap-1.5">
                    <Truck size={16} className="text-[#0f8646]" />
                    {isFreeDelivery ? (
                      <span className="text-[#0f8646]">
                        Congratulations! You unlocked FREE Delivery 🎉
                      </span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong className="text-[#0f8646]">
                          ₹{remainingForFreeDelivery}
                        </strong>{" "}
                        more for FREE 10-Min Delivery
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    Threshold: ₹{freeDeliveryThreshold}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#0f8646] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-3.5 sm:p-5 divide-y divide-gray-100 shadow-xs">
                {cartdata.map((item) => {
                  const itemId = item.cartItemId || item._id?.toString();
                  const itemWeight = item.variation?.weight || item.unit;

                  return (
                    <div
                      key={itemId}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 sm:gap-4 justify-between"
                    >
                      {/* Left: Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-100 p-1.5 sm:p-2 shrink-0 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Middle: Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-tight line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium block mt-0.5">
                          {itemWeight}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs sm:text-sm font-black text-[#0f8646]">
                            ₹{item.price * item.quantity}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-gray-400">
                              (₹{item.price}/each)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Quantity Stepper & Delete */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-3 shrink-0">
                        <div className="flex items-center bg-white border border-[#0f8646] rounded-xl overflow-hidden h-7 sm:h-8 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => dispatch(decreaseQuantity(itemId))}
                            className="w-7 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-xs cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-black text-xs text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(increaseQuantity(itemId))}
                            className="w-7 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-xs cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(itemId))}
                          className="text-gray-300 hover:text-red-500 p-0.5 transition cursor-pointer"
                          title="Remove Item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Safety & Guarantee */}
              <div className="bg-green-50/60 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#0f8646] shrink-0" />
                <p className="text-xs text-green-900 font-medium">
                  <strong>100% Freshness Guarantee:</strong> If you are not satisfied with quality, return directly to our delivery rider for an instant replacement.
                </p>
              </div>
            </div>

            {/* Right: Bill Breakdown & Promo (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Promo Code Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs">
                <h3 className="font-extrabold text-xs uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5">
                  <Tag size={14} className="text-[#0f8646]" />
                  <span>Promo Code & Coupons</span>
                </h3>

                {couponCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl p-3.5">
                    <div>
                      <span className="font-black text-sm text-[#0f8646] block uppercase tracking-wider">
                        {couponCode} APPLIED
                      </span>
                      <span className="text-xs text-green-700 font-medium">
                        You saved ₹{discountAmount} on this order!
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1.5 rounded-full hover:bg-green-200/50 text-gray-500 hover:text-red-600 transition"
                      title="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#0f8646] bg-gray-50"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 rounded-xl text-xs font-extrabold shadow-sm disabled:opacity-50 transition cursor-pointer"
                      >
                        {couponLoading ? "Checking..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-xs font-bold text-red-500 mt-2">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bill Details Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
                <h3 className="font-extrabold text-sm text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  Bill Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-extrabold text-gray-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Partner Fee</span>
                    <span className="font-extrabold text-gray-900">
                      {deliveryFee === 0 ? (
                        <span className="text-[#0f8646]">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#0f8646] font-bold bg-green-50 p-2 rounded-xl">
                      <span>Promo Discount ({couponCode})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-black text-gray-900 block">
                        To Pay
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Inclusive of all taxes
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#0f8646]">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* GreenPoints Wallet Notification */}
                {(userdata as any)?.walletBalance > 0 && (
                  <div className="mt-4 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <Coins size={15} className="text-[#0f8646]" />
                      <span>₹{(userdata as any).walletBalance} GreenPoints Available</span>
                    </div>
                    <span className="text-[10px] font-black text-[#0f8646] uppercase">
                      Redeem at Checkout
                    </span>
                  </div>
                )}

                {/* Proceed Button */}
                <button
                  onClick={() => router.push("/user/checkout")}
                  className="w-full mt-5 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Delivery & Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
