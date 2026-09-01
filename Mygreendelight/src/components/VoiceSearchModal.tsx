"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, X, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceSearchModal({ isOpen, onClose }: VoiceSearchModalProps) {
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
          const text = event.results[current][0].transcript;
          setTranscript(text);

          if (event.results[current].isFinal) {
            setTimeout(() => {
              handleSearch(text);
            }, 600);
          }
        };

        reco.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setErrorMsg("Microphone permission denied. Please allow microphone access in your browser.");
          } else {
            setErrorMsg("Could not hear clearly. Please try speaking again.");
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
        recognition.lang = language;
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setErrorMsg("Voice search is not supported on this browser. Try Chrome / Edge.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (err) {}
    }
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
    if (!textToSearch.trim()) return;
    onClose();
    router.push(`/user/search?q=${encodeURIComponent(textToSearch.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cursor-default bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-all cursor-pointer border border-gray-200"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Language Selector */}
        <div className="inline-flex items-center bg-gray-100 p-1 rounded-2xl mb-6">
          <button
            onClick={() => {
              setLanguage("hi-IN");
              stopListening();
              setTimeout(startListening, 200);
            }}
            className={`px-3.5 py-1 text-xs font-bold rounded-xl transition ${
              language === "hi-IN" ? "bg-white text-[#0f8646] shadow-xs" : "text-gray-600"
            }`}
          >
            🇮🇳 हिन्दी (Hindi)
          </button>
          <button
            onClick={() => {
              setLanguage("en-IN");
              stopListening();
              setTimeout(startListening, 200);
            }}
            className={`px-3.5 py-1 text-xs font-bold rounded-xl transition ${
              language === "en-IN" ? "bg-white text-[#0f8646] shadow-xs" : "text-gray-600"
            }`}
          >
            English
          </button>
        </div>

        {/* Animated Mic Wave */}
        <div className="relative flex items-center justify-center my-6">
          {isListening && (
            <>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute w-28 h-28 rounded-full bg-emerald-400"
              />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
                className="absolute w-28 h-28 rounded-full bg-green-200"
              />
            </>
          )}

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer ${
              isListening
                ? "bg-[#0f8646] text-white shadow-emerald-500/40"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {isListening ? <Mic size={32} /> : <MicOff size={32} />}
          </button>
        </div>

        <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1">
          {isListening ? "Listening... Bolna shuru karein!" : "Tap mic to speak"}
        </h3>
        
        <p className="text-xs text-gray-400 mb-4 font-medium">
          {language === "hi-IN" ? 'e.g. "Aloo, Tamatar, Taaza Palak, Doodh"' : 'e.g. "Fresh milk, Paneer, Apple"'}
        </p>

        {/* Live Transcript Display */}
        {transcript && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4 text-emerald-950 font-black text-sm">
            "{transcript}"
          </div>
        )}

        {errorMsg && (
          <p className="text-xs font-bold text-red-600 mb-4 bg-red-50 p-2.5 rounded-xl border border-red-200">
            {errorMsg}
          </p>
        )}

        {transcript && (
          <button
            type="button"
            onClick={() => handleSearch()}
            className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
          >
            <span>Search Produce</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
