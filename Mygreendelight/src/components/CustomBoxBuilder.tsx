"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Salad, Plus, Check, ShoppingBag, Flame, Dumbbell, ArrowRight, RotateCcw } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { AppDispatch } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function CustomBoxBuilder({ initialIngredients = [] }: { initialIngredients?: any[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const [ingredients, setIngredients] = useState<any[]>(initialIngredients);
  const [selectedBase, setSelectedBase] = useState<any>(null);
  const [selectedVeggies, setSelectedVeggies] = useState<any[]>([]);
  const [selectedProtein, setSelectedProtein] = useState<any[]>([]);
  const [selectedDressing, setSelectedDressing] = useState<any>(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (initialIngredients && initialIngredients.length > 0) {
      setIngredients(initialIngredients);
      // default first base
      const defaultB = initialIngredients.find((i) => i.category === "base");
      if (defaultB) setSelectedBase(defaultB);
      return;
    }
    axios
      .get("/api/custom-box")
      .then((res) => {
        if (res.data?.success && res.data.ingredients?.length > 0) {
          setIngredients(res.data.ingredients);
          const defaultB = res.data.ingredients.find((i: any) => i.category === "base");
          if (defaultB) setSelectedBase(defaultB);
        }
      })
      .catch(() => {});
  }, [initialIngredients]);

  const bases = ingredients.filter((i) => i.category === "base");
  const veggies = ingredients.filter((i) => i.category === "veggie");
  const proteins = ingredients.filter((i) => i.category === "protein_crunch");
  const dressings = ingredients.filter((i) => i.category === "dressing");

  const toggleVeggie = (item: any) => {
    if (selectedVeggies.some((v) => v._id === item._id)) {
      setSelectedVeggies(selectedVeggies.filter((v) => v._id !== item._id));
    } else {
      if (selectedVeggies.length >= 4) return;
      setSelectedVeggies([...selectedVeggies, item]);
    }
  };

  const toggleProtein = (item: any) => {
    if (selectedProtein.some((p) => p._id === item._id)) {
      setSelectedProtein(selectedProtein.filter((p) => p._id !== item._id));
    } else {
      if (selectedProtein.length >= 2) return;
      setSelectedProtein([...selectedProtein, item]);
    }
  };

  // Calculate totals
  const allSelected = [
    selectedBase,
    ...selectedVeggies,
    ...selectedProtein,
    selectedDressing,
  ].filter(Boolean);

  const totalPrice = allSelected.reduce((sum, item) => sum + (item.price || 0), 0) + 30; // base packaging fee
  const totalCalories = allSelected.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = allSelected.reduce((sum, item) => sum + (item.protein || 0), 0);

  const handleAddToCart = () => {
    if (!selectedBase) return;

    const summaryText = allSelected.map((i) => i.name).join(" + ");
    const customId = `custom-box-${Date.now()}`;

    dispatch(
      addToCart({
        _id: customId as any,
        name: `Custom Farm Salad Bowl (${selectedBase.name})`,
        price: totalPrice,
        unit: "1 Fresh Crafted Bowl",
        image: selectedBase.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
        category: "Custom Salad Box",
        stock: 50,
        quantity: 1,
        cartItemId: customId,
      } as any)
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="w-full py-6 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black">
              <Salad size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Craft Your Own Fresh Salad & Detox Bowl
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Choose base greens, toppings, superfoods & zesty dressing • 100% Ozone Washed
              </p>
            </div>
          </div>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: 4-Step Options Selector (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Base */}
            <div className="bg-gray-50/70 p-5 rounded-3xl border border-gray-200/80">
              <span className="text-[11px] font-black uppercase text-[#0f8646] tracking-wider block mb-1">
                Step 1 of 4 • Select Base Greens (1 Required)
              </span>
              <h3 className="text-sm font-black text-gray-900 mb-3">Choose Your Fresh Leafy Foundation</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bases.map((base) => {
                  const isSelected = selectedBase?._id === base._id;
                  return (
                    <div
                      key={base._id}
                      onClick={() => setSelectedBase(base)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? "bg-emerald-50/80 border-[#0f8646] shadow-2xs"
                          : "bg-white border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <img src={base.image} alt={base.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{base.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                          <span className="text-[#0f8646] font-bold">₹{base.price}</span>
                          <span>•</span>
                          <span>{base.calories} kcal</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0f8646] text-white flex items-center justify-center shrink-0">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Veggies */}
            <div className="bg-gray-50/70 p-5 rounded-3xl border border-gray-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-black uppercase text-[#0f8646] tracking-wider">
                  Step 2 of 4 • Farm Fresh Veggies (Pick up to 4)
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  {selectedVeggies.length}/4 selected
                </span>
              </div>
              <h3 className="text-sm font-black text-gray-900 mb-3">Add Sweet, Crunchy & Juicy Mix-ins</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {veggies.map((veg) => {
                  const isSelected = selectedVeggies.some((v) => v._id === veg._id);
                  return (
                    <div
                      key={veg._id}
                      onClick={() => toggleVeggie(veg)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-emerald-50/80 border-[#0f8646] shadow-2xs"
                          : "bg-white border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <img src={veg.image} alt={veg.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{veg.name}</h4>
                        <span className="text-[10px] font-black text-[#0f8646]">₹{veg.price}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected ? "bg-[#0f8646] text-white border-[#0f8646]" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Protein & Superfoods */}
            <div className="bg-gray-50/70 p-5 rounded-3xl border border-gray-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-black uppercase text-[#0f8646] tracking-wider">
                  Step 3 of 4 • Protein & Superfood Crunch (Pick up to 2)
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  {selectedProtein.length}/2 selected
                </span>
              </div>
              <h3 className="text-sm font-black text-gray-900 mb-3">Nutritious Protein & Healthy Fats Boost</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {proteins.map((prot) => {
                  const isSelected = selectedProtein.some((p) => p._id === prot._id);
                  return (
                    <div
                      key={prot._id}
                      onClick={() => toggleProtein(prot)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-emerald-50/80 border-[#0f8646] shadow-2xs"
                          : "bg-white border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <img src={prot.image} alt={prot.name} className="w-11 h-11 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{prot.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                          <span className="text-[#0f8646] font-bold">₹{prot.price}</span>
                          <span>•</span>
                          <span>{prot.protein}g protein</span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected ? "bg-[#0f8646] text-white border-[#0f8646]" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Dressing */}
            <div className="bg-gray-50/70 p-5 rounded-3xl border border-gray-200/80">
              <span className="text-[11px] font-black uppercase text-[#0f8646] tracking-wider block mb-1">
                Step 4 of 4 • Handcrafted Dressing (1 Included)
              </span>
              <h3 className="text-sm font-black text-gray-900 mb-3">Zesty & Tangy Farm Flavors</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dressings.map((dress) => {
                  const isSelected = selectedDressing?._id === dress._id;
                  return (
                    <div
                      key={dress._id}
                      onClick={() => setSelectedDressing(dress)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-emerald-50/80 border-[#0f8646] shadow-2xs"
                          : "bg-white border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <img src={dress.image} alt={dress.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{dress.name}</h4>
                        <span className="text-[10px] font-black text-[#0f8646]">₹{dress.price}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0f8646] text-white flex items-center justify-center shrink-0">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Nutrition Summary & 1-Click Cart (4 cols sticky) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-gradient-to-b from-[#07321a] to-[#0f8646] text-white rounded-3xl p-6 shadow-xl border border-emerald-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-300 text-gray-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  Live Health Tracker
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-4">Your Custom Bowl Summary</h3>

              {/* Selected Items List */}
              <div className="space-y-2 mb-6 bg-white/10 p-3.5 rounded-2xl text-xs backdrop-blur-xs max-h-48 overflow-y-auto">
                {allSelected.length === 0 ? (
                  <p className="text-green-200 text-[11px]">Select items from steps above to build your bowl.</p>
                ) : (
                  allSelected.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-green-100 font-medium">
                      <span className="truncate max-w-[170px]">{item.name}</span>
                      <span className="font-bold text-white">₹{item.price}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Nutrition Counters */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/15 p-3 rounded-2xl text-center border border-white/10">
                  <div className="flex items-center justify-center gap-1 text-amber-300 text-[10px] font-bold uppercase mb-0.5">
                    <Flame size={12} />
                    <span>Calories</span>
                  </div>
                  <span className="text-xl font-black text-white">{totalCalories} kcal</span>
                </div>

                <div className="bg-white/15 p-3 rounded-2xl text-center border border-white/10">
                  <div className="flex items-center justify-center gap-1 text-blue-200 text-[10px] font-bold uppercase mb-0.5">
                    <Dumbbell size={12} />
                    <span>Protein</span>
                  </div>
                  <span className="text-xl font-black text-white">{totalProtein.toFixed(1)} g</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="border-t border-white/20 pt-4 mb-4 flex items-baseline justify-between">
                <span className="text-xs text-green-200 font-bold uppercase">Total Combo Price</span>
                <span className="text-3xl font-black text-white">₹{totalPrice}</span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isAdded
                    ? "bg-white text-emerald-800"
                    : "bg-yellow-300 hover:bg-yellow-400 text-gray-950 border-2 border-yellow-200"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} /> <span>Added to Cart! 🎉</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> <span>Add Custom Bowl to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
