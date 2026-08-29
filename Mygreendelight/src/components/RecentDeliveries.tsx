'use client'

import {
  PackageCheck,
  Calendar
} from "lucide-react";

interface Props {
  deliveries: {
    _id: string;
    totalamount: number;
    createdAt: string;
    status: string;
  }[];
}

export default function RecentDeliveries({
  deliveries
}: Props) {

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6">

      <div className="flex items-center gap-3 mb-6">

        <PackageCheck
          size={28}
          className="text-green-600"
        />

        <div>

          <h2 className="text-xl font-bold">
            Recent Deliveries
          </h2>

          <p className="text-gray-500 text-sm">
            Latest completed orders
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {deliveries.length === 0 ? (

          <div className="text-center py-8 text-gray-500">
            No deliveries yet
          </div>

        ) : (

          deliveries.map((order) => (

            <div
              key={order._id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition"
            >

              <div>

                <h3 className="font-semibold">
                  #{order._id?.slice?.(-6) || "N/A"}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                  <Calendar size={14} />
                  <span suppressHydrationWarning>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                  </span>

                </div>

              </div>

              <div className="text-right">

                <h3 className="font-bold text-green-600">
                  Rs {order.totalamount}
                </h3>

                <p className="text-sm text-green-600">
                  {order.status}
                </p>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}