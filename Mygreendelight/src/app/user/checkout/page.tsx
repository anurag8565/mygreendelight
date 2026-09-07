"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Wallet,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sun,
  ShoppingBag,
  Truck,
  Building,
  Home,
  Briefcase,
  Navigation,
  Sparkles,
  Check,
  AlertCircle,
  Lock,
  Loader2,
  Upload,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart, hydrateCart } from "@/redux/CartSlice";
import axios from "axios";
import {
  selectSubtotal,
  selectDeliveryFee,
  selectTotal,
  selectDiscount,
  selectCouponCode,
} from "@/redux/cartSelectors";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import useGetMe from "@/hooks/useGetMe";

const CheckoutMap = dynamic(() => import("@/components/CheckoutMap"), {
  ssr: false,
});

const BHOPAL_AREAS = [
  { name: "Bagsewaniya / Amrai (SubziQuick Store)", pincode: "462043", lat: 23.1985, lng: 77.4475 },
  { name: "MP Nagar (Zone 1 & 2)", pincode: "462011", lat: 23.2332, lng: 77.4343 },
  { name: "Arera Colony (E1-E8 / 10 No. Market)", pincode: "462016", lat: 23.2167, lng: 77.4267 },
  { name: "Kolar Road / Sarvdharm / Chuna Bhatti", pincode: "462042", lat: 23.175, lng: 77.418 },
  { name: "Bawadiya Kalan / Gulmohar Colony", pincode: "462039", lat: 23.1895, lng: 77.442 },
  { name: "TT Nagar / New Market / Malviya Nagar", pincode: "462003", lat: 23.239, lng: 77.401 },
  { name: "Saket Nagar / AIIMS Bhopal / Habibganj", pincode: "462020", lat: 23.209, lng: 77.456 },
  { name: "Shahpura / Manisha Market / 11 No.", pincode: "462016", lat: 23.195, lng: 77.425 },
  { name: "Ayodhya Bypass / Minal Residency", pincode: "462022", lat: 23.268, lng: 77.469 },
  { name: "Indrapuri / BHEL Township / Piplani", pincode: "462021", lat: 23.242, lng: 77.478 },
  { name: "Hoshangabad Road / Misrod / Ratanpur", pincode: "462026", lat: 23.162, lng: 77.465 },
  { name: "Shivaji Nagar / 6 No. Stop / Char Imli", pincode: "462016", lat: 23.228, lng: 77.421 },
  { name: "Katara Hills / Bagmugaliya", pincode: "462043", lat: 23.178, lng: 77.485 },
  { name: "Koh-e-Fiza / VIP Road / Lalghati", pincode: "462001", lat: 23.275, lng: 77.382 },
  { name: "Karond / Berasia Road / DIG Bungalow", pincode: "462038", lat: 23.292, lng: 77.405 },
  { name: "Neelbad / Ratibad / Bhadbhada", pincode: "462044", lat: 23.188, lng: 77.345 },
];

export default function Checkout() {
  useGetMe();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state: RootState) => state.user);
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    dispatch(hydrateCart());
  }, [dispatch]);

  useEffect(() => {
    if (status === "unauthenticated" && !userdata) {
      router.replace("/login?callbackUrl=/user/checkout");
    }
  }, [status, userdata, router]);

  const subtotal = useSelector(selectSubtotal);
  const deliveryFee = useSelector(selectDeliveryFee);
  const total = useSelector(selectTotal);
  const discount = useSelector(selectDiscount);
  const couponCode = useSelector(selectCouponCode);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [upiRefNumber, setUpiRefNumber] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [deliverySlot, setDeliverySlot] = useState<string>("Early Morning Slot (6:00 AM – 8:30 AM)");
  const [isSilentDelivery, setIsSilentDelivery] = useState<boolean>(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
  const [riderTip, setRiderTip] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Clean Address Fields
  const [addressType, setAddressType] = useState<"Home" | "Work" | "Other">("Home");
  const [flatHouse, setFlatHouse] = useState("");
  const [streetSociety, setStreetSociety] = useState("");
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [landmark, setLandmark] = useState("");
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [outsideBhopalNotice, setOutsideBhopalNotice] = useState<string | null>(null);
  const [insideBhopalSuccess, setInsideBhopalSuccess] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number] | null>([
    BHOPAL_AREAS[0].lat,
    BHOPAL_AREAS[0].lng,
  ]);

  useEffect(() => {
    if (userdata) {
      if (userdata.name && !fullname) setFullname(userdata.name);
      if (userdata.mobile && !mobile) setMobile(userdata.mobile);
    }
  }, [userdata]);

  const currentArea = BHOPAL_AREAS[selectedAreaIndex] || BHOPAL_AREAS[0];

  const handleAreaChange = (idx: number) => {
    setSelectedAreaIndex(idx);
    const ar = BHOPAL_AREAS[idx];
    if (ar) {
      setPosition([ar.lat, ar.lng]);
    }
  };

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on your browser/device.");
      return;
    }
    setIsLocating(true);
    setOutsideBhopalNotice(null);
    setInsideBhopalSuccess(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        // Distance calculation from Bhopal Center
        const bhopalLat = 23.2599;
        const bhopalLng = 77.4126;
        const R = 6371;
        const dLat = ((latitude - bhopalLat) * Math.PI) / 180;
        const dLon = ((longitude - bhopalLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((bhopalLat * Math.PI) / 180) *
            Math.cos((latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distKm = R * c;

        if (distKm > 35) {
          // OUTSIDE BHOPAL -> RED WARNING
          setOutsideBhopalNotice(
            `🚫 Delivery Unavailable at Your Current GPS Location! Your device location is outside Bhopal (~${distKm.toFixed(0)} km away). SubziQuick delivers exclusively across Bhopal city (MP - 462xxx). Please select your Bhopal delivery area from the dropdown below.`
          );
          setInsideBhopalSuccess(null);
        } else {
          // INSIDE BHOPAL -> GREEN SUCCESS & AUTO SELECT NEAREST AREA
          let nearestIdx = 0;
          let minD = 9999;
          BHOPAL_AREAS.forEach((ar, idx) => {
            const d = Math.hypot(ar.lat - latitude, ar.lng - longitude);
            if (d < minD) {
              minD = d;
              nearestIdx = idx;
            }
          });
          setSelectedAreaIndex(nearestIdx);
          setInsideBhopalSuccess(
            `✅ Location Verified: Closest delivery location pinpointed as "${BHOPAL_AREAS[nearestIdx].name}" (PIN: ${BHOPAL_AREAS[nearestIdx].pincode}).`
          );
          setOutsideBhopalNotice(null);
        }
      },
      (err) => {
        setIsLocating(false);
        console.log("GPS detect error:", err);
        alert("Could not access GPS. Please ensure location permissions are allowed in your browser.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const finalPayableTotal = Math.max(0, subtotal + deliveryFee + riderTip - discount);

  const handelPlaceOrder = async () => {
    if (!cartdata || cartdata.length === 0) {
      alert("Your cart is empty. Please add farm produce items to checkout.");
      router.push("/shop");
      return;
    }

    const activeUserId = session?.user?.id || (userdata as any)?._id;
    if (!activeUserId) {
      alert("Please login or create an account to place your order.");
      router.push("/login?callbackUrl=/user/checkout");
      return;
    }

    if (!fullname.trim()) {
      alert("Please enter your Full Name.");
      return;
    }

    if (!mobile.trim() || mobile.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid 10-digit Mobile Number.");
      return;
    }

    if (!flatHouse.trim() && !streetSociety.trim()) {
      alert("Please enter your House/Flat No. or Street/Society Name.");
      return;
    }

    if (paymentMethod === "upi") {
      const cleanUtr = upiRefNumber.trim();
      if (!cleanUtr || cleanUtr.length < 6) {
        alert("⚠️ कृपया UPI पेमेंट करने के बाद 12-अंकों का UTR / Reference Number दर्ज करें, ताकि आपका पेमेंट वेरिफाई हो सके।\n\n(Please enter the 12-digit UPI UTR / Reference Number from your payment receipt before confirming order).");
        return;
      }
    }

    setSubmitting(true);
    const payableAmount = finalPayableTotal;

    const fulladdress = [
      addressType ? `[${addressType}]` : "",
      flatHouse ? `Flat/House: ${flatHouse.trim()}` : "",
      streetSociety ? streetSociety.trim() : "",
      currentArea.name,
      landmark ? `Landmark: ${landmark.trim()}` : "",
      `Bhopal, Madhya Pradesh - ${currentArea.pincode}`,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const cleanUtr = upiRefNumber.trim();
      let uploadedProofUrl: string | null = null;

      // Upload payment proof if provided
      if (paymentMethod === "upi" && paymentProofFile) {
        try {
          const formData = new FormData();
          formData.append("file", paymentProofFile);
          const uploadRes = await axios.post("/api/user/upload-payment-proof", formData);
          if (uploadRes.data?.success) {
            uploadedProofUrl = uploadRes.data.url;
          }
        } catch (upErr) {
          console.warn("Proof upload error:", upErr);
        }
      }

      const orderRes = await axios.post("/api/user/order", {
        userid: activeUserId,
        items: cartdata.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          variationWeight: item.variation?.weight,
          quantity: item.quantity,
        })),
        totalamount: payableAmount,
        address: {
          fullname: fullname.trim(),
          mobile: mobile.trim(),
          city: "Bhopal",
          state: "Madhya Pradesh",
          pincode: currentArea.pincode,
          fulladress: fulladdress,
          latitude: position ? position[0] : currentArea.lat,
          longitude: position ? position[1] : currentArea.lng,
        },
        paymentmethod: paymentMethod, // "cod" | "upi"
        paymentId: paymentMethod === "upi" ? `UTR_${cleanUtr}` : null,
        paymentProofImage: uploadedProofUrl,
        couponCode: couponCode || undefined,
        discount: discount || 0,
        walletDiscount: 0,
        isSilentDelivery: isSilentDelivery || false,
        deliveryInstructions: deliveryInstructions || "",
        deliverySlot: deliverySlot,
      });

      if (!orderRes.data?.success) {
        alert(orderRes.data?.message || "Could not place order. Please try again.");
        setSubmitting(false);
        return;
      }

      const createdOrderId = orderRes.data?.order?._id;

      dispatch(clearCart());
      try {
        await axios.delete("/api/user/cart");
      } catch (e) {}

      const successUrl = createdOrderId
        ? `/user/ordersuccess?orderId=${createdOrderId}&amount=${payableAmount}&method=${paymentMethod}`
        : `/user/ordersuccess?amount=${payableAmount}&method=${paymentMethod}`;

      window.location.replace(successUrl);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="bg-[#f8faf9] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={(userdata as any) || null} />
        <main className="max-w-md mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#0f8646] animate-spin mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-1">Checking Authentication...</h2>
          <p className="text-xs text-gray-500">Connecting you securely to checkout.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "unauthenticated" && !userdata) {
    return (
      <div className="bg-[#f8faf9] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={null} />
        <main className="max-w-md mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 mx-auto border border-amber-200 shadow-inner">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Please Login to Continue</h2>
          <p className="text-xs text-gray-500 mb-6">
            Aapko order place karne ke liye pehle Login / Signup karna hoga.
          </p>
          <Link
            href="/login?callbackUrl=/user/checkout"
            className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-md transition text-center"
          >
            Login / Create Account ➔
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="bg-[#f8faf9] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={(userdata as any) || { role: "user" }} />
        <main className="max-w-md mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-green-100 text-[#0f8646] flex items-center justify-center mb-4 animate-bounce shadow-md">
            <Truck size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Confirming Your Order...
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Connecting to Bagsewaniya Store (Amrai, Bhopal) and generating your delivery receipt.
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-[#0f8646] bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0f8646] animate-ping" />
            <span>Connecting Morning Fresh Harvest Fleet...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!submitting && (!cartdata || cartdata.length === 0)) {
    return (
      <div className="bg-[#f8faf9] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={(userdata as any) || { role: "user" }} />
        <main className="max-w-md mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-[#0f8646] flex items-center justify-center mb-4 mx-auto border border-emerald-100 shadow-inner">
            <ShoppingBag size={36} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Your Basket is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-xs mx-auto">
            You have no items ready for checkout. Please add fresh farm produce from our store.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
            <Link
              href="/shop"
              className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-md transition text-center"
            >
              Explore Farm Produce ➔
            </Link>
            <Link
              href="/user/myorder"
              className="w-full bg-white border border-gray-300 hover:border-green-500 text-gray-700 hover:text-[#0f8646] py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-center transition"
            >
              View Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf9] min-h-screen flex flex-col justify-between font-sans selection:bg-green-100 selection:text-green-900">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-12 w-full flex-1">
        {/* Top Breadcrumb & Clean Header */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#0f8646] transition font-medium">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/user/cart" className="hover:text-[#0f8646] transition font-medium">
            Cart ({cartdata.length})
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-bold">Checkout</span>
        </div>

        {/* Top Delivery Hub Strip */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Truck size={20} className="text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight">
                  Express Bhopal Doorstep Delivery
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-emerald-100 px-2.5 py-0.5 rounded-full">
                  SAME-DAY FRESH
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                Freshly packed & dispatched from SubziQuick Store (Amrai, Bagsewaniya, Bhopal)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold bg-white/10 px-3 py-1.5 rounded-xl text-emerald-100 self-stretch sm:self-auto justify-center">
            <ShieldCheck size={14} className="text-emerald-300" />
            <span>100% Farm Fresh Guarantee</span>
          </div>
        </div>

        {/* Outside Bhopal Alert: RED WARNING */}
        {outsideBhopalNotice && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 text-red-950 shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-red-900 block text-sm sm:text-base">
                  Delivery Unavailable Outside Bhopal
                </span>
                <p className="mt-1 text-xs text-red-800 leading-relaxed font-medium">
                  {outsideBhopalNotice}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOutsideBhopalNotice(null)}
              className="text-red-500 hover:text-red-800 p-1 font-bold text-xs cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Inside Bhopal Success Banner: GREEN CONFIRMATION */}
        {insideBhopalSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start justify-between gap-3 text-emerald-950 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={20} className="text-[#0f8646] shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-emerald-900 block text-xs sm:text-sm">
                  Bhopal Location Verified
                </span>
                <p className="mt-0.5 text-xs text-emerald-800 font-medium">
                  {insideBhopalSuccess}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInsideBhopalSuccess(null)}
              className="text-emerald-600 hover:text-emerald-900 p-1 font-bold text-xs cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ================= LEFT COLUMN: ADDRESS & PREFERENCES (7 cols) ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. DELIVERY ADDRESS CARD */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base text-gray-900">
                      Delivery Address
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      Where should we deliver your fresh produce?
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGPSDetect}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0f8646] bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition cursor-pointer disabled:opacity-60 shadow-2xs"
                >
                  <Navigation size={13} className={isLocating ? "animate-spin" : ""} />
                  <span>{isLocating ? "Detecting GPS..." : "Locate My Area"}</span>
                </button>
              </div>

              {/* Address Type Selector (Home / Work / Other) */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Save Address As
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "Home", label: "Home", icon: Home },
                    { id: "Work", label: "Work / Office", icon: Briefcase },
                    { id: "Other", label: "Other", icon: MapPin },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = addressType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAddressType(item.id as any)}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 text-[#0f8646] border-[#0f8646] shadow-2xs"
                            : "bg-gray-50/80 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={14} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                {/* Receiver Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Receiver&apos;s Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. Anurag Sharma"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      10-Digit Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9981418565"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                {/* Flat / House No */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    House / Flat No., Floor & Building *
                  </label>
                  <div className="relative">
                    <Building size={15} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Flat 302, 3rd Floor, Tower B"
                      value={flatHouse}
                      onChange={(e) => setFlatHouse(e.target.value)}
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition"
                    />
                  </div>
                </div>

                {/* Society / Colony / Street */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Apartment Society / Colony / Street Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Green Meadows, Amrai / Danish Nagar"
                    value={streetSociety}
                    onChange={(e) => setStreetSociety(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition"
                  />
                </div>

                {/* Bhopal Locality Dropdown Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Bhopal Locality / Sector *
                    </label>
                    <span className="text-[10px] font-black text-[#0f8646] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Bhopal (MP - 462xxx)
                    </span>
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3 text-[#0f8646]" />
                    <select
                      value={selectedAreaIndex}
                      onChange={(e) => handleAreaChange(Number(e.target.value))}
                      className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl py-2.5 pl-10 pr-8 text-xs sm:text-sm font-bold text-gray-900 outline-none focus:border-[#0f8646] cursor-pointer appearance-none"
                    >
                      {BHOPAL_AREAS.map((area, idx) => (
                        <option key={area.name} value={idx}>
                          📍 {area.name} — Pincode: {area.pincode}
                        </option>
                      ))}
                    </select>
                    <ChevronRight size={14} className="absolute right-3.5 top-3.5 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nearby Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near 10 No. Market / Behind City Hospital"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition"
                  />
                </div>

                {/* Interactive Bhopal Map Pinpoint */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#0f8646]" />
                      <span>Pinpoint Location on Bhopal Map</span>
                    </label>
                    <span className="text-[10px] font-extrabold text-[#0f8646] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Drag Pin to Adjust
                    </span>
                  </div>

                  <div className="h-52 sm:h-60 rounded-2xl overflow-hidden border border-emerald-200/80 shadow-xs relative bg-gray-100">
                    {position && (
                      <CheckoutMap position={position} setposition={setPosition} />
                    )}
                    <div className="absolute top-2.5 left-2.5 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-sm text-xs font-bold text-gray-800 flex items-center gap-1.5 pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-[#0f8646] animate-pulse" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">{currentArea.name} ({currentArea.pincode})</span>
                    </div>
                  </div>
                </div>

                {/* Locked City & State summary badge */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock size={13} className="text-gray-400" />
                    <span className="font-bold text-gray-700">Delivery Zone:</span>
                    <span className="font-black text-gray-900">Bhopal, Madhya Pradesh</span>
                  </div>
                  <span className="font-extrabold text-[#0f8646] bg-green-50 px-2 py-0.5 rounded-lg border border-green-200">
                    PIN: {currentArea.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. DELIVERY TIME SLOT */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base text-gray-900">
                      Select Delivery Slot
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      Freshly harvested farm batches dispatched across Bhopal
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-[#0f8646] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Farm Fresh
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "Early Morning Slot (6:00 AM – 8:30 AM)",
                    title: "Early Morning Harvest",
                    time: "6:00 AM – 8:30 AM",
                    desc: "Direct farm harvest dispatch from SubziQuick Store for breakfast",
                    icon: Sun,
                    badge: "Best Freshness",
                    badgeColor: "bg-emerald-100 text-emerald-800",
                  },
                  {
                    id: "Morning Fresh Slot (8:30 AM – 11:00 AM)",
                    title: "Morning Farm Fresh Batch",
                    time: "8:30 AM – 11:00 AM",
                    desc: "Crisp sorted veggies & fruits for lunch preparation",
                    icon: Zap,
                    badge: "Most Popular",
                    badgeColor: "bg-amber-100 text-amber-900",
                  },
                  {
                    id: "Midday Slot (11:00 AM – 1:00 PM)",
                    title: "Midday Express Batch",
                    time: "11:00 AM – 1:00 PM",
                    desc: "Same-day morning harvest dispatch right to your doorstep",
                    icon: Clock,
                    badge: "Express",
                    badgeColor: "bg-blue-100 text-blue-900",
                  },
                ].map((slot) => {
                  const isSelected = deliverySlot === slot.id;
                  const Icon = slot.icon;
                  return (
                    <label
                      key={slot.id}
                      onClick={() => setDeliverySlot(slot.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-[#0f8646] bg-emerald-50/40 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#0f8646] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs sm:text-sm text-gray-900">
                              {slot.title}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${slot.badgeColor}`}
                            >
                              {slot.badge}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium block mt-0.5">
                            {slot.time} • <span className="text-gray-400">{slot.desc}</span>
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected
                            ? "border-[#0f8646] bg-[#0f8646] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. DELIVERY PREFERENCES / QUIET DROP */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900">
                      🔕 Silent Doorstep Drop (Do Not Ring Bell)
                    </span>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      Quiet Mode
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-0.5">
                    Rider will place bag at your doorstep without ringing bell
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSilentDelivery}
                    onChange={(e) => setIsSilentDelivery(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f8646]"></div>
                </label>
              </div>

              {isSilentDelivery && (
                <input
                  type="text"
                  placeholder="Optional instruction (e.g. Leave bag on shoe rack / security gate)"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="mt-3 w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646]"
                />
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PAYMENT & ORDER SUMMARY (5 cols) ================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* PAYMENT OPTIONS */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0f8646] flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-gray-900">
                    Payment Method
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Choose how you want to pay
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === "cod"
                      ? "border-[#0f8646] bg-emerald-50/40 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0f8646] flex items-center justify-center shrink-0">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs sm:text-sm text-gray-900">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[9px] font-black uppercase bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                          Pay on Arrival
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium block mt-0.5">
                        Pay via Cash or UPI directly to delivery partner at doorstep
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                      paymentMethod === "cod"
                        ? "border-[#0f8646] bg-[#0f8646] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {paymentMethod === "cod" && <Check size={12} strokeWidth={3} />}
                  </div>
                </label>

                {/* Direct UPI Payment (GPay, PhonePe, Paytm, QR) */}
                <div
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    paymentMethod === "upi"
                      ? "border-[#0f8646] bg-emerald-50/30 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod("upi")}
                    className="p-4 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-green-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Zap size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs sm:text-sm text-gray-900">
                            Pay via UPI / QR Code
                          </span>
                          <span className="text-[9px] font-black uppercase bg-gradient-to-r from-purple-100 to-green-100 text-purple-900 px-1.5 py-0.5 rounded">
                            0% Extra Fee
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium block mt-0.5">
                          Google Pay, PhonePe, Paytm, BHIM or Scan QR
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        paymentMethod === "upi"
                          ? "border-[#0f8646] bg-[#0f8646] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {paymentMethod === "upi" && <Check size={12} strokeWidth={3} />}
                    </div>
                  </label>

                  {/* UPI QR & 1-Click Pay Extended Box */}
                  {paymentMethod === "upi" && (
                    <div className="p-4 pt-0 border-t border-emerald-100/80 bg-white space-y-4">
                      {/* Mobile 1-Click Pay Apps Button */}
                      <div className="pt-3">
                        <span className="text-[11px] font-bold text-gray-600 block mb-2">
                          ⚡ Tap to Pay Directly on Phone (Mobile UPI Apps):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <a
                            href={`upi://pay?pa=9981418565-2@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Fresh%20Order`}
                            className="bg-[#5f259f] hover:bg-[#4a1c7d] text-white py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                          >
                            <span>PhonePe</span>
                          </a>
                          <a
                            href={`upi://pay?pa=9981418565-2@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Fresh%20Order`}
                            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                          >
                            <span>GPay</span>
                          </a>
                          <a
                            href={`upi://pay?pa=9981418565-2@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Fresh%20Order`}
                            className="bg-[#00baf2] hover:bg-[#0092bf] text-white py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition col-span-2 sm:col-span-1"
                          >
                            <span>Paytm / BHIM</span>
                          </a>
                        </div>
                      </div>

                      {/* Dynamic QR Code Box */}
                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="relative bg-white p-2 rounded-xl shadow-xs border border-gray-200 shrink-0">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                              `upi://pay?pa=9981418565-2@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Fresh%20Order`
                            )}`}
                            alt="SubziQuick UPI QR"
                            className="w-28 h-28 object-contain"
                          />
                          <span className="text-[9px] font-bold text-gray-500 block text-center mt-1">
                            Scan with Any App
                          </span>
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                            Direct Bank Transfer
                          </span>
                          <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                            Scan & Pay ₹{finalPayableTotal}
                          </h4>
                          
                          {/* Copyable UPI ID */}
                          <div className="flex items-center gap-2 pt-1">
                            <code className="bg-white border border-gray-200 px-2 py-1 rounded-lg text-xs font-mono font-bold text-gray-800">
                              9981418565-2@ybl
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("9981418565-2@ybl");
                                setCopiedUpi(true);
                                setTimeout(() => setCopiedUpi(false), 2000);
                              }}
                              className="text-[11px] font-bold text-[#0f8646] hover:underline cursor-pointer flex items-center gap-1"
                            >
                              {copiedUpi ? "✓ Copied" : "Copy ID"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 12-Digit UTR / Reference ID Field */}
                      <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                            <span>Step 2: Enter 12-Digit UPI UTR No.</span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          </label>
                          <span className="text-[10px] font-bold text-gray-500">From GPay/PhonePe</span>
                        </div>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="e.g. 423987123456 (from your UPI receipt)"
                          value={upiRefNumber}
                          onChange={(e) => setUpiRefNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                          className="w-full bg-white border border-amber-300 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646] focus:ring-1 focus:ring-[#0f8646] transition shadow-2xs placeholder:text-gray-400 placeholder:font-normal"
                        />
                        <p className="text-[10px] text-amber-800/80 mt-1.5 font-medium leading-tight">
                          💡 Pay on your UPI app ➔ Copy the 12-digit UTR/Ref No. ➔ Paste here & attach screenshot below.
                        </p>
                      </div>

                      {/* Step 3: Upload Payment Screenshot (Receipt Proof) */}
                      <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                            <Camera size={14} className="text-[#0f8646]" />
                            <span>Step 3: Attach Payment Screenshot</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              Recommended
                            </span>
                          </label>
                          <span className="text-[10px] font-bold text-gray-400">JPG/PNG</span>
                        </div>

                        <div className="relative">
                          {paymentProofPreview ? (
                            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-300 shadow-2xs">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={paymentProofPreview}
                                  alt="Payment Screenshot Preview"
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-2xs"
                                />
                                <div>
                                  <span className="text-xs font-bold text-emerald-800 block flex items-center gap-1">
                                    <Check size={13} className="stroke-[3]" /> Screenshot Attached
                                  </span>
                                  <span className="text-[10px] text-gray-500">Ready for 1-second admin verification</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setPaymentProofFile(null);
                                  setPaymentProofPreview(null);
                                }}
                                className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-emerald-300 hover:border-[#0f8646] bg-white rounded-xl cursor-pointer transition group">
                              <div className="flex items-center gap-2 text-xs font-bold text-[#0f8646] group-hover:underline">
                                <Upload size={15} />
                                <span>Upload Payment Receipt / Screenshot</span>
                              </div>
                              <span className="text-[10px] text-gray-400 mt-0.5">
                                Click or tap to browse photo from gallery
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setPaymentProofFile(file);
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setPaymentProofPreview(ev.target?.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ORDER ITEMS & BILL BREAKDOWN */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <span className="font-black text-sm text-gray-900">
                  Order Summary ({cartdata.length} items)
                </span>
                <Link href="/user/cart" className="text-xs text-[#0f8646] font-bold hover:underline">
                  Edit Basket
                </Link>
              </div>

              {/* Items Mini List */}
              <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
                {cartdata.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100 p-0.5 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-gray-900 block truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-400">
                          Qty: {item.quantity} × {item.variation?.weight || item.unit}
                        </span>
                      </div>
                    </div>
                    {item.price === 0 ? (
                      <span className="text-[10px] font-black text-[#0f8646] bg-green-100 px-2 py-0.5 rounded shrink-0">
                        FREE (₹0)
                      </span>
                    ) : (
                      <span className="font-black text-gray-900 shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2.5 text-xs pt-3 border-t border-gray-100">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Item Total</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    <span>Delivery Partner Fee</span>
                  </span>
                  <span className="font-bold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-[#0f8646] font-black bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {/* Rider Tip */}
                <div className="pt-2 pb-1 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-gray-700">
                      🛵 Tip your delivery partner
                    </span>
                    {riderTip > 0 && (
                      <button
                        type="button"
                        onClick={() => setRiderTip(0)}
                        className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 20, 30, 50].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setRiderTip(riderTip === amt ? 0 : amt)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                          riderTip === amt
                            ? "bg-[#0f8646] text-white shadow-2xs"
                            : "bg-gray-50 hover:bg-green-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        <span>₹{amt}</span>
                        {amt === 20 && <span>⭐</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#0f8646] font-bold bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span>Coupon Savings ({couponCode})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-gray-900 block">
                      To Pay
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Incl. all taxes & store packaging
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#0f8646]">
                    ₹{finalPayableTotal}
                  </span>
                </div>
              </div>

              {/* Desktop Confirm Button */}
              <button
                type="button"
                onClick={handelPlaceOrder}
                disabled={submitting || cartdata.length === 0}
                className="w-full mt-5 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                <span>
                  {paymentMethod === "cod" ? "Place COD Order" : "Confirm & Place UPI Order"} • ₹{finalPayableTotal}
                </span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <ShieldCheck size={14} className="text-[#0f8646]" />
                <span>100% Safe & Contactless Delivery in Bhopal</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= STICKY MOBILE BOTTOM BAR ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 p-3.5 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
            Total Payable
          </span>
          <span className="text-xl font-black text-[#0f8646]">
            ₹{finalPayableTotal}
          </span>
        </div>

        <button
          type="button"
          onClick={handelPlaceOrder}
          disabled={submitting || cartdata.length === 0}
          className="flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 size={16} />
          <span>
            {paymentMethod === "cod" ? "Place COD Order" : "Confirm UPI Order"} • ₹{finalPayableTotal}
          </span>
        </button>
      </div>

      <Footer />
    </div>
  );
}