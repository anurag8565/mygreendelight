'use client'

import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import {
    useEffect,
    useState,
} from "react";

export default function RevenueChart() {
    const [data, setData] =
        useState([]);

    useEffect(() => {
        const fetchRevenue =
            async () => {
                const res =
                    await axios.get(
                        "/api/admin/dashboard/revenue"
                    );

                setData(res.data);
            };

        fetchRevenue();


    }, []);

    return (<div className="bg-white rounded-2xl shadow p-5">


        <h2 className="font-bold text-lg mb-5">
            Revenue Last 7 Days
        </h2>

        <div className="h-[300px]">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <LineChart
                    data={data}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="day"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#16a34a"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    </div>


    );
}
