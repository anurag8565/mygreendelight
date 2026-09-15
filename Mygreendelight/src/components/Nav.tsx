"use client";

import mongoose from "mongoose";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  X,
  MapPin,
  ChevronDown,
  ChevronRight,
  Leaf,
  User as UserIcon,
  Phone,
  Truck,
  Box,
  ClipboardCheck,
  PlusCircle,
  LogOut,
  Loader2,
  ArrowRight,
  Mic,
  MicOff,
  Plus,
  Minus,
  Smartphone,
  Gift,
  Tag,
  Package,
  MessageCircle,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity, hydrateCart, setCartFromCloud } from "@/redux/CartSlice";
import { hydrateWishlist } from "@/redux/WishlistSlice";
import { useCartSync } from "@/hooks/useCartSync";
import type { RootState, AppDispatch } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import VoiceSearchModal from "./VoiceSearchModal";
import MiniCart from "./MiniCart";
import LocationModal from "./LocationModal";
import Logo from "./Logo";

interface iUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryboy";
  image?: string;
}

export default function Nav({ user }: { user?: iUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [menuopen, setmenuopen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { cartdata } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { userdata } = useSelector((state: RootState) => state.user);
  const activeUser = (user && (user._id || user.email)) ? user : (userdata as any);
  const rawUserId = activeUser?._id || (activeUser as any)?.id || null;
  const cleanUserId = rawUserId ? String(rawUserId) : null;
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Real-time live cart sync across devices (WebSocket, focus, tabs, heartbeat)
  useCartSync(cleanUserId);

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateCart({ userId: cleanUserId }));
    dispatch(hydrateWishlist({ userId: cleanUserId }));
    if (typeof window !== "undefined") {
      const savedLoc = localStorage.getItem("mgd_user_location");
      if (savedLoc) setLocation(savedLoc);
    }
  }, [dispatch, cleanUserId]);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await axios.get(`/api/user/search?query=${encodeURIComponent(search.trim())}`);
        if (res.data) {
          setSearchResults(res.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = searchRef.current && !searchRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node);
      if (isOutsideDesktop && isOutsideMobile) {
        setSearchResults([]);
        setIsSearchFocused(false);
        setIsMobileSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartTotal = cartdata.reduce((total, item) => total + (item.price * item.quantity), 0);

  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const handleVoiceSearch = () => {
    setShowVoiceModal(true);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    router.push(`/user/search?query=${encodeURIComponent(trimmed)}`);
  };

  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [location, setLocation] = useState("Bhopal, Madhya Pradesh");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [navCategories, setNavCategories] = useState<any[]>([]);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch live categories from database
    axios.get("/api/admin/category").then(res => {
      if (res.data.success) {
        setNavCategories(res.data.categories);
      }
    }).catch(console.error);

    // Fetch live trending produce directly from MongoDB
    axios.get("/api/user/search?trending=true").then(res => {
      if (Array.isArray(res.data)) {
        setTrendingItems(res.data);
      }
    }).catch(console.error);
  }, []);
  
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsDetectingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          
          if (data && data.city) {
            setLocation(`${data.city}, ${data.principalSubdivision || data.adminArea1 || data.countryName}`);
          } else if (data && data.locality) {
            setLocation(`${data.locality}, ${data.principalSubdivision}`);
          } else {
            setLocation("Location found");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
        } finally {
          setIsDetectingLocation(false);
          setShowLocationPopup(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please allow location access to detect your current area.");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sidebar = menuopen ? createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setmenuopen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999]"
      />
      <motion.div
        key="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        className="fixed top-0 left-0 w-[300px] xs:w-[325px] h-screen bg-[#faf9f5] z-[1000] shadow-2xl flex flex-col font-sans border-r border-stone-200/80"
      >
        {/* Top Header & Brand Bar */}
        <div className="p-4 bg-white border-b border-stone-200/80 flex items-center justify-between">
          <div onClick={() => setmenuopen(false)} className="cursor-pointer">
            <Logo showTagline={false} />
          </div>
          <button
            onClick={() => setmenuopen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition cursor-pointer"
            title="Close Menu"
          >
            <X size={17} />
          </button>
        </div>

        {/* Minimalist User Card */}
        {activeUser?.email ? (
          <div className="p-4 bg-white border-b border-stone-200/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0a3d24] flex items-center justify-center font-black text-base shrink-0 shadow-2xs">
                {activeUser?.image ? (
                  <img
                    src={activeUser.image}
                    alt={activeUser.name || "User"}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : activeUser?.name ? (
                  activeUser.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon size={18} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-sm text-stone-900 truncate">
                  {activeUser.name || "Customer"}
                </h4>
                <p className="text-[11px] text-stone-500 truncate font-medium">
                  {activeUser.email}
                </p>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[#0a3d24] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full mt-1">
                  {activeUser.role === "admin" ? (
                    <ShieldCheck size={11} className="text-[#0a3d24]" />
                  ) : (
                    <Sparkles size={11} className="text-[#0a3d24]" />
                  )}
                  <span>
                    {activeUser.role === "admin"
                      ? "Store Administrator"
                      : "Fresh Member"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white border-b border-stone-200/60">
            <p className="text-xs text-stone-600 font-medium mb-3">
              Sign in to track orders, earn wallet rewards, and save fresh produce.
            </p>
            <Link
              href="/login"
              onClick={() => setmenuopen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0a3d24] hover:bg-[#072817] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition"
            >
              <UserIcon size={14} />
              <span>Login or Create Account</span>
            </Link>
          </div>
        )}

        {/* Location Quick-Bar */}
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              setmenuopen(false);
              setShowLocationPopup(true);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-300 transition text-left cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0a3d24] flex items-center justify-center shrink-0">
                <MapPin size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Deliver to
                </span>
                <span className="text-xs font-black text-stone-800 truncate block max-w-[170px]">
                  {location}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#0a3d24] group-hover:underline">
              Change
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Aisles */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none text-xs font-bold">
          {/* Section 1: Fresh Produce Categories */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block px-2 mb-1.5">
              Produce Aisles
            </span>
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100 shadow-2xs">
              <Link
                href="/shop?category=Vegetables"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-emerald-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0a3d24] flex items-center justify-center shrink-0">
                    <Leaf size={16} />
                  </div>
                  <span className="font-bold text-xs text-stone-800 group-hover:text-[#0a3d24]">
                    Fresh Vegetables
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-stone-300 group-hover:text-[#0a3d24] group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/shop?category=Fruits"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-emerald-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-amber-600" />
                  </div>
                  <span className="font-bold text-xs text-stone-800 group-hover:text-[#0a3d24]">
                    Seasonal Fruits
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-stone-300 group-hover:text-[#0a3d24] group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/shop?category=Exotics"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-emerald-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0a3d24] flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <span className="font-bold text-xs text-stone-800 group-hover:text-[#0a3d24]">
                    Hydroponics & Exotics
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-stone-300 group-hover:text-[#0a3d24] group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/shop?category=Combos"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-emerald-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0a3d24] flex items-center justify-center shrink-0">
                    <Gift size={16} />
                  </div>
                  <span className="font-bold text-xs text-stone-800 group-hover:text-[#0a3d24]">
                    Combos & Bulk Savers
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-stone-300 group-hover:text-[#0a3d24] group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/shop"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 bg-stone-50/60 hover:bg-emerald-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0a3d24] text-white flex items-center justify-center shrink-0">
                    <LayoutGrid size={15} />
                  </div>
                  <span className="font-extrabold text-xs text-[#0a3d24]">
                    Browse Complete Store
                  </span>
                </div>
                <ArrowRight
                  size={14}
                  className="text-[#0a3d24] group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Section 2: Account & Services */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block px-2 mb-1.5">
              Account & Services
            </span>
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100 shadow-2xs">
              <Link
                href="/user/myorder"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-stone-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Package size={15} />
                  </div>
                  <span className="font-bold text-xs text-stone-800 group-hover:text-[#0a3d24]">
                    My Orders & Live Tracking
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-stone-300 group-hover:text-[#0a3d24] transition-transform"
                />
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-stone-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Heart size={15} />
                  </div>
                  <span className="font-bold text-xs text-stone-800 group-hover:text-[#0a3d24]">
                    Saved Wishlist
                  </span>
                </div>
                {wishlistItems.length > 0 && (
                  <span className="bg-[#0a3d24] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                href="/offers"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-stone-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Tag size={15} />
                  </div>
                  <span className="font-bold text-xs text-stone-800 group-hover:text-[#0a3d24]">
                    Offers & Coupons
                  </span>
                </div>
                <span className="bg-emerald-50 text-[#0a3d24] border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Discounts
                </span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setmenuopen(false)}
                className="flex items-center justify-between p-3 hover:bg-stone-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0a3d24] flex items-center justify-center shrink-0">
                    <MessageCircle size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-800 block leading-tight">
                      Help & WhatsApp Support
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      Chat directly with Bhopal hub
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-stone-300 group-hover:text-[#0a3d24] transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Admin Shortcuts (If admin) */}
          {activeUser?.role === "admin" && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 flex items-center gap-1 px-2 mb-1.5">
                <ShieldCheck size={12} className="text-amber-600" /> Admin
                Center
              </span>
              <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100 shadow-2xs">
                <Link
                  href="/admin"
                  onClick={() => setmenuopen(false)}
                  className="flex items-center gap-2.5 p-3 text-stone-800 hover:bg-amber-50/50 transition"
                >
                  <PlusCircle size={15} className="text-[#0a3d24]" />
                  <span className="text-xs font-bold">Dashboard Overview</span>
                </Link>
                <Link
                  href="/admin/manageorder"
                  onClick={() => setmenuopen(false)}
                  className="flex items-center gap-2.5 p-3 text-stone-800 hover:bg-amber-50/50 transition"
                >
                  <ClipboardCheck size={15} className="text-[#0a3d24]" />
                  <span className="text-xs font-bold">Manage Orders</span>
                </Link>
                <Link
                  href="/admin/viewgrocery"
                  onClick={() => setmenuopen(false)}
                  className="flex items-center gap-2.5 p-3 text-stone-800 hover:bg-amber-50/50 transition"
                >
                  <Box size={15} className="text-[#0a3d24]" />
                  <span className="text-xs font-bold">Inventory Stock</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-white border-t border-stone-200/80 space-y-2">
          <button
            type="button"
            onClick={() => {
              setmenuopen(false);
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("trigger-pwa-install"));
              }
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 text-[#0a3d24] transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} />
              <span className="text-xs font-bold">Install SubziQuick App</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#0a3d24] text-white px-2 py-0.5 rounded-md">
              10m
            </span>
          </button>

          {activeUser?.email && (
            <button
              onClick={() => {
                setmenuopen(false);
                dispatch(hydrateCart({ userId: null }));
                signOut({ callbackUrl: "/login" });
              }}
              className="w-full flex items-center justify-center gap-2 text-stone-500 hover:text-rose-600 font-bold py-2 rounded-xl hover:bg-rose-50 transition text-xs cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          )}

          <div className="text-center pt-1">
            <span className="text-[10px] text-stone-400 font-medium flex items-center justify-center gap-1">
              <Truck size={12} className="text-[#0a3d24]" />
              <span>Direct Kisan Mandi • Bhopal Express 10-15m</span>
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      <header className="w-full flex flex-col z-50 bg-white sticky top-0 shadow-2xs">
        {/* Tier 1: Top Bar (Deep Forest Green) */}
        <div className="bg-[#0a3d24] text-white py-1.5 px-4 md:px-8 text-xs font-medium flex justify-between items-center hidden sm:flex">
          <div className="flex items-center gap-2 tracking-tight">
            <Truck size={14} className="text-emerald-300" />
            <span>FREE DELIVERY on orders above ₹199 in Bhopal</span>
          </div>
          <div className="flex items-center gap-6 text-[11.5px]">
            <Link href="/user/myorder" className="cursor-pointer hover:text-emerald-200 transition-colors">Track Order</Link>
            <Link href="/contact" className="cursor-pointer hover:text-emerald-200 transition-colors">Help & Support</Link>
            {activeUser?.role === "admin" && (
              <Link href="/admin" className="cursor-pointer font-bold text-amber-300 hover:underline">Admin Center</Link>
            )}
          </div>
        </div>

        {/* Tier 2: Main Middle Bar */}
        <div className="pt-2.5 pb-2 sm:py-3.5 px-3.5 sm:px-6 md:px-8 flex items-center justify-between border-b sm:border-b-0 border-gray-100/80 gap-2 sm:gap-4 w-full max-w-full relative z-30">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <button 
              onClick={() => setmenuopen(true)} 
              className="lg:hidden p-1 text-stone-700 hover:text-[#0a3d24] shrink-0 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col min-w-0">
              <Logo className="shrink-0" />
              <button 
                onClick={() => setShowLocationPopup(true)} 
                className="lg:hidden flex items-center gap-1 text-[11px] font-bold text-stone-600 hover:text-[#0a3d24] transition text-left mt-0.5 cursor-pointer"
                title="Change delivery location"
              >
                <MapPin size={11} className="text-[#0a3d24] shrink-0" />
                <span className="truncate max-w-[110px] sm:max-w-[150px] font-semibold text-stone-800">{location}</span>
                <span className="bg-amber-100 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-amber-300/80 shrink-0">
                  10-15m
                </span>
                <ChevronDown size={11} className="shrink-0 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Location Dropdown (Desktop) */}
          <div
            className="hidden lg:flex items-center gap-2.5 shrink-0 cursor-pointer group relative hover:opacity-90 transition"
            onClick={() => setShowLocationPopup(true)}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0a3d24] flex items-center justify-center group-hover:bg-[#0a3d24] group-hover:text-white transition-colors shadow-2xs">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Deliver to</span>
                <span className="bg-amber-100 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-amber-300/80">
                  ⚡ 10-15 Min
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-stone-800 flex items-center gap-1 group-hover:text-[#0a3d24] transition-colors">
                <span className="truncate max-w-[160px]">{location}</span>
                <ChevronDown size={14} className="shrink-0 text-stone-400" />
              </div>
            </div>
          </div>

            {/* Search Bar */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative ml-4 lg:ml-8 h-11 z-[60]">
              <form onSubmit={handleSearch} className="w-full h-full flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#0a3d24] focus-within:ring-1 focus-within:ring-[#0a3d24] transition-all">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                  }}
                  placeholder="Search for fresh vegetables, fruits, groceries..."
                  className="w-full h-full bg-transparent outline-none px-4 text-sm text-gray-700"
                />

                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  title="Search by voice in Hindi or English"
                  className="p-2 mr-1.5 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer text-stone-400 hover:text-[#0a3d24] hover:bg-stone-50"
                >
                  <Mic size={18} />
                </button>

                <button type="submit" className="bg-[#0a3d24] hover:bg-[#072817] text-white px-6 font-semibold transition-colors text-sm h-full shrink-0 cursor-pointer">
                  Search
                </button>
              </form>

              {/* 1. Real Trending Searches (When focused and input is empty) */}
              <AnimatePresence>
                {isSearchFocused && !search.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.18)] border border-gray-100 p-4 z-50 font-sans max-h-[420px] overflow-y-auto"
                  >
                    {/* Real Category Pills */}
                    {navCategories && navCategories.length > 0 && (
                      <div className="mb-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                            <LayoutGrid size={12} className="text-[#0a3d24]" />
                            Explore Categories
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 inline-flex items-center gap-1">
                            <Zap size={10} className="text-amber-500 fill-amber-500" />
                            10-15 Min Delivery
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {navCategories.map((c: any) => (
                            <button
                              key={c._id || c.name}
                              type="button"
                              onClick={() => {
                                setSearch(c.name);
                                router.push(`/user/search?query=${encodeURIComponent(c.name)}`);
                                setIsSearchFocused(false);
                              }}
                              className="bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-[#0a3d24] border border-gray-200/80 hover:border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                            >
                              <span>🌿</span>
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Real Live Trending Products from MongoDB */}
                    {trendingItems && trendingItems.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block mb-2">
                          🔥 Trending In Stock Today
                        </span>

                        <div className="space-y-1.5">
                          {trendingItems.slice(0, 5).map((item: any) => {
                            const cartItem = cartdata.find(
                              (c) => c._id === item._id || c.cartItemId === item._id
                            );
                            return (
                              <div
                                key={item._id}
                                onClick={() => {
                                  setSearch("");
                                  setIsSearchFocused(false);
                                  router.push(`/product/${item._id}`);
                                }}
                                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-emerald-50/50 cursor-pointer border border-transparent hover:border-emerald-100 transition group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-xl object-contain border border-gray-100 p-1 bg-white shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#0a3d24] truncate">
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <span className="text-gray-400 font-medium">
                                        {item.unit || item.category}
                                      </span>
                                      <span className="font-black text-[#0a3d24]">
                                        ₹{item.price}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {!cartItem ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(
                                        addToCart({
                                          ...item,
                                          price: item.price,
                                          unit: item.unit || "unit",
                                          cartItemId: item._id,
                                          quantity: 1,
                                        })
                                      );
                                    }}
                                    className="bg-emerald-50 hover:bg-[#0a3d24] text-[#0a3d24] hover:text-white border border-emerald-300 px-3 py-1 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                                  >
                                    <Plus size={12} className="stroke-[3]" />
                                    <span>ADD</span>
                                  </button>
                                ) : (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center bg-white border border-[#0a3d24] rounded-xl overflow-hidden h-6.5 shadow-2xs shrink-0"
                                  >
                                    <button
                                      type="button"
                                      className="w-5.5 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-xs cursor-pointer"
                                      onClick={() =>
                                        dispatch(
                                          decreaseQuantity(cartItem.cartItemId || item._id)
                                        )
                                      }
                                    >
                                      <Minus size={10} className="stroke-[3]" />
                                    </button>
                                    <span className="px-2 text-center font-black text-xs text-gray-900">
                                      {cartItem.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      className="w-5.5 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-xs cursor-pointer"
                                      onClick={() =>
                                        dispatch(
                                          increaseQuantity(cartItem.cartItemId || item._id)
                                        )
                                      }
                                    >
                                      <Plus size={10} className="stroke-[3]" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 2. Live Search Results Suggestions Dropdown */}
              <AnimatePresence>
                {search.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden z-50 font-sans"
                  >
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin text-[#0a3d24]" /> Searching Bhopal Mandi produce...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((item) => {
                          const cartItem = cartdata.find(
                            (c) => c._id === item._id || c.cartItemId === item._id
                          );
                          return (
                            <div
                              key={item._id}
                              onClick={() => {
                                setSearch("");
                                setSearchResults([]);
                                router.push(`/product/${item._id}`);
                              }}
                              className="flex items-center justify-between gap-3 p-3 hover:bg-emerald-50/50 cursor-pointer border-b border-gray-50 last:border-0 transition"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-11 h-11 rounded-xl object-contain border border-gray-100 p-1 bg-white shrink-0"
                                />
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-sm font-bold text-gray-900 line-clamp-1">
                                    {item.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400 font-medium">
                                      {item.unit || item.category}
                                    </span>
                                    <span className="font-extrabold text-[#0a3d24]">
                                      ₹{item.price}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* 1-Click Fast ADD / Quantity Pill */}
                              {!cartItem ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      addToCart({
                                        ...item,
                                        price: item.price,
                                        unit: item.unit || "unit",
                                        cartItemId: item._id,
                                        quantity: 1,
                                      })
                                    );
                                  }}
                                  className="bg-emerald-50 hover:bg-[#0a3d24] text-[#0a3d24] hover:text-white border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                                >
                                  <Plus size={13} className="stroke-[3]" />
                                  <span>ADD</span>
                                </button>
                              ) : (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center bg-white border border-[#0a3d24] rounded-xl overflow-hidden h-7 shadow-2xs shrink-0"
                                >
                                  <button
                                    type="button"
                                    className="w-6 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-xs cursor-pointer"
                                    onClick={() =>
                                      dispatch(
                                        decreaseQuantity(cartItem.cartItemId || item._id)
                                      )
                                    }
                                  >
                                    <Minus size={11} className="stroke-[3]" />
                                  </button>
                                  <span className="px-2 text-center font-black text-xs text-gray-900">
                                    {cartItem.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="w-6 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-xs cursor-pointer"
                                    onClick={() =>
                                      dispatch(
                                        increaseQuantity(cartItem.cartItemId || item._id)
                                      )
                                    }
                                  >
                                    <Plus size={11} className="stroke-[3]" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div 
                          onClick={() => handleSearch()}
                          className="p-3 text-center text-xs font-black text-[#0a3d24] bg-emerald-50/70 hover:bg-emerald-100/80 cursor-pointer border-t border-emerald-100 flex items-center justify-center gap-1.5"
                        >
                          <span>View all results for &quot;{search.trim()}&quot;</span>
                          <ArrowRight size={13} />
                        </div>
                      </>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs font-bold text-gray-600 mb-1">
                          Koi produce nahi mila &ldquo;{search.trim()}&rdquo; ke liye
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSearch()}
                          className="text-xs font-black text-[#0a3d24] hover:underline cursor-pointer"
                        >
                          Poora store catalog search karein &rarr;
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          {/* User & Cart */}
          <div className="flex items-center gap-4 shrink-0">
            {/* User Dropdown */}
            <div
              className="hidden sm:flex items-center gap-3 cursor-pointer group relative select-none"
              ref={dropdownRef}
              onClick={(e) => {
                e.stopPropagation();
                if (!activeUser?.email) {
                  router.push("/login");
                } else {
                  setOpen((prev) => !prev);
                }
              }}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 transition-colors shadow-2xs border border-gray-200/80">
                {activeUser?.image ? (
                  <img
                    src={activeUser.image}
                    alt={activeUser.name || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-[#0a3d24]">
                  {activeUser?.email
                    ? `Hi, ${activeUser?.name ? activeUser.name.split(" ")[0] : "Shopper"}`
                    : "Welcome"}
                </span>
                <div className="text-sm font-black text-stone-800 flex items-center gap-1 group-hover:text-[#0a3d24] transition-colors">
                  {activeUser?.email ? "My Profile" : "Login / Signup"}{" "}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      open ? "rotate-180 text-[#0a3d24]" : ""
                    }`}
                  />
                </div>
              </div>

              {/* User Menu Popup */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    key="user-menu"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999] text-gray-900"
                  >
                    <div className="p-4 border-b bg-emerald-50/60 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#0a3d24] flex items-center justify-center font-black text-base shrink-0 border border-emerald-200">
                        {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-xs text-gray-900 truncate">
                          {activeUser?.name || "Shopper"}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate font-medium">
                          {activeUser?.email || "Bhopal Resident"}
                        </p>
                      </div>
                    </div>

                    {activeUser?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 text-xs font-black bg-[#0a3d24] text-white hover:bg-[#072817] transition flex items-center justify-between border-b"
                      >
                        <span>👑 Open Admin Center</span>
                        <span className="bg-yellow-300 text-gray-950 text-[9px] px-1.5 py-0.5 rounded font-black">
                          ADMIN
                        </span>
                      </Link>
                    )}

                    {activeUser?.role === "deliveryboy" && (
                      <Link
                        href="/deliveryboy"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 text-xs font-black bg-emerald-700 text-white hover:bg-emerald-800 transition flex items-center justify-between border-b"
                      >
                        <span>🛵 Delivery Partner Hub</span>
                        <span className="bg-emerald-200 text-emerald-950 text-[9px] px-1.5 py-0.5 rounded font-black">
                          RIDER
                        </span>
                      </Link>
                    )}

                    <Link
                      href="/user"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-[#0a3d24] font-bold border-b transition"
                    >
                      👤 Account Dashboard
                    </Link>

                    <Link
                      href="/user/myorder"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-[#0a3d24] font-bold border-b transition"
                    >
                      📦 My Orders & Tracking
                    </Link>

                    <Link
                      href="/offers"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-800 font-bold border-b flex items-center justify-between transition"
                    >
                      <span>🏷️ Offers & Scratch Rewards</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                        Win ₹50
                      </span>
                    </Link>



                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(new CustomEvent("trigger-pwa-install"));
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-emerald-950 bg-emerald-50 hover:bg-emerald-100 font-bold border-b flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Smartphone size={14} className="text-[#0a3d24]" />
                        <span>📲 Install SubziQuick App</span>
                      </span>
                      <span className="bg-[#0a3d24] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        Install
                      </span>
                    </button>

                    <Link
                      href="/wishlist"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-rose-50 hover:text-rose-700 font-bold border-b flex justify-between transition"
                    >
                      <span>❤️ Saved Wishlist</span>
                      {wishlistItems.length > 0 && (
                        <span className="bg-[#0a3d24] text-white text-[10px] px-2 rounded-full font-black">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        dispatch(hydrateCart({ userId: null }));
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="w-full text-left px-4 py-3 text-xs text-red-600 hover:bg-red-50 font-black flex items-center gap-2 transition cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Widget (Desktop Only to prevent mobile header overflow) */}
            <Link href="/wishlist" className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer relative">
               <Heart className="text-gray-800" size={24} />
               {mounted && wishlistItems.length > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                   {wishlistItems.length}
                 </span>
               )}
            </Link>

            {/* Cart Widget with Bounce Animation & Premium Pill Styling */}
            <motion.button
              id="desktop-header-cart-btn"
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 450, damping: 24 }}
              onClick={() => setIsMiniCartOpen(true)}
              className="flex items-center gap-2.5 bg-[#0a3d24] hover:bg-[#072817] text-white px-3.5 py-2 rounded-2xl shadow-[0_4px_16px_rgba(10,61,36,0.25)] border border-emerald-800/40 cursor-pointer shrink-0 select-none transition-all group"
            >
              <div className="relative flex items-center justify-center text-white">
                <ShoppingCart size={18} className="stroke-[2.4]" />
                {mounted && cartdata.length > 0 && (
                  <motion.span
                    key={`header-badge-${cartdata.reduce((sum, item) => sum + item.quantity, 0)}`}
                    initial={{ scale: 0.4, y: -3 }}
                    animate={{ scale: [1.3, 0.95, 1], y: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 18 }}
                    className="absolute -top-2 -right-2.5 bg-amber-400 text-stone-950 text-[9px] font-black min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center shadow-xs border border-white/80"
                  >
                    {cartdata.reduce((sum, item) => sum + item.quantity, 0)}
                  </motion.span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] font-bold text-emerald-200/90 tracking-wide uppercase">
                  {cartdata.length > 0 ? `${cartdata.length} items` : "My Basket"}
                </span>
                <span className="text-xs font-black text-white mt-0.5">
                  ₹{mounted ? cartTotal.toFixed(0) : "0"}
                </span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on small screens below md) */}
        <div ref={mobileSearchRef} className="md:hidden pb-2.5 px-3.5 pt-0 relative z-[60]">
          <form onSubmit={handleSearch} className="flex items-center bg-stone-50 rounded-xl border border-stone-200/90 focus-within:border-[#0a3d24] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-900/10 transition-all h-10 px-3 shadow-2xs">
            <Search size={16} className="text-gray-400 shrink-0 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                setIsMobileSearchFocused(true);
              }}
              placeholder="Search 'tomato', 'milk', 'mango'..."
              className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-gray-800 placeholder-gray-400"
            />

            {/* Mobile Voice Search */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Search by voice in Hindi or English"
              className="p-1.5 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer text-gray-400 hover:text-[#0a3d24]"
            >
              <Mic size={16} />
            </button>
          </form>

          {/* 1. Real Mobile Trending Searches Dropdown (When focused and input is empty) */}
          <AnimatePresence>
            {isMobileSearchFocused && !search.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-[3.2rem] left-3.5 right-3.5 bg-white rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-3.5 z-50 font-sans max-h-[380px] overflow-y-auto"
              >
                {/* Real Category Pills */}
                {navCategories && navCategories.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                        <LayoutGrid size={12} className="text-[#0a3d24]" />
                        Explore Categories
                      </span>
                      <span className="text-[9.5px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 inline-flex items-center gap-1">
                        <Zap size={10} className="text-amber-500 fill-amber-500" />
                        10-15 Min
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {navCategories.map((c: any) => (
                        <button
                          key={c._id || c.name}
                          type="button"
                          onClick={() => {
                            setSearch(c.name);
                            router.push(`/user/search?query=${encodeURIComponent(c.name)}`);
                            setIsMobileSearchFocused(false);
                          }}
                          className="bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-[#0a3d24] border border-gray-200/80 hover:border-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <span>🌿</span>
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Trending Products from Database */}
                {trendingItems && trendingItems.length > 0 && (
                  <div className="pt-2.5 border-t border-gray-100">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-2">
                      🔥 Trending Produce in Bhopal
                    </span>

                    <div className="space-y-1.5">
                      {trendingItems.slice(0, 4).map((item: any) => {
                        const cartItem = cartdata.find(
                          (c) => c._id === item._id || c.cartItemId === item._id
                        );
                        return (
                          <div
                            key={item._id}
                            onClick={() => {
                              setSearch("");
                              setIsMobileSearchFocused(false);
                              router.push(`/product/${item._id}`);
                            }}
                            className="flex items-center justify-between gap-2.5 p-1.5 rounded-xl hover:bg-emerald-50/50 cursor-pointer border border-transparent hover:border-emerald-100 transition group"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8.5 h-8.5 rounded-lg object-contain border border-gray-100 p-0.5 bg-white shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-[11.5px] font-bold text-gray-900 group-hover:text-[#0a3d24] truncate">
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="text-gray-400 font-medium">
                                    {item.unit || item.category}
                                  </span>
                                  <span className="font-black text-[#0a3d24]">
                                    ₹{item.price}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {!cartItem ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    addToCart({
                                      ...item,
                                      price: item.price,
                                      unit: item.unit || "unit",
                                      cartItemId: item._id,
                                      quantity: 1,
                                    })
                                  );
                                }}
                                className="bg-emerald-50 hover:bg-[#0a3d24] text-[#0a3d24] hover:text-white border border-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                              >
                                <Plus size={11} className="stroke-[3]" />
                                <span>ADD</span>
                              </button>
                            ) : (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center bg-white border border-[#0a3d24] rounded-lg overflow-hidden h-6 shadow-2xs shrink-0"
                              >
                                <button
                                  type="button"
                                  className="w-5 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-[10px] cursor-pointer"
                                  onClick={() =>
                                    dispatch(
                                      decreaseQuantity(cartItem.cartItemId || item._id)
                                    )
                                  }
                                >
                                  <Minus size={9} className="stroke-[3]" />
                                </button>
                                <span className="px-1.5 text-center font-black text-[10px] text-gray-900">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="w-5 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-[10px] cursor-pointer"
                                  onClick={() =>
                                    dispatch(
                                      increaseQuantity(cartItem.cartItemId || item._id)
                                    )
                                  }
                                >
                                  <Plus size={9} className="stroke-[3]" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Mobile Suggestions Dropdown */}
          <AnimatePresence>
            {search.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[3.2rem] left-3.5 right-3.5 bg-white rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-50 font-sans"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#0a3d24]" /> Searching Bhopal Mandi produce...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((item) => {
                      const cartItem = cartdata.find(
                        (c) => c._id === item._id || c.cartItemId === item._id
                      );
                      return (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSearch("");
                            setSearchResults([]);
                            router.push(`/product/${item._id}`);
                          }}
                          className="flex items-center justify-between gap-3 p-3 hover:bg-emerald-50/50 cursor-pointer border-b border-gray-50 last:border-0 transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-contain border border-gray-100 p-1 bg-white shrink-0"
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="text-gray-400 font-medium">
                                  {item.unit || item.category}
                                </span>
                                <span className="font-extrabold text-[#0a3d24]">
                                  ₹{item.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 1-Click Fast ADD / Quantity Pill */}
                          {!cartItem ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(
                                  addToCart({
                                    ...item,
                                    price: item.price,
                                    unit: item.unit || "unit",
                                    cartItemId: item._id,
                                    quantity: 1,
                                  })
                                );
                              }}
                              className="bg-emerald-50 hover:bg-[#0a3d24] text-[#0a3d24] hover:text-white border border-emerald-300 px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                            >
                              <Plus size={12} className="stroke-[3]" />
                              <span>ADD</span>
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center bg-white border border-[#0a3d24] rounded-xl overflow-hidden h-7 shadow-2xs shrink-0"
                            >
                              <button
                                type="button"
                                className="w-6 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-xs cursor-pointer"
                                onClick={() =>
                                  dispatch(
                                    decreaseQuantity(cartItem.cartItemId || item._id)
                                  )
                                }
                              >
                                <Minus size={10} className="stroke-[3]" />
                              </button>
                              <span className="px-1.5 text-center font-black text-xs text-gray-900">
                                {cartItem.quantity}
                              </span>
                              <button
                                type="button"
                                className="w-6 h-full flex items-center justify-center bg-emerald-50 text-[#0a3d24] hover:bg-[#0a3d24] hover:text-white transition font-black text-xs cursor-pointer"
                                onClick={() =>
                                  dispatch(
                                    increaseQuantity(cartItem.cartItemId || item._id)
                                  )
                                }
                              >
                                <Plus size={10} className="stroke-[3]" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div 
                      onClick={() => handleSearch()}
                      className="p-3 text-center text-xs font-black text-[#0a3d24] bg-emerald-50/70 hover:bg-emerald-100/80 cursor-pointer border-t border-emerald-100 flex items-center justify-center gap-1.5"
                    >
                      <span>View all results for &quot;{search.trim()}&quot;</span>
                      <ArrowRight size={13} />
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-gray-600 mb-1">
                      Koi produce nahi mila &ldquo;{search.trim()}&rdquo; ke liye
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSearch()}
                      className="text-xs font-black text-[#0a3d24] hover:underline cursor-pointer"
                    >
                      Poora store catalog search karein &rarr;
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tier 3: Bottom Nav Bar (Desktop Only) */}
        <div className="hidden lg:flex px-8 border-b border-gray-100 items-center justify-center gap-8 h-12 bg-white relative">
          {/* Categories Dropdown */}
          <div className="absolute left-8 h-full group">
            <div className="bg-[#0a3d24] text-white h-full px-6 flex items-center gap-3 cursor-pointer hover:bg-[#072817] transition-colors rounded-t-md font-semibold text-sm">
              <Menu size={18} />
              All Categories
              <ChevronDown size={16} className="ml-4" />
            </div>
            <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-lg border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
               <Link href="/shop" className="px-4 py-2 text-sm text-stone-700 hover:text-[#0a3d24] hover:bg-emerald-50/60 font-medium">All Products</Link>
               {navCategories.map((cat: any) => (
                 <Link key={cat._id} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="px-4 py-2 text-sm text-stone-700 hover:text-[#0a3d24] hover:bg-emerald-50/60 font-medium">
                   {cat.name}
                 </Link>
               ))}
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8 text-sm font-semibold pl-[240px]">
            <Link href="/" className={`transition-colors ${pathname === "/" ? "text-[#0a3d24] font-bold" : "text-stone-700 hover:text-[#0a3d24]"}`}>Home</Link>
            <Link href="/shop" className={`transition-colors ${pathname === "/shop" ? "text-[#0a3d24] font-bold" : "text-stone-700 hover:text-[#0a3d24]"}`}>Shop</Link>
            <Link href="/about" className={`transition-colors ${pathname === "/about" ? "text-[#0a3d24] font-bold" : "text-stone-700 hover:text-[#0a3d24]"}`}>About Us</Link>
            <Link href="/contact" className={`transition-colors ${pathname === "/contact" ? "text-[#0a3d24] font-bold" : "text-stone-700 hover:text-[#0a3d24]"}`}>Contact Us</Link>
          </nav>
        </div>
      </header>

      {/* Sidebar for Mobile */}
      {sidebar}
      
      {/* Mini Cart Slide-over */}
      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />

      {/* Quick-Commerce Bhopal Location & Address Modal */}
      <LocationModal
        isOpen={showLocationPopup}
        onClose={() => setShowLocationPopup(false)}
        currentLocation={location}
        onSelectLocation={(newLoc) => {
          setLocation(newLoc);
          if (typeof window !== "undefined") {
            localStorage.setItem("mgd_user_location", newLoc);
          }
        }}
      />

      {/* 🎙️ Voice Search in Hindi & English Modal */}
      <VoiceSearchModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onResult={(text) => setSearch(text)}
      />
    </>
  );
}