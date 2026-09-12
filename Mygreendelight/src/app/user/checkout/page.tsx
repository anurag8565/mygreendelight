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
  ArrowRight,
  ChevronDown,
  BadgeCheck,
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
  { name: "Berasia Road / DIG Bungalow / Navbahar", pincode: "462038", lat: 23.292, lng: 77.405 },
  { name: "Neelbad / Ratibad / Bhadbhada", pincode: "462044", lat: 23.188, lng: 77.345 },
];

export default function Checkout() {
  useGetMe();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state: RootState) => state.user);
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const { data: session, status } = useSession();

  const rawUserId = userdata?._id || (userdata as any)?.id || (session?.user as any)?._id || (session?.user as any)?.id || null;
  const cleanUserId = rawUserId ? String(rawUserId) : null;

  useEffect(() => {
    dispatch(hydrateCart({ userId: cleanUserId }));
  }, [dispatch, cleanUserId]);

  useEffect(() => {
    if (status === "unauthenticated" && !userdata) {
      router.replace("/login?callbackUrl=/user/checkout");
    }
  }, [status, userdata, router]);

  const [deliverySettings, setDeliverySettings] = useState<{
    deliveryFee: number;
    freeDeliveryThreshold: number;
    isFreeDeliveryActive: boolean;
    minOrderAmount: number;
    expressDeliveryMins: string;
    deliveryNotice?: string;
  }>({
    deliveryFee: 30,
    freeDeliveryThreshold: 199,
    isFreeDeliveryActive: false,
    minOrderAmount: 0,
    expressDeliveryMins: "15-45 Mins",
    deliveryNotice: "",
  });

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((res) => {
        if (res.data?.success) {
          setDeliverySettings({
            deliveryFee: res.data.deliveryFee ?? 30,
            freeDeliveryThreshold: res.data.freeDeliveryThreshold ?? 199,
            isFreeDeliveryActive: Boolean(res.data.isFreeDeliveryActive),
            minOrderAmount: res.data.minOrderAmount ?? 0,
            expressDeliveryMins: res.data.expressDeliveryMins || "15-45 Mins",
            deliveryNotice: res.data.deliveryNotice || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = useSelector(selectSubtotal);
  const total = useSelector(selectTotal);
  const discount = useSelector(selectDiscount);
  const couponCode = useSelector(selectCouponCode);

  const isFreeDelivery =
    deliverySettings.isFreeDeliveryActive ||
    deliverySettings.deliveryFee === 0 ||
    subtotal >= deliverySettings.freeDeliveryThreshold;
  const deliveryFee =
    subtotal === 0 ? 0 : isFreeDelivery ? 0 : deliverySettings.deliveryFee;

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [upiRefNumber, setUpiRefNumber] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [deliverySlot, setDeliverySlot] = useState<string>("Early Morning Slot (6:00 AM – 8:30 AM)");
  const [isSilentDelivery, setIsSilentDelivery] = useState<boolean>(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
  const [riderTip, setRiderTip] = useState<number>(0);
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  // Address Fields
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
          setOutsideBhopalNotice(
            `Delivery Unavailable at Your GPS Location (~${distKm.toFixed(0)} km from Bhopal). We deliver across Bhopal city (MP - 462xxx). Please select your Bhopal locality below.`
          );
          setInsideBhopalSuccess(null);
        } else {
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
            `Located nearest area: "${BHOPAL_AREAS[nearestIdx].name}" (PIN: ${BHOPAL_AREAS[nearestIdx].pincode})`
          );
          setOutsideBhopalNotice(null);
        }
      },
      (err) => {
        setIsLocating(false);
        alert("Could not access GPS. Please allow location access or choose locality from the list.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const userWalletBalance = Number(userdata?.walletBalance) || 0;
  const preWalletTotal = Math.max(0, subtotal + deliveryFee + riderTip - discount);
  const appliedWalletDiscount = useWallet ? Math.min(userWalletBalance, preWalletTotal) : 0;
  const finalPayableTotal = Math.max(0, preWalletTotal - appliedWalletDiscount);

  const handelPlaceOrder = async () => {
    if (!cartdata || cartdata.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
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

    const effectiveMinOrder = deliverySettings.minOrderAmount || 99;
    if (subtotal < effectiveMinOrder) {
      alert(`Minimum order value is ₹${effectiveMinOrder}. Please add ₹${effectiveMinOrder - subtotal} more to place this order.`);
      router.push("/shop");
      return;
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
          unit: item.variation?.weight || item.unit || "1 unit",
          image: item.image,
          variationWeight: item.variation?.weight || item.unit || undefined,
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
        paymentmethod: paymentMethod,
        paymentId:
          paymentMethod === "upi"
            ? cleanUtr
              ? cleanUtr.startsWith("UTR_")
                ? cleanUtr
                : `UTR_${cleanUtr}`
              : `UPI_APP_${Date.now().toString().slice(-6)}`
            : null,
        paymentProofImage: uploadedProofUrl,
        couponCode: couponCode || undefined,
        discount: discount || 0,
        walletDiscount: appliedWalletDiscount,
        farmerTip: riderTip || 0,
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
      <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={(userdata as any) || null} />
        <main className="max-w-md mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-9 h-9 text-[#0f8646] animate-spin mb-3" />
          <h2 className="text-sm font-semibold text-gray-700">Connecting securely...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "unauthenticated" && !userdata) {
    return (
      <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={null} />
        <main className="max-w-sm mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 mx-auto border border-amber-100">
            <Lock size={22} />
          </div>
          <h2 className="text-base font-extrabold text-gray-900 mb-1">Login to Checkout</h2>
          <p className="text-xs text-gray-500 mb-5">
            Log in to your account to review address and confirm your order.
          </p>
          <Link
            href="/login?callbackUrl=/user/checkout"
            className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <span>Login / Create Account</span>
            <ArrowRight size={13} />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={(userdata as any) || { role: "user" }} />
        <main className="max-w-md mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center mb-3 animate-bounce shadow-xs">
            <Truck size={24} />
          </div>
          <h2 className="text-base font-extrabold text-gray-900 mb-1">
            Placing Your Order...
          </h2>
          <p className="text-xs text-gray-500">
            Confirming with Bagsewaniya Hub and preparing your dispatch.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!submitting && (!cartdata || cartdata.length === 0)) {
    return (
      <div className="bg-[#fcfdfc] min-h-screen flex flex-col justify-between font-sans">
        <Nav user={(userdata as any) || { role: "user" }} />
        <main className="max-w-sm mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center mb-3 mx-auto border border-emerald-100">
            <ShoppingBag size={26} />
          </div>
          <h2 className="text-base font-extrabold text-gray-900 mb-1">
            Your Basket is Empty
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Add fresh farm vegetables and fruits to get started.
          </p>
          <div className="flex gap-2 w-full">
            <Link
              href="/shop"
              className="flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1"
            >
              <span>Explore Farm Produce</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/user/myorder"
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 px-3 rounded-xl font-bold text-xs text-center transition hover:border-[#0f8646]"
            >
              My Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf8] min-h-screen flex flex-col justify-between font-sans selection:bg-green-100 selection:text-green-900">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 pb-28 sm:pb-12 w-full flex-1">
        
        {/* Sleek Breadcrumb & Micro Status Strip */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Link href="/" className="hover:text-gray-700 transition">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/user/cart" className="hover:text-gray-700 transition">Cart</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#0f8646] font-bold">Checkout</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f8646] bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f8646] animate-pulse" />
            <span>Bhopal Express • 100% Farm Fresh</span>
          </div>
        </div>

        {/* Notices */}
        {outsideBhopalNotice && (
          <div className="mb-4 bg-red-50/90 border border-red-200 rounded-2xl p-3.5 flex items-start justify-between gap-2.5 text-red-900 text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span>{outsideBhopalNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setOutsideBhopalNotice(null)}
              className="text-red-400 hover:text-red-700 font-bold p-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {insideBhopalSuccess && (
          <div className="mb-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-emerald-900 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0f8646] shrink-0" />
              <span>{insideBhopalSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setInsideBhopalSuccess(null)}
              className="text-emerald-500 hover:text-emerald-800 font-bold p-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          
          {/* ================= LEFT COLUMN: FORM DETAILS (7 cols) ================= */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* STEP 1: DELIVERY ADDRESS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                    1
                  </span>
                  <div>
                    <h2 className="font-bold text-xs sm:text-sm text-gray-900">
                      Delivery Address
                    </h2>
                  </div>
                </div>

                {/* GPS Detect & Type chips */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-50 border border-gray-100 p-0.5 rounded-lg text-[11px] font-bold">
                    {(["Home", "Work", "Other"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddressType(type)}
                        className={`px-2 py-0.5 rounded-md transition ${
                          addressType === type
                            ? "bg-white text-[#0f8646] shadow-xs"
                            : "text-gray-400 hover:text-gray-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleGPSDetect}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f8646] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    <Navigation size={11} className={isLocating ? "animate-spin" : ""} />
                    <span>{isLocating ? "Locating..." : "GPS Detect"}</span>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-2.5">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Receiver's Name *"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl py-2 pl-8.5 pr-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </div>

                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-Digit Mobile *"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl py-2 pl-8.5 pr-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition placeholder:text-gray-400 placeholder:font-normal tracking-wide"
                    />
                  </div>
                </div>

                {/* House No & Street */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Building size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="House / Flat No., Floor *"
                      value={flatHouse}
                      onChange={(e) => setFlatHouse(e.target.value)}
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl py-2 pl-8.5 pr-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Society / Colony / Street *"
                    value={streetSociety}
                    onChange={(e) => setStreetSociety(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>

                {/* Bhopal Locality & Landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-2.5 text-[#0f8646]" />
                    <select
                      value={selectedAreaIndex}
                      onChange={(e) => handleAreaChange(Number(e.target.value))}
                      className="w-full bg-emerald-50/50 border border-emerald-200/70 rounded-xl py-2 pl-8 pr-7 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646] cursor-pointer appearance-none truncate"
                    >
                      {BHOPAL_AREAS.map((area, idx) => (
                        <option key={area.name} value={idx}>
                          {area.name} ({area.pincode})
                        </option>
                      ))}
                    </select>
                    <ChevronRight size={12} className="absolute right-2.5 top-2.5 text-gray-400 rotate-90 pointer-events-none" />
                  </div>

                  <input
                    type="text"
                    placeholder="Nearby Landmark (Optional)"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0f8646] transition placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>

                {/* Collapsible Clean Map Strip */}
                <div className="pt-0.5">
                  <div className="flex items-center justify-between text-xs bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium truncate">
                      <MapPin size={12} className="text-[#0f8646] shrink-0" />
                      <span className="truncate">Pin: <strong className="text-gray-800 font-semibold">{currentArea.name}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="text-[#0f8646] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                    >
                      <span>{showMap ? "Hide Map" : "Adjust Pin"}</span>
                      <ChevronDown size={11} className={`transition-transform duration-200 ${showMap ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {showMap && (
                    <div className="mt-2 h-36 rounded-xl overflow-hidden border border-emerald-200/80 shadow-2xs relative bg-gray-100">
                      {position && (
                        <CheckoutMap position={position} setposition={setPosition} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STEP 2: DELIVERY TIME SLOT */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                    2
                  </span>
                  <h2 className="font-bold text-xs sm:text-sm text-gray-900">
                    Delivery Slot
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Harvest Batches
                </span>
              </div>

              {/* 3 Horizontal Modern Radio Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: "Early Morning Slot (6:00 AM – 8:30 AM)",
                    title: "Early Morning",
                    time: "6:00 AM – 8:30 AM",
                    badge: "Freshest",
                    icon: Sun,
                  },
                  {
                    id: "Morning Fresh Slot (8:30 AM – 11:00 AM)",
                    title: "Morning Fresh",
                    time: "8:30 AM – 11:00 AM",
                    badge: "Popular",
                    icon: Zap,
                  },
                  {
                    id: "Midday Slot (11:00 AM – 1:00 PM)",
                    title: "Midday Batch",
                    time: "11:00 AM – 1:00 PM",
                    badge: "Express",
                    icon: Clock,
                  },
                ].map((slot) => {
                  const isSelected = deliverySlot === slot.id;
                  const Icon = slot.icon;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setDeliverySlot(slot.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? "border-[#0f8646] bg-emerald-50/40 shadow-xs"
                          : "border-gray-200/80 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {slot.badge}
                        </span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-[#0f8646] bg-[#0f8646] text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check size={9} strokeWidth={3} />}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1">
                          <Icon size={13} className={isSelected ? "text-[#0f8646]" : "text-gray-400"} />
                          <span className="font-bold text-xs text-gray-900">{slot.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          {slot.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Silent Delivery Toggle */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-700 font-medium">
                  🔕 Silent Doorstep Drop (Do Not Ring Bell)
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSilentDelivery}
                    onChange={(e) => setIsSilentDelivery(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0f8646]"></div>
                </label>
              </div>

              {isSilentDelivery && (
                <input
                  type="text"
                  placeholder="Drop instruction (e.g. Leave on shoe rack / table)"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="mt-2 w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646]"
                />
              )}
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                    3
                  </span>
                  <h2 className="font-bold text-xs sm:text-sm text-gray-900">
                    Payment Method
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-gray-400">100% Secure</span>
              </div>

              {/* Segmented Radio Cards: COD vs UPI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === "cod"
                      ? "border-[#0f8646] bg-emerald-50/40 shadow-xs"
                      : "border-gray-200/80 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#0f8646] flex items-center justify-center shrink-0">
                      <Wallet size={15} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">
                        Cash on Delivery
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Pay Cash / UPI at Doorstep
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMethod === "cod"
                        ? "border-[#0f8646] bg-[#0f8646] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "cod" && <Check size={9} strokeWidth={3} />}
                  </div>
                </div>

                {/* Direct UPI / QR */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === "upi"
                      ? "border-[#0f8646] bg-emerald-50/40 shadow-xs"
                      : "border-gray-200/80 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-[#0f8646] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Zap size={15} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-gray-900">
                          UPI / QR Code
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                          Fast
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        GPay, PhonePe, Paytm, QR
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMethod === "upi"
                        ? "border-[#0f8646] bg-[#0f8646] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "upi" && <Check size={9} strokeWidth={3} />}
                  </div>
                </div>
              </div>

              {/* UPI Expanded Minimalist Section */}
              {paymentMethod === "upi" && (
                <div className="mt-3 p-3 bg-emerald-50/30 rounded-xl border border-emerald-200/70 space-y-2.5">
                  {/* Quick App Buttons (1-Tap Deep Link) */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <a
                      href={`upi://pay?pa=9981418565@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Order`}
                      className="bg-[#5f259f] hover:bg-[#4a1c7d] text-white py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition flex items-center justify-center"
                    >
                      PhonePe
                    </a>
                    <a
                      href={`upi://pay?pa=9981418565@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Order`}
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition flex items-center justify-center"
                    >
                      Google Pay
                    </a>
                    <a
                      href={`upi://pay?pa=9981418565@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Order`}
                      className="bg-[#00baf2] hover:bg-[#0092bf] text-white py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition flex items-center justify-center"
                    >
                      Paytm
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("9981418565@ybl");
                        setCopiedUpi(true);
                        setTimeout(() => setCopiedUpi(false), 2000);
                      }}
                      className="bg-white border border-gray-300 hover:border-[#0f8646] text-gray-700 hover:text-[#0f8646] py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition"
                    >
                      {copiedUpi ? "✓ Copied" : "Copy ID"}
                    </button>
                  </div>

                  {/* QR Preview & Inputs side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center pt-1">
                    {/* Compact QR Preview */}
                    <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-gray-200/80">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                          `upi://pay?pa=9981418565@ybl&pn=SubziQuick&am=${finalPayableTotal}&cu=INR&tn=SubziQuick%20Order`
                        )}`}
                        alt="SubziQuick UPI QR"
                        className="w-14 h-14 object-contain rounded border border-gray-100"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-gray-900 block">Scan to Pay</span>
                        <code className="text-[10px] text-gray-500 font-mono block">9981418565@ybl</code>
                        <span className="text-[10px] text-[#0f8646] font-bold block mt-0.5">₹{finalPayableTotal}</span>
                      </div>
                    </div>

                    {/* UTR Reference input & Screenshot Upload */}
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        maxLength={20}
                        placeholder="UPI Ref / UTR No. (Optional)"
                        value={upiRefNumber}
                        onChange={(e) => setUpiRefNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                        className="w-full bg-white border border-gray-200/80 rounded-xl py-1.5 px-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[#0f8646] transition placeholder:text-gray-400 placeholder:font-normal"
                      />

                      <div>
                        {paymentProofPreview ? (
                          <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-emerald-300 text-[10px]">
                            <span className="text-[#0f8646] font-bold flex items-center gap-1">
                              <Check size={11} /> Screenshot Added
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentProofFile(null);
                                setPaymentProofPreview(null);
                              }}
                              className="text-red-500 hover:text-red-700 font-bold ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-1 py-1 px-2 bg-white border border-dashed border-gray-300 hover:border-[#0f8646] rounded-xl cursor-pointer text-[10px] text-gray-500 hover:text-[#0f8646] transition">
                            <Upload size={11} />
                            <span>Upload Screenshot (Optional)</span>
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
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: STICKY SUMMARY (5 cols) ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <span className="font-bold text-xs sm:text-sm text-gray-900">
                  Order Summary ({cartdata.length} {cartdata.length === 1 ? "item" : "items"})
                </span>
                <Link href="/user/cart" className="text-[11px] text-[#0f8646] font-bold hover:underline">
                  Edit Cart
                </Link>
              </div>

              {/* Items Compact Mini List */}
              <div className="space-y-1.5 mb-3 max-h-36 overflow-y-auto pr-1">
                {cartdata.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-6 h-6 rounded-md object-contain bg-gray-50 border border-gray-100 p-0.5 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-gray-900 block truncate text-xs">{item.name}</span>
                        <span className="text-[10px] text-gray-400">
                          {item.quantity} × {item.variation?.weight || item.unit}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0 ml-2 text-xs">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 text-xs pt-2.5 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-[#0f8646] font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {/* Rider Tip Chips */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-500 font-medium">
                      🛵 Delivery Partner Tip
                    </span>
                    {riderTip > 0 && (
                      <button
                        type="button"
                        onClick={() => setRiderTip(0)}
                        className="text-[10px] text-red-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[10, 20, 30, 50].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setRiderTip(riderTip === amt ? 0 : amt)}
                        className={`py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          riderTip === amt
                            ? "bg-[#0f8646] text-white"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/80"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GreenPoints Wallet Redemption */}
                {userWalletBalance > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <label
                      onClick={() => setUseWallet(!useWallet)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition select-none ${
                        useWallet
                          ? "bg-emerald-50 border-emerald-400 shadow-2xs"
                          : "bg-gray-50/70 border-gray-200/80 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                            useWallet
                              ? "bg-[#0f8646] border-[#0f8646] text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {useWallet && <Check size={11} strokeWidth={3} />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block leading-tight">
                            GreenPoints Wallet
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            Balance: ₹{userWalletBalance}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#0f8646]">
                        {useWallet ? `-₹${appliedWalletDiscount}` : `Use ₹${Math.min(userWalletBalance, preWalletTotal)}`}
                      </span>
                    </label>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-[#0f8646] font-bold bg-emerald-50/70 p-2 rounded-lg text-xs">
                    <span>Coupon ({couponCode})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                {appliedWalletDiscount > 0 && (
                  <div className="flex justify-between text-[#0f8646] font-bold bg-emerald-50/70 p-2 rounded-lg text-xs">
                    <span>Wallet GreenPoints Applied</span>
                    <span>-₹{appliedWalletDiscount}</span>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Total Payable</span>
                    <span className="text-[10px] text-gray-400">Incl. all taxes</span>
                  </div>
                  <span className="text-xl font-black text-[#0f8646]">
                    ₹{finalPayableTotal}
                  </span>
                </div>
              </div>

              {/* Desktop Place Order CTA Button */}
              <button
                type="button"
                onClick={handelPlaceOrder}
                disabled={submitting || cartdata.length === 0}
                className="w-full mt-4 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                <span>
                  {paymentMethod === "cod" ? "Place COD Order" : "Place UPI Order"} • ₹{finalPayableTotal}
                </span>
              </button>

              <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] text-gray-400">
                <ShieldCheck size={12} className="text-[#0f8646]" />
                <span>Safe & Contactless Delivery in Bhopal</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= STICKY MOBILE BOTTOM BAR ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 p-3 px-4 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
            Total
          </span>
          <span className="text-lg font-black text-[#0f8646]">
            ₹{finalPayableTotal}
          </span>
        </div>

        <button
          type="button"
          onClick={handelPlaceOrder}
          disabled={submitting || cartdata.length === 0}
          className="flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 size={15} />
          <span>
            {paymentMethod === "cod" ? "Place COD Order" : "Place UPI Order"} • ₹{finalPayableTotal}
          </span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
