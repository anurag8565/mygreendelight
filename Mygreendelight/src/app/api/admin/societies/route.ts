import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Society from "@/model/society.model";
import Order from "@/model/order";
import { auth } from "@/auth";
import User from "@/model/user.model";

const INITIAL_BHOPAL_SOCIETIES = [
  {
    name: "Arera Colony (E1 - E7 & Green Meadows)",
    slug: "arera-colony",
    locality: "Arera Colony",
    landmark: "Bittan Market / 10 No. Market",
    pincode: "462016",
    targetOrders: 3,
    discountPercent: 5,
    keywords: ["arera", "bittan", "e-1", "e-2", "e-3", "e-4", "e-5", "e-6", "e-7", "10 no"],
    isActive: true,
  },
  {
    name: "Kolar Road (Sagar Premium & CI Grand)",
    slug: "kolar-road",
    locality: "Kolar Road",
    landmark: "Chuna Bhatti / Sarvadharam",
    pincode: "462042",
    targetOrders: 3,
    discountPercent: 5,
    keywords: ["kolar", "chuna bhatti", "sarvadharam", "sagar premium", "ci grand", "danish kunj"],
    isActive: true,
  },
  {
    name: "Bawadiya Kalan & Gulmohar (Aakriti Greens)",
    slug: "bawadiya-kalan",
    locality: "Bawadiya Kalan",
    landmark: "Rohit Nagar / Trilanga",
    pincode: "462026",
    targetOrders: 3,
    discountPercent: 5,
    keywords: ["bawadiya", "gulmohar", "aakriti", "rohit nagar", "trilanga", "shahpura"],
    isActive: true,
  },
  {
    name: "Hoshangabad Road (Aakriti Eco City & Fortune)",
    slug: "hoshangabad-road",
    locality: "Hoshangabad Road",
    landmark: "Misrod / Bagsewaniya",
    pincode: "462026",
    targetOrders: 3,
    discountPercent: 5,
    keywords: ["hoshangabad", "misrod", "bagsewaniya", "eco city", "fortune pride", "amrai"],
    isActive: true,
  },
  {
    name: "Minal Residency & Ayodhya Bypass",
    slug: "minal-residency",
    locality: "Minal Residency",
    landmark: "JK Road / Govindpura",
    pincode: "462023",
    targetOrders: 3,
    discountPercent: 5,
    keywords: ["minal", "ayodhya", "jk road", "govindpura", "piplani"],
    isActive: true,
  },
  {
    name: "MP Nagar & Rachna Nagar",
    slug: "mp-nagar",
    locality: "MP Nagar",
    landmark: "Zone 1 / Zone 2 / Kasturba Hospital",
    pincode: "462011",
    targetOrders: 3,
    discountPercent: 5,
    keywords: ["mp nagar", "rachna nagar", "zone 1", "zone 2", "kasturba", "chetak bridge"],
    isActive: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    // Auto seed if collection is empty
    const count = await Society.countDocuments();
    if (count === 0) {
      await Society.insertMany(INITIAL_BHOPAL_SOCIETIES);
    }

    const societies = await Society.find().sort({ createdAt: -1 });

    // Calculate actual matching orders placed in the last 48 hours for each society
    const sinceTime = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recentOrders = await Order.find({
      createdAt: { $gte: sinceTime },
      status: { $ne: "cancelled" },
    }).select("address createdAt totalamount");

    const enrichedSocieties = societies.map((doc) => {
      const soc = doc.toObject();
      const keywords = (soc.keywords && soc.keywords.length > 0)
        ? soc.keywords
        : [soc.name.toLowerCase(), soc.locality.toLowerCase()];

      const matchingOrders = recentOrders.filter((ord) => {
        const fullAddr = (ord.address?.fulladress || "").toLowerCase();
        const city = (ord.address?.city || "").toLowerCase();
        return keywords.some((kw: string) => fullAddr.includes(kw.toLowerCase()) || city.includes(kw.toLowerCase()));
      });

      return {
        ...soc,
        currentOrders: matchingOrders.length,
        isUnlocked: matchingOrders.length >= soc.targetOrders,
        ordersNeeded: Math.max(0, soc.targetOrders - matchingOrders.length),
      };
    });

    return NextResponse.json({
      success: true,
      societies: enrichedSocieties,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, locality, landmark, pincode, targetOrders, discountPercent, keywords, isActive } = body;

    if (!name || !locality) {
      return NextResponse.json({ success: false, message: "Name and Locality are required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await Society.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, message: "Society with this name already exists" }, { status: 400 });
    }

    const newSociety = await Society.create({
      name,
      slug,
      locality,
      landmark: landmark || "",
      pincode: pincode || "462001",
      targetOrders: Number(targetOrders) || 3,
      discountPercent: Number(discountPercent) || 5,
      keywords: Array.isArray(keywords)
        ? keywords
        : (keywords ? keywords.split(",").map((k: string) => k.trim()).filter(Boolean) : [locality.toLowerCase()]),
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({
      success: true,
      society: newSociety,
      message: "Society created successfully in database",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
