"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f4f7f4]">

      {/* Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-emerald-200 border-t-[#0a3d24] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-[#0a3d24] font-bold text-sm tracking-wide"
      >
        Loading your groceries...
      </motion.p>

    </div>
  )
}