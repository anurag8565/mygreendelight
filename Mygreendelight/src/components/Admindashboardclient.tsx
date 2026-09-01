'use client'

import axios from "axios";
import { useEffect, useState } from "react";

import {
    ShoppingBag,
    Users,
    Bike,
    DollarSign,
} from "lucide-react";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";
import RecentOrdersTable from "./RecentOrdersTable";
import DeliveryBoyPerformance from "./DeliveryBoyPerformance";
import AdminMandiProfitAnalytics from "./AdminMandiProfitAnalytics";

export default function Admindashboardclient() {
    const [stats, setStats] =
        useState<any>(null);

    const fetchStats =
        async () => {
            try {
                const res =
                    await axios.get(
                        "/api/admin/dashboard/summary"
                    );


                setStats(res.data);
            } catch (error) {
                console.log(error);
            }
        };


    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-500">
          Loading Dashboard...
        </p>
      </div>
    </div>
  );
}

    return (<div className="p-6">


        <h1 className="text-3xl text-center font-bold mb-8 mt-22">
            Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-4 gap-5">

            <div className="bg-white rounded-2xl shadow p-5">
                <DollarSign className="text-green-600 mb-2" />
                <p className="text-gray-500">
                    Total Sales
                </p>
                <h2 className="text-3xl font-bold">
                    Rs {stats.totalSales}
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
                <ShoppingBag className="text-blue-600 mb-2" />
                <p className="text-gray-500">
                    Orders
                </p>
                <h2 className="text-3xl font-bold">
                    {stats.totalOrders}
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
                <Users className="text-purple-600 mb-2" />
                <p className="text-gray-500">
                    Customers
                </p>
                <h2 className="text-3xl font-bold">
                    {stats.totalCustomers}
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
                <Bike className="text-orange-600 mb-2" />
                <p className="text-gray-500">
                    Delivery Boys
                </p>
                <h2 className="text-3xl font-bold">
                    {stats.totalDeliveryBoys}
                </h2>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
            <RevenueChart />
            <OrdersChart />
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mt-8">

            <RecentOrdersTable />

            <DeliveryBoyPerformance />

        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-8">

            <div className="bg-yellow-50 p-5 rounded-2xl">
                <h3 className="font-bold">
                    Pending Orders
                </h3>

                <p className="text-3xl mt-2">
                    {stats.pendingOrders}
                </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl">
                <h3 className="font-bold">
                    Out For Delivery
                </h3>

                <p className="text-3xl mt-2">
                    {stats.outForDeliveryOrders}
                </p>
            </div>

            <div className="bg-green-50 p-5 rounded-2xl">
                <h3 className="font-bold">
                    Delivered Orders
                </h3>

                <p className="text-3xl mt-2">
                    {stats.deliveredOrders}
                </p>
            </div>

        </div>

        {/* 📊 Admin Smart Mandi Margin & Profit Analytics */}
        <AdminMandiProfitAnalytics />

    </div>


    );
}


