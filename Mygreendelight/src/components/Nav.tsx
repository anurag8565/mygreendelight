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
  MicOff
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import MiniCart from "./MiniCart";

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
  }, []);

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

  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);

  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported on this browser. Please try Google Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN"; // Seamlessly captures Hindi, Hinglish and English
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus("Listening... Bolna shuru kijiye");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearch(transcript);
          setIsListening(false);
          setVoiceStatus(null);
          router.push(`/user/search?query=${encodeURIComponent(transcript.trim())}`);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setVoiceStatus(null);
        if (event.error === "no-speech" || event.error === "aborted") {
          // Normal user silence or cancellation, handle silently
          return;
        }
        if (event.error === "not-allowed") {
          alert("Microphone access is blocked. Please allow mic permissions in your browser address bar.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatus(null);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceStatus(null);
    }
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
        <div className="py-4 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 gap-4">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setmenuopen(true)} className="lg:hidden p-1 text-gray-700">
              <Menu size={24} />
            </button>
            <Link href="/" className="text-[#0f8646] text-xl md:text-3xl font-extrabold flex items-center gap-1 md:gap-2 tracking-tight">
              <ShoppingCart className="fill-current w-6 h-6 md:w-8 md:h-8" />
              MyGreenDelight
            </Link>
          </div>

          {/* Location Dropdown (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 cursor-pointer group relative" ref={locationRef} onClick={() => setShowLocationPopup(!showLocationPopup)}>
            <MapPin className="text-gray-400 group-hover:text-[#0f8646] transition-colors" size={24} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Deliver to</span>
              <div className="text-sm font-bold text-gray-800 flex items-center gap-1 group-hover:text-[#0f8646] transition-colors">
                {location} <ChevronDown size={14} />
              </div>
            </div>
            
            <AnimatePresence>
              {showLocationPopup && (
                <motion.div 
                  key="location-popup"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }} 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 cursor-default"
                >
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800 mb-1">Choose your location</p>
                    <p className="text-xs text-gray-500">Select a delivery location to see product availability and delivery options</p>
                  </div>
                  <div className="p-3">
                    <button 
                      disabled={isDetectingLocation}
                      onClick={handleDetectLocation} 
                      className={`w-full text-left px-3 py-2 text-sm text-[#0f8646] hover:bg-green-50 font-bold rounded-lg flex items-center gap-2 ${isDetectingLocation ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isDetectingLocation ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Detecting...
                        </>
                      ) : (
                        <>
                          <MapPin size={16} /> Detect my location
                        </>
                      )}
                    </button>
                    <div className="my-2 border-t border-gray-100"></div>
                    {["Bhopal, Madhya Pradesh", "Indore, Madhya Pradesh", "Mumbai, Maharashtra", "Delhi, NCR", "Bangalore, Karnataka"].map((loc) => (
                      <button 
                        key={loc}
                        onClick={() => { setLocation(loc); setShowLocationPopup(false); }} 
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${location === loc ? 'bg-green-50 text-[#0f8646] font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                  title="Search by voice (e.g. Tamatar, Fresh Apple, Milk)"
                  className={`p-2 mr-1.5 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300' 
                      : 'text-gray-400 hover:text-[#0f8646] hover:bg-green-50'
                  }`}
                >
                  <Mic size={18} className={isListening ? "animate-bounce" : ""} />
                </button>

                <button type="submit" className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 font-semibold transition-colors text-sm h-full shrink-0">
                  Search
                </button>
              </form>

              {/* Listening Overlay Tooltip */}
              {isListening && (
                <div className="absolute top-full left-0 mt-2 bg-red-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>Listening... Bolna shuru kijiye (e.g. Tamatar, Palak)</span>
                </div>
              )}

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
                        {searchResults.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              setSearch("");
                              setSearchResults([]);
                              router.push(`/product/${item._id}`);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0"
                          >
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-contain border border-gray-100 p-1 bg-white" />
                            <div className="flex flex-col flex-1">
                              <span className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</span>
                              <span className="text-xs text-gray-500">{item.category}</span>
                            </div>
                            <span className="text-sm font-bold text-[#0f8646]">₹{item.price}</span>
                          </div>
                        ))}
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
                    <Link href="/user/myorder" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0f8646] font-medium border-b">My Orders</Link>
                    <Link href="/wishlist" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0f8646] font-medium border-b flex justify-between">Wishlist {wishlistItems.length > 0 && <span className="bg-[#0f8646] text-white text-[10px] px-2 rounded-full">{wishlistItems.length}</span>}</Link>
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Widget */}
            <Link href="/wishlist" className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer relative">
               <Heart className="text-gray-800" size={24} />
               {mounted && wishlistItems.length > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                   {wishlistItems.length}
                 </span>
               )}
            </Link>

            {/* Cart Widget */}
            <div onClick={() => setIsMiniCartOpen(true)} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ml-1">
              <div className="relative">
                <ShoppingCart className="text-gray-800" size={28} />
                {mounted && cartdata.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#0f8646] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
        <div ref={mobileSearchRef} className="md:hidden pb-4 px-4 pt-2 relative z-[60]">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-transparent focus-within:border-[#0f8646] focus-within:bg-white transition-all shadow-inner h-11">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => { if(search.trim() && searchResults.length===0) setSearch(search+" ") }}
              placeholder="Search for groceries..."
              className="flex-1 px-4 py-2 bg-transparent outline-none text-sm text-gray-700"
            />

            {/* Mobile Voice Search */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Search by voice"
              className={`p-2 mr-1 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300' 
                  : 'text-gray-500 hover:text-[#0f8646]'
              }`}
            >
              <Mic size={18} className={isListening ? "animate-bounce" : ""} />
            </button>

            <button type="submit" className="px-4 bg-gray-200 text-gray-600 hover:bg-[#0f8646] hover:text-white transition-colors h-full flex items-center justify-center">
              <Search size={18} />
            </button>
          </form>

          {/* Listening Overlay Tooltip on Mobile */}
          {isListening && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-bounce justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Listening... Bolna shuru kijiye</span>
            </div>
          )}

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
                    {searchResults.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          setSearch("");
                          setSearchResults([]);
                          router.push(`/product/${item._id}`);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-contain border border-gray-100 p-1 bg-white" />
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.category}</span>
                        </div>
                        <span className="text-sm font-bold text-[#0f8646]">₹{item.price}</span>
                      </div>
                    ))}
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

      {/* Mobile Sticky Floating Cart */}
      {mounted && cartdata.length > 0 && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-[900]">
          <div 
            onClick={() => setIsMiniCartOpen(true)}
            className="bg-[#0f8646] text-white rounded-xl p-4 flex items-center justify-between shadow-2xl cursor-pointer hover:bg-[#0c6a38] transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-xs font-medium text-green-100">{cartdata.length} Item{cartdata.length > 1 ? 's' : ''}</span>
              <span className="font-extrabold text-lg">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 font-bold bg-white/20 px-4 py-2 rounded-lg">
              View Cart <ArrowRight size={18} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}