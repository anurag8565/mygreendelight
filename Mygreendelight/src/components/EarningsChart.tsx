'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface Props {
  data: {
    day: string;
    earnings: number;
  }[];
}

export default function EarningsChart({
  data
}: Props) {

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6">

      <div className="mb-5">

        <h2 className="text-xl font-bold">
          💰 Earnings Overview
        </h2>

        <p className="text-gray-500 text-sm">
          Last 7 days earnings
        </p>

      </div>

      <div className="h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="earnings"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}