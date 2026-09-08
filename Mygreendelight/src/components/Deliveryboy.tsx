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
  Check,
  ExternalLink,
  ChevronLeft,
  Bike,
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
  // Multi-Trip and Available Requests State
  const [activeAssignments, setActiveAssignments] = useState<any[]>([])
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'requests' | 'earnings' | 'history'>('requests')
  
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [sendingOtpEmail, setSendingOtpEmail] = useState(false)
  const [bagsReturned, setBagsReturned] = useState<number>(0)
  const [gpsActive, setGpsActive] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showItemsList, setShowItemsList] = useState(false)
  const [showMapPreview, setShowMapPreview] = useState(true)

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

  // Computed current active order for delivery
  const currentActiveAssignment = 
    activeAssignments.find((a) => String(a._id) === String(selectedAssignmentId) || String(a.order?._id) === String(selectedAssignmentId)) ||
    activeAssignments[0] ||
    null

  const activeOrderObj = currentActiveAssignment?.order || null

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
      if (result.data?.active && Array.isArray(result.data.activeAssignments)) {
        const list = result.data.activeAssignments
        setActiveAssignments(list)
        setSelectedAssignmentId((prev) => {
          const exists = list.some((a: any) => String(a._id) === String(prev) || String(a.order?._id) === String(prev))
          return exists ? prev : (list[0]?._id || null)
        })
      } else {
        setActiveAssignments([])
        setSelectedAssignmentId(null)
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

  // Socket listener for real-time delivery dispatches & direct assignments
  useEffect(() => {
    const handleNewAssignment = (data: any) => {
      if (!isOnline) return
      playDispatchChime()
      showToast('🔔 New express delivery request received!', 'info')
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200])
      }
      fetchAssignments()
      fetchCurrentOrder()
    }

    const handleOrderAssigned = (data: any) => {
      if (!isOnline) return
      playDispatchChime()
      showToast('🚚 New Delivery Trip Assigned by Dispatcher!', 'success')
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([300, 150, 300])
      }
      fetchCurrentOrder()
      fetchAssignments()
    }

    socket.on('new-assignment', handleNewAssignment)
    socket.on('send-assignment', handleOrderAssigned)
    socket.on('order-assigned', handleOrderAssigned)
    socket.on('order-updated', () => {
      fetchCurrentOrder()
      fetchAssignments()
    })

    return () => {
      socket.off('new-assignment', handleNewAssignment)
      socket.off('send-assignment', handleOrderAssigned)
      socket.off('order-assigned', handleOrderAssigned)
      socket.off('order-updated')
    }
  }, [isOnline])

  // ⚡ Smart Background Auto-Sync (Every 5 seconds while driver is Online)
  useEffect(() => {
    if (!isOnline) return

    const syncInterval = setInterval(async () => {
      try {
        const [assignRes, currRes] = await Promise.all([
          axios.get('/api/delivery/getassigments').catch(() => null),
          axios.get('/api/delivery/currentorder').catch(() => null),
        ])

        if (assignRes?.data?.assignments) {
          setAssignments(assignRes.data.assignments)
        }

        if (currRes?.data) {
          if (currRes.data.active && Array.isArray(currRes.data.activeAssignments)) {
            const list = currRes.data.activeAssignments
            setActiveAssignments((prevList) => {
              if (list.length > prevList.length) {
                playDispatchChime()
                showToast(`🚚 ${list.length - prevList.length} New Delivery Trip(s) Assigned!`, 'success')
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  navigator.vibrate([200, 100, 200])
                }
              }
              return list
            })
            setSelectedAssignmentId((prev) => {
              const exists = list.some((a: any) => String(a._id) === String(prev) || String(a.order?._id) === String(prev))
              return exists ? prev : (list[0]?._id || null)
            })
          } else {
            setActiveAssignments([])
            setSelectedAssignmentId(null)
          }
        }
      } catch (_) {}
    }, 5000)

    return () => clearInterval(syncInterval)
  }, [isOnline])

  // Real-time GPS stream during active delivery trip (only if driver is online)
  useEffect(() => {
    if (!activeOrderObj || !isOnline) return
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
            socket.emit('update-location', {
              orderId: activeOrderObj._id,
              latitude,
              longitude,
            })
            axios
              .post('/api/delivery/updatelocation', {
                latitude,
                longitude,
              })
              .catch(() => {})
          }
        },
        () => setGpsActive(false),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      )
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [activeOrderObj, isOnline])

  // Handle PIN Box Input
  const handlePinChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1)
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

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4)
    if (!pasted) return
    const newPin = ['', '', '', '']
    pasted.split('').forEach((ch, idx) => {
      if (idx < 4) newPin[idx] = ch
    })
    setPin(newPin)
    const focusIdx = Math.min(pasted.length, 3)
    pinRefs[focusIdx].current?.focus()
  }

  // 1-Tap Trigger to Send OTP to Customer Email
  const handleResendOtpEmail = async () => {
    if (!activeOrderObj?._id) return
    setSendingOtpEmail(true)
    try {
      const res = await axios.post(`/api/delivery/send-delivery-otp/${activeOrderObj._id}`)
      if (res.data?.success) {
        showToast(res.data.message || 'OTP sent to customer email!', 'success')
      } else {
        showToast(res.data?.message || 'Failed to dispatch email OTP', 'error')
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to send OTP to email', 'error')
    } finally {
      setSendingOtpEmail(false)
    }
  }

  // Verify OTP and complete delivery
  const handleVerifyOtp = async () => {
    const fullPin = pin.join('')
    if (fullPin.length !== 4) {
      showToast('Please enter all 4 digits of the OTP', 'error')
      return
    }

    if (!activeOrderObj?._id) {
      showToast('No active order selected', 'error')
      return
    }

    setVerifyingOtp(true)
    try {
      const result = await axios.post('/api/delivery/verify-otp', {
        orderId: activeOrderObj._id,
        otp: fullPin,
        bagsReturned: bagsReturned || 0,
      })

      if (result.data?.success) {
        showToast(
          result.data.message || '🎉 Delivery verified and marked completed!',
          'success'
        )
        setPin(['', '', '', ''])
        setBagsReturned(0)

        // Optimistically remove from active list
        setActiveAssignments((prev) =>
          prev.filter(
            (a) =>
              String(a._id) !== String(currentActiveAssignment?._id) &&
              String(a.order?._id) !== String(activeOrderObj._id)
          )
        )

        handleRefreshAll()
      } else {
        showToast(result.data?.message || 'Invalid OTP code. Please retry.', 'error')
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'OTP verification failed. Retry.', 'error')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(`/api/delivery/assigment/${id}/accepyaccigment`)
      if (result.data?.success) {
        showToast('✓ Express Delivery Accepted! Added to active deliveries.', 'success')
        playDispatchChime()
        handleRefreshAll()
      } else {
        showToast(result.data?.message || 'Could not accept assignment', 'error')
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Error accepting assignment', 'error')
    }
  }

  const handleReject = async (id: string) => {
    setAssignments((prev) => prev.filter((a) => a._id !== id))
    showToast('Delivery request passed', 'info')
  }

  // Toast Notification Renderer
  const renderToast = () => {
    if (!toast) return null
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
        <div
          className={`p-4 rounded-3xl border shadow-2xl flex items-center gap-3 text-xs font-bold backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/50 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-100 border-rose-500/50 shadow-rose-950/20'
              : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/30'
          }`}
        >
          <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 bg-white/10">
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-rose-400" />}
            {toast.type === 'info' && <Sparkles size={16} className="text-amber-400" />}
          </div>
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-1 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition">
            <X size={15} />
          </button>
        </div>
      </div>
    )
  }

  // Modern Minimalist Header
  const renderHeader = () => (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Driver Profile */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-50 via-white to-amber-50 p-1 flex items-center justify-center shadow-sm border border-emerald-500/20 shrink-0">
                <img src="/logo-icon.png" alt="SubziQuick Partner" className="w-full h-full object-contain filter drop-shadow-xs" />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-slate-900 leading-tight">
                  {currentUser?.name || 'Rider Partner'}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                  Express
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-emerald-600" />
                <span>Bhopal Fleet Radar</span>
              </p>
            </div>
          </div>

          {/* Duty Switcher & Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDuty}
              disabled={togglingDuty}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-black text-xs transition-all duration-200 cursor-pointer border active:scale-95 shadow-2xs ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
              title="Toggle Online/Offline Duty"
            >
              <Power size={13} className={isOnline ? 'text-emerald-600' : 'text-slate-400'} />
              <span className="hidden xs:inline">{isOnline ? 'Online' : 'Offline'}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'
                }`}
              />
            </button>

            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-90 cursor-pointer"
              title="Refresh"
            >
              <RotateCw size={14} className={refreshing ? 'animate-spin text-emerald-600' : ''} />
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Shift Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100">
          <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <IndianRupee size={13} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight truncate">Today's Pay</span>
              <span className="text-xs font-black text-slate-900 truncate block">
                ₹{dashboardStats.todayEarnings || dashboardStats.totalDeliveries * 100}
              </span>
            </div>
          </div>

          <div className="bg-sky-50/80 border border-sky-200/70 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={13} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight truncate">Trips</span>
              <span className="text-xs font-black text-slate-900 truncate block">{dashboardStats.totalDeliveries || 0} Drop(s)</span>
            </div>
          </div>

          <div className="bg-purple-50/80 border border-purple-200/70 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Zap size={13} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight truncate">Rate</span>
              <span className="text-xs font-black text-slate-900 truncate block">₹100 / Trip</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )

  // ACTIVE DELIVERY COCKPIT (CARD)
  const renderActiveTripCard = () => {
    if (!activeOrderObj) return null

    const orderShortId = String(activeOrderObj._id || '').slice(-6).toUpperCase()
    const customerName = activeOrderObj.address?.fullname || activeOrderObj.user?.name || 'Customer'
    const customerMobile = activeOrderObj.address?.mobile || activeOrderObj.user?.mobile || ''
    const customerAddress = activeOrderObj.address?.fulladress || 'Bhopal Address'
    const totalAmount = activeOrderObj.totalamount || 0
    const isPaid = !!activeOrderObj.ispaid
    const cleanMobile = String(customerMobile).replace(/[^0-9]/g, '').slice(-10)

    const custLat = activeOrderObj.address?.latitude
    const custLng = activeOrderObj.address?.longitude
    const mapsUrl = custLat && custLng
      ? `https://www.google.com/maps/dir/?api=1&destination=${custLat},${custLng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress + ', Bhopal')}`

    const arrivalWhatsappMsg = encodeURIComponent(
      `*🌿 SubziQuick Farm Fresh Express Delivery*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Namaste *${customerName}*! 🙏\n\n` +
      `Main aapka *SubziQuick Delivery Partner* aapke doorstep par taaza grocery leke pahunch gaya hoon.\n\n` +
      `📦 *Order ID:* #${orderShortId}\n` +
      `📍 *Address:* ${customerAddress}\n` +
      `💵 *Payment:* ${isPaid ? '✅ Paid Online (₹0 to pay)' : `💵 Collect Cash / UPI: ₹${totalAmount}`}\n\n` +
      `👉 Kripya delivery lete waqt apna *4-digit verification OTP* share karein taaki order handover complete ho sake.\n\n` +
      `Live Tracking: https://subziquick.in/track/${activeOrderObj._id}\n` +
      `Dhanyawaad! 🌿`
    )
    const whatsappArrivalUrl = `https://wa.me/91${cleanMobile}?text=${arrivalWhatsappMsg}`

    return (
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-emerald-500/50 space-y-4 transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
              Selected Trip
            </span>
            <span className="font-mono font-black text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl">
              #{orderShortId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {gpsActive && (
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Radio size={10} className="animate-pulse" />
                <span>GPS Live</span>
              </span>
            )}
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}>
              {isPaid ? '✅ Paid Online' : `💵 Collect ₹${totalAmount}`}
            </span>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {customerName}
          </h2>
          <p className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
            <MapPin size={14} className="text-[#0f8646] shrink-0 mt-0.5" />
            <span>{customerAddress}</span>
          </p>
        </div>

        {/* Silent Delivery Instructions Banner (If Specified) */}
        {activeOrderObj.isSilentDelivery && (
          <div className="bg-amber-500 text-white p-3.5 rounded-2xl shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center font-black text-base shrink-0">
              🔕
            </div>
            <div className="text-xs">
              <span className="font-black block uppercase">Silent Delivery — Do Not Ring Bell</span>
              <span className="text-amber-100">Drop produce safely at doorstep.</span>
              {activeOrderObj.deliveryInstructions && (
                <span className="block font-bold text-white mt-0.5">
                  "{activeOrderObj.deliveryInstructions}"
                </span>
              )}
            </div>
          </div>
        )}

        {/* 4 Thumb Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 shadow-xs text-center"
          >
            <Compass size={17} />
            <span>Google Maps 🗺️</span>
          </a>

          {customerMobile ? (
            <a
              href={whatsappArrivalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 shadow-xs text-center"
            >
              <MessageCircle size={17} />
              <span>WhatsApp 💬</span>
            </a>
          ) : null}

          {customerMobile ? (
            <a
              href={`tel:${customerMobile}`}
              className="bg-slate-900 hover:bg-black text-white p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 shadow-xs text-center"
            >
              <Phone size={17} />
              <span>Call Customer 📞</span>
            </a>
          ) : null}

          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-emerald-50 hover:bg-emerald-100 text-[#0f8646] p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 border border-emerald-200 shadow-xs text-center cursor-pointer"
          >
            <MessageSquare size={17} />
            <span>In-App Chat</span>
          </button>
        </div>

        {/* Live Map Preview (Collapsible) */}
        {custLat && custLng && (
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
            <div
              onClick={() => setShowMapPreview(!showMapPreview)}
              className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-1.5">
                <Navigation size={13} className="text-emerald-600" />
                <span>Live Route Preview</span>
              </span>
              {showMapPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {showMapPreview && (
              <div className="p-2">
                <Livemap
                  customerLocation={{
                    latitude: custLat,
                    longitude: custLng,
                  }}
                  isDeliveryBoy={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Produce Items Accordion */}
        <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80">
          <button
            onClick={() => setShowItemsList(!showItemsList)}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-emerald-600" />
              <span>Produce Package ({activeOrderObj.items?.length || 0} items)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-700 font-black">₹{totalAmount}</span>
              {showItemsList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          {showItemsList && (
            <div className="divide-y divide-slate-200/60 mt-3 pt-2 max-h-48 overflow-y-auto pr-1">
              {(activeOrderObj.items || []).map((item: any, idx: number) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-xl object-contain bg-white border border-slate-100 p-0.5 shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.quantity} × {item.unit}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doorstep Email OTP Security Verification Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl p-4 sm:p-5 border-2 border-emerald-500/40 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
              <ShieldAlert size={15} className="text-[#0f8646]" />
              <span>Doorstep Verification</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Zero Fraud Security
            </span>
          </div>

          {/* 1-Tap Trigger to Send OTP to Customer's Real Email */}
          <button
            onClick={handleResendOtpEmail}
            disabled={sendingOtpEmail}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black py-2.5 px-3 rounded-2xl text-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Send size={13} />
            <span>{sendingOtpEmail ? 'Dispatching to Customer Email...' : '📩 Send OTP to Customer Email'}</span>
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-tight">
            Ask customer for the 4-digit verification PIN received in email:
          </p>

          {/* 4 Discrete PIN Input Boxes */}
          <div className="flex items-center justify-center gap-2.5">
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
                className={`w-12 h-14 text-center font-mono font-black text-2xl rounded-2xl border-2 outline-none transition bg-white shadow-2xs ${
                  digit
                    ? 'border-[#0f8646] text-slate-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-300 focus:border-[#0f8646]'
                }`}
              />
            ))}
          </div>

          {/* Eco-Bag Return Counter */}
          <div className="bg-white border border-emerald-200/80 rounded-2xl p-2.5 flex items-center justify-between text-xs">
            <div>
              <span className="font-black text-emerald-950 block text-[11px]">♻️ Eco-Bags Collected</span>
              <span className="text-[10px] text-emerald-700 font-semibold">+₹10 reward/bag to customer</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBagsReturned((p) => Math.max(0, p - 1))}
                className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center transition cursor-pointer"
              >
                -
              </button>
              <span className="font-mono font-black text-sm text-emerald-800 w-4 text-center">
                {bagsReturned}
              </span>
              <button
                type="button"
                onClick={() => setBagsReturned((p) => p + 1)}
                className="w-7 h-7 rounded-xl bg-[#0f8646] text-white font-black text-xs flex items-center justify-center transition cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Complete Delivery Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={verifyingOtp}
            className="w-full bg-[#0f8646] hover:bg-[#0c6a38] disabled:bg-slate-400 text-white font-black py-3.5 rounded-2xl shadow-md shadow-emerald-900/10 transition active:scale-98 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {verifyingOtp ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying Security Code...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Verify OTP & Mark Delivered</span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans antialiased text-slate-900">
      {renderHeader()}
      {renderToast()}

      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6 space-y-4 pb-24">
        
        {/* Rest Mode Banner (Offline) */}
        {!isOnline && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300">
                  <Power size={18} />
                </div>
                <h3 className="font-black text-base text-white">Duty Offline (Rest Mode)</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-300 px-3 py-1 rounded-full">
                Not Receiving Orders
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are currently off-duty. Switch to Online to start receiving express grocery dispatches in Bhopal.
            </p>
            <button
              onClick={handleToggleDuty}
              disabled={togglingDuty}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Zap size={14} />
              <span>Slide / Tap to Go Online</span>
            </button>
          </div>
        )}

        {/* Segmented Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200/80 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Truck size={14} className={activeTab === 'requests' ? 'text-[#0f8646]' : ''} />
            <span>Trips & Requests</span>
            {(activeAssignments.length > 0 || assignments.length > 0) && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                {activeAssignments.length + assignments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 size={14} className={activeTab === 'earnings' ? 'text-[#0f8646]' : ''} />
            <span>Earnings & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <History size={14} className={activeTab === 'history' ? 'text-[#0f8646]' : ''} />
            <span>Trip History</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs">
            <Loader2 size={30} className="animate-spin text-[#0f8646] mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold">Syncing fleet dispatch radar...</p>
          </div>
        )}

        {/* TAB 1: REQUESTS & ACTIVE TRIPS */}
        {!loading && activeTab === 'requests' && (
          <div className="space-y-6">
            
            {/* SECTION 1: MY ACTIVE ASSIGNED DELIVERIES */}
            {activeAssignments.length > 0 && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                    <h3 className="font-black text-sm text-slate-900">
                      My Active Deliveries ({activeAssignments.length})
                    </h3>
                  </div>
                  <span className="text-[10.5px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Choose Order to Deliver
                  </span>
                </div>

                {/* Multi-Trip Order Selector Chips (If >1 order assigned) */}
                {activeAssignments.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeAssignments.map((a) => {
                      const ord = a.order || {}
                      const isSelected =
                        String(a._id) === String(selectedAssignmentId) ||
                        String(ord._id) === String(selectedAssignmentId)
                      const shortId = String(ord._id || '').slice(-6).toUpperCase()

                      return (
                        <div
                          key={a._id}
                          onClick={() => setSelectedAssignmentId(a._id)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-98 ${
                            isSelected
                              ? 'bg-emerald-50/90 border-[#0f8646] shadow-xs'
                              : 'bg-white border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                isSelected ? 'bg-[#0f8646] text-white' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              #{shortId}
                            </div>
                            <div className="min-w-0">
                              <span className="font-black text-xs text-slate-900 block leading-tight truncate">
                                {ord.address?.fullname || ord.user?.name || 'Customer'}
                              </span>
                              <span className="text-[11px] text-slate-500 line-clamp-1">
                                {ord.address?.fulladress || 'Bhopal'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-black text-xs text-slate-900 block">
                              ₹{ord.totalamount || 0}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                                isSelected
                                  ? 'bg-[#0f8646] text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {isSelected ? '🎯 Active Focus' : 'Select'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Selected Order Action Cockpit */}
                {renderActiveTripCard()}
              </div>
            )}

            {/* SECTION 2: AVAILABLE EXPRESS DISPATCH REQUESTS */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Package size={16} className="text-[#0f8646]" />
                  <span>Available Express Requests</span>
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {assignments.length} Available
                </span>
              </div>

              {assignments.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0f8646] flex items-center justify-center mx-auto">
                    <Package size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {isOnline ? 'No Pending Requests' : 'You are currently offline'}
                    </h3>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
                      {isOnline
                        ? 'All live orders in Bhopal are assigned. New dispatch alerts will ring here automatically.'
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
                            <h4 className="font-black text-base text-slate-900">
                              {order?.address?.fullname || 'Customer'}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                              <MapPin size={13} className="text-rose-500 shrink-0 mt-0.5" />
                              <span>{order?.address?.fulladress || 'Bhopal Address'}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                            <div className="bg-slate-50 p-2.5 rounded-2xl">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Items</span>
                              <span className="font-black text-xs text-slate-900">
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

                        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex gap-2">
                          <button
                            onClick={() => handleAccept(a._id)}
                            className="flex-1 bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3 rounded-2xl font-black text-xs transition active:scale-95 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <Check size={14} />
                            <span>Accept & Deliver</span>
                          </button>
                          <button
                            onClick={() => handleReject(a._id)}
                            className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl font-black text-xs transition active:scale-95 cursor-pointer border border-slate-200"
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

        {/* TAB 2: EARNINGS & PERFORMANCE STATS */}
        {!loading && activeTab === 'earnings' && (
          <div className="space-y-4">
            <DeliveryDashboardStats
              totalDeliveries={dashboardStats.totalDeliveries}
              totalEarnings={dashboardStats.totalEarnings}
              todayEarnings={dashboardStats.todayEarnings}
              earningPerDelivery={dashboardStats.earningPerDelivery}
            />
            <EarningsChart data={earningsData} />
            <DeliveriesChart data={deliveriesData} />
          </div>
        )}

        {/* TAB 3: TRIP HISTORY */}
        {!loading && activeTab === 'history' && (
          <div className="space-y-4">
            <RecentDeliveries deliveries={recentDeliveries} />
          </div>
        )}

      </main>

      {/* Floating In-App Chat Modal with Customer */}
      {isChatOpen && activeOrderObj && (
        <ChatBox
          orderId={activeOrderObj._id}
          currentUserId={currentUser?._id || ''}
          otherUserName={activeOrderObj.address?.fullname || activeOrderObj.user?.name || 'Customer'}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  )
}
