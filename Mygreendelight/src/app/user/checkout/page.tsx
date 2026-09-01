"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Wallet,
  ArrowLeft,
  Target,
  Loader2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sun,
  Moon,
  Coins,
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

export default function Checkout() {
  useGetMe();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state: RootState) => state.user);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [deliverySlot, setDeliverySlot] = useState<string>("Instant Express (30-45 Mins)");
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [isSilentDelivery, setIsSilentDelivery] = useState<boolean>(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
  const [searchquery, setsearchquery] = useState("");
  const { cartdata } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(hydrateCart());
  }, [dispatch]);

  const subtotal = useSelector(selectSubtotal);
  const deliveryFee = useSelector(selectDeliveryFee);
  const total = useSelector(selectTotal);
  const discount = useSelector(selectDiscount);
  const couponCode = useSelector(selectCouponCode);
  const [searchloading, setsearchloading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const availableWallet = (userdata as any)?.walletBalance || 0;
  const walletDiscount = useWallet
    ? Math.min(availableWallet, Math.max(0, subtotal + deliveryFee - discount))
    : 0;
  const finalPayableTotal = Math.max(0, total - walletDiscount);

  const [address, setaddress] = useState({
    fullname: "",
    mobile: "",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462001",
    fulladress: "",
  });

  const [position, setposition] = useState<[number, number] | null>([
    23.2599, 77.4126,
  ]); // Default to Bhopal coords

  useEffect(() => {
    if (userdata?.name && !address.fullname) {
      setaddress((prev) => ({
        ...prev,
        fullname: userdata.name || "",
        mobile: userdata.mobile || "",
      }));
    }
  }, [userdata]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setposition([latitude, longitude]);
        },
        (err) => {
          console.log("Location error:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  const handelsearchquery = async () => {
    if (!searchquery.trim()) return;
    setsearchloading(true);
    try {
      const { OpenStreetMapProvider } = await import("leaflet-geosearch");
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({
        query: `${searchquery}, Bhopal, Madhya Pradesh`,
      });

      if (results.length) {
        setposition([results[0].y, results[0].x]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setsearchloading(false);
    }
  };

  useEffect(() => {
    const fetchaddress = async () => {
      if (!position) return;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
        );
        if (result.data) {
          setaddress((prev) => ({
            ...prev,
            city: result.data.address?.city || result.data.address?.town || "Bhopal",
            state: result.data.address?.state || "Madhya Pradesh",
            pincode: result.data.address?.postcode || "462001",
            fulladress: result.data.display_name,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchaddress();
  }, [position]);

  const handelPlaceOrder = async () => {
    if (!cartdata || cartdata.length === 0) {
      alert("Your cart is empty. Please add farm produce items to checkout.");
      router.push("/shop");
      return;
    }
    if (!position) {
      alert("Please select delivery location on the map.");
      return;
    }
    if (!address.fullname.trim() || !address.mobile.trim()) {
      alert("Please fill in your Full Name and Mobile Number for delivery.");
      return;
    }

    setSubmitting(true);
    try {
      if (paymentMethod === "cod") {
        await axios.post("/api/user/order", {
          userid: session?.user?.id,
          items: cartdata.map((item) => ({
            grocery: item._id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            image: item.image,
            variationWeight: item.variation?.weight,
            quantity: item.quantity,
          })),
          totalamount: finalPayableTotal,
          address: {
            fullname: address.fullname,
            mobile: address.mobile,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            fulladress: address.fulladress,
            latitude: position[0],
            longitude: position[1],
          },
          paymentmethod: "cod",
          couponCode: couponCode || undefined,
          discount: discount || 0,
          walletDiscount: walletDiscount || 0,
          isSilentDelivery: isSilentDelivery || false,
          deliveryInstructions: deliveryInstructions || "",
          deliverySlot: deliverySlot,
        });
        dispatch(clearCart());
        try {
          await axios.delete("/api/user/cart");
        } catch (e) {}
        router.push("/user/ordersuccess");
      } else {
        // 💳 Paytm Online Payment Flow
        const result = await axios.post("/api/user/payment", {
          userid: session?.user?.id,
          items: cartdata.map((item) => ({
            grocery: item._id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            image: item.image,
            variationWeight: item.variation?.weight,
            quantity: item.quantity,
          })),
          totalamount: finalPayableTotal,
          address: {
            fullname: address.fullname,
            mobile: address.mobile,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            fulladress: address.fulladress,
            latitude: position[0],
            longitude: position[1],
          },
          paymentmethod: "online",
          couponCode: couponCode || undefined,
          discount: discount || 0,
          walletDiscount: walletDiscount || 0,
          isSilentDelivery: isSilentDelivery || false,
          deliveryInstructions: deliveryInstructions || "",
          deliverySlot: deliverySlot,
        });

        if (result.data?.success && result.data?.txnToken) {
          // Load Paytm Checkout JS and open payment page
          const { orderId, txnToken, amount, mid } = result.data;

          const script = document.createElement("script");
          script.src = `https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`;
          script.crossOrigin = "anonymous";
          script.onload = () => {
            const config = {
              root: "",
              flow: "DEFAULT",
              data: {
                orderId: orderId,
                token: txnToken,
                tokenType: "TXN_TOKEN",
                amount: String(amount),
              },
              handler: {
                notifyMerchant: (eventName: string, data: any) => {
                  console.log("Paytm Event:", eventName, data);
                },
              },
            };
            if ((window as any).Paytm?.CheckoutJS) {
              (window as any).Paytm.CheckoutJS.init(config)
                .then(() => {
                  (window as any).Paytm.CheckoutJS.invoke();
                })
                .catch((err: any) => {
                  console.error("Paytm Checkout Error:", err);
                  alert("Payment gateway error. Please try again.");
                  setSubmitting(false);
                });
            }
          };
          script.onerror = () => {
            alert("Failed to load payment gateway. Please try again.");
            setSubmitting(false);
          };
          document.body.appendChild(script);
          return; // Don't set submitting=false, Paytm will redirect
        } else {
          alert(result.data?.message || "Failed to initiate payment.");
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbfcfb] min-h-screen flex flex-col justify-between">
      <Nav user={(userdata as any) || { role: "user" }} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-32 sm:pb-12 w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#0f8646] transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/user/cart" className="hover:text-[#0f8646] transition">
            Cart
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0f8646] font-extrabold">Delivery & Checkout</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Delivery & Payment
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Express 10-15 minute delivery to your doorstep in Bhopal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery Address & Map (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-[#0f8646]" />
                  <span>1. Delivery Address</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        setposition([pos.coords.latitude, pos.coords.longitude]);
                      });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 bg-green-50 text-[#0f8646] hover:bg-green-100 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  <Target size={14} />
                  <span>Use GPS Location</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={address.fullname}
                        onChange={(e) =>
                          setaddress((prev) => ({ ...prev, fullname: e.target.value }))
                        }
                        className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold outline-none focus:border-[#0f8646] bg-gray-50/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={address.mobile}
                        onChange={(e) =>
                          setaddress((prev) => ({ ...prev, mobile: e.target.value }))
                        }
                        className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold outline-none focus:border-[#0f8646] bg-gray-50/60"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    House / Flat No. & Street Address *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Flat 302, Green Meadows, Arera Colony"
                    value={address.fulladress}
                    onChange={(e) =>
                      setaddress((prev) => ({ ...prev, fulladress: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-[#0f8646] bg-gray-50/60 resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setaddress((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#0f8646] bg-gray-50/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setaddress((prev) => ({ ...prev, state: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#0f8646] bg-gray-50/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setaddress((prev) => ({ ...prev, pincode: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#0f8646] bg-gray-50/60"
                    />
                  </div>
                </div>

                {/* Map Pin Area Search */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Search Bhopal Landmark / Area:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MP Nagar Zone 1, Kolar Road, Bittan Market"
                      value={searchquery}
                      onChange={(e) => setsearchquery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handelsearchquery();
                        }
                      }}
                      className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:border-[#0f8646] bg-gray-50/60"
                    />
                    <button
                      type="button"
                      onClick={handelsearchquery}
                      disabled={searchloading}
                      className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 rounded-xl text-xs font-extrabold transition cursor-pointer"
                    >
                      {searchloading ? <Loader2 size={14} className="animate-spin" /> : "Locate"}
                    </button>
                  </div>
                </div>

                {/* Leaflet Map Preview */}
                <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 relative bg-gray-100">
                  {position && <CheckoutMap position={position} setposition={setposition} />}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Slot Selection, Payment & Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Time-Slot Selector */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-[#0f8646]" />
                  <span>2. Delivery Slot</span>
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Bhopal Mandi Fresh
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "Instant Express (30-45 Mins)",
                    title: "⚡ Instant Express Delivery",
                    time: "Arriving within 30–45 Mins",
                    desc: "Direct express dispatch from nearest local hub",
                    icon: Zap,
                    badge: "Fastest",
                    badgeColor: "bg-emerald-100 text-emerald-800",
                  },
                  {
                    id: "Morning Mandi Batch (7:00 AM - 9:00 AM)",
                    title: "🌅 Morning Mandi Batch",
                    time: "Tomorrow 7:00 AM – 9:00 AM",
                    desc: "Freshly harvested early morning mandi auction pick",
                    icon: Sun,
                    badge: "Crispest",
                    badgeColor: "bg-amber-100 text-amber-900",
                  },
                  {
                    id: "Evening Fresh Batch (5:00 PM - 8:00 PM)",
                    title: "🌆 Evening Fresh Batch",
                    time: "Today / Tomorrow 5:00 PM – 8:00 PM",
                    desc: "Sorted & delivered right on time for dinner cooking",
                    icon: Moon,
                    badge: "Convenient",
                    badgeColor: "bg-blue-100 text-blue-900",
                  },
                ].map((slot) => {
                  const isSelected = deliverySlot === slot.id;
                  const Icon = slot.icon;
                  return (
                    <label
                      key={slot.id}
                      onClick={() => setDeliverySlot(slot.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-[#0f8646] bg-green-50/60 shadow-2xs"
                          : "border-gray-200 hover:border-green-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-[#0f8646] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-gray-900">
                              {slot.title}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${slot.badgeColor}`}
                            >
                              {slot.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-500 block">
                            {slot.time} • <span className="text-gray-400">{slot.desc}</span>
                          </span>
                        </div>
                      </div>

                      <input
                        type="radio"
                        name="deliverySlot"
                        checked={isSelected}
                        onChange={() => setDeliverySlot(slot.id)}
                        className="accent-[#0f8646] w-4 h-4 shrink-0"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
              <h2 className="font-extrabold text-base text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#0f8646]" />
                <span>3. Payment Option</span>
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === "cod"
                      ? "border-[#0f8646] bg-green-50/50 shadow-xs"
                      : "border-gray-200 hover:border-green-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-[#0f8646] flex items-center justify-center">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-gray-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-gray-500">
                        Pay cash or UPI directly to the rider at delivery
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#0f8646] w-4 h-4"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === "online"
                      ? "border-[#0f8646] bg-green-50/50 shadow-xs"
                      : "border-gray-200 hover:border-green-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-gray-900 block">
                        Pay Online (UPI / GPay / Cards)
                      </span>
                      <span className="text-xs text-gray-500">
                        Paytm Secure Gateway — UPI, GPay, PhonePe, Cards & Net Banking
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="accent-[#0f8646] w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* GreenPoints Wallet Redemption Card */}
            {availableWallet > 0 && (
              <div className="bg-emerald-50/70 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-xs">
                      <Coins size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">
                          MyGreenDelight GreenPoints
                        </span>
                        <span className="text-[10px] font-black bg-emerald-100 text-[#0f8646] px-2 py-0.5 rounded-full">
                          ₹{availableWallet} Available
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 block">
                        Use wallet cash to save instantly on this Bhopal produce order
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f8646]"></div>
                  </label>
                </div>
              </div>
            )}

            {/* 🔕 Subah 6:30 AM Silent Delivery Mode */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900">
                      🔕 Silent Doorstep Drop (Do Not Ring Doorbell)
                    </span>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      Quiet Mode
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-0.5">
                    Rider will place insulated freshness bag at your doorstep without ringing bell
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
                  placeholder="Optional note for rider (e.g. Leave bag on shoe rack / gate)"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="mt-3 w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#0f8646]"
                />
              )}
            </div>

            {/* Order Items & Total Summary */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
              <h3 className="font-extrabold text-sm text-gray-900 mb-3 pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Order Summary ({cartdata.length} items)</span>
                <Link href="/user/cart" className="text-[11px] text-[#0f8646] font-bold hover:underline">
                  Edit Basket
                </Link>
              </h3>

              {/* Items Mini List */}
              <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
                {cartdata.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100 p-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-gray-900 block truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-400">Qty: {item.quantity} × {item.variation?.weight || item.unit}</span>
                      </div>
                    </div>
                    {item.price === 0 ? (
                      <span className="text-[10px] font-black text-[#0f8646] bg-green-100 px-2 py-0.5 rounded shrink-0">
                        🎁 FREE (₹0)
                      </span>
                    ) : (
                      <span className="font-extrabold text-gray-900 shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-xs mb-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-gray-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Partner Fee</span>
                  <span className="font-extrabold text-gray-900">
                    {deliveryFee === 0 ? <span className="text-[#0f8646]">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#0f8646] font-bold bg-green-50 p-2 rounded-xl">
                    <span>Promo Discount ({couponCode})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                {walletDiscount > 0 && (
                  <div className="flex justify-between text-[#0f8646] font-bold bg-emerald-100/70 p-2 rounded-xl border border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Coins size={13} />
                      <span>GreenPoints Wallet Cash</span>
                    </span>
                    <span>-₹{walletDiscount}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-black text-gray-900 block">
                      Total Payable
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Inclusive of all taxes
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#0f8646]">
                    ₹{finalPayableTotal}
                  </span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                onClick={handelPlaceOrder}
                disabled={submitting || cartdata.length === 0}
                className="w-full mt-4 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3.5 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm & Place Order (₹{finalPayableTotal})</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                <ShieldCheck size={14} className="text-[#0f8646]" />
                <span>100% Safe & Contactless Delivery in Bhopal</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}