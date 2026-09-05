"use client"

import { Bike, User, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function EditMobile() {
  const [roles, setroles] = useState([
    { id: "user", label: "Customer / User", icon: User },
    { id: "deliveryboy", label: "Delivery Partner", icon: Bike },
  ]);

  const [selectedRole, setSelectedRole] = useState("user");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const router = useRouter();

  // Indian 10-digit mobile validation (starts with 6,7,8,9)
  const cleanMobile = mobile.trim().replace(/[^0-9]/g, "");
  const isValidMobile = /^[6-9][0-9]{9}$/.test(cleanMobile);
  const canSave = selectedRole && isValidMobile && !loading;

  useEffect(() => {
    const checkforadmin = async () => {
      try {
        const rt = await axios.get("/api/checkforadmin");
        if (rt.data.adminExists) {
          setroles([
            { id: "user", label: "Customer / User", icon: User },
            { id: "deliveryboy", label: "Delivery Partner", icon: Bike },
          ]);
        } else {
          setroles([
            { id: "user", label: "Customer / User", icon: User },
            { id: "deliveryboy", label: "Delivery Partner", icon: Bike },
            { id: "admin", label: "Admin", icon: UserCog },
          ]);
        }
      } catch (error) {
        console.error("Check admin error:", error);
      }
    };
    checkforadmin();
  }, []);

  const handleSave = async () => {
    if (!canSave) return;
    setLoading(true);
    try {
      const result = await axios.post("/api/user/editrolemobile", {
        role: selectedRole,
        mobile: cleanMobile,
      });

      if (result.data.message) {
        await update({ role: selectedRole });
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50 px-4 py-8">
      {/* Title */}
      <h1 className="text-green-600 font-bold text-3xl sm:text-4xl mb-2 text-center">
        Complete Your Profile
      </h1>
      <p className="text-gray-500 mb-6 text-center text-sm sm:text-base">
        Select your role and enter your 10-digit mobile number
      </p>

      {/* ROLE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl">
        {roles.map((role, index) => {
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border shadow-sm
              ${isSelected
                  ? "bg-green-600 text-white border-green-600 ring-2 ring-green-600 ring-offset-2"
                  : "bg-white border-green-200 hover:shadow-md"
                }`}
            >
              <div
                className={`p-3 rounded-xl transition-all ${isSelected ? "bg-white/20" : "bg-green-100"
                  }`}
              >
                <role.icon
                  size={32}
                  className={isSelected ? "text-white" : "text-green-600"}
                />
              </div>

              <h2
                className={`font-bold text-lg ${isSelected ? "text-white" : "text-green-700"
                  }`}
              >
                {role.label}
              </h2>
            </motion.div>
          );
        })}
      </div>

      {/* MOBILE INPUT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mt-6 bg-white p-6 rounded-2xl border border-green-100 shadow-sm"
      >
        <label className="text-gray-700 font-semibold text-sm">
          Mobile Number (10 Digits)
        </label>

        <div className="relative mt-2 flex items-center">
          <span className="absolute left-3 text-gray-500 font-bold text-sm bg-gray-100 px-2 py-1 rounded-lg">
            🇮🇳 +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full pl-20 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium text-lg tracking-wider"
          />
        </div>

        {!isValidMobile && cleanMobile.length > 0 && (
          <p className="text-red-500 text-xs mt-2 font-medium">
            Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)
          </p>
        )}
      </motion.div>

      {/* SAVE BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        disabled={!canSave}
        className={`mt-6 w-full max-w-xl py-3.5 rounded-xl font-bold transition-all text-center shadow-md
        ${canSave
            ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving Profile...
          </div>
        ) : (
          "Save & Continue to Store"
        )}
      </motion.button>
    </div>
  );
}

export default EditMobile;