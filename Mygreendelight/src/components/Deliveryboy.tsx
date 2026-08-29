'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  MapPin,
  Phone,
  Package,
  Truck,
  Clock,
  MessageCircle,
  Navigation,
  User,
  CreditCard,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import dynamic from "next/dynamic";
const Livemap = dynamic(() => import("./Livemap"), { ssr: false });
import ChatButton from './ChatButton'
import EarningsChart from "./EarningsChart";
import DeliveriesChart from "./DeliveriesChart";
import RecentDeliveries from "./RecentDeliveries";
import DeliveryDashboardStats from "./DeliveryDashboardStats";
import { socket } from "@/lib/socket";


function Deliveryboy() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [loadingCurrentOrder, setLoadingCurrentOrder] = useState(true)
  const [earningsData, setEarningsData] = useState([]);
  const [deliveriesData, setDeliveriesData] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  

  const [activeorder, setactiverder] = useState<any>(null)
  const [userlocation, setuserlocation] = useState<any>(null)
  const [dashboardStats, setDashboardStats] =
  useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    earningPerDelivery: 100,
  });
 
useEffect(() => {

  console.log(
    "LISTENING FOR SOCKET"
  );

  socket.on(
    "new-assignment",
    (
      assignment
    ) => {

      console.log(
        "NEW ASSIGNMENT RECEIVED"
      );

      console.log(
        assignment
      );

      setAssignments(
        (prev) => [
          assignment,
          ...prev,
        ]
      );

      alert(
        "NEW ASSIGNMENT RECEIVED"
      );

    }
  );

  return () => {

    socket.off(
      "new-assignment"
    );

  };

}, []);

  const fetchDashboardData = async () => {
    try {

      const [
        earningsRes,
        deliveriesRes,
        recentRes
      ] = await Promise.all([
        axios.get(
          "/api/delivery/earnings-chart"
        ),
        axios.get(
          "/api/delivery/deliveries-chart"
        ),
        axios.get(
          "/api/delivery/recent-deliveries"
        )
      ]);

      setEarningsData(
        earningsRes.data
      );

      setDeliveriesData(
        deliveriesRes.data
      );

      setRecentDeliveries(
        recentRes.data
      );

    } catch (error) {
      console.log(
        "Dashboard Error:",
        error
      );
    }
  };
  useEffect(() => {
  console.log(
    "earningsData",
    earningsData
  );

  console.log(
    "deliveriesData",
    deliveriesData
  );

  console.log(
    "recentDeliveries",
    recentDeliveries
  );
}, [
  earningsData,
  deliveriesData,
  recentDeliveries
]);
  useEffect(() => {
  fetchDashboardData();
  fetchStats();
}, []);
  const fetchStats = async () => {
  try {
    const res = await axios.get(
      "/api/delivery/dashboard-stats"
    );

    setDashboardStats(res.data.stats);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchDashboardData();
  fetchStats();
}, []);
  const fetchAssignments = async () => {
    try {
      const result = await axios.get(
        '/api/delivery/getassigments'
      )

      setAssignments(
        result.data.assignments || []
      )
    } catch (error) {
      console.log(error)
    }
  }
  const [otp, setOtp] = useState("")
  const { userdata } = useSelector(
    (state: RootState) => state.user
  )
  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assigment/${id}/accepyaccigment`
      )
      console.log(result)

      alert(result.data.message)

      setAssignments((prev) =>
        prev.filter((a) => a._id !== id)
      )
       setTimeout(() => {
      window.location.reload();
    }, 3000);
    } catch (error: any) {
      console.log(error)

      alert(
        error?.response?.data?.message ||
        "Failed to accept assignment"
      )
    }
  }

  const handleReject = async (
    id: string
  ) => {
    try {
      await axios.post(
        '/api/delivery/reject',
        { id }
      )

      alert('Assignment Rejected')

      setAssignments((prev) =>
        prev.filter((a) => a._id !== id)
      )
    } catch (error) {
      console.log(error)
    }
  }
  const fetchcurrentorder = async () => {
    try {
      const result = await axios.get(
        "/api/delivery/currentorder"
      )
      if (result.data.active) {
        setactiverder(result.data.assigment)
        setuserlocation({
          latitude: result.data.assigment.order.address.latitude,
          longitude: result.data.assigment.order.address.longitude
        })
      }



      if (result.data.active) {
        setCurrentOrder(result.data.assigment)
      } else {
        setCurrentOrder(null)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingCurrentOrder(false)
    }
  }

  const [gpsActive, setGpsActive] = useState(false);

  useEffect(() => {
    if (userdata) {
      fetchcurrentorder();
      fetchAssignments();
    }
  }, [userdata]);

  useEffect(() => {
    if (!activeorder) return;
    let watchId: number | null = null;
    let lastUpdate = 0;

    if (navigator.geolocation) {
      setGpsActive(true);
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const now = Date.now();
          if (now - lastUpdate > 8000) {
            lastUpdate = now;
            axios
              .post("/api/delivery/updatelocation", { latitude, longitude })
              .catch(() => {});
          }
        },
        (err) => console.log("GPS watch error:", err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [activeorder]);

  if (activeorder && userlocation) {
    const orderObj = activeorder.order || {};
    const customerName = orderObj.address?.fullname || "Customer";
    const customerMobile = orderObj.address?.mobile || "";
    const customerAddress = orderObj.address?.fulladress || "Bhopal Location";
    const orderShortId = String(orderObj._id || "").slice(-6).toUpperCase();
    const isPaid = orderObj.ispaid;
    const totalAmount = orderObj.totalamount || 0;

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${userlocation.latitude},${userlocation.longitude}`;
    const whatsappMsg = encodeURIComponent(
      `Hello ${customerName}, I am your MyGreenDelight Delivery Partner on the way to your address (${customerAddress}) with your farm-fresh produce order #${orderShortId}. Total: ₹${totalAmount} (${isPaid ? "Paid Online" : "Cash on Delivery"}).`
    );
    const whatsappUrl = `https://wa.me/91${customerMobile.replace(/\D/g, "")}?text=${whatsappMsg}`;

    return (
      <div className="p-4 pt-24 sm:pt-28 min-h-screen bg-[#f8faf9] font-sans pb-16">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-100 text-[#0f8646] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  ACTIVE DELIVERY IN PROGRESS
                </span>
                {gpsActive && (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Live GPS Streaming</span>
                  </span>
                )}
                <span className="font-mono font-black text-sm text-gray-900">
                  #{orderShortId}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                Delivering to {customerName}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#0f8646] shrink-0" />
                <span>{customerAddress}</span>
              </p>
            </div>

            {/* Payment Collection Alert */}
            <div
              className={`p-3.5 rounded-2xl border text-xs font-black shrink-0 ${
                isPaid
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-300 animate-pulse"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                <CreditCard size={14} />
                <span>{isPaid ? "Payment Verified" : "Cash Collection Required"}</span>
              </div>
              <p className="text-sm">
                {isPaid ? "✅ Paid Online (₹0 to collect)" : `💵 Collect Cash: ₹${totalAmount}`}
              </p>
            </div>
          </div>

          {/* 1-Click Rider Action Bar (Google Maps + WhatsApp + Call) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Google Maps Turn-by-Turn */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <Navigation size={16} />
              <span>Turn-by-Turn GPS Navigation</span>
            </a>

            {/* WhatsApp Customer */}
            {customerMobile && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Customer</span>
              </a>
            )}

            {/* Direct Phone Call */}
            {customerMobile && (
              <a
                href={`tel:${customerMobile}`}
                className="bg-gray-900 hover:bg-black text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
              >
                <Phone size={16} />
                <span>Call Customer ({customerMobile})</span>
              </a>
            )}
          </div>

          {/* Live Map */}
          <div className="rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden bg-white p-2">
            <Livemap
              customerLocation={{
                latitude: userlocation.latitude,
                longitude: userlocation.longitude,
              }}
              isDeliveryBoy={true}
            />
          </div>

          {/* Order Items Breakdown & OTP Verification */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Items Summary */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3">
              <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                <Package size={16} className="text-[#0f8646]" />
                <span>Produce Package ({orderObj.items?.length || 0} items)</span>
              </h3>

              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                {(orderObj.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100 p-0.5"
                        />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {item.quantity} × {item.unit}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm">
                <span>Order Total:</span>
                <span className="text-[#0f8646]">₹{totalAmount}</span>
              </div>
            </div>

            {/* OTP Verification & Complete Delivery Box */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                    <ShieldAlert size={16} className="text-[#0f8646]" />
                    <span>Doorstep OTP Verification</span>
                  </h3>

                  <button
                    onClick={async () => {
                      try {
                        const res = await axios.post(
                          `/api/delivery/send-delivery-otp/${activeorder.order._id}`
                        );
                        alert(res.data.message || "OTP sent to customer!");
                      } catch (error: any) {
                        alert(error?.response?.data?.message || "Failed to send OTP");
                      }
                    }}
                    className="text-xs font-bold text-[#0f8646] hover:underline cursor-pointer"
                  >
                    📩 Send / Resend OTP
                  </button>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Ask the customer for the 4-digit OTP sent to their mobile phone to verify handover.
                </p>

                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-Digit Customer OTP"
                  className="w-full text-center font-mono font-black text-xl tracking-widest border-2 border-dashed border-gray-300 focus:border-[#0f8646] p-3 rounded-2xl outline-none bg-gray-50/50 transition"
                />
              </div>

              <button
                onClick={async () => {
                  if (!otp.trim()) {
                    alert("Please enter the 4-digit OTP provided by the customer.");
                    return;
                  }
                  try {
                    const result = await axios.post("/api/delivery/verify-otp", {
                      orderId: activeorder.order._id,
                      otp,
                    });
                    alert(result.data.message || "Delivery Completed Successfully!");
                    window.location.reload();
                  } catch (error: any) {
                    alert(error.response?.data?.message || "Invalid OTP entered.");
                  }
                }}
                className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black py-3 rounded-2xl shadow-sm hover:shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Verify OTP & Mark Delivered</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Chat */}
        {activeorder?.order?._id && userdata && (
          <ChatButton
            orderId={activeorder.order._id}
            userId={userdata._id}
            deliveryBoyId={userdata._id}
          />
        )}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 to-white p-5 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between gap-3 mb-8 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-md">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Rider Delivery Portal
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Live Bhopal doorstep delivery dispatch & earnings
              </p>
            </div>
          </div>
        </div>

        {assignments.length === 0 ? (

          <>

           <DeliveryDashboardStats
  totalDeliveries={
    dashboardStats.totalDeliveries
  }
  totalEarnings={
    dashboardStats.totalEarnings
  }
  todayEarnings={
    dashboardStats.todayEarnings
  }
  earningPerDelivery={
    dashboardStats.earningPerDelivery
  }
/>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">

              <EarningsChart
                data={earningsData}
              />

              <DeliveriesChart
                data={deliveriesData}
              />

            </div>

            <div className="mt-8">

              <RecentDeliveries
                deliveries={recentDeliveries}
              />

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-10 text-center mt-8">

              <Package
                size={60}
                className="mx-auto text-gray-300 mb-4"
              />

              <h2 className="text-xl font-semibold">
                No Assignments
              </h2>

              <p className="text-gray-500 mt-2">
                Waiting for new delivery requests...
              </p>

            </div>

          </>

        ) : (



          <div className="grid md:grid-cols-2 gap-6">
            {assignments.map((a) => {
              const order = a.order

              return (
                <div
                  key={a._id}
                  className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden hover:shadow-xl transition"
                >
                  {/* Header */}
                  <div className="bg-green-600 text-white p-4 flex justify-between items-center">
                    <div>
                      <h2 className="font-bold">
                        New Assignment
                      </h2>

                      <p className="text-xs opacity-80">
                        #{order?._id?.slice(-6)}
                      </p>
                    </div>

                    <span className="bg-white text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      {a.status}
                    </span>
                  </div>

                  <div className="p-5">

                    {/* Customer */}
                    <div className="mb-4">
                      <h3 className="font-bold text-lg">
                        {order?.address?.fullname}
                      </h3>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-2 mb-3 text-gray-700">
                      <Phone
                        size={18}
                        className="text-green-600"
                      />
                      <span>
                        {order?.address?.mobile}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex gap-2 mb-3 text-gray-700">
                      <MapPin
                        size={18}
                        className="text-red-500 mt-1"
                      />

                      <span>
                        {order?.address?.fulladress}
                      </span>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-3 mt-5">

                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">
                          Items
                        </p>

                        <p className="font-bold text-green-700">
                          {order?.items?.length}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">
                          Amount
                        </p>

                        <p className="font-bold text-green-700">
                          Rs {order?.totalamount}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex gap-2 mt-4 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>
                        New delivery request
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          handleAccept(a._id)
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleReject(a._id)
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )

}

export default Deliveryboy
