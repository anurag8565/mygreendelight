import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";

export async function GET() {
try {
await connectDb();


const days = [];

for (let i = 6; i >= 0; i--) {
  const date = new Date();

  date.setDate(
    date.getDate() - i
  );

  const start = new Date(date);
  start.setHours(
    0,
    0,
    0,
    0
  );

  const end = new Date(date);
  end.setHours(
    23,
    59,
    59,
    999
  );

  const orders =
    await Order.find({
      status: { $in: ["delivered", "completed"] },
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

  const revenue =
    orders.reduce(
      (sum, order) =>
        sum +
        order.totalamount,
      0
    );

  days.push({
    day:
      date.toLocaleDateString(
        "en-US",
        {
          weekday:
            "short",
        }
      ),
    revenue,
  });
}

return NextResponse.json(
  days
);


} catch (error) {
console.log(error);

return NextResponse.json(
  {
    message:
      "Revenue error",
  },
  {
    status: 500,
  }
);


}
}
