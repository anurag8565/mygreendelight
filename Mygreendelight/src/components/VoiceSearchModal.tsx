"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, X, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (text: string) => void;
}

const QUICK_VOICE_PROMPTS = [
  "Aloo (Potato)",
  "Tamatar (Tomato)",
  "Taaza Palak",
  "Ratlami Sev",
  "Bhopali Poha",
  "Pyaaz (Onion)",
  "Hari Mirch & Dhaniya",
  "Adrak & Lahsun",
];

export default function VoiceSearchModal({
  isOpen,
  onClose,
  onResult,
}: VoiceSearchModalProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [recognition, setRecognition] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = language;

        reco.onresult = (event: any) => {
          const current = event.resultIndex;
          const rawText = event.results[current][0].transcript;
          const cleanText = rawText.replace(/[.,?!]/g, "").trim();
          setTranscript(cleanText);

          if (event.results[current].isFinal) {
            triggerHaptic("success");
            setTimeout(() => {
              handleSearch(cleanText);
            }, 500);
          }
        };

        reco.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setErrorMsg("Microphone permission blocked. Please allow mic access in browser settings.");
          } else if (event.error === "no-speech") {
            setErrorMsg("Awaaz sunayi nahi di. Kripya dobara mic par tap karke bole.");
          } else {
            setErrorMsg("Microphone disconnected. Kripya niche diye produce par tap karein.");
          }
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      }
    }
  }, [language]);

  useEffect(() => {
    if (isOpen && recognition) {
      startListening();
    } else if (!isOpen && recognition) {
      stopListening();
      setTranscript("");
      setErrorMsg(null);
    }
  }, [isOpen, recognition]);

  const startListening = () => {
    setErrorMsg(null);
    setTranscript("");
    if (recognition) {
      try {
        triggerHaptic("medium");
        recognition.lang = language;
        recognition.start();
        setIsListening(true);
      } catch (err) {
        // Recognition might already be running
      }
    } else {
      setErrorMsg("Is browser me voice speech supported nahi hai. Niche produce choose karein.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {}
    }
    setIsListening(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (textToSearch = transcript) => {
    const clean = textToSearch.replace(/[.,?!]/g, "").trim();
    if (!clean) return;

    if (onResult) {
      onResult(clean);
    }

    onClose();
    router.push(`/user/search?query=${encodeURIComponent(clean)}`);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs cursor-pointer font-sans select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="cursor-default bg-[#faf9f5] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-amber-200/90 relative text-center overflow-hidden"
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition flex items-center justify-center cursor-pointer border border-stone-200"
          title="Close"
        >
          <X size={16} />
        </button>

        {/* Header Tag */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="bg-[#0a3d24] text-white text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles size={10} className="text-amber-300" />
            <span>SubziQuick Voice Assistant</span>
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight font-heading">
          {isListening ? "Listening... Bolna shuru karein!" : "Awaaz Se Sabzi Search Karein"}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 font-medium">
          {language === "hi-IN" ? 'Boliye jaise: "Ek kilo aloo, tamatar, taaza palak"' : 'Speak produce name like "Tomato", "Spinach"'}
        </p>

        {/* Language Selector */}
        <div className="inline-flex items-center bg-stone-200/70 p-1 rounded-2xl my-4 border border-stone-300/60">
          <button
            type="button"
            onClick={() => {
              setLanguage("hi-IN");
              stopListening();
              setTimeout(startListening, 200);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
              language === "hi-IN" ? "bg-[#0a3d24] text-white shadow-xs" : "text-stone-700 hover:text-stone-950"
            }`}
          >
            🇮🇳 हिन्दी (Hindi)
          </button>
          <button
            type="button"
            onClick={() => {
              setLanguage("en-IN");
              stopListening();
              setTimeout(startListening, 200);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
              language === "en-IN" ? "bg-[#0a3d24] text-white shadow-xs" : "text-stone-700 hover:text-stone-950"
            }`}
          >
            English
          </button>
        </div>

        {/* Animated Microphone Radar Graphic */}
        <div className="relative flex items-center justify-center my-4 py-2">
          {isListening && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5, 1.9], opacity: [0.6, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                className="absolute w-24 h-24 rounded-full border-2 border-emerald-500"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1.6], opacity: [0.7, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: 0.3, ease: "easeOut" }}
                className="absolute w-24 h-24 rounded-full border-2 border-amber-400"
              />
            </>
          )}

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer border-2 ${
              isListening
                ? "bg-gradient-to-tr from-[#0a3d24] to-emerald-600 text-white border-emerald-400 shadow-[0_8px_24px_rgba(10,61,36,0.4)]"
                : "bg-white text-stone-700 border-stone-300 hover:border-[#0a3d24]"
            }`}
          >
            {isListening ? <Mic size={32} className="animate-pulse" /> : <MicOff size={32} />}
          </button>
        </div>

        {/* Live Transcript Display */}
        {transcript ? (
          <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-2xl mb-3 text-[#0a3d24] font-black text-sm sm:text-base">
            &ldquo;{transcript}&rdquo;
          </div>
        ) : (
          <p className="text-[11px] text-stone-400 font-bold mb-3">
            {isListening ? "Mic chalu hai... bol rahe hain toh yahan aayega" : "Tap mic button to start speaking"}
          </p>
        )}

        {errorMsg && (
          <p className="text-xs font-bold text-red-700 mb-3 bg-red-50 p-2.5 rounded-xl border border-red-200">
            {errorMsg}
          </p>
        )}

        {transcript && (
          <button
            type="button"
            onClick={() => handleSearch()}
            className="w-full bg-[#0a3d24] hover:bg-[#072817] text-white font-black py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer mb-3 active:scale-95"
          >
            <span>Search &quot;{transcript}&quot; Produce</span>
            <ArrowRight size={15} />
          </button>
        )}

        {/* Quick Produce Tap Chips (Useful if mic is denied or for instant 1-tap search) */}
        <div className="pt-2 border-t border-stone-200/80 text-left">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block mb-1.5">
            Quick Bhopal Produce:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_VOICE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSearch(prompt.split(" ")[0])}
                className="bg-white hover:bg-emerald-50 text-stone-800 hover:text-[#0a3d24] border border-stone-200 hover:border-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
