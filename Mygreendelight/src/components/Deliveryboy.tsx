'use client'

import axios from 'axios'
import React, { useEffect, useState, useCallback, useRef } from 'react'
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
  LogOut,
  Store,
  MessageSquare,
  Volume2,
  Check,
  X,
  User,
  ExternalLink,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const Livemap = dynamic(() => import('./Livemap'), { ssr: false })
import ChatBox from './ChatBox'
import EarningsChart from './EarningsChart'
import DeliveriesChart from './DeliveriesChart'
import RecentDeliveries from './RecentDeliveries'
import DeliveryDashboardStats from './DeliveryDashboardStats'
import { socket } from '@/lib/socket'

interface Props {
  initialUser?: any;
}

// 🔔 Web Audio API Synthesizer Chime (Zero external audio asset dependencies)
function playDispatchChime() {
  try {
    if (typeof window === 'undefined') return
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(880, now + 0.12) // A5
    osc.frequency.setValueAtTime(1174.66, now + 0.24) // D6

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.6)
  } catch (_) {}
}

export default function Deliveryboy({ initialUser }: Props) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'requests' | 'earnings' | 'history'>('requests')
  const [activeorder, setactiverder] = useState<any>(null)
  const [userlocation, setuserlocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [sendingOtpEmail, setSendingOtpEmail] = useState(false)
  const [bagsReturned, setBagsReturned] = useState<number>(0)
  const [gpsActive, setGpsActive] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // 4-Digit PIN Box Inputs
  const [pin, setPin] = useState(['', '', '', ''])
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  // Native Toast Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

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

  // Socket listener for real-time delivery dispatches
  useEffect(() => {
    socket.on('new-assignment', (assignment) => {
      setAssignments((prev) => [assignment, ...prev])
      playDispatchChime()
      showToast('🔔 New express delivery request received!', 'info')
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
      showToast(result.data?.message || 'Trip accepted! Starting live navigation...', 'success')
      setAssignments((prev) => prev.filter((a) => a._id !== id))
      fetchCurrentOrder()
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Failed to accept assignment', 'error')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await axios.post('/api/delivery/reject', { id })
      showToast('Assignment passed', 'info')
      setAssignments((prev) => prev.filter((a) => a._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  // Handle PIN input box typing and auto-advancement
  const handlePinChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const newPin = [...pin]
    newPin[index] = digit
    setPin(newPin)

    if (digit && index < 3) {
      pinRefs[index + 1].current?.focus()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus()
    }
  }

  const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pastedData) return

    const newPin = ['', '', '', '']
    for (let i = 0; i < pastedData.length; i++) {
      newPin[i] = pastedData[i]
    }
    setPin(newPin)
    const focusIndex = Math.min(3, pastedData.length)
    pinRefs[focusIndex].current?.focus()
  }

  const handleVerifyOtp = async () => {
    const cleanOtp = pin.join('').trim()
    if (!cleanOtp || cleanOtp.length < 4) {
      showToast('Please enter the full 4-digit OTP provided by the customer.', 'error')
      return
    }

    setVerifyingOtp(true)
    try {
      const result = await axios.post('/api/delivery/verify-otp', {
        orderId: activeorder.order._id,
        otp: cleanOtp,
        bagsReturned,
      })
      showToast(result.data?.message || '🎉 Delivery Handover Completed Successfully!', 'success')
      setactiverder(null)
      setuserlocation(null)
      setPin(['', '', '', ''])
      setBagsReturned(0)
      handleRefreshAll()
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Invalid OTP. Please verify the 4 digits with the customer.', 'error')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleResendOtpEmail = async () => {
    if (!activeorder?.order?._id) return
    setSendingOtpEmail(true)
    try {
      const res = await axios.post(`/api/delivery/send-delivery-otp/${activeorder.order._id}`)
      showToast(res.data?.message || "✅ 4-Digit OTP has been dispatched to the customer's email!", 'success')
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Failed to send OTP email.', 'error')
    } finally {
      setSendingOtpEmail(false)
    }
  }

  // Dedicated Header
  const renderRiderHeader = () => (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Duty Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0f8646] to-emerald-400 text-white flex items-center justify-center font-black shadow-sm shrink-0">
            <Truck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-gray-900 leading-tight">SubziQuick Partner</span>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Duty Online
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold truncate max-w-[160px] sm:max-w-xs">
              {currentUser?.name || 'Rider Hub'} • Bhopal Express Hub
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
            title="Refresh Feed"
          >
            <RotateCw size={15} className={refreshing ? 'animate-spin text-[#0f8646]' : ''} />
          </button>

          <Link
            href="/user"
            className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition"
            title="Account Hub"
          >
            <User size={13} />
            <span className="hidden sm:inline">Account</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 flex items-center justify-center transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )

  // Floating Native Toast
  const renderToast = () => {
    if (!toast) return null
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in fade-in slide-in-from-top-3 duration-200">
        <div
          className={`p-3.5 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-black backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-900/95 text-white border-emerald-500'
              : toast.type === 'error'
              ? 'bg-red-900/95 text-white border-red-500'
              : 'bg-gray-900/95 text-white border-gray-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}
          {toast.type === 'info' && <Sparkles size={16} className="text-yellow-400 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-white/60 hover:text-white">
            <X size={14} />
          </button>
        </div>
      </div>
    )
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
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${userlocation.latitude},${userlocation.longitude}&travelmode=driving`

    const arrivalWhatsappMsg = encodeURIComponent(
      `*🌿 SubziQuick Farm Fresh Express Delivery*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Namaste *${customerName}*! 🙏\n\n` +
      `Main aapka *SubziQuick Delivery Partner* aapke doorstep par taaza grocery leke pahunch gaya hoon.\n\n` +
      `📦 *Order ID:* #${orderShortId}\n` +
      `📍 *Address:* ${customerAddress}\n` +
      `💵 *Payment:* ${isPaid ? '✅ Paid Online (₹0 to pay)' : `💵 Collect Cash / UPI: ₹${totalAmount}`}\n\n` +
      `👉 Kripya delivery lete waqt apna *4-digit verification OTP* share karein taaki order handover complete ho sake.\n\n` +
      `Live Tracking: https://subziquick.in/track/${orderObj._id}\n` +
      `Dhanyawaad! 🌿`
    )
    const whatsappArrivalUrl = `https://wa.me/91${cleanMobile}?text=${arrivalWhatsappMsg}`

    return (
      <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
        {renderRiderHeader()}
        {renderToast()}

        <main className="flex-1 max-w-3xl w-full mx-auto p-3.5 sm:p-6 space-y-4 pb-24">
          
          {/* Active Trip Header Card */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
                  Trip In Progress
                </span>
                <span className="font-mono font-black text-xs text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg">
                  #{orderShortId}
                </span>
              </div>

              {gpsActive && (
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Radio size={11} className="animate-pulse" />
                  <span>GPS Streaming</span>
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {customerName}
              </h2>
              <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5 leading-relaxed">
                <MapPin size={14} className="text-[#0f8646] shrink-0 mt-0.5" />
                <span>{customerAddress}</span>
              </p>
            </div>

            {/* Payment Badge */}
            <div
              className={`p-3.5 rounded-2xl border text-xs font-black ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">
                {isPaid ? 'Payment Status' : 'Cash / UPI Collection Required'}
              </div>
              <div className="text-base font-black">
                {isPaid ? '✅ Paid Online (₹0 to collect)' : `💵 Collect Cash: ₹${totalAmount}`}
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

          {/* 4 Clean Thumb Actions Grid (Zero collisions) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center"
            >
              <Compass size={20} />
              <span>Turn-by-Turn GPS</span>
            </a>

            {customerMobile ? (
              <a
                href={whatsappArrivalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center"
              >
                <MessageCircle size={20} />
                <span>WhatsApp Notice</span>
              </a>
            ) : null}

            {customerMobile ? (
              <a
                href={`tel:${customerMobile}`}
                className="bg-gray-900 hover:bg-black text-white p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center"
              >
                <Phone size={20} />
                <span>Call Customer</span>
              </a>
            ) : null}

            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-emerald-100 hover:bg-emerald-200 text-[#0f8646] p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center border border-emerald-300"
            >
              <MessageSquare size={20} />
              <span>In-App Chat</span>
            </button>
          </div>

          {/* Compact Live Map */}
          <div className="rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden bg-white p-3">
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
                  <span>Order Items ({orderObj.items?.length || 0})</span>
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

            {/* Zero-Knowledge Doorstep 4-Box PIN Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-black text-sm text-gray-900">
                    <ShieldAlert size={16} className="text-[#0f8646]" />
                    <span>Customer 4-Digit OTP</span>
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
                  Ask customer for the 4-digit PIN on their screen or email:
                </p>

                {/* 4 Discrete PIN Input Boxes */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={pinRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePinPaste : undefined}
                      className={`w-12 h-14 text-center font-mono font-black text-2xl rounded-2xl border-2 outline-none transition bg-gray-50/70 ${
                        digit
                          ? 'border-[#0f8646] bg-emerald-50/40 text-gray-900'
                          : 'border-gray-200 focus:border-[#0f8646]'
                      }`}
                    />
                  ))}
                </div>

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
        </main>

        {/* Modal In-App Chat */}
        {isChatOpen && activeorder?.order?._id && currentUser?._id && (
          <ChatBox
            orderId={activeorder.order._id}
            userId={currentUser._id}
            deliveryBoyId={currentUser._id}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    )
  }

  // ==========================================
  // VIEW 2: DELIVERY PARTNER STANDBY DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      {renderRiderHeader()}
      {renderToast()}

      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6 space-y-4 pb-24">
        
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

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80 shadow-xs">
            <Loader2 size={28} className="animate-spin text-[#0f8646] mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-bold">Connecting to dispatch server...</p>
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
                  <h3 className="text-base font-black text-gray-900">No Pending Requests</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    Your duty is online. New orders dispatched near your location in Bhopal will appear here.
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
      </main>
    </div>
  )
}
