'use client'

import {
  DollarSign,
  PackageCheck,
  Wallet,
  BadgeDollarSign
} from "lucide-react";

interface Props {
  totalDeliveries: number;
  totalEarnings: number;
  todayEarnings: number;
  earningPerDelivery: number;
}

export default function DeliveryDashboardStats({
  totalDeliveries,
  totalEarnings,
  todayEarnings,
  earningPerDelivery
}: Props) {

  return (
    <div className="space-y-6">

      {/* Welcome Card */}

      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-3xl p-6 shadow-xl">

        <h2 className="text-3xl font-bold">
          🚴 Delivery Dashboard
        </h2>

        <p className="mt-2 text-green-100">
          Welcome Back Delivery Partner
        </p>

      </div>

      {/* Earnings Policy */}

      <div className="bg-white rounded-3xl p-6 shadow-lg border">

        <div className="flex items-center gap-3 mb-4">

          <BadgeDollarSign
            className="text-green-600"
            size={28}
          />

          <h3 className="font-bold text-xl">
            Earnings Policy
          </h3>

        </div>

        <p className="text-gray-600">
          Earn
          <span className="font-bold text-green-600 mx-1">
            Rs {earningPerDelivery}
          </span>
          per completed delivery.
        </p>

      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Deliveries */}

        <div className="bg-white rounded-3xl p-5 shadow-lg border">

          <PackageCheck
            className="text-blue-600 mb-3"
            size={30}
          />

          <p className="text-gray-500 text-sm">
            Deliveries
          </p>

          <h2 className="text-3xl font-bold">
            {totalDeliveries}
          </h2>

        </div>

        {/* Total Earnings */}

        <div className="bg-white rounded-3xl p-5 shadow-lg border">

          <Wallet
            className="text-green-600 mb-3"
            size={30}
          />

          <p className="text-gray-500 text-sm">
            Total Earnings
          </p>

          <h2 className="text-3xl font-bold">
            Rs {totalEarnings}
          </h2>

        </div>

        {/* Today's Earnings */}

        <div className="bg-white rounded-3xl p-5 shadow-lg border">

          <DollarSign
            className="text-yellow-600 mb-3"
            size={30}
          />

          <p className="text-gray-500 text-sm">
            Today
          </p>

          <h2 className="text-3xl font-bold">
            Rs {todayEarnings}
          </h2>

        </div>

        {/* Status */}

        <div className="bg-white rounded-3xl p-5 shadow-lg border">

          <div className="h-8 w-8 rounded-full bg-green-500 mb-3" />

          <p className="text-gray-500 text-sm">
            Status
          </p>

          <h2 className="text-xl font-bold text-green-600">
            Available
          </h2>

        </div>

      </div>

    </div>
  );
}