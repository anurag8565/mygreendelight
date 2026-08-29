"use client"

import { ArrowLeft, Leaf, Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { signIn } from "next-auth/react";

function Registerform() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [googleLoading, setGoogleLoading] = useState(false);
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password
      })

      console.log(result.data)

      // optional redirect
      router.push("/")

    } catch (error: any) {
      console.log(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }



  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">


      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/register")}
        className=" absolute top-5 left-5 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition-all">
        <ArrowLeft size={18} />
        Back
      </button>

      {/* CARD */}
      <div className=" w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-green-100 p-8 ">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Leaf className="text-green-600 w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold text-green-700">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join My Green Delight today
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className=" w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none "
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className=" w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none "
            required
          />

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className=" w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none "
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className=" absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 "
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className=" w-full py-3 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 hover:scale-[1.02] transition-all disabled:opacity-70 "
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-200" />
          <span className="mx-3 text-sm text-gray-400">
            OR
          </span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={async () => {
            try {
              setGoogleLoading(true);

              await signIn(
                "google",
                {
                  callbackUrl: "/",
                }
              );
            } catch (error) {
              console.log(error);
              setGoogleLoading(false);
            }
          }}
          disabled={googleLoading}
          className=" w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:border-green-500 hover:shadow-lg hover:-translate-y-0.5 transition-all " >
          {googleLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.4 7l6.3 5.2C39.1 36.7 44 31 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>

              <span className="font-medium">
                Continue with Google
              </span>
            </>
          )}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?
          <a
            href="/login"
            className="
      text-green-600
      font-semibold
      ml-1
      hover:underline
      "
          >
            Login
          </a>
        </p>
      </div>


    </div>
  );

}

export default Registerform