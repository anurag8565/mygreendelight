"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Utensils, ChefHat, Clock, Users, ArrowRight, Check, X, ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function DinnerDeciderWheel({ initialRecipes = [] }: { initialRecipes?: any[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const [recipes, setRecipes] = useState<any[]>(initialRecipes);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    if (initialRecipes && initialRecipes.length > 0) {
      setRecipes(initialRecipes);
      return;
    }
    axios
      .get("/api/dinner-wheel")
      .then((res) => {
        if (res.data?.success && res.data.recipes?.length > 0) {
          setRecipes(res.data.recipes);
        }
      })
      .catch(() => {});
  }, [initialRecipes]);

  if (!recipes || recipes.length === 0) return null;

  const sliceAngle = 360 / recipes.length;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsAddedToCart(false);

    // Pick random index
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const chosen = recipes[randomIndex];

    // Extra full spins (5 to 8 rotations) + target angle
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    // Calculate angle so chosen slice aligns at top (270 deg / pointer at top)
    const targetOffset = randomIndex * sliceAngle + sliceAngle / 2;
    const newRotation = rotation + extraSpins + (360 - (rotation % 360)) + (360 - targetOffset);

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedRecipe(chosen);
      setIsModalOpen(true);
    }, 4200);
  };

  const handleAddAllToCart = () => {
    if (!selectedRecipe) return;
    const dishId = selectedRecipe._id || selectedRecipe.title;

    selectedRecipe.ingredients.forEach((ing: any, idx: number) => {
      dispatch(
        addToCart({
          _id: (ing.groceryId || `${dishId}-ing-${idx}`) as any,
          name: `${ing.name} (${selectedRecipe.title})`,
          price: ing.price,
          unit: ing.qty,
          image: ing.image || selectedRecipe.image,
          category: "Dinner Combo",
          stock: 50,
          quantity: 1,
          cartItemId: `${dishId}-ing-${idx}`,
        } as any)
      );
    });

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  return (
    <div className="w-full py-6 sm:py-10 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Card Frame */}
        <div className="bg-gradient-to-r from-[#07321a] via-[#0b542c] to-[#0f8646] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Ambient Glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Pitch */}
          <div className="flex-1 flex flex-col items-start z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-yellow-300 text-gray-950 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles size={12} className="animate-spin" />
              <span>Dinner Decider AI</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight text-white mb-2">
              Confused What to Cook Tonight? <br className="hidden sm:inline" />
              <span className="text-yellow-300">Spin the Farm Recipe Wheel!</span>
            </h2>

            <p className="text-xs sm:text-sm text-green-100/90 max-w-lg mb-6 leading-relaxed">
              Ghar par samajh nahi aa raha kya banayein? Wheel ghumaiye, tasty recipe select kijiye aur 1-Click me saari fresh farm ingredients 10 minute me mangwaiye!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSpinning}
              onClick={handleSpin}
              className="bg-yellow-300 hover:bg-yellow-400 text-gray-950 px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-60 transition-all border-2 border-yellow-200"
            >
              <Utensils size={18} />
              <span>{isSpinning ? "Spinning Wheel..." : "🎡 Spin for Dinner Recipe"}</span>
            </motion.button>
          </div>

          {/* Right Wheel Visual */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Top Pointer */}
            <div className="absolute -top-3 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-300 drop-shadow-md" />

            {/* Rotating SVG Wheel */}
            <div
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden relative"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)" : "none",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {recipes.map((recipe, idx) => {
                  const startAngle = idx * sliceAngle;
                  const endAngle = (idx + 1) * sliceAngle;
                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                  const path = `M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`;

                  return (
                    <path
                      key={recipe._id || idx}
                      d={path}
                      fill={recipe.sliceColor || "#0f8646"}
                      stroke="#ffffff"
                      strokeWidth="0.6"
                    />
                  );
                })}
              </svg>

              {/* Dish Labels overlay */}
              {recipes.map((recipe, idx) => {
                const angle = idx * sliceAngle + sliceAngle / 2;
                return (
                  <div
                    key={idx}
                    className="absolute w-full h-full top-0 left-0 flex items-start justify-center pt-3 pointer-events-none"
                    style={{ transform: `rotate(${angle + 90}deg)` }}
                  >
                    <span className="text-[9px] sm:text-[11px] font-black text-white drop-shadow-md max-w-[70px] text-center leading-tight truncate">
                      {recipe.title.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Spin Button Hub */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-gray-950 font-black text-[11px] sm:text-xs shadow-2xl flex flex-col items-center justify-center border-4 border-yellow-300 z-20 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <span>SPIN</span>
              <span className="text-[9px] text-[#0f8646] font-bold">1-Click</span>
            </button>
          </div>
        </div>

        {/* Selected Recipe Reveal Modal */}
        <AnimatePresence>
          {isModalOpen && selectedRecipe && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full transition cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Dish Header */}
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 relative shadow-sm">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="bg-yellow-400 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase mb-1 inline-block">
                      Tonight's Pick 🎉
                    </span>
                    <h3 className="text-lg font-black leading-tight text-white drop-shadow-xs">
                      {selectedRecipe.title}
                    </h3>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-[#0f8646]" />
                    <span className="font-bold">{selectedRecipe.prepTime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-[#0f8646]" />
                    <span className="font-bold">{selectedRecipe.servings}</span>
                  </div>
                  <span>•</span>
                  <span className="text-green-700 font-extrabold">100% Farm Fresh</span>
                </div>

                {/* Ingredients Breakdown */}
                <div className="mb-5">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-2">
                    Included Farm Ingredients (Pre-measured)
                  </h4>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients?.map((ing: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-green-100 text-[#0f8646] flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </span>
                          <span className="font-bold text-gray-800">{ing.name}</span>
                          <span className="text-gray-400 font-medium">({ing.qty})</span>
                        </div>
                        <span className="font-black text-[#0f8646]">₹{ing.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Combo Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-gray-900">₹{selectedRecipe.comboPrice}</span>
                      <span className="text-xs text-gray-400 line-through">₹{selectedRecipe.mrp}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAllToCart}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      isAddedToCart
                        ? "bg-green-700 text-white"
                        : "bg-[#0f8646] hover:bg-[#0c6a38] text-white"
                    }`}
                  >
                    {isAddedToCart ? <Check size={16} /> : <ShoppingBag size={16} />}
                    <span>{isAddedToCart ? "Added to Cart! 🎉" : "Add All to Cart"}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
