import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Banner from "@/model/banner.model";
import { NextRequest, NextResponse } from "next/server";

export const OFFICIAL_DEFAULT_BANNERS = [
  {
    title: "Direct From Local Bhopal & Sehore Farms",
    subtitle: "Harvested at 5:00 AM daily • Best store prices in Bhopal.",
    btnText: "Order Fresh Produce",
    link: "/shop?category=Vegetables",
    image: "/banners/hero1.jpg",
    badge: "5:00 AM Sunrise Harvest • 15 Min Express",
    offerPill: "FLAT ₹50 OFF • CODE: FRESH50",
    floatingStat: "5:00 AM Fresh Harvest",
    bgGradient: "from-[#052e16]/95 via-[#064e3b]/85 to-transparent/30",
    accentColor: "#10b981",
    isActive: true,
    order: 1,
  },
  {
    title: "Handpicked Premium Seasonal Fruits",
    subtitle: "Crisp apples, sweet mangoes, pomegranates & farm-fresh citrus.",
    btnText: "Explore Fresh Fruits",
    link: "/shop?category=Fruits",
    image: "/hero_fruits_orchard.jpg",
    badge: "Naturally Sweet • 100% Wax & Carbide Free",
    offerPill: "SWEET & JUICY GUARANTEE",
    floatingStat: "100% Wax & Carbide Free",
    bgGradient: "from-[#451a03]/95 via-[#7c2d12]/85 to-transparent/30",
    accentColor: "#f59e0b",
    isActive: true,
    order: 2,
  },
  {
    title: "Fresh Dairy & Daily Morning Essentials",
    subtitle: "Pure milk, artisan breads, eggs & pantry staples delivered fast.",
    btnText: "Shop Daily Essentials",
    link: "/shop?category=Dairy",
    image: "/banners/hero2.jpg",
    badge: "100% Farm Purity Guaranteed",
    offerPill: "PESTICIDE FREE CERTIFIED",
    floatingStat: "Farm Purity Certified",
    bgGradient: "from-[#134e4a]/95 via-[#115e59]/85 to-transparent/30",
    accentColor: "#2dd4bf",
    isActive: true,
    order: 3,
  },
];

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { overwrite = false } = await req.json().catch(() => ({}));

    if (overwrite) {
      await Banner.deleteMany({});
    }

    const existingCount = await Banner.countDocuments();
    if (existingCount === 0 || overwrite) {
      const created = await Banner.insertMany(OFFICIAL_DEFAULT_BANNERS);
      return NextResponse.json({
        success: true,
        message: "Successfully seeded 4 official 8K luxury banners!",
        count: created.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Banners already exist. Pass overwrite: true to reset completely.",
      count: existingCount,
    });
  } catch (error: any) {
    console.error("BANNER SEED ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to seed banners" },
      { status: 500 }
    );
  }
}
