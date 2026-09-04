"use client";

import React from "react";
import { motion } from "framer-motion";

export interface FilterChip {
  id: string;
  label: string;
  icon: string;
  filterFn: (item: any) => boolean;
}

export const filterChipsList: FilterChip[] = [
  {
    id: "all",
    label: "All Produce",
    icon: "🌱",
    filterFn: () => true,
  },
  {
    id: "leafy",
    label: "Saag & Leafy",
    icon: "🥬",
    filterFn: (item) =>
      item.name?.toLowerCase().includes("palak") ||
      item.name?.toLowerCase().includes("spinach") ||
      item.name?.toLowerCase().includes("methi") ||
      item.name?.toLowerCase().includes("coriander") ||
      item.name?.toLowerCase().includes("dhaniya") ||
      item.name?.toLowerCase().includes("lettuce") ||
      item.name?.toLowerCase().includes("saag") ||
      item.category?.toLowerCase().includes("vegetables"),
  },
  {
    id: "daily",
    label: "Daily Essentials",
    icon: "🥔",
    filterFn: (item) =>
      item.name?.toLowerCase().includes("potato") ||
      item.name?.toLowerCase().includes("aloo") ||
      item.name?.toLowerCase().includes("onion") ||
      item.name?.toLowerCase().includes("pyaaz") ||
      item.name?.toLowerCase().includes("tomato") ||
      item.name?.toLowerCase().includes("tamatar") ||
      item.name?.toLowerCase().includes("ginger") ||
      item.name?.toLowerCase().includes("garlic"),
  },
  {
    id: "fruits",
    label: "Fresh Fruits",
    icon: "🍎",
    filterFn: (item) => item.category?.toLowerCase().includes("fruit"),
  },
  {
    id: "dairy",
    label: "Desi Dairy & Milk",
    icon: "🥛",
    filterFn: (item) =>
      item.category?.toLowerCase().includes("dairy") ||
      item.name?.toLowerCase().includes("milk") ||
      item.name?.toLowerCase().includes("paneer") ||
      item.name?.toLowerCase().includes("ghee") ||
      item.name?.toLowerCase().includes("butter") ||
      item.name?.toLowerCase().includes("dahi"),
  },
  {
    id: "jain",
    label: "Jain Friendly",
    icon: "🟢",
    filterFn: (item) => {
      const name = item.name?.toLowerCase() || "";
      const isRoot =
        name.includes("onion") ||
        name.includes("pyaaz") ||
        name.includes("garlic") ||
        name.includes("lehsun") ||
        name.includes("potato") ||
        name.includes("aloo") ||
        name.includes("ginger") ||
        name.includes("adrak") ||
        name.includes("carrot") ||
        name.includes("radish");
      return !isRoot;
    },
  },
  {
    id: "under49",
    label: "Under ₹49",
    icon: "⚡",
    filterFn: (item) => (item.price || 0) <= 49,
  },
];

interface QuickFilterChipsProps {
  activeChip: string;
  onSelectChip: (chipId: string) => void;
}

export default function QuickFilterChips({
  activeChip,
  onSelectChip,
}: QuickFilterChipsProps) {
  return (
    <div className="w-full py-0.5">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none snap-x">
        {filterChipsList.map((chip) => {
          const isActive = activeChip === chip.id;
          return (
            <motion.button
              key={chip.id}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onSelectChip(chip.id)}
              className={`snap-start shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? "bg-[#0f8646] text-white border-[#0f8646] shadow-2xs"
                  : "bg-white text-gray-600 border-gray-200/80 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span className="text-[11px] leading-none">{chip.icon}</span>
              <span className="whitespace-nowrap tracking-tight">{chip.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
