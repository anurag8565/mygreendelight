'use client'

import axios from "axios";
import { useEffect, useState } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function OrdersChart() {
    const [data, setData] =
        useState([]);

    useEffect(() => {
        const fetchData =
            async () => {
                const res =
                    await axios.get(
                        "/api/admin/dashboard/orders"
                    );


                setData(res.data);
            };

        fetchData();


    }, []);

    return (<div className="bg-white rounded-2xl shadow p-5">


        <h2 className="font-bold text-lg mb-5">
            Orders Last 7 Days
        </h2>

        <div className="h-[300px]">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="orders"
                        fill="#16a34a"
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    </div>


    );
}
