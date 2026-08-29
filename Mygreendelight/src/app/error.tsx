"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-red-50 text-center px-4">

      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-6xl"
      >
        ⚠️
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-red-600 mt-4"
      >
        Something went wrong
      </motion.h1>

      {/* Message */}
      <p className="text-gray-600 mt-2 max-w-md">
        An unexpected error occurred. Please try again or go back home.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => reset()}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>

        <a
          href="/"
          className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Go Home
        </a>
      </div>

    </div>
  )
}