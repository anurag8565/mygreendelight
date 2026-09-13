"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  setCartFromCloud,
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
  Zap,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";
import { useSession } from "next-auth/react";
import { FaWhatsapp } from "react-icons/fa6";
import { triggerFreeDeliveryConfetti } from "@/lib/confetti";

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

    // Real-time Cloud Cart Sync: Fetch cloud database cart immediately if customer is logged in
    axios
      .get("/api/user/cart")
      .then((cRes) => {
        if (cRes.data?.success && cRes.data?.cart) {
          const cloudItems = cRes.data.cart.items || [];
          if (Array.isArray(cloudItems) && cloudItems.length > 0) {
            const formatted = cloudItems.map((item: any) => ({
              _id: item.product?._id ? String(item.product._id) : (item.product ? String(item.product) : String(item._id || "")),
              cartItemId: item.cartItemId || String(item.product?._id || item.product || item._id),
              name: item.name || item.product?.name || "Item",
              price: item.price ?? item.product?.price ?? 0,
              unit: item.unit || item.product?.unit || "kg",
              image: item.image || item.product?.image || "",
              quantity: item.quantity || 1,
              stock: item.stock ?? item.product?.stock ?? 50,
              category: item.category || item.product?.category || "Produce",
              variation: item.variation || undefined,
            }));
            dispatch(
              setCartFromCloud({
                cartdata: formatted,
                couponCode: cRes.data.cart.couponCode || null,
                discountAmount: cRes.data.cart.discountAmount || 0,
                userId: cleanUserId,
              })
            );
          }
        }
      })
      .catch(() => {});

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

  const minOrderAmount = deliverySettings.minOrderAmount || 99;
  const isSubMinimum = subtotal > 0 && subtotal < minOrderAmount;
  const remainingForMinOrder = Math.max(0, minOrderAmount - subtotal);

  const hasCelebratedRef = React.useRef(false);

  useEffect(() => {
    if (isFreeDelivery && subtotal > 0 && cartdata.length > 0) {
      if (!hasCelebratedRef.current) {
        hasCelebratedRef.current = true;
        triggerFreeDeliveryConfetti();
      }
    } else if (!isFreeDelivery) {
      hasCelebratedRef.current = false;
    }
  }, [isFreeDelivery, subtotal, cartdata.length]);

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
    if (isSubMinimum) {
      alert(`⚠️ Minimum order amount for Bhopal express delivery is ₹${minOrderAmount}. Please add ₹${remainingForMinOrder} more produce to proceed.`);
      return;
    }
    const isLoggedIn = Boolean(session?.user || userdata?._id);
    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/user/checkout");
    } else {
      router.push("/user/checkout");
    }
  };

  const handleWhatsAppOrder = () => {
    if (cartdata.length === 0) return;

    if (isSubMinimum) {
      alert(`⚠️ Minimum order amount for Bhopal express delivery is ₹${minOrderAmount}. Please add ₹${remainingForMinOrder} more produce to proceed.`);
      return;
    }

    const itemsText = cartdata
      .map((item, idx) => {
        const wt = item.variation?.weight || item.unit || "1 unit";
        const priceTotal = item.price * item.quantity;
        return `${idx + 1}. *${item.name}* [${wt}] × ${item.quantity} = ₹${priceTotal}`;
      })
      .join("\n");

    const custName = userdata?.name || (session?.user as any)?.name || "Bhopal Customer";
    const custPhone = userdata?.mobile || "";

    const orderMsg =
      `*🌿 New Order Request - SubziQuick Bhopal*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer:* ${custName}${custPhone ? ` (${custPhone})` : ""}\n\n` +
      `🛒 *Order Items (${totalItemCount}):*\n` +
      `${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Subtotal:* ₹${subtotal}\n` +
      `🚚 *Delivery:* ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}\n` +
      (discountAmount > 0 ? `🏷️ *Coupon (${couponCode}):* -₹${discountAmount}\n` : "") +
      `💰 *Total Amount:* *₹${total}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📍 *Please share delivery address & preferred time slot:*`;

    const whatsappUrl = `https://wa.me/919981418565?text=${encodeURIComponent(orderMsg)}`;
    window.open(whatsappUrl, "_blank");
  };

  const totalMRP = useMemo(() => {
    return cartdata.reduce((acc, item) => {
      const itemPrice = item.price || 0;
      const mrp = (item as any).mrp && (item as any).mrp > itemPrice 
        ? (item as any).mrp 
        : Math.round(itemPrice * 1.25);
      return acc + mrp * (item.quantity || 1);
    }, 0);
  }, [cartdata]);

  const totalSavings = Math.max(0, (totalMRP - subtotal) + discountAmount + (isFreeDelivery && subtotal > 0 ? (deliverySettings.deliveryFee || 30) : 0));

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col justify-between font-sans text-stone-900 selection:bg-emerald-500 selection:text-white">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 pb-32 lg:pb-12 w-full flex-1">
        {/* Luxury Checkout Step Bar & Header */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-semibold mb-1">
                <Link href="/" className="hover:text-[#0a3d24] transition">
                  Home
                </Link>
                <ChevronRight size={11} />
                <Link href="/shop" className="hover:text-[#0a3d24] transition">
                  Shop
                </Link>
                <ChevronRight size={11} />
                <span className="text-[#0a3d24] font-bold">Shopping Basket</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight font-heading flex items-center gap-2">
                <span>Review Your Fresh Basket</span>
                {totalItemCount > 0 && (
                  <span className="text-xs bg-emerald-50 text-[#0a3d24] px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                    {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
                  </span>
                )}
              </h1>
              <p className="text-xs text-stone-500 font-medium mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Harvested at 5:00 AM • 10-15 Min Express Delivery across Bhopal</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <Link
                href="/shop"
                className="text-[#0a3d24] hover:bg-emerald-50 font-bold text-xs flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-emerald-200/80 transition active:scale-95 shadow-2xs"
              >
                <span>+ Add More Produce</span>
              </Link>
            </div>
          </div>

          {/* 3-Step Checkout Progress Indicators */}
          <div className="pt-3.5 flex items-center justify-between max-w-xl mx-auto text-[11px] sm:text-xs font-bold overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#0a3d24] shrink-0">
              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-[#0a3d24] text-white flex items-center justify-center text-[10px] sm:text-[11px] font-black shadow-2xs">
                1
              </span>
              <span>Basket</span>
            </div>
            <div className="flex-1 min-w-[20px] h-0.5 mx-2 sm:mx-3 bg-emerald-200 rounded-full" />
            <div className="flex items-center gap-1.5 sm:gap-2 text-stone-400 shrink-0">
              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-stone-100 text-stone-500 border border-stone-200 flex items-center justify-center text-[10px] sm:text-[11px] font-black">
                2
              </span>
              <span>Address</span>
            </div>
            <div className="flex-1 min-w-[20px] h-0.5 mx-2 sm:mx-3 bg-stone-200 rounded-full" />
            <div className="flex items-center gap-1.5 sm:gap-2 text-stone-400 shrink-0">
              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-stone-100 text-stone-500 border border-stone-200 flex items-center justify-center text-[10px] sm:text-[11px] font-black">
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* Guest Login Hint (Minimal Banner) */}
        {cartdata.length > 0 && !Boolean(session?.user || userdata?._id) && (
          <div className="bg-white border border-stone-200/90 p-3 sm:p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0">
                <Lock size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">
                  Logged out? Quick sign-in saves your delivery address & order history.
                </p>
                <p className="text-[10.5px] sm:text-[11px] text-stone-400 font-medium">
                  Instant Google 1-Tap or mobile OTP login.
                </p>
              </div>
            </div>
            <Link
              href="/login?callbackUrl=/user/checkout"
              className="bg-stone-900 hover:bg-black text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-2xs shrink-0 flex items-center gap-1.5 self-end sm:self-auto"
            >
              <span>Sign In</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {cartdata.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-14 text-center max-w-md mx-auto shadow-2xs my-8">
            <div className="w-16 h-16 bg-emerald-50 text-[#0a3d24] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-black text-stone-900 mb-1.5">
              Your basket is empty
            </h2>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed max-w-xs mx-auto">
              Fresh 5:00 AM mandi harvest, exotic herbs, and daily saver combos are waiting for you.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#0a3d24] hover:bg-[#072817] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-2xs transition active:scale-95"
            >
              Explore Fresh Produce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
            
            {/* Left Column: Items & Addons (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Minimum Order Alert Strip */}
              {isSubMinimum && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-bold text-amber-900">
                  <div className="flex items-center gap-2">
                    <span className="text-base shrink-0">⚠️</span>
                    <span>
                      Minimum order for delivery is <strong>₹{minOrderAmount}</strong>. Add <strong>₹{remainingForMinOrder}</strong> more produce to checkout.
                    </span>
                  </div>
                  <Link
                    href="/shop"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black px-3 py-1.5 rounded-xl transition self-end sm:self-auto shrink-0 shadow-2xs"
                  >
                    + Add Items
                  </Link>
                </div>
              )}

              {/* Free Delivery Status & Mandi Direct Strip */}
              <div className={`border rounded-3xl p-3.5 sm:p-4 shadow-xs transition-all duration-300 ${
                isFreeDelivery 
                  ? "bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-emerald-300" 
                  : "bg-white border-stone-200/90"
              }`}>
                <div className="flex items-center justify-between text-xs mb-2.5 gap-2">
                  <div className="flex items-center gap-2 font-bold text-stone-800 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#0a3d24] flex items-center justify-center shrink-0">
                      <Truck size={15} />
                    </div>
                    <div className="min-w-0 truncate">
                      {isFreeDelivery ? (
                        <>
                          <span className="text-[#0a3d24] font-black text-xs sm:text-sm block truncate">
                            🎉 FREE Express Delivery Unlocked!
                          </span>
                          <span className="text-[10px] sm:text-[10.5px] text-stone-500 font-medium block truncate">
                            Your order qualifies for free delivery across Bhopal.
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-stone-900 font-bold text-xs sm:text-sm block truncate">
                            Add <strong className="text-[#0a3d24]">₹{remainingForFreeDelivery}</strong> more for FREE Delivery
                          </span>
                          <span className="text-[10px] sm:text-[10.5px] text-stone-500 font-medium block truncate">
                            Standard Bhopal delivery fee is ₹{deliverySettings.deliveryFee || 30}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#0a3d24] font-black bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                    {Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 sm:h-2.5 overflow-hidden p-0.5 border border-stone-200/60">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-[#0a3d24] h-full rounded-full transition-all duration-500 shadow-2xs"
                    style={{
                      width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Total Mandi Direct Savings Banner */}
              {totalSavings > 0 && (
                <div className="bg-gradient-to-r from-emerald-900 via-[#0a3d24] to-emerald-950 text-white rounded-2xl p-3 px-3.5 sm:px-4 flex items-center justify-between shadow-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles size={16} className="text-amber-300 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-black text-xs block text-white truncate sm:text-clip">
                        You are saving ₹{totalSavings} on this Mandi direct order!
                      </span>
                      <span className="text-[10px] sm:text-[10.5px] text-emerald-200/80 font-medium block truncate sm:text-clip">
                        Direct farmer sourcing beats local market rates with zero middleman margin.
                      </span>
                    </div>
                  </div>
                  <span className="bg-amber-400 text-stone-950 font-black text-[9.5px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-2xs shrink-0">
                    SAVER
                  </span>
                </div>
              )}

              {/* Items Card List with Luxury Border & Shadow */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-3.5 sm:p-5 divide-y divide-stone-100 shadow-xs">
                {cartdata.map((item) => {
                  const itemId = item.cartItemId || item._id?.toString();
                  const itemWeight = item.variation?.weight || item.unit;
                  const itemMRP = (item as any).mrp && (item as any).mrp > item.price
                    ? (item as any).mrp
                    : Math.round(item.price * 1.25);

                  return (
                    <div
                      key={itemId}
                      className="py-3 sm:py-3.5 first:pt-0 last:pb-0 flex items-center gap-2.5 sm:gap-4 justify-between"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/product/${item._id}`}
                        className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-stone-50 to-white border border-stone-200/80 p-1 shrink-0 flex items-center justify-center overflow-hidden hover:border-emerald-300 transition group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80";
                          }}
                        />
                      </Link>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <Link href={`/product/${item._id}`} className="hover:text-[#0a3d24] transition block">
                          <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 leading-tight truncate">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10.5px] sm:text-[11px] text-stone-500 font-medium">
                            {itemWeight}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-[9.5px] sm:text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Grade A
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                          {item.price === 0 ? (
                            <span className="bg-emerald-100 text-[#0a3d24] font-black text-[9.5px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Gift size={11} />
                              <span>Free Gift</span>
                            </span>
                          ) : (
                            <>
                              <span className="text-xs sm:text-sm font-black text-stone-900">
                                ₹{item.price * item.quantity}
                              </span>
                              <span className="text-[10px] sm:text-[11px] text-stone-400 line-through font-medium">
                                ₹{itemMRP * item.quantity}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[9.5px] sm:text-[10px] text-stone-500 font-medium hidden xs:inline">
                                  (₹{item.price}/{itemWeight})
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Stepper + Delete */}
                      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl overflow-hidden h-7.5 sm:h-9 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => dispatch(decreaseQuantity(itemId))}
                            className="w-7 sm:w-8 h-full flex items-center justify-center text-stone-600 hover:text-red-600 hover:bg-stone-100 transition cursor-pointer active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} className="stroke-[2.5]" />
                          </button>
                          <span className="w-5.5 sm:w-7 text-center font-black text-xs text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(increaseQuantity(itemId))}
                            className="w-7 sm:w-8 h-full flex items-center justify-center text-[#0a3d24] hover:bg-emerald-50 transition cursor-pointer active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} className="stroke-[2.5]" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(itemId))}
                          className="text-stone-300 hover:text-red-500 p-1 sm:p-1.5 transition cursor-pointer active:scale-90"
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
                  <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#0a3d24]" />
                        <span>Frequently Added With Fresh Produce</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold">10-15 Min</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {suggestedAddons.map((product) => (
                        <div
                          key={product._id}
                          className="bg-stone-50/80 rounded-2xl p-2.5 border border-stone-200/70 flex flex-col justify-between items-center text-center hover:border-emerald-300 transition group"
                        >
                          <div className="w-14 h-14 relative flex items-center justify-center mb-1.5 bg-white rounded-xl overflow-hidden border border-stone-200/60 p-1">
                            <img
                              src={product.image || "/placeholder.png"}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              onError={(e: any) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80";
                              }}
                            />
                          </div>
                          <span className="font-extrabold text-xs text-stone-900 line-clamp-1">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
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
                            className="mt-2 w-full py-1.5 rounded-xl font-black text-[11px] bg-white text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white border border-emerald-200 transition cursor-pointer shadow-2xs active:scale-95"
                          >
                            + ADD
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Bhopal Doorstep Freshness Guarantee Card */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0a3d24] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <span className="text-xs font-black text-stone-900 block">
                    100% Quality & Freshness Guarantee at Doorstep
                  </span>
                  <span className="text-[11px] text-stone-600 font-medium">
                    Inspect your produce upon delivery in Bhopal. If not 100% satisfied, get an instant replacement or refund.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout (5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              
              {/* Promo Code Input Card */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-xs">
                <h3 className="font-black text-[11px] uppercase text-stone-500 tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} className="text-[#0a3d24]" />
                    <span>Apply Coupon / Voucher</span>
                  </span>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                    Offers Available
                  </span>
                </h3>

                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-300 rounded-2xl p-3 shadow-2xs">
                    <div>
                      <span className="font-black text-xs text-[#0a3d24] block uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>{couponCode} APPLIED</span>
                      </span>
                      <span className="text-[11px] text-emerald-800 font-bold mt-0.5 block">
                        You saved ₹{discountAmount} on this order!
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1.5 rounded-full hover:bg-emerald-200/60 text-stone-500 hover:text-red-600 transition cursor-pointer active:scale-90"
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
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#0a3d24] bg-stone-50/70 focus:bg-white transition"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-[#0a3d24] hover:bg-[#072817] text-white px-5 rounded-xl text-xs font-black disabled:opacity-50 transition cursor-pointer active:scale-95 shadow-2xs"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] font-bold text-red-500 mt-2 flex items-center gap-1">
                        <span>•</span> {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bill Details Summary Card */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
                <h3 className="font-black text-xs sm:text-sm text-stone-900 mb-3.5 pb-2.5 border-b border-stone-100 flex items-center justify-between">
                  <span>Bill Breakdown</span>
                  <span className="text-[10.5px] text-stone-500 font-bold bg-stone-100 px-2.5 py-0.5 rounded-full">
                    {totalItemCount} Items in Basket
                  </span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Produce Total (MRP)</span>
                    <span className="font-medium text-stone-400 line-through">₹{totalMRP}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>SubziQuick Mandi Price</span>
                    <span className="font-bold text-stone-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-stone-600 items-center">
                    <span>Bhopal Express Delivery Fee</span>
                    <span className="font-bold">
                      {deliveryFee === 0 ? (
                        <span className="text-[#0a3d24] bg-emerald-50 px-2 py-0.5 rounded-md font-black border border-emerald-200">
                          FREE
                        </span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#0a3d24] font-bold bg-emerald-50 p-2.5 rounded-xl text-xs border border-emerald-200">
                      <span>Promo Discount ({couponCode})</span>
                      <span className="font-black">-₹{discountAmount}</span>
                    </div>
                  )}

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50/50 p-2 rounded-xl text-[11px]">
                      <span>Total Savings Today</span>
                      <span className="font-black text-emerald-900">₹{totalSavings}</span>
                    </div>
                  )}

                  <div className="border-t border-stone-100 pt-3.5 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-stone-950 block">
                        To Pay
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        Inclusive of all Mandi taxes
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-[#0a3d24]">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Primary Proceed CTA */}
                <button
                  onClick={handleProceed}
                  className="w-full mt-5 bg-[#0a3d24] hover:bg-[#072817] text-white py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {Boolean(session?.user || userdata?._id) ? (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Sign In & Order (₹{total})</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                {/* 1-Click WhatsApp Quick Order */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full mt-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-2xs"
                  title="Direct order list to SubziQuick WhatsApp helpline"
                >
                  <FaWhatsapp size={18} className="text-[#25D366]" />
                  <span>Order via WhatsApp (1-Click)</span>
                </button>

                {/* Trust Badges */}
                <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-center gap-4 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-[#0a3d24]" /> 100% Safe
                  </span>
                  <span>•</span>
                  <span>UPI / COD Accepted</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Zap size={13} className="text-amber-500 fill-amber-500" /> 10-15 Min
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Mobile Sticky Floating Bar with Safe Area Insets */}
        {cartdata.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 pb-[max(0.7rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                {totalItemCount} Items • Total
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#0a3d24]">
                  ₹{total}
                </span>
                {totalMRP > total && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{totalMRP}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="bg-[#25D366] active:scale-90 text-white p-2.5 rounded-xl font-black text-xs shadow-xs flex items-center justify-center cursor-pointer shrink-0"
                title="Order on WhatsApp"
                aria-label="Order on WhatsApp"
              >
                <FaWhatsapp size={19} />
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 max-w-[210px] bg-[#0a3d24] active:scale-95 hover:bg-[#072817] text-white py-3 px-4 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
