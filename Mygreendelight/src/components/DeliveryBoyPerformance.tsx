'use client'

import axios from "axios";
import { useEffect, useState } from "react";

export default function DeliveryBoyPerformance() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(
                "/api/admin/dashboard/delivery-performance"
            );
            setData(res.data);
        };

        fetchData();


    }, []);

    return (<div className="bg-white rounded-2xl shadow p-5 mt-8">


        <h2 className="text-lg font-bold mb-4">
            Delivery Boy Performance
        </h2>

        <div className="space-y-3">

            {data.map((d, i) => (
                <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                >
                    <span className="font-medium">
                        {d.name}
                    </span>

                    <span className="text-green-700 font-bold">
                        {d.deliveries} deliveries
                    </span>
                </div>
            ))}

        </div>

    </div>


    );
}
