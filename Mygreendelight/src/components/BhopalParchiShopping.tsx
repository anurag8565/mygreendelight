"use client";

import React, { useState } from "react";
import {
  FileText,
  Camera,
  Upload,
  Mic,
  Send,
  Sparkles,
  CheckCircle2,
  X,
  Phone,
  User,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  PenTool,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { triggerHaptic } from "@/utils/haptics";

export default function BhopalParchiShopping() {
  const [isOpen, setIsOpen] = useState(false);
  const [parchiText, setParchiText] = useState("");
  const [parchiFile, setParchiFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    const handleOpen = () => {
      triggerHaptic("medium");
      setIsOpen(true);
    };
    window.addEventListener("open-parchi-modal", handleOpen);
    return () => window.removeEventListener("open-parchi-modal", handleOpen);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setParchiFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmitParchi = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !mobile.trim() || !address.trim()) {
      setErrorMsg("Kripya apna Naam, 10-digit Mobile number aur Bhopal ka Address bharein.");
      return;
    }

    if (!parchiFile && !parchiText.trim()) {
      setErrorMsg("Kripya kaagaz ki parchi ki photo upload karein ya sabziyon ki list likhein.");
      return;
    }

    try {
      setSubmitting(true);
      triggerHaptic("medium");

      let uploadedImageUrl = "";
      if (parchiFile) {
        // Upload image
        const formData = new FormData();
        formData.append("file", parchiFile);
        const uploadRes = await axios.post("/api/user/upload-payment-proof", formData);
        if (uploadRes.data?.success && uploadRes.data?.url) {
          uploadedImageUrl = uploadRes.data.url;
        }
      }

      const res = await axios.post("/api/parchi-order", {
        customerName: name,
        mobile,
        address,
        listText: parchiText,
        parchiImageUrl: uploadedImageUrl,
      });

      if (res.data?.success) {
        triggerHaptic("success");
        setSuccessMsg("🎉 Parchi Order Safaltapoorvak Bheja Gaya! Hamari store team turant verify karke delivery dispatch karegi.");
        setTimeout(() => {
          setSuccessMsg(null);
          setIsOpen(false);
          setParchiText("");
          setParchiFile(null);
          setPreviewUrl(null);
        }, 3500);
      } else {
        setErrorMsg(res.data?.message || "Order submit karne me samasya aayi.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to submit parchi order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppQuickList = () => {
    triggerHaptic("medium");
    const prefillText = parchiText.trim()
      ? `Namaste SubziQuick Bhopal, mujhe ye taaza sabziyan chahiye:\n\n${parchiText.trim()}\n\nNaam: ${name || "Shopper"}\nAddress: ${address || "Bhopal"}`
      : `Namaste SubziQuick Bhopal! Main apni ghar ki sabziyon ki parchi / voice note bhej raha hoon. Kripya dispatch karein.`;
    
    window.open(
      `https://wa.me/919981418565?text=${encodeURIComponent(prefillText)}`,
      "_blank"
    );
  };

  return (
    <>
      {/* 🌟 HOMEPAGE PROMINENT BANNER (Indian Yellow Notepad Aesthetic with Floating Pen) */}
      <section className="w-full py-4 sm:py-6 bg-white font-sans border-b border-stone-200/70 select-none">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
          <div className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-r from-amber-100/90 via-amber-50/70 to-emerald-50/80 border border-amber-300 shadow-[0_6px_24px_rgba(217,119,6,0.1)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 group">
            
            {/* Ambient Background Decorative Grid Lines (Like Indian Register / Notebook) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f59e0b10_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />

            {/* Left: Animated Notepad Icon & Catchy Bhopal Tagline */}
            <div className="relative z-10 flex items-start sm:items-center gap-3.5 sm:gap-4.5 min-w-0 flex-1">
              
              {/* Animated Floating Notepad + Pen */}
              <div className="relative shrink-0">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 text-stone-950 flex items-center justify-center shadow-[0_8px_20px_rgba(217,119,6,0.25)] border-2 border-white"
                >
                  <FileText size={26} className="stroke-[2.5]" />
                </motion.div>

                {/* Floating Micro Pen */}
                <motion.div
                  animate={{ rotate: [0, -10, 0], x: [0, 2, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0a3d24] text-white flex items-center justify-center shadow-xs border border-white"
                >
                  <PenTool size={11} />
                </motion.div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-[#0a3d24] text-white text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Sparkles size={10} className="text-amber-300" />
                    <span>Bhopal Special Fast Order</span>
                  </span>
                  <span className="text-[10.5px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300/80">
                    No App Typing Needed!
                  </span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-black text-stone-900 tracking-tight leading-snug font-heading">
                  Parchi Bhejo, Sabzi Paao! (Haath Ki List Ya Voice Note)
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 font-medium mt-0.5 leading-relaxed">
                  Kaagaz par likhi sabziyon ki photo kheecho ya WhatsApp par list bhej do. 15-20 min me direct mandi fresh sabzi aapke ghar!
                </p>
              </div>
            </div>

            {/* Right: 2 Direct Action Buttons */}
            <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
              {/* Button 1: Upload Photo / Form Modal */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("medium");
                  setIsOpen(true);
                }}
                className="flex-1 sm:flex-initial bg-[#0a3d24] hover:bg-[#072416] text-white px-4 sm:px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(10,61,36,0.3)] transition-all cursor-pointer active:scale-95 border border-emerald-800"
              >
                <Camera size={16} />
                <span>Parchi Upload Karein</span>
              </button>

              {/* Button 2: WhatsApp Voice / Direct Message */}
              <button
                type="button"
                onClick={handleWhatsAppQuickList}
                className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white px-4 sm:px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all cursor-pointer active:scale-95"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp List</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 📋 POPUP INTERACTIVE NOTEPAD MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs font-sans overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="relative w-full max-w-lg bg-[#faf8f0] rounded-3xl border-2 border-amber-300/90 shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Top Header (Indian Notepad Header Style) */}
              <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 p-4 px-5 flex items-center justify-between border-b-2 border-amber-500/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white text-stone-950 flex items-center justify-center shadow-xs">
                    <FileText size={17} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-stone-950 font-heading leading-tight">
                      Ghar Ki Sabzi Parchi
                    </h3>
                    <span className="text-[10.5px] font-bold text-amber-950">
                      Bhopal 15-20 Min Doorstep Express Delivery
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-stone-900 flex items-center justify-center transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitParchi} className="p-4 sm:p-6 space-y-3.5">
                {successMsg && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#0a3d24] shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-2xl text-red-950 text-xs font-bold">
                    {errorMsg}
                  </div>
                )}

                {/* Section 1: Parchi Photo Upload OR Text Writing */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-stone-800 uppercase tracking-wide flex items-center justify-between">
                    <span>1. Parchi Ki Photo Ya List Likhein *</span>
                    <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.2 rounded-full">
                      Simple & Fast
                    </span>
                  </label>

                  {/* Photo Upload Box */}
                  <div className="relative border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-3.5 bg-white transition flex flex-col items-center justify-center text-center cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />

                    {previewUrl ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-amber-200">
                        <img src={previewUrl} alt="Parchi preview" className="w-full h-full object-contain" />
                        <span className="absolute bottom-1 right-2 bg-black/70 text-white text-[9.5px] px-2 py-0.5 rounded-full font-bold">
                          Tap to change photo
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-1">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                          <Camera size={20} />
                        </div>
                        <span className="text-xs font-extrabold text-stone-800">
                          Kaagaz Ki Parchi Ki Photo Kheecho / Upload Karo
                        </span>
                        <span className="text-[10.5px] text-stone-500 font-medium">
                          Supports Mobile Camera Click & Gallery (JPG, PNG)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center gap-2 py-0.5">
                    <div className="flex-1 h-px bg-amber-200" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                      YA LIST YAHAN TYPE KAREIN
                    </span>
                    <div className="flex-1 h-px bg-amber-200" />
                  </div>

                  {/* Lined Notepad Textarea */}
                  <div className="relative bg-white rounded-2xl border border-amber-200 p-2.5 shadow-2xs">
                    <textarea
                      rows={3}
                      value={parchiText}
                      onChange={(e) => setParchiText(e.target.value)}
                      placeholder="Udaharan:&#10;1kg Aloo, 500g Tamatar, 250g Hari Mirch, 1 Gaddi Dhaniya, 1 Packet Ratlami Sev..."
                      className="w-full bg-transparent outline-none text-xs font-semibold text-stone-900 placeholder:text-stone-400 placeholder:font-normal resize-none"
                    />
                  </div>
                </div>

                {/* Section 2: Contact & Address */}
                <div className="space-y-2 pt-1 border-t border-amber-200/80">
                  <label className="text-xs font-black text-stone-800 uppercase tracking-wide block">
                    2. Delivery Kahan Bhejni Hai? *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Aapka Naam *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl py-2 pl-8 pr-3 text-xs font-bold text-stone-900 outline-none focus:border-[#0a3d24]"
                      />
                    </div>

                    <div className="relative">
                      <Phone size={13} className="absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-Digit Mobile *"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full bg-white border border-stone-200 rounded-xl py-2 pl-8 pr-3 text-xs font-bold text-stone-900 outline-none focus:border-[#0a3d24]"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Bhopal Full Address (House No, Society / Colony, Area) *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl py-2 pl-8 pr-3 text-xs font-bold text-stone-900 outline-none focus:border-[#0a3d24]"
                    />
                  </div>
                </div>

                {/* Submit & WhatsApp Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:flex-1 bg-[#0a3d24] hover:bg-[#072416] text-white py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Send size={15} />
                    <span>{submitting ? "Parchi Bhej Rahe Hain..." : "Parchi Order Confirm Karein"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppQuickList}
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer active:scale-95"
                  >
                    <FaWhatsapp size={17} />
                    <span>WhatsApp Par Bhejo</span>
                  </button>
                </div>

                {/* Doorstep Trust Note */}
                <div className="text-center pt-1">
                  <span className="text-[10.5px] text-stone-500 font-semibold flex items-center justify-center gap-1">
                    <ShieldCheck size={12} className="text-[#0a3d24]" />
                    <span>Pehle sabzi check karein, fir delivery boy ko Cash ya UPI karein!</span>
                  </span>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
