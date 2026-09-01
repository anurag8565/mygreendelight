"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  Star,
  ShoppingBag,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Truck,
  TrendingUp,
  Flame,
  Gift,
  ChefHat,
  Utensils,
  Milk,
  Salad,
  Heart,
  FileText,
  Bell,
  BookOpen,
  Percent,
  Radio,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Manage Orders",
      href: "/admin/manageorder",
      icon: <ShoppingBag size={18} />,
    },
    {
      name: "All Produce & Stock",
      href: "/admin/viewgrocery",
      icon: <Package size={18} />,
    },
    {
      name: "Add New Produce",
      href: "/admin/addgrocery",
      icon: <PlusCircle size={18} />,
    },
    {
      name: "Bulk Import (CSV/JSON)",
      href: "/admin/bulk-upload",
      icon: <FolderTree size={18} />,
    },
    {
      name: "Categories",
      href: "/admin/manage-categories",
      icon: <FolderTree size={18} />,
    },
    {
      name: "Recipe Kits (Combos)",
      href: "/admin/manage-recipes",
      icon: <ChefHat size={18} />,
    },
    {
      name: "Dinner Decider Wheel",
      href: "/admin/manage-dinner-wheel",
      icon: <Utensils size={18} />,
    },
    {
      name: "Morning Subscriptions",
      href: "/admin/manage-subscriptions",
      icon: <Milk size={18} />,
    },
    {
      name: "Custom Salad Boxes",
      href: "/admin/manage-custom-boxes",
      icon: <Salad size={18} />,
    },
    {
      name: "Harvest Stock Alerts",
      href: "/admin/manage-stock-alerts",
      icon: <Bell size={18} />,
    },
    {
      name: "Produce Storage Guide",
      href: "/admin/manage-produce-guide",
      icon: <BookOpen size={18} />,
    },
    {
      name: "Value Combos & Packs",
      href: "/admin/manage-combos",
      icon: <Percent size={18} />,
    },
    {
      name: "Gift Hampers & Baskets",
      href: "/admin/manage-gift-baskets",
      icon: <Gift size={18} />,
    },
    {
      name: "Customer Reviews",
      href: "/admin/manage-reviews",
      icon: <Star size={18} />,
    },
    {
      name: "Coupons & Discounts",
      href: "/admin/managecoupons",
      icon: <Tag size={18} />,
    },
    {
      name: "Flash Deals Timer",
      href: "/admin/manage-flash-deals",
      icon: <Flame size={18} />,
    },
    {
      name: "Scratch Card Rewards",
      href: "/admin/manage-rewards",
      icon: <Gift size={18} />,
    },
    {
      name: "Mandi Live Rates",
      href: "/admin/manage-mandi",
      icon: <TrendingUp size={18} />,
    },
    {
      name: "Customer Inquiries",
      href: "/admin/manageinquiries",
      icon: <MessageSquare size={18} />,
    },
    {
      name: "Hero & Promo Banners",
      href: "/admin/managebanners",
      icon: <ImageIcon size={18} />,
    },
    {
      name: "Broadcast Alerts",
      href: "/admin/manage-broadcast",
      icon: <Radio size={18} />,
    },
    {
      name: "Customer Testimonials",
      href: "/admin/managetestimonials",
      icon: <Star size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Top Header (Fixed at top on phones) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#093e21] text-white px-4 flex items-center justify-between z-50 shadow-md border-b border-green-800/60">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition"
            aria-label="Open Admin Menu"
          >
            <Menu size={20} />
          </button>
          <div className="leading-tight">
            <span className="font-black text-sm block">MyGreenDelight</span>
            <span className="text-[9px] text-green-300 font-bold uppercase tracking-widest">
              Admin Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition"
          >
            <span>Store</span>
            <ExternalLink size={12} />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Logout from Admin"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-[999] lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer for Desktop & Mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-[1000] lg:z-40 w-72 lg:w-64 bg-[#093e21] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-5 border-b border-green-800/60 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 font-black text-lg tracking-tight text-white"
            >
              <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-400/40 flex items-center justify-center text-green-300 shrink-0">
                <Truck size={18} />
              </div>
              <div className="leading-tight">
                <span className="block font-black text-sm sm:text-base">MyGreenDelight</span>
                <span className="text-[9px] text-green-300 font-bold uppercase tracking-widest">
                  Admin Center
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-gray-300 hover:text-white rounded-lg bg-white/10"
              aria-label="Close Admin Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-175px)] scrollbar-thin scrollbar-thumb-green-800">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#0f8646] text-white shadow-sm font-extrabold"
                      : "text-green-100/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-green-300 shrink-0"}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Link, Status & Logout */}
        <div className="p-4 border-t border-green-800/60 bg-[#073019] shrink-0 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-green-200/80 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-[11px] truncate">Bhopal Dark Stores Live</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-xs font-extrabold transition-all border border-white/10"
            >
              <span>Store</span>
              <ExternalLink size={12} />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
