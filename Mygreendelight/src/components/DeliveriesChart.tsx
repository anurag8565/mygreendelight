'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface Props {
  data: {
    day: string;
    deliveries: number;
  }[];
}

export default function DeliveriesChart({
  data
}: Props) {

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6">

      <div className="mb-5">

        <h2 className="text-xl font-bold">
          🚚 Deliveries Overview
        </h2>

        <p className="text-gray-500 text-sm">
          Last 7 days deliveries
        </p>

      </div>

      <div className="h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="deliveries"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}