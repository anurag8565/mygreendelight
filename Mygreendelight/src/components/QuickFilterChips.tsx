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
    <div className="w-full py-1">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
        {filterChipsList.map((chip) => {
          const isActive = activeChip === chip.id;
          return (
            <motion.button
              key={chip.id}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onSelectChip(chip.id)}
              className={`snap-start shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? "bg-[#0c831f] text-white border-[#0c831f] shadow-xs"
                  : "bg-[#f8f9fa] text-gray-700 border-gray-200/80 hover:bg-gray-100"
              }`}
            >
              <span className="text-xs">{chip.icon}</span>
              <span>{chip.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
