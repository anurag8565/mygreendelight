import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/model/order";

const POPULAR_BHOPAL_SOCIETIES = [
  {
    id: "arera-colony",
    name: "Arera Colony (E1 - E7 & Green Meadows)",
    landmark: "Bittan Market / 10 No. Market",
    targetOrders: 3,
    discountPercent: 5,
  },
  {
    id: "kolar-road",
    name: "Kolar Road (Sagar Premium & CI Grand)",
    landmark: "Chuna Bhatti / Sarvadharam",
    targetOrders: 3,
    discountPercent: 5,
  },
  {
    id: "bawadiya-kalan",
    name: "Bawadiya Kalan (Gulmohar & Aakriti Greens)",
    landmark: "Rohit Nagar / Trilanga",
    targetOrders: 3,
    discountPercent: 5,
  },
  {
    id: "hoshangabad-road",
    name: "Hoshangabad Road (Aakriti Eco City & Fortune)",
    landmark: "Misrod / Bagsewaniya",
    targetOrders: 3,
    discountPercent: 5,
  },
  {
    id: "minal-residency",
    name: "Minal Residency & Ayodhya Bypass",
    landmark: "JK Road / Govindpura",
    targetOrders: 3,
    discountPercent: 5,
  },
  {
    id: "mp-nagar",
    name: "MP Nagar & Rachna Nagar",
    landmark: "Zone 1 / Zone 2 / Kasturba Hospital",
    targetOrders: 3,
    discountPercent: 5,
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // Check orders placed in the last 48 hours for society pool
    const sinceTime = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const recentOrders = await Order.find({
      createdAt: { $gte: sinceTime },
      status: { $ne: "cancelled" },
    }).select("address createdAt");

    const poolResults = POPULAR_BHOPAL_SOCIETIES.map((soc) => {
      // Count matching orders from fulladress or city matching society keywords
      const matchCount = recentOrders.filter((ord) => {
        const addr = (ord.address?.fulladress || "").toLowerCase();
        const sName = soc.name.toLowerCase();
        const sId = soc.id.replace("-", " ");
        return addr.includes(sId) || addr.includes("arera") && soc.id === "arera-colony" || addr.includes("kolar") && soc.id === "kolar-road" || addr.includes("bawadiya") && soc.id === "bawadiya-kalan" || addr.includes("minal") && soc.id === "minal-residency" || addr.includes("hoshangabad") && soc.id === "hoshangabad-road" || addr.includes("mp nagar") && soc.id === "mp-nagar";
      }).length;

      // Ensure minimum dynamic threshold display (at least 2 orders so 1 more triggers or unlocked)
      const dynamicOrders = Math.max(matchCount, (soc.id === "arera-colony" || soc.id === "kolar-road") ? 3 : 2);
      const isUnlocked = dynamicOrders >= soc.targetOrders;

      return {
        ...soc,
        currentOrders: dynamicOrders,
        isUnlocked,
        ordersNeeded: Math.max(0, soc.targetOrders - dynamicOrders),
      };
    });

    return NextResponse.json({
      success: true,
      societies: poolResults,
      discountPercent: 5,
      totalActivePools: poolResults.filter((p) => p.isUnlocked).length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
