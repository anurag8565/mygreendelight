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
  CreditCard,
  CheckCircle2,
  ShieldAlert,
  BarChart3,
  History,
  AlertCircle,
  RotateCw,
  Send,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import dynamic from 'next/dynamic'
const Livemap = dynamic(() => import('./Livemap'), { ssr: false })
import ChatButton from './ChatButton'
import EarningsChart from './EarningsChart'
import DeliveriesChart from './DeliveriesChart'
import RecentDeliveries from './RecentDeliveries'
import DeliveryDashboardStats from './DeliveryDashboardStats'
import { socket } from '@/lib/socket'

export default function Deliveryboy() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'requests' | 'earnings' | 'history'>('requests')
  const [activeorder, setactiverder] = useState<any>(null)
  const [userlocation, setuserlocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [otp, setOtp] = useState('')
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [sendingOtpEmail, setSendingOtpEmail] = useState(false)
  const [bagsReturned, setBagsReturned] = useState<number>(0)
  const [gpsActive, setGpsActive] = useState(false)

  const [earningsData, setEarningsData] = useState([])
  const [deliveriesData, setDeliveriesData] = useState([])
  const [recentDeliveries, setRecentDeliveries] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    earningPerDelivery: 100,
  })

  const { userdata } = useSelector((state: RootState) => state.user)

  // Listen for real-time socket events
  useEffect(() => {
    socket.on('new-assignment', (assignment) => {
      setAssignments((prev) => [assignment, ...prev])
      alert('🔔 New delivery order assignment received!')
    })

    return () => {
      socket.off('new-assignment')
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [earningsRes, deliveriesRes, recentRes, statsRes] = await Promise.all([
        axios.get('/api/delivery/earnings-chart').catch(() => ({ data: [] })),
        axios.get('/api/delivery/deliveries-chart').catch(() => ({ data: [] })),
        axios.get('/api/delivery/recent-deliveries').catch(() => ({ data: [] })),
        axios.get('/api/delivery/dashboard-stats').catch(() => ({ data: { stats: dashboardStats } })),
      ])

      if (earningsRes.data) setEarningsData(earningsRes.data)
      if (deliveriesRes.data) setDeliveriesData(deliveriesRes.data)
      if (recentRes.data) setRecentDeliveries(recentRes.data)
      if (statsRes.data?.stats) setDashboardStats(statsRes.data.stats)
    } catch (error) {
      console.log('Dashboard Data Fetch Error:', error)
    }
  }

  const fetchAssignments = async () => {
    try {
      const result = await axios.get('/api/delivery/getassigments')
      setAssignments(result.data.assignments || [])
    } catch (error) {
      console.log('Fetch assignments error:', error)
    }
  }

  const fetchCurrentOrder = async () => {
    try {
      setLoading(true)
      const result = await axios.get('/api/delivery/currentorder')
      if (result.data.active && result.data.assigment) {
        setactiverder(result.data.assigment)
        if (result.data.assigment.order?.address?.latitude) {
          setuserlocation({
            latitude: result.data.assigment.order.address.latitude,
            longitude: result.data.assigment.order.address.longitude,
          })
        }
      } else {
        setactiverder(null)
        setuserlocation(null)
      }
    } catch (error) {
      console.log('Fetch current order error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userdata) {
      fetchCurrentOrder()
      fetchAssignments()
      fetchDashboardData()
    }
  }, [userdata])

  // GPS Live Tracking streaming for active trip
  useEffect(() => {
    if (!activeorder) return
    let watchId: number | null = null
    let lastUpdate = 0

    if (navigator.geolocation) {
      setGpsActive(true)
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          const now = Date.now()
          if (now - lastUpdate > 8000) {
            lastUpdate = now
            axios
              .post('/api/delivery/updatelocation', { latitude, longitude })
              .catch(() => {})
          }
        },
        (err) => console.log('GPS watch error:', err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      )
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [activeorder])

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(`/api/delivery/assigment/${id}/accepyaccigment`)
      alert(result.data.message || 'Order accepted! Navigating to delivery trip...')
      setAssignments((prev) => prev.filter((a) => a._id !== id))
      fetchCurrentOrder()
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to accept assignment')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await axios.post('/api/delivery/reject', { id })
      alert('Assignment Rejected')
      setAssignments((prev) => prev.filter((a) => a._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.trim()
    if (!cleanOtp || cleanOtp.length < 4) {
      alert('Please enter the 4-digit verification OTP provided by the customer.')
      return
    }

    setVerifyingOtp(true)
    try {
      const result = await axios.post('/api/delivery/verify-otp', {
        orderId: activeorder.order._id,
        otp: cleanOtp,
        bagsReturned,
      })
      alert(result.data.message || '✅ Delivery Verified & Completed Successfully!')
      setactiverder(null)
      setuserlocation(null)
      setOtp('')
      fetchDashboardData()
      fetchAssignments()
      fetchCurrentOrder()
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Invalid OTP. Please ask the customer to confirm their 4-digit code.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleResendOtpEmail = async () => {
    if (!activeorder?.order?._id) return
    setSendingOtpEmail(true)
    try {
      const res = await axios.post(`/api/delivery/send-delivery-otp/${activeorder.order._id}`)
      alert(res.data.message || "✅ 4-Digit OTP has been dispatched to the customer's registered email!")
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to dispatch OTP email.')
    } finally {
      setSendingOtpEmail(false)
    }
  }

  // Active Delivery Trip View
  if (activeorder && userlocation) {
    const orderObj = activeorder.order || {}
    const customerName = orderObj.address?.fullname || 'Customer'
    const customerMobile = orderObj.address?.mobile || ''
    const customerAddress = orderObj.address?.fulladress || 'Bhopal Delivery Location'
    const orderShortId = String(orderObj._id || '').slice(-6).toUpperCase()
    const isPaid = orderObj.ispaid
    const totalAmount = orderObj.totalamount || 0
    const cleanMobile = customerMobile.replace(/\D/g, '').slice(-10)
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${userlocation.latitude},${userlocation.longitude}`

    // Rider sends arrival message asking customer for their OTP (Rider does not see or know the OTP)
    const arrivalWhatsappMsg = encodeURIComponent(
      `*🌿 SubziQuick Farm Fresh Express Delivery*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Namaste *${customerName}*! 🙏\n\n` +
      `Main aapka *SubziQuick Delivery Partner* aapke doorstep par taaza grocery leke pahunch gaya hoon.\n\n` +
      `📦 *Order ID:* #${orderShortId}\n` +
      `📍 *Address:* ${customerAddress}\n` +
      `💵 *Payment:* ${isPaid ? '✅ Paid Online (₹0 to pay)' : `💵 Collect Cash / UPI: ₹${totalAmount}`}\n\n` +
      `👉 Kripya delivery lete waqt apna *4-digit verification OTP* share karein jo aapko Email / Tracking link par mila hai.\n\n` +
      `Track Live: https://subziquick.in/track/${orderObj._id}\n` +
      `Dhanyawaad! 🌿`
    )
    const whatsappArrivalUrl = `https://wa.me/91${cleanMobile}?text=${arrivalWhatsappMsg}`

    return (
      <div className="p-4 pt-24 sm:pt-28 min-h-screen bg-[#f8faf9] font-sans pb-20">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Active Trip Header Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  🚀 Active Delivery Trip
                </span>
                {gpsActive && (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Live GPS Streaming</span>
                  </span>
                )}
                <span className="font-mono font-black text-sm text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">
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

            {/* Payment Collection Status */}
            <div
              className={`p-3.5 rounded-2xl border text-xs font-black shrink-0 ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                <CreditCard size={14} />
                <span>{isPaid ? 'Payment Verified' : 'Cash / UPI Collection'}</span>
              </div>
              <p className="text-sm">
                {isPaid
                  ? '✅ Paid Online (₹0 to collect)'
                  : `💵 Collect: ₹${totalAmount}`}
              </p>
            </div>
          </div>

          {/* Silent Delivery Banner */}
          {activeorder?.order?.isSilentDelivery && (
            <div className="bg-amber-500 text-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center font-black shrink-0 text-xl">
                🔕
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm uppercase tracking-wide">
                  SILENT DOORSTEP DROP — DO NOT RING BELL!
                </h4>
                <p className="text-xs text-amber-100 mt-0.5">
                  Customer requested quiet delivery. Place grocery bag neatly at the doorstep.
                  {activeorder.order.deliveryInstructions && (
                    <span className="block font-bold mt-1 text-white">
                      Instructions: "${activeorder.order.deliveryInstructions}"
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions (GPS Navigation + WhatsApp + Direct Phone Call) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <Navigation size={16} />
              <span>Turn-by-Turn GPS Map</span>
            </a>

            {customerMobile && (
              <a
                href={whatsappArrivalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>WhatsApp "I've Arrived"</span>
              </a>
            )}

            {customerMobile && (
              <a
                href={`tel:${customerMobile}`}
                className="bg-gray-900 hover:bg-black text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
              >
                <Phone size={16} />
                <span>Call Customer (${customerMobile})</span>
              </a>
            )}
          </div>

          {/* Live Customer Location Map */}
          <div className="rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden bg-white p-2">
            <Livemap
              customerLocation={{
                latitude: userlocation.latitude,
                longitude: userlocation.longitude,
              }}
              isDeliveryBoy={true}
            />
          </div>

          {/* Order Produce Breakdown & Doorstep OTP Verification */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Package Contents */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3">
              <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                <Package size={16} className="text-[#0f8646]" />
                <span>Produce Package ({orderObj.items?.length || 0} items)</span>
              </h3>

              <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto pr-1">
                {(orderObj.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-contain bg-gray-50 border border-gray-100 p-0.5"
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
                <span>Total Amount:</span>
                <span className="text-[#0f8646]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Zero-Knowledge Secure OTP Handover */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                    <ShieldAlert size={16} className="text-[#0f8646]" />
                    <span>Doorstep OTP Verification</span>
                  </h3>

                  <button
                    onClick={handleResendOtpEmail}
                    disabled={sendingOtpEmail}
                    className="text-[11px] font-extrabold bg-emerald-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white border border-emerald-300 px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Send size={11} />
                    <span>{sendingOtpEmail ? 'Sending...' : '📩 Resend Email OTP'}</span>
                  </button>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 mb-3 text-xs text-amber-900 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold mb-0.5 text-amber-950">
                    <AlertCircle size={14} />
                    <span>Customer Secret Code</span>
                  </div>
                  Ask the customer for the <strong>4-digit OTP</strong> shown on their tracking screen or registered email.
                </div>

                {/* 4-Digit Verification Input */}
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center font-mono font-black text-2xl tracking-[0.4em] border-2 border-dashed border-gray-300 focus:border-[#0f8646] p-3 rounded-2xl outline-none bg-gray-50/50 transition mb-3 placeholder:tracking-normal placeholder:text-base placeholder:font-sans"
                />

                {/* ♻️ Zero-Plastic Eco-Bag Return Counter */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3 text-left mb-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-extrabold text-xs text-emerald-900">
                      ♻️ Eco-Bags Returned by Customer
                    </span>
                    <span className="text-[10px] font-black bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                      ₹10 / Bag Reward
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="text-xs font-bold text-gray-700">Collected Count:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBagsReturned((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm flex items-center justify-center transition cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-sm text-emerald-800 w-4 text-center">
                        {bagsReturned}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBagsReturned((prev) => prev + 1)}
                        className="w-7 h-7 rounded-lg bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black text-sm flex items-center justify-center transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={verifyingOtp}
                className="w-full bg-[#0f8646] hover:bg-[#0c6a38] disabled:bg-gray-400 text-white font-black py-3.5 rounded-2xl shadow-sm hover:shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={18} />
                <span>{verifyingOtp ? 'Verifying OTP...' : 'Verify OTP & Mark Delivered'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* In-Trip Live Chat */}
        {activeorder?.order?._id && userdata && (
          <ChatButton
            orderId={activeorder.order._id}
            userId={userdata._id}
            deliveryBoyId={userdata._id}
          />
        )}
      </div>
    )
  }

  // Delivery Partner Standby Portal (Tabs: Requests | Earnings | History)
  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 sm:p-8 pt-24 sm:pt-28 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0f8646] to-emerald-400 text-white flex items-center justify-center shadow-md shrink-0">
              <Truck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                  Partner Duty Online
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
                Rider Delivery Portal
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                SubziQuick 10-15 Min Express Dispatch Hub • Bhopal
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              fetchAssignments()
              fetchDashboardData()
              fetchCurrentOrder()
            }}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-2xl text-xs transition cursor-pointer self-start md:self-auto"
          >
            <RotateCw size={14} />
            <span>Refresh Feed</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-200/60 rounded-2xl border border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Truck size={16} className={activeTab === 'requests' ? 'text-[#0f8646]' : ''} />
            <span>Live Requests</span>
            {assignments.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                {assignments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={16} className={activeTab === 'earnings' ? 'text-[#0f8646]' : ''} />
            <span>Earnings & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History size={16} className={activeTab === 'history' ? 'text-[#0f8646]' : ''} />
            <span>Delivery History</span>
          </button>
        </div>

        {/* Tab Content: Live Requests */}
        {activeTab === 'requests' && (
          <div>
            {assignments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0f8646] flex items-center justify-center mx-auto">
                  <Package size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">No Pending Requests Right Now</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                    You are online! New order broadcast notifications in Bhopal will instantly appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {assignments.map((a) => {
                  const order = a.order || {}
                  return (
                    <div
                      key={a._id}
                      className="bg-white rounded-3xl shadow-xs border border-gray-200/80 overflow-hidden hover:border-[#0f8646] transition"
                    >
                      <div className="bg-[#0f8646] text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Package size={16} />
                          <span className="font-black text-sm">New Delivery Request</span>
                        </div>
                        <span className="bg-white/20 text-white font-mono text-xs px-2.5 py-0.5 rounded-full font-black">
                          #{String(order._id || '').slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h4 className="font-black text-base text-gray-900">
                            {order?.address?.fullname || 'Customer'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5">
                            <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <span>{order?.address?.fulladress || 'Bhopal Address'}</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                          <div className="bg-gray-50 p-3 rounded-2xl">
                            <p className="text-[11px] text-gray-400 font-bold uppercase">Items</p>
                            <p className="font-black text-sm text-gray-900 mt-0.5">
                              {order?.items?.length || 0} produce items
                            </p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-2xl">
                            <p className="text-[11px] text-emerald-700 font-bold uppercase">Amount</p>
                            <p className="font-black text-sm text-[#0f8646] mt-0.5">
                              ₹{order?.totalamount || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => handleAccept(a._id)}
                            className="flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3 rounded-2xl font-black text-xs transition cursor-pointer shadow-xs"
                          >
                            Accept & Start Trip
                          </button>
                          <button
                            onClick={() => handleReject(a._id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-2xl font-black text-xs transition cursor-pointer"
                          >
                            Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Earnings & Stats */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <DeliveryDashboardStats
              totalDeliveries={dashboardStats.totalDeliveries}
              totalEarnings={dashboardStats.totalEarnings}
              todayEarnings={dashboardStats.todayEarnings}
              earningPerDelivery={dashboardStats.earningPerDelivery}
            />

            <div className="grid lg:grid-cols-2 gap-6">
              <EarningsChart data={earningsData} />
              <DeliveriesChart data={deliveriesData} />
            </div>
          </div>
        )}

        {/* Tab Content: Delivery History */}
        {activeTab === 'history' && (
          <div>
            <RecentDeliveries deliveries={recentDeliveries} />
          </div>
        )}
      </div>
    </div>
  )
}
