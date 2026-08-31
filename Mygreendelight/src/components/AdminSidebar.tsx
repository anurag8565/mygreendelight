"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      name: "Customer Testimonials",
      href: "/admin/managetestimonials",
      icon: <Star size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#0c592f] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-black text-base tracking-tight">
            MyGreenDelight Admin
          </span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1 bg-white/15 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
        >
          <span>Store</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-[9998] lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-[9999] lg:z-40 w-64 bg-[#093e21] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-6 border-b border-green-800/60 flex items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white"
            >
              <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-400/40 flex items-center justify-center text-green-300">
                <Truck size={20} />
              </div>
              <div className="leading-tight">
                <span className="block font-black text-base">MyGreenDelight</span>
                <span className="text-[10px] text-green-300 font-bold uppercase tracking-widest">
                  Admin Center
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#0f8646] text-white shadow-sm font-extrabold"
                      : "text-green-100/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-green-300"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Link & Status */}
        <div className="p-4 border-t border-green-800/60 bg-[#073019]">
          <div className="flex items-center gap-2 text-xs text-green-200/80 mb-3 px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[11px]">Bhopal Hubs Live</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white w-full py-2.5 rounded-xl text-xs font-extrabold transition-all border border-white/10"
          >
            <span>View Customer Store</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>
    </>
  );
}
