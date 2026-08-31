import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import MandiRate from "@/model/mandi.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    let rates = await MandiRate.find({ isActive: true }).sort({ updatedAt: -1 });

    if (rates.length === 0) {
      // Auto seed 4 Bhopal Mandi rates
      rates = await MandiRate.insertMany([
        {
          itemName: "Desi Tamatar (Farm Harvest)",
          currentRate: 24,
          unit: "1 kg",
          priceChange: "down",
          percentageChange: 35,
          isActive: true,
        },
        {
          itemName: "Indore Lal Pyaaz (Onion)",
          currentRate: 28,
          unit: "1 kg",
          priceChange: "down",
          percentageChange: 20,
          isActive: true,
        },
        {
          itemName: "New Season Chandramukhi Aloo",
          currentRate: 22,
          unit: "1 kg",
          priceChange: "stable",
          percentageChange: 0,
          isActive: true,
        },
        {
          itemName: "Sehore Desi Palak (Spinach)",
          currentRate: 15,
          unit: "250 g",
          priceChange: "down",
          percentageChange: 25,
          isActive: true,
        },
      ]);
    }

    return NextResponse.json({ success: true, rates });
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
    const rate = await MandiRate.create(body);
    return NextResponse.json({ success: true, rate, message: "Mandi rate added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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

    const { id, ...updates } = await req.json();
    const rate = await MandiRate.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, rate, message: "Mandi rate updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
