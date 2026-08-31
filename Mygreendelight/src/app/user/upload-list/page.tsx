"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  ShoppingBag,
  Check,
  ArrowRight,
  Plus,
  Minus,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [rawText, setRawText] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchedItems, setMatchedItems] = useState<any[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const sampleLists = [
    {
      title: "Mummy’s Sunday Sabzi List",
      text: "2kg Aloo\n1kg Pyaaz\n500g Desi Tamatar\n250g Palak\n100g Dhaniya Mirchi\n1 packet Doodh",
    },
    {
      title: "Daily Morning Breakfast List",
      text: "1 packet A2 Cow Milk\n1 loaf Brown Bread\n6 pcs Desi Eggs\n200g Malai Paneer",
    },
    {
      title: "Salad & Fitness Essentials",
      text: "Lettuce\nCucumber\nCherry Tomatoes\nAvocado\nLemon",
    },
  ];

  const handleMatchList = async (textToMatch = rawText) => {
    if (!textToMatch.trim()) {
      setMsg({ type: "error", text: "Please type or paste your grocery list first!" });
      return;
    }

    setIsMatching(true);
    setMsg(null);
    setIsAddedToCart(false);

    try {
      const res = await axios.post("/api/user/parse-list", { rawText: textToMatch });
      if (res.data.success) {
        setMatchedItems(res.data.matchedItems || []);
        setUnmatched(res.data.unmatchedQueries || []);
        setMsg({ type: "success", text: res.data.message });
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Matching failed" });
    } finally {
      setIsMatching(false);
    }
  };

  const handleQuantityChange = (idx: number, delta: number) => {
    const updated = [...matchedItems];
    updated[idx].quantity = Math.max(1, (updated[idx].quantity || 1) + delta);
    setMatchedItems(updated);
  };

  const handleAddAllToCart = () => {
    if (matchedItems.length === 0) return;

    matchedItems.forEach((item) => {
      dispatch(
        addToCart({
          _id: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit || "unit",
          image: item.image,
          category: item.category,
          stock: 50,
          quantity: item.quantity || 1,
          cartItemId: item._id,
        } as any)
      );
    });

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const totalAmount = matchedItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0f8646] text-white flex items-center justify-center shadow-md">
                <FileText size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Grocery List & Parchi 1-Click Auto-Cart Matcher
                </h1>
                <p className="text-xs text-gray-500">
                  Type or paste your raw paper list • AI auto-matches with real Bhopal farm produce
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="bg-white border border-gray-200 hover:border-[#0f8646] text-gray-800 hover:text-[#0f8646] px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>Shop Produce</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Sample Quick List Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 shrink-0">Try Sample:</span>
          {sampleLists.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setRawText(s.text);
                handleMatchList(s.text);
              }}
              className="bg-white hover:bg-green-50 text-gray-700 hover:text-[#0f8646] border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all shadow-2xs cursor-pointer"
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Text Input Box */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs mb-6">
          <label className="text-xs font-bold text-gray-700 uppercase block mb-2">
            Paste or Type Your Grocery List (1 Item per line)
          </label>

          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g.&#10;2kg Aloo&#10;1kg Pyaaz&#10;500g Desi Tamatar&#10;1 packet Doodh&#10;200g Paneer"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs sm:text-sm font-bold text-gray-900 outline-none focus:border-[#0f8646] focus:bg-white transition"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Sparkles size={14} className="text-amber-500" />
              <span>Supports Hindi & English item names with quantities (kg, g, pkt)</span>
            </div>

            <button
              type="button"
              onClick={() => handleMatchList()}
              disabled={isMatching || !rawText.trim()}
              className="w-full sm:w-auto bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Zap size={16} />
              <span>{isMatching ? "Matching Farm Produce..." : "Match List & Create Cart"}</span>
            </button>
          </div>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {msg.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Matched Items Section */}
        {matchedItems.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Matched Real Store Items ({matchedItems.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Review quantities before adding everything to cart in 1 shot
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Estimated</span>
                <span className="text-xl font-black text-gray-900">₹{totalAmount}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {matchedItems.map((item, idx) => (
                <div
                  key={item._id}
                  className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-3"
                >
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                    <span className="text-[10px] font-bold text-[#0f8646]">
                      ₹{item.price}/{item.unit}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(idx, -1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2 text-xs font-black text-gray-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(idx, 1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom 1-Click Action */}
            <button
              type="button"
              onClick={handleAddAllToCart}
              className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                isAddedToCart
                  ? "bg-green-800 text-white"
                  : "bg-[#0f8646] hover:bg-[#0c6a38] text-white"
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check size={18} /> <span>All Items Added to Cart! 🎉</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> <span>Add All {matchedItems.length} Matched Items to Cart</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Unmatched Notices */}
        {unmatched.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-800">
            <span className="font-bold block mb-1">
              ⚠️ {unmatched.length} item(s) could not be matched automatically:
            </span>
            <ul className="list-disc pl-4 space-y-0.5 text-amber-700">
              {unmatched.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
