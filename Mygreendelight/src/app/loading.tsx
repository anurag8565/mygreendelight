"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-green-50">

      {/* Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-green-300 border-t-green-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-green-700 font-medium"
      >
        Loading your groceries...
      </motion.p>

    </div>
  )
}