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
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertCircle,
  Compass,
  Radio,
  ShoppingBag,
  Loader2,
  LogOut,
  Store,
  MessageSquare,
  User,
  X,
  Power,
  Zap,
  HelpCircle,
  IndianRupee,
  Activity,
  Headphones,
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

// 🔔 Web Audio API Synthesizer Chime
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
  const [activeTripExpanded, setActiveTripExpanded] = useState(true)

  // Real Database-backed Online/Offline Duty State
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [togglingDuty, setTogglingDuty] = useState(false)

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

  // Fetch initial online duty state from backend
  const fetchDutyState = async () => {
    try {
      const res = await axios.get('/api/delivery/toggle-duty')
      if (res.data?.success && typeof res.data.isonline === 'boolean') {
        setIsOnline(res.data.isonline)
      }
    } catch (_) {}
  }

  // Toggle Duty Online/Offline
  const handleToggleDuty = async () => {
    setTogglingDuty(true)
    try {
      const res = await axios.post('/api/delivery/toggle-duty', { isonline: !isOnline })
      if (res.data?.success) {
        setIsOnline(res.data.isonline)
        showToast(res.data.message, res.data.isonline ? 'success' : 'info')
        if (res.data.isonline) {
          handleRefreshAll()
        }
      }
    } catch (err: any) {
      showToast('Failed to update duty state', 'error')
    } finally {
      setTogglingDuty(false)
    }
  }

  // Socket listener for real-time delivery dispatches
  useEffect(() => {
    socket.on('new-assignment', (assignment) => {
      if (!isOnline) return // Ignore if driver is in rest mode
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
  }, [isOnline])

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
        fetchDutyState(),
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

  // Real-time GPS stream during active delivery trip (only if driver is online)
  useEffect(() => {
    if (!activeorder || !isOnline) return
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
  }, [activeorder, isOnline])

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(`/api/delivery/assigment/${id}/accepyaccigment`)
      showToast(result.data?.message || 'Trip accepted! Starting live navigation...', 'success')
      setAssignments((prev) => prev.filter((a) => a._id !== id))
      await fetchCurrentOrder()
      setActiveTab('requests')
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
      setActiveTab('requests')
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

  // Floating Toast
  const renderToast = () => {
    if (!toast) return null
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in fade-in slide-in-from-top-3 duration-200">
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
  // REAL PRODUCTION HEADER & SHIFT COCKPIT
  // ==========================================
  const renderProductionHeader = () => (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Row 1: Brand, Duty Toggle Switch & Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Driver Avatar & Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0f8646] to-emerald-400 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <Truck size={22} />}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-gray-900 leading-tight">
                  {currentUser?.name || 'Rider'}
                </span>
                <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                  Partner
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-[#0f8646]" />
                <span>Bhopal Central Hub</span>
              </p>
            </div>
          </div>

          {/* Real Interactive Duty Online/Offline Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDuty}
              disabled={togglingDuty}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-black text-xs transition cursor-pointer shadow-xs border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
              title="Toggle Duty Status"
            >
              <Power size={14} className={isOnline ? 'text-emerald-600' : 'text-gray-400'} />
              <span>{isOnline ? 'Duty Online' : 'Duty Offline'}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-600 animate-ping' : 'bg-gray-400'
                }`}
              />
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
              title="Refresh Dashboard"
            >
              <RotateCw size={15} className={refreshing ? 'animate-spin text-[#0f8646]' : ''} />
            </button>

            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 flex items-center justify-center transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Row 2: Live Shift Quick Metric Pills */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-gray-100">
          <div className="bg-emerald-50/70 p-2 rounded-xl text-center border border-emerald-100">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 block">Today's Payout</span>
            <span className="font-black text-xs sm:text-sm text-[#0f8646]">
              ₹{dashboardStats.todayEarnings}
            </span>
          </div>

          <div className="bg-blue-50/70 p-2 rounded-xl text-center border border-blue-100">
            <span className="text-[10px] font-extrabold uppercase text-blue-800 block">Trips Done</span>
            <span className="font-black text-xs sm:text-sm text-blue-800">
              {Math.round(dashboardStats.todayEarnings / 100)} Orders
            </span>
          </div>

          <div className="bg-gray-50 p-2 rounded-xl text-center border border-gray-200">
            <span className="text-[10px] font-extrabold uppercase text-gray-500 block">Base Rate</span>
            <span className="font-black text-xs sm:text-sm text-gray-800">
              ₹100<span className="text-[10px] font-normal text-gray-400">/trip</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  // Render Active Trip Cockpit Section
  const renderActiveTripCard = () => {
    if (!activeorder) return null
    const orderObj = activeorder.order || {}
    const customerName = orderObj.address?.fullname || 'Customer'
    const customerMobile = orderObj.address?.mobile || ''
    const customerAddress = orderObj.address?.fulladress || 'Bhopal Delivery Location'
    const orderShortId = String(orderObj._id || '').slice(-6).toUpperCase()
    const isPaid = orderObj.ispaid
    const totalAmount = orderObj.totalamount || 0
    const cleanMobile = customerMobile.replace(/\D/g, '').slice(-10)
    const userLat = userlocation?.latitude || orderObj.address?.latitude || 23.259933
    const userLng = userlocation?.longitude || orderObj.address?.longitude || 77.412613
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${userLat},${userLng}&travelmode=driving`

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
      <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-emerald-500/40 space-y-4">
        {/* Card Header with Collapsible Toggle */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
              Active Trip In Progress
            </span>
            <span className="font-mono font-black text-xs text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg">
              #{orderShortId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {gpsActive && (
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Radio size={11} className="animate-pulse" />
                <span>GPS Live</span>
              </span>
            )}
            <button
              onClick={() => setActiveTripExpanded(!activeTripExpanded)}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
            >
              {activeTripExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Customer & Address */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {customerName}
          </h2>
          <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5 leading-relaxed">
            <MapPin size={14} className="text-[#0f8646] shrink-0 mt-0.5" />
            <span>{customerAddress}</span>
          </p>
        </div>

        {/* Payment Banner */}
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

        {/* Expandable Cockpit Details */}
        {activeTripExpanded && (
          <div className="space-y-4 pt-2 border-t border-gray-100">
            {/* Silent Delivery Alert */}
            {activeorder?.order?.isSilentDelivery && (
              <div className="bg-amber-500 text-white p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center font-black text-lg shrink-0">
                  🔕
                </div>
                <div className="text-xs">
                  <span className="font-black block uppercase">Silent Delivery — Do Not Ring Bell</span>
                  <span className="text-amber-100">Drop produce safely at the doorstep.</span>
                  {activeorder.order.deliveryInstructions && (
                    <span className="block font-bold text-white mt-0.5">
                      Note: "{activeorder.order.deliveryInstructions}"
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 4 Clean Thumb Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center"
              >
                <Compass size={18} />
                <span>Turn-by-Turn GPS</span>
              </a>

              {customerMobile ? (
                <a
                  href={whatsappArrivalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Notice</span>
                </a>
              ) : null}

              {customerMobile ? (
                <a
                  href={`tel:${customerMobile}`}
                  className="bg-gray-900 hover:bg-black text-white p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center"
                >
                  <Phone size={18} />
                  <span>Call Customer</span>
                </a>
              ) : null}

              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-emerald-100 hover:bg-emerald-200 text-[#0f8646] p-3.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center border border-emerald-300"
              >
                <MessageSquare size={18} />
                <span>In-App Chat</span>
              </button>
            </div>

            {/* Live Map */}
            {userlocation && (
              <div className="rounded-2xl border border-gray-200 shadow-xs overflow-hidden bg-white p-2">
                <Livemap
                  customerLocation={{
                    latitude: userlocation.latitude,
                    longitude: userlocation.longitude,
                  }}
                  isDeliveryBoy={true}
                />
              </div>
            )}

            {/* Produce Bag Items & Doorstep OTP Verification */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Package Breakdown */}
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-xs text-gray-900">
                    <ShoppingBag size={15} className="text-[#0f8646]" />
                    <span>Produce Items ({orderObj.items?.length || 0})</span>
                  </div>
                  <span className="font-mono font-black text-xs text-[#0f8646]">
                    ₹{totalAmount}
                  </span>
                </div>

                <div className="divide-y divide-gray-200/60 max-h-44 overflow-y-auto pr-1">
                  {(orderObj.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-7 h-7 rounded-lg object-contain bg-white border border-gray-100 p-0.5 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{item.name}</p>
                          <p className="text-[10px] text-gray-400">
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
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-black text-xs text-gray-900">
                      <ShieldAlert size={15} className="text-[#0f8646]" />
                      <span>Customer Doorstep OTP</span>
                    </div>
                    <button
                      onClick={handleResendOtpEmail}
                      disabled={sendingOtpEmail}
                      className="text-[10px] font-extrabold bg-white text-[#0f8646] hover:bg-[#0f8646] hover:text-white border border-emerald-300 px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Send size={9} />
                      <span>{sendingOtpEmail ? 'Sending...' : 'Email OTP'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 mb-2 leading-tight">
                    Ask customer for the 4-digit PIN on their screen:
                  </p>

                  {/* 4 Discrete PIN Input Boxes */}
                  <div className="flex items-center justify-center gap-2.5 mb-2.5">
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
                        className={`w-11 h-13 text-center font-mono font-black text-xl rounded-xl border-2 outline-none transition bg-white ${
                          digit
                            ? 'border-[#0f8646] text-gray-900'
                            : 'border-gray-300 focus:border-[#0f8646]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Eco-Bag Return Counter */}
                  <div className="bg-white border border-emerald-200 rounded-xl p-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 block text-[11px]">♻️ Eco-Bags Collected</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">+₹10 reward/bag</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBagsReturned((p) => Math.max(0, p - 1))}
                        className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs flex items-center justify-center transition cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-xs text-emerald-800 w-3 text-center">
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
                  className="w-full bg-[#0f8646] hover:bg-[#0c6a38] disabled:bg-gray-400 text-white font-black py-3 rounded-xl shadow-xs transition text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <CheckCircle2 size={15} />
                  <span>{verifyingOtp ? 'Verifying...' : 'Verify OTP & Mark Delivered'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      {renderProductionHeader()}
      {renderToast()}

      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6 space-y-4 pb-24">
        
        {/* If Rider is Offline (Rest Mode Banner) */}
        {!isOnline && (
          <div className="bg-gradient-to-r from-gray-900 to-zinc-800 text-white rounded-3xl p-6 shadow-md border border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-gray-300">
                  <Power size={16} />
                </div>
                <h3 className="font-black text-base text-white">Duty Offline (Rest Mode)</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-gray-300 px-2.5 py-1 rounded-full">
                Not Receiving Orders
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              You are currently on break. You will not receive any new express grocery dispatch notifications in Bhopal.
            </p>
            <button
              onClick={handleToggleDuty}
              disabled={togglingDuty}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Zap size={14} />
              <span>Slide to Go Online</span>
            </button>
          </div>
        )}

        {/* Segmented Tab Controls */}
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
            <span>Requests & Trips</span>
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
            <span>Earnings & Stats</span>
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
            <span>Trip History</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80 shadow-xs">
            <Loader2 size={28} className="animate-spin text-[#0f8646] mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-bold">Connecting to dispatch server...</p>
          </div>
        )}

        {/* TAB 1: REQUESTS & ACTIVE TRIPS */}
        {!loading && activeTab === 'requests' && (
          <div className="space-y-4">
            
            {/* 1. Active Trip (If any active trip exists) */}
            {activeorder && renderActiveTripCard()}

            {/* 2. Available Incoming Requests */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                  <Package size={16} className="text-[#0f8646]" />
                  <span>Available Delivery Requests</span>
                </h3>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {assignments.length} Available
                </span>
              </div>

              {assignments.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-gray-200/80 shadow-xs space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center mx-auto">
                    <Package size={26} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">
                      {isOnline ? 'No New Requests Pending' : 'You are currently offline'}
                    </h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                      {isOnline
                        ? 'Your duty is online. New broadcast orders in Bhopal will appear here automatically.'
                        : 'Switch your duty toggle above to Online to start receiving incoming orders.'}
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
                            Accept & Start Trip
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
