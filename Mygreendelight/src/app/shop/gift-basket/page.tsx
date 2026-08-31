"use client";

import React, { useState, useEffect } from "react";
import { Gift, Heart, Sparkles, ShoppingBag, Check, ArrowRight, X, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function GiftBasketPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [baskets, setBaskets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBasket, setSelectedBasket] = useState<any | null>(null);
  const [giftNote, setGiftNote] = useState("Wishing you great health and happiness with farm fresh produce!");
  const [recipientName, setRecipientName] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    axios
      .get("/api/gift-baskets")
      .then((res) => {
        if (res.data.success) {
          setBaskets(res.data.baskets || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddGift = (basket: any) => {
    dispatch(
      addToCart({
        _id: basket._id,
        name: `🎁 Gift Hamper: ${basket.title} (For ${recipientName || "Loved One"})`,
        price: basket.price,
        unit: "Gift Basket",
        image: basket.image,
        category: "Gift Hampers",
        stock: 50,
        quantity: 1,
        cartItemId: `${basket._id}-gift`,
      } as any)
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setSelectedBasket(null);
    }, 2000);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col justify-between">
      <Nav user={{ name: "User", email: "", role: "user", image: "", password: "" } as any} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            <Gift size={14} />
            <span>Farm-To-Doorstep Gifting across Bhopal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
            Send a Fresh Farm & Fruit Hamper to Loved Ones
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
            Gift healthy, ozone-sanitized fresh fruit hampers and wellness baskets to parents, relatives, and friends with custom greeting cards.
          </p>
        </div>

        {/* Baskets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {baskets.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Ribbon Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-pink-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                  {b.ribbonColor || "Gift Packaging"}
                </span>
              </div>

              <div>
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-50 mb-4 relative">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <span className="text-[10px] font-bold text-pink-700 uppercase block mb-1">
                  {b.occasion}
                </span>
                <h3 className="font-black text-base text-gray-900 line-clamp-1 mb-1">{b.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                  {b.description}
                </p>

                <div className="space-y-1 mb-4 bg-gray-50 p-2.5 rounded-xl text-[11px] text-gray-600 font-medium">
                  {b.contents?.slice(0, 3).map((item: string, idx: number) => (
                    <div key={idx} className="truncate">
                      • {item}
                    </div>
                  ))}
                  {b.contents?.length > 3 && (
                    <div className="text-[10px] text-pink-600 font-bold">
                      +{b.contents.length - 3} more items
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-[#0f8646]">₹{b.price}</span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">₹{b.originalPrice}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBasket(b)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Gift size={14} />
                  <span>Personalize & Send</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Personalizing Gift */}
        {selectedBasket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-gray-900">
                      Personalize Gift Card
                    </h3>
                    <p className="text-[11px] text-gray-400">{selectedBasket.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBasket(null)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Recipient Name (Kis ke liye hai?)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Papa, Priya Sharma, Ramesh Ji"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Personal Greeting Card Message
                  </label>
                  <textarea
                    rows={3}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>

                <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl text-[11px] text-pink-900 flex items-center gap-2 font-bold">
                  <Sparkles size={14} className="text-pink-600 shrink-0" />
                  <span>Includes signature golden ribbon gift packaging and card print.</span>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                  <span className="text-base font-black text-[#0f8646]">
                    Total: ₹{selectedBasket.price}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAddGift(selectedBasket)}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer ${
                      isAdded ? "bg-emerald-800 text-white" : "bg-pink-600 hover:bg-pink-700 text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> <span>Hamper Added to Cart! 🎉</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> <span>Add Hamper to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
