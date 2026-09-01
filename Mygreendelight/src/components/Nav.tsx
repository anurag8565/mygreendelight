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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity, hydrateCart } from "@/redux/CartSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import VoiceSearchModal from "./VoiceSearchModal";
import MiniCart from "./MiniCart";
import LocationModal from "./LocationModal";

interface iUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryboy";
  image?: string;
}

export default function Nav({ user }: { user: iUser }) {
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
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateCart());
    if (typeof window !== "undefined") {
      const savedLoc = localStorage.getItem("mgd_user_location");
      if (savedLoc) setLocation(savedLoc);
    }
  }, [dispatch]);

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
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch categories for the Nav dropdown
    axios.get("/api/admin/category").then(res => {
      if (res.data.success) {
        setNavCategories(res.data.categories);
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
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setmenuopen(false)} className="fixed inset-0 bg-black/40 z-[999]" />
      <motion.div key="sidebar" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.3 }} className="fixed top-0 left-0 w-72 h-screen bg-white z-[1000] shadow-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <Link href="/" className="text-[#0f8646] text-2xl font-extrabold flex items-center gap-2" onClick={() => setmenuopen(false)}>
            <ShoppingCart className="fill-current" />
            MyGreenDelight
          </Link>
          <button onClick={() => setmenuopen(false)} className="p-2 rounded-full hover:bg-gray-100">
            <X className="text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          <Link href="/" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b ${pathname === "/" ? "text-[#0f8646]" : "text-gray-700"}`}>Home</Link>
          <Link href="/shop" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b ${pathname === "/shop" ? "text-[#0f8646]" : "text-gray-700"}`}>Shop</Link>
          <Link href="/about" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b ${pathname === "/about" ? "text-[#0f8646]" : "text-gray-700"}`}>About Us</Link>
          <Link href="/contact" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b ${pathname === "/contact" ? "text-[#0f8646]" : "text-gray-700"}`}>Contact Us</Link>
          <Link href="/wishlist" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b ${pathname === "/wishlist" ? "text-[#0f8646]" : "text-gray-700"}`}>Wishlist</Link>
          <Link href="/user/wallet" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b flex items-center justify-between ${pathname === "/user/wallet" ? "text-[#0f8646]" : "text-gray-700"}`}>
            <span>MGD Green Wallet</span>
            <span className="bg-green-100 text-[#0f8646] text-[10px] font-black px-2 py-0.5 rounded-full">+10% Bonus</span>
          </Link>
          <Link href="/user/subscriptions" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b flex items-center justify-between ${pathname === "/user/subscriptions" ? "text-[#0f8646]" : "text-gray-700"}`}>
            <span>🥛 7 AM Subscriptions</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full">New</span>
          </Link>
          <Link href="/produce-guide" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b flex items-center justify-between ${pathname === "/produce-guide" ? "text-[#0f8646]" : "text-gray-700"}`}>
            <span>🍅 Storage & Shelf Life Guide</span>
            <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded-full">Hacks</span>
          </Link>
          <Link href="/shop/gift-basket" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b flex items-center justify-between ${pathname === "/shop/gift-basket" ? "text-[#0f8646]" : "text-gray-700"}`}>
            <span>🎁 Gift a Fresh Hamper</span>
            <span className="bg-pink-100 text-pink-800 text-[10px] font-black px-2 py-0.5 rounded-full">Gift</span>
          </Link>
          <Link href="/user/myorder" onClick={() => setmenuopen(false)} className={`font-semibold py-2 border-b ${pathname === "/user/myorder" ? "text-[#0f8646]" : "text-gray-700"}`}>My Orders</Link>
          
          {user.role === "admin" && (
            <>
              <h3 className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Center</h3>
              <Link href="/admin" onClick={() => setmenuopen(false)} className="flex items-center gap-3 text-gray-700 py-2 hover:text-[#0f8646] font-bold"><PlusCircle size={18}/> Overview Dashboard</Link>
              <Link href="/admin/manageorder" onClick={() => setmenuopen(false)} className="flex items-center gap-3 text-gray-700 py-2 hover:text-[#0f8646]"><ClipboardCheck size={18}/> Manage Orders</Link>
              <Link href="/admin/viewgrocery" onClick={() => setmenuopen(false)} className="flex items-center gap-3 text-gray-700 py-2 hover:text-[#0f8646]"><Box size={18}/> Inventory Stock</Link>
              <Link href="/admin/addgrocery" onClick={() => setmenuopen(false)} className="flex items-center gap-3 text-gray-700 py-2 hover:text-[#0f8646]"><PlusCircle size={18}/> Add Produce</Link>
              <Link href="/admin/managecoupons" onClick={() => setmenuopen(false)} className="flex items-center gap-3 text-gray-700 py-2 hover:text-[#0f8646]"><ClipboardCheck size={18}/> Coupons & Deals</Link>
              <Link href="/admin/manageinquiries" onClick={() => setmenuopen(false)} className="flex items-center gap-3 text-gray-700 py-2 hover:text-[#0f8646]"><ClipboardCheck size={18}/> Customer Inquiries</Link>
            </>
          )}

          <button onClick={() => { setmenuopen(false); signOut({ callbackUrl: "/login" }); }} className="flex items-center gap-2 mt-4 text-red-600 font-bold py-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      <header className="w-full flex flex-col z-50 bg-white">
        {/* Tier 1: Top Bar (Green) */}
        <div className="bg-[#0f8646] text-white py-1.5 px-4 md:px-8 text-xs font-medium flex justify-between items-center hidden sm:flex">
          <div className="flex items-center gap-2">
            <Truck size={14} />
            <span>FREE DELIVERY on orders above ₹499 in Bhopal</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/user/myorder" className="cursor-pointer hover:text-green-200">Track Order</Link>
            <Link href="/contact" className="cursor-pointer hover:text-green-200">Help & Support</Link>
            {user.role === "admin" && (
              <Link href="/admin" className="cursor-pointer font-bold text-yellow-300 hover:underline">Admin Center</Link>
            )}
          </div>
        </div>

        {/* Tier 2: Main Middle Bar */}
        <div className="py-2.5 sm:py-4 px-3 sm:px-4 md:px-8 flex items-center justify-between border-b border-gray-100 gap-2 sm:gap-4 w-full max-w-full overflow-hidden">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <button onClick={() => setmenuopen(true)} className="lg:hidden p-1 text-gray-700 hover:text-[#0f8646] shrink-0">
              <Menu size={22} />
            </button>
            <div className="flex flex-col min-w-0">
              <Link href="/" className="text-[#0f8646] text-base sm:text-xl md:text-3xl font-extrabold flex items-center gap-1 md:gap-2 tracking-tight truncate">
                <ShoppingCart className="fill-current w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 shrink-0" />
                <span className="truncate">MyGreenDelight</span>
              </Link>
              <button 
                onClick={() => setShowLocationPopup(true)} 
                className="lg:hidden flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-[#0f8646] transition text-left mt-0.5"
              >
                <span className="text-[#0f8646] font-black shrink-0">⚡ 10 MINS</span>
                <span>•</span>
                <span className="truncate max-w-[95px] sm:max-w-[140px]">{location}</span>
                <ChevronDown size={10} className="shrink-0" />
              </button>
            </div>
          </div>

          {/* Location Dropdown (Desktop) */}
          <div
            className="hidden lg:flex items-center gap-2 shrink-0 cursor-pointer group relative hover:opacity-90 transition"
            onClick={() => setShowLocationPopup(true)}
          >
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#0f8646] group-hover:bg-[#0f8646] group-hover:text-white transition-colors">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Deliver to</span>
              <div className="text-xs sm:text-sm font-black text-gray-800 flex items-center gap-1 group-hover:text-[#0f8646] transition-colors">
                <span className="truncate max-w-[160px]">{location}</span>
                <ChevronDown size={14} className="shrink-0 text-gray-400" />
              </div>
            </div>
          </div>

            {/* Search Bar */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative ml-4 lg:ml-8 h-11 z-[60]">
              <form onSubmit={handleSearch} className="w-full h-full flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#0f8646] focus-within:ring-1 focus-within:ring-[#0f8646] transition-all">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => { if(search.trim() && searchResults.length===0) setSearch(search+" ") }}
                  placeholder="Search for fresh vegetables, fruits, groceries..."
                  className="w-full h-full bg-transparent outline-none px-4 text-sm text-gray-700"
                />

                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  title="Search by voice in Hindi or English"
                  className="p-2 mr-1.5 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer text-gray-400 hover:text-[#0f8646] hover:bg-green-50"
                >
                  <Mic size={18} />
                </button>

                <button type="submit" className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 font-semibold transition-colors text-sm h-full shrink-0">
                  Search
                </button>
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {search.trim() && (searchResults.length > 0 || isSearching) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                  >
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin text-[#0f8646]" /> Searching...
                      </div>
                    ) : (
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
                              className="flex items-center justify-between gap-3 p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 transition"
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
                                    <span className="font-extrabold text-[#0f8646]">
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
                                  className="bg-emerald-50 hover:bg-[#0f8646] text-[#0f8646] hover:text-white border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                                >
                                  <Plus size={13} className="stroke-[3]" />
                                  <span>ADD</span>
                                </button>
                              ) : (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center bg-white border border-[#0f8646] rounded-xl overflow-hidden h-7 shadow-2xs shrink-0"
                                >
                                  <button
                                    type="button"
                                    className="w-6 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-xs cursor-pointer"
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
                                    className="w-6 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-xs cursor-pointer"
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
                          className="p-3 text-center text-sm text-[#0f8646] font-bold bg-green-50/50 hover:bg-green-100 cursor-pointer"
                        >
                          View all results for "{search.trim()}"
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          {/* User & Cart */}
          <div className="flex items-center gap-4 shrink-0">
            {/* User Dropdown */}
            <div className="hidden sm:flex items-center gap-3 cursor-pointer group relative" ref={dropdownRef} onClick={() => setOpen(!open)}>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-green-50 transition-colors">
                {user.image ? <img src={user.image} className="w-full h-full rounded-full object-cover" /> : <UserIcon size={20} />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-semibold">Login / Signup</span>
                <div className="text-sm font-bold text-gray-800 flex items-center gap-1 group-hover:text-[#0f8646] transition-colors">
                  My Account <ChevronDown size={14} />
                </div>
              </div>

              {/* User Menu Popup */}
              <AnimatePresence>
                {open && (
                  <motion.div key="user-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b bg-gray-50">
                      <p className="font-bold text-gray-800">{user.name || "Guest"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2.5 text-xs font-black bg-[#0f8646] text-white hover:bg-[#0c6a38] transition flex items-center justify-between border-b"
                      >
                        <span>👑 Open Admin Center</span>
                        <span className="bg-yellow-300 text-gray-950 text-[9px] px-1.5 py-0.5 rounded font-black">
                          ADMIN
                        </span>
                      </Link>
                    )}
                    <Link href="/user/myorder" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0f8646] font-medium border-b">My Orders</Link>
                    <Link href="/user/wallet" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0f8646] font-medium border-b flex items-center justify-between">
                      <span>MGD Green Wallet</span>
                      <span className="bg-green-100 text-[#0f8646] text-[10px] font-black px-2 py-0.5 rounded-full">+10% Bonus</span>
                    </Link>
                    <Link href="/user/subscriptions" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0f8646] font-medium border-b flex items-center justify-between">
                      <span>🥛 7 AM Subscriptions</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full">New</span>
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0f8646] font-medium border-b flex justify-between">Wishlist {wishlistItems.length > 0 && <span className="bg-[#0f8646] text-white text-[10px] px-2 rounded-full">{wishlistItems.length}</span>}</Link>
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2">
                      <LogOut size={16} /> Logout
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

            {/* Cart Widget */}
            <div onClick={() => setIsMiniCartOpen(true)} className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center text-[#0f8646] border border-green-200/60 shadow-2xs">
                <ShoppingCart size={19} className="stroke-[2.2]" />
                {mounted && cartdata.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0f8646] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartdata.length}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[12px] font-extrabold text-gray-900">₹{mounted ? cartTotal.toFixed(2) : "0.00"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on small screens below md) */}
        <div ref={mobileSearchRef} className="md:hidden pb-2.5 px-3.5 pt-0 relative z-[60]">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50/90 rounded-xl border border-gray-200/90 focus-within:border-[#0f8646] focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 transition-all h-10 px-3 shadow-2xs">
            <Search size={16} className="text-gray-400 shrink-0 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => { if(search.trim() && searchResults.length===0) setSearch(search+" ") }}
              placeholder="Search 'tomato', 'milk', 'mango'..."
              className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-gray-800 placeholder-gray-400"
            />

            {/* Mobile Voice Search */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Search by voice in Hindi or English"
              className="p-1.5 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer text-gray-400 hover:text-[#0f8646]"
            >
              <Mic size={16} />
            </button>
          </form>

          {/* Mobile Suggestions Dropdown */}
          <AnimatePresence>
            {search.trim() && (searchResults.length > 0 || isSearching) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[3.2rem] left-4 right-4 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#0f8646]" /> Searching...
                  </div>
                ) : (
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
                          className="flex items-center justify-between gap-3 p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 transition"
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
                                <span className="font-extrabold text-[#0f8646]">
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
                              className="bg-emerald-50 hover:bg-[#0f8646] text-[#0f8646] hover:text-white border border-emerald-300 px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                            >
                              <Plus size={12} className="stroke-[3]" />
                              <span>ADD</span>
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center bg-white border border-[#0f8646] rounded-xl overflow-hidden h-7 shadow-2xs shrink-0"
                            >
                              <button
                                type="button"
                                className="w-6 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-xs cursor-pointer"
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
                                className="w-6 h-full flex items-center justify-center bg-green-50 text-[#0f8646] hover:bg-[#0f8646] hover:text-white transition font-black text-xs cursor-pointer"
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
                      className="p-3 text-center text-sm text-[#0f8646] font-bold bg-green-50/50 hover:bg-green-100 cursor-pointer"
                    >
                      View all results
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tier 3: Bottom Nav Bar (Desktop Only) */}
        <div className="hidden lg:flex px-8 border-b border-gray-100 items-center justify-center gap-8 h-12 bg-white relative">
          {/* Categories Dropdown */}
          <div className="absolute left-8 h-full group">
            <div className="bg-[#0f8646] text-white h-full px-6 flex items-center gap-3 cursor-pointer hover:bg-[#0c6a38] transition-colors rounded-t-md font-semibold text-sm">
              <Menu size={18} />
              All Categories
              <ChevronDown size={16} className="ml-4" />
            </div>
            <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
               <Link href="/shop" className="px-4 py-2 text-sm text-gray-700 hover:text-[#0f8646] hover:bg-green-50 font-medium">All Products</Link>
               {navCategories.map((cat: any) => (
                 <Link key={cat._id} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="px-4 py-2 text-sm text-gray-700 hover:text-[#0f8646] hover:bg-green-50 font-medium">
                   {cat.name}
                 </Link>
               ))}
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8 text-sm font-semibold pl-[240px]">
            <Link href="/" className={`transition-colors ${pathname === "/" ? "text-[#0f8646] font-bold" : "text-gray-700 hover:text-[#0f8646]"}`}>Home</Link>
            <Link href="/shop" className={`transition-colors ${pathname === "/shop" ? "text-[#0f8646] font-bold" : "text-gray-700 hover:text-[#0f8646]"}`}>Shop</Link>
            <Link href="/about" className={`transition-colors ${pathname === "/about" ? "text-[#0f8646] font-bold" : "text-gray-700 hover:text-[#0f8646]"}`}>About Us</Link>
            <Link href="/contact" className={`transition-colors ${pathname === "/contact" ? "text-[#0f8646] font-bold" : "text-gray-700 hover:text-[#0f8646]"}`}>Contact Us</Link>
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
      />
    </>
  );
}