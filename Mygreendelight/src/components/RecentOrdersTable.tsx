'use client'

import axios from "axios";
import { useEffect, useState } from "react";

export default function RecentOrdersTable() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(
                "/api/admin/dashboard/recent-orders"
            );
            setOrders(res.data);
        };


        fetchData();


    }, []);

    return (<div className="bg-white rounded-2xl shadow p-5 mt-8">


        <h2 className="text-lg font-bold mb-4">
            Recent Orders
        </h2>

        <div className="overflow-x-auto">

            <table className="w-full text-sm">

                <thead>
                    <tr className="text-left text-gray-500 border-b">
                        <th className="py-2">Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {orders.map((o) => (
                        <tr key={o.id} className="border-b">

                            <td className="py-2 font-medium">
                                #{o.id}
                            </td>

                            <td>{o.customer}</td>

                            <td>Rs {o.amount}</td>

                            <td>
                                <span
                                    className={`px-2 py-1 rounded text-xs ${o.status === "delivered"
                                            ? "bg-green-100 text-green-700"
                                            : o.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {o.status}
                                </span>
                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>

    </div>


    );
}
