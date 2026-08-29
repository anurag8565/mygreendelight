"use client"

import { Bike, User, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function EditMobile() {
  const [roles,setroles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "deliveryboy", label: "Delivery Boy", icon: Bike },
    { id: "user", label: "User", icon: User },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const { update } = useSession()
  const router = useRouter()

  // validation (support 10 or 11 digit mobile numbers)
  const isValidMobile = /^[0-9]{10,11}$/.test(mobile.trim());
  const canSave = selectedRole && isValidMobile;

  useEffect(() => {
    const checkforadmin = async () => {
      try {
        const rt = await axios.get("/api/checkforadmin");
        if (rt.data.adminExists) {
          // Admin already exists, remove admin option so regular users cannot select it
          setroles([
            { id: "user", label: "Customer / User", icon: User },
            { id: "deliveryboy", label: "Delivery Partner", icon: Bike },
          ]);
        }
      } catch (error) {
        console.error("Check admin error:", error);
      }
    };
    checkforadmin();
  }, []);

  const handleSave = async () => {
    try {
      const result = await axios.post("/api/user/editrolemobile", {
        role: selectedRole,
        mobile: mobile.trim(),
      });

    if (result.data.message) {
      await update({ role: selectedRole });
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50 px-4">

      {/* Title */}
      <h1 className="text-green-600 font-bold text-4xl mb-2">
        Complete Your Profile
      </h1>
      <p className="text-gray-500 mb-6">
        Select role and enter mobile number
      </p>

      {/* ROLE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {roles.map((role, index) => {
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all border shadow-md
              ${isSelected
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white border-green-200 hover:shadow-xl"
                }`}
            >
              <div
                className={`p-3 rounded-xl transition-all ${isSelected ? "bg-white/20" : "bg-green-100"
                  }`}
              >
                <role.icon
                  size={38}
                  className={isSelected ? "text-white" : "text-green-600"}
                />
              </div>

              <h1
                className={`font-bold text-xl ${isSelected ? "text-white" : "text-green-600"
                  }`}
              >
                {role.label}
              </h1>
            </motion.div>
          );
        })}
      </div>

      {/* MOBILE INPUT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mt-8"
      >
        <label className="text-gray-600 font-medium">
          Enter Mobile Number
        </label>

        <input
          type="text"
          placeholder="03XXXXXXXXX"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full mt-2 p-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {!isValidMobile && mobile.length > 0 && (
          <p className="text-red-500 text-sm mt-1">
            Enter valid 11-digit mobile number
          </p>
        )}
      </motion.div>

      {/* SAVE BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        disabled={!canSave}
        className={`mt-6 px-6 py-3 rounded-xl font-bold transition-all
        ${canSave
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Save & Continue
      </motion.button>

      {/* OUTPUT */}
      {canSave && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-green-700 font-semibold"
        >
          Ready to save: {selectedRole} + {mobile}
        </motion.div>
      )}
    </div>
  );
}

export default EditMobile;