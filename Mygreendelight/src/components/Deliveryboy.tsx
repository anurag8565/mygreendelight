'use client'

import axios from 'axios'
import React, { useEffect, useState, useCallback } from 'react'
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
  RotateCw,
  Send,
  Sparkles,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Compass,
  Radio,
  ShoppingBag,
  Loader2,
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

interface Props {
  initialUser?: any;
}

export default function Deliveryboy({ initialUser }: Props) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'requests' | 'earnings' | 'history'>('requests')
  const [activeorder, setactiverder] = useState<any>(null)
  const [userlocation, setuserlocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
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
  const currentUser = initialUser || userdata

  // Socket notification for incoming broadcasts
  useEffect(() => {
    socket.on('new-assignment', (assignment) => {
      setAssignments((prev) => [assignment, ...prev])
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200])
      }
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
      setAssignments(result.data?.assignments || [])
    } catch (error) {
      console.log('Fetch assignments error:', error)
    }
  }

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get('/api/delivery/currentorder')
      if (result.data?.active && result.data?.assigment) {
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
    }
  }

  const handleRefreshAll = useCallback(async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchAssignments(),
        fetchDashboardData(),
        fetchCurrentOrder(),
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Always fetch on component mount!
  useEffect(() => {
    handleRefreshAll()
  }, [handleRefreshAll])

  // Real-time GPS stream during active delivery trip
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
        (err) => console.log('GPS tracking notice:', err),
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
      setAssignments((prev) => prev.filter((a) => a._id !== id))
      fetchCurrentOrder()
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to accept assignment')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await axios.post('/api/delivery/reject', { id })
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
      alert(result.data?.message || '🎉 Delivery Handover Completed Successfully!')
      setactiverder(null)
      setuserlocation(null)
      setOtp('')
      setBagsReturned(0)
      handleRefreshAll()
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Invalid OTP. Please verify the 4 digits with the customer.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleResendOtpEmail = async () => {
    if (!activeorder?.order?._id) return
    setSendingOtpEmail(true)
    try {
      const res = await axios.post(`/api/delivery/send-delivery-otp/${activeorder.order._id}`)
      alert(res.data?.message || "✅ 4-Digit OTP has been dispatched to the customer's email!")
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to send OTP email.')
    } finally {
      setSendingOtpEmail(false)
    }
  }

  // ==========================================
  // VIEW 1: ACTIVE DELIVERY TRIP IN PROGRESS
  // ==========================================
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

    const arrivalWhatsappMsg = encodeURIComponent(
      `*🌿 SubziQuick Farm Fresh Express Delivery*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Namaste *${customerName}*! 🙏\n\n` +
      `Main aapka *SubziQuick Delivery Partner* aapke doorstep par taaza grocery leke pahunch gaya hoon.\n\n` +
      `📦 *Order ID:* #${orderShortId}\n` +
      `📍 *Address:* ${customerAddress}\n` +
      `💵 *Payment:* ${isPaid ? '✅ Paid Online (₹0 Collect)' : `💵 Collect Cash / UPI: ₹${totalAmount}`}\n\n` +
      `👉 Kripya apna *4-digit delivery verification OTP* share karein taaki handover complete ho sake.\n\n` +
      `Live Tracking: https://subziquick.in/track/${orderObj._id}\n` +
      `Dhanyawaad! 🌿`
    )
    const whatsappArrivalUrl = `https://wa.me/91${cleanMobile}?text=${arrivalWhatsappMsg}`

    return (
      <div className="font-sans pb-24 px-3 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Top Status Header */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
                  Trip In Progress
                </span>
                <span className="font-mono font-black text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                  #{orderShortId}
                </span>
                {gpsActive && (
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Radio size={11} className="animate-pulse" />
                    <span>GPS Online</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 tracking-tight">
                {customerName}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1.5">
                <MapPin size={13} className="text-[#0f8646] shrink-0 mt-0.5" />
                <span>{customerAddress}</span>
              </p>
            </div>

            {/* Payment Badge */}
            <div
              className={`p-3.5 rounded-2xl border text-xs font-black shrink-0 ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">
                {isPaid ? 'Payment Status' : 'Cash / UPI Collection'}
              </div>
              <div className="text-sm font-black">
                {isPaid ? '✅ Paid Online (₹0)' : `💵 Collect ₹${totalAmount}`}
              </div>
            </div>
          </div>

          {/* Silent Delivery Instruction Card */}
          {activeorder?.order?.isSilentDelivery && (
            <div className="bg-amber-500 text-white p-4 rounded-3xl shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center font-black text-xl shrink-0">
                🔕
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider">
                  Silent Delivery — Please Do Not Ring Bell
                </h4>
                <p className="text-xs text-amber-100 mt-0.5">
                  Drop produce safely at the doorstep.
                  {activeorder.order.deliveryInstructions && (
                    <span className="font-bold text-white block mt-0.5">
                      Note: "{activeorder.order.deliveryInstructions}"
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* 1-Tap Thumb Action Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white p-3.5 rounded-2xl font-black text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition shadow-xs cursor-pointer text-center"
            >
              <Compass size={18} />
              <span>GPS Map</span>
            </a>

            {customerMobile ? (
              <a
                href={whatsappArrivalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-2xl font-black text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition shadow-xs cursor-pointer text-center"
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a>
            ) : null}

            {customerMobile ? (
              <a
                href={`tel:${customerMobile}`}
                className="bg-gray-900 hover:bg-black text-white p-3.5 rounded-2xl font-black text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition shadow-xs cursor-pointer text-center"
              >
                <Phone size={18} />
                <span>Call</span>
              </a>
            ) : null}
          </div>

          {/* Interactive Live Map */}
          <div className="rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden bg-white p-2">
            <Livemap
              customerLocation={{
                latitude: userlocation.latitude,
                longitude: userlocation.longitude,
              }}
              isDeliveryBoy={true}
            />
          </div>

          {/* Produce Items & OTP Verification */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Produce Bag Items */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm text-gray-900">
                  <ShoppingBag size={16} className="text-[#0f8646]" />
                  <span>Order Produce ({orderObj.items?.length || 0})</span>
                </div>
                <span className="font-mono font-black text-xs text-[#0f8646]">
                  ₹{totalAmount}
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                {(orderObj.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100 p-0.5 shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{item.name}</p>
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
            </div>

            {/* Zero-Knowledge Doorstep OTP Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-black text-sm text-gray-900">
                    <ShieldAlert size={16} className="text-[#0f8646]" />
                    <span>Customer OTP</span>
                  </div>
                  <button
                    onClick={handleResendOtpEmail}
                    disabled={sendingOtpEmail}
                    className="text-[11px] font-extrabold bg-emerald-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white border border-emerald-200 px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <Send size={10} />
                    <span>{sendingOtpEmail ? 'Sending...' : 'Email OTP'}</span>
                  </button>
                </div>

                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Ask customer for the <strong>4-digit code</strong> from their email or live tracking page.
                </p>

                {/* OTP Input */}
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center font-mono font-black text-2xl tracking-[0.4em] border-2 border-dashed border-gray-300 focus:border-[#0f8646] p-3 rounded-2xl outline-none bg-gray-50/50 transition mb-3 placeholder:tracking-normal placeholder:text-base placeholder:font-sans"
                />

                {/* Eco-Bag Return Counter */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-950 block">♻️ Eco-Bags Collected</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">+₹10 reward/bag</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white px-2 py-1 rounded-xl border border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setBagsReturned((p) => Math.max(0, p - 1))}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs flex items-center justify-center transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-sm text-emerald-800 w-3 text-center">
                      {bagsReturned}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBagsReturned((p) => p + 1)}
                      className="w-6 h-6 rounded-lg bg-[#0f8646] text-white font-black text-xs flex items-center justify-center transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Complete Delivery Action */}
              <button
                onClick={handleVerifyOtp}
                disabled={verifyingOtp}
                className="w-full bg-[#0f8646] hover:bg-[#0c6a38] disabled:bg-gray-400 text-white font-black py-3.5 rounded-2xl shadow-sm hover:shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>{verifyingOtp ? 'Verifying...' : 'Verify OTP & Mark Delivered'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        {activeorder?.order?._id && currentUser?._id && (
          <ChatButton
            orderId={activeorder.order._id}
            userId={currentUser._id}
            deliveryBoyId={currentUser._id}
          />
        )}
      </div>
    )
  }

  // ==========================================
  // VIEW 2: DELIVERY PARTNER STANDBY DASHBOARD
  // ==========================================
  return (
    <div className="font-sans pb-24 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* Sleek Header & Duty Online Pill */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0f8646] to-emerald-400 text-white flex items-center justify-center shadow-md shadow-emerald-700/10 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
                  Partner Duty Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {currentUser?.name ? `Namaste, ${currentUser.name}!` : 'Rider Dashboard'}
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                Bhopal Express 10-15 Min Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-2 rounded-2xl text-xs transition cursor-pointer"
            >
              <RotateCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Minimalist Segmented Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-gray-200/70 rounded-2xl border border-gray-200 backdrop-blur-xs">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Truck size={14} className={activeTab === 'requests' ? 'text-[#0f8646]' : ''} />
            <span>Requests</span>
            {assignments.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                {assignments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={14} className={activeTab === 'earnings' ? 'text-[#0f8646]' : ''} />
            <span>Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <History size={14} className={activeTab === 'history' ? 'text-[#0f8646]' : ''} />
            <span>History</span>
          </button>
        </div>

        {/* Loading Spinner during initial fetch */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80 shadow-xs">
            <Loader2 size={28} className="animate-spin text-[#0f8646] mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-bold">Connecting to Bhopal dispatch server...</p>
          </div>
        )}

        {/* TAB 1: LIVE REQUESTS */}
        {!loading && activeTab === 'requests' && (
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-200/80 shadow-xs space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center mx-auto">
                  <Package size={26} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Waiting for New Requests</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    Your duty is online. New broadcast orders near your location in Bhopal will alert here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {assignments.map((a) => {
                  const order = a.order || {}
                  const shortId = String(order._id || '').slice(-6).toUpperCase()

                  return (
                    <div
                      key={a._id}
                      className="bg-white rounded-3xl shadow-xs border-2 border-emerald-500/20 hover:border-emerald-500 overflow-hidden transition duration-200 flex flex-col justify-between"
                    >
                      <div className="p-5 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-xs text-[#0f8646] bg-emerald-50 px-2.5 py-1 rounded-lg">
                            #{shortId}
                          </span>
                          <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Express Dispatch
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-base text-gray-900">
                            {order?.address?.fullname || 'Customer'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5">
                            <MapPin size={13} className="text-red-500 shrink-0 mt-0.5" />
                            <span>{order?.address?.fulladress || 'Bhopal Address'}</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                          <div className="bg-gray-50 p-2.5 rounded-2xl">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Items</span>
                            <span className="font-black text-xs text-gray-900">
                              {order?.items?.length || 0} produce
                            </span>
                          </div>
                          <div className="bg-emerald-50 p-2.5 rounded-2xl">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Bill</span>
                            <span className="font-black text-xs text-[#0f8646]">
                              ₹{order?.totalamount || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex gap-2">
                        <button
                          onClick={() => handleAccept(a._id)}
                          className="flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3 rounded-2xl font-black text-xs transition cursor-pointer shadow-xs"
                        >
                          Accept Trip
                        </button>
                        <button
                          onClick={() => handleReject(a._id)}
                          className="bg-white hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl font-black text-xs transition cursor-pointer border border-gray-200"
                        >
                          Pass
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EARNINGS & STATS */}
        {!loading && activeTab === 'earnings' && (
          <div className="space-y-4">
            <DeliveryDashboardStats
              totalDeliveries={dashboardStats.totalDeliveries}
              totalEarnings={dashboardStats.totalEarnings}
              todayEarnings={dashboardStats.todayEarnings}
              earningPerDelivery={dashboardStats.earningPerDelivery}
            />

            <div className="grid lg:grid-cols-2 gap-4">
              <EarningsChart data={earningsData} />
              <DeliveriesChart data={deliveriesData} />
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERY HISTORY */}
        {!loading && activeTab === 'history' && (
          <div>
            <RecentDeliveries deliveries={recentDeliveries} />
          </div>
        )}
      </div>
    </div>
  )
}
