"use client";

import { ArrowLeft, Leaf, Eye, EyeOff,} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await signIn(
        "credentials",
        {
          email: cleanEmail,
          password,
          redirect: false,
        }
      );

      if (res?.error) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.log(error);
      setErrorMessage("Something went wrong during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">

      {/* Back Button */}
      <button
        onClick={() =>
          router.push("/register")
        }
        className=" absolute top-5 left-5 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition ">
        <ArrowLeft size={18} />
        Back
      </button>

      <div
        className=" w-full max-w-md bg-white rounded-3xl shadow-2xl border border-green-100 p-8 "
      >
        {/* Header */}

        <div className="text-center mb-8">

          <div
            className=" w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center "
          >
            <Leaf
              className="text-green-600"
              size={32}
            />
          </div>

          <h1 className="text-3xl font-bold text-green-600">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue shopping
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2 animate-shake">
            <span className="font-semibold">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          {/* Email */}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className=" w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition "
          />

          {/* Password */}

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
              required
              className=" w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className=" absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 "
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className=" w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 disabled:opacity-70 ">

            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}

            {loading
              ? "Logging In..."
              : "Login"}
          </button>
        </form>

        {/* Divider */}

        <div className="flex items-center my-6">
          <div className="flex-1 border-t" />

          <span className="px-3 text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 border-t" />
        </div>

        {/* Google Login */}

        <button
          onClick={async () => {
            try {
              setGoogleLoading(true);

              await signIn("google", {
                callbackUrl: "/",
              });
            } catch (error) {
              console.log(error);
              setGoogleLoading(false);
            }
          }}
          disabled={googleLoading}
          className=" w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl bg-white hover:bg-gray-50 hover:shadow-md transition disabled:opacity-70 "
        >
          {googleLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />

              <span className="font-medium">
                Continue with Google
              </span>
            </>
          )}
        </button>

        {/* Footer */}

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className=" text-green-600 font-semibold hover:underline "
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;