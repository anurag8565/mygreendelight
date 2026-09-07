import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Banner from "@/model/banner.model";
import { NextRequest, NextResponse } from "next/server";

export const OFFICIAL_DEFAULT_BANNERS = [
  {
    title: "Direct From Local Bhopal & Sehore Farms",
    subtitle: "100% Ozone-Washed, Handpicked Vegetables & Fruits Delivered Fresh.",
    btnText: "Order Fresh Produce",
    link: "/shop?category=Vegetables",
    image: "/banners/veggies_clean_4k.jpg",
    badge: "🌿 Sunrise Farm Harvest • 10-15 Min Express",
    offerPill: "FLAT ₹50 OFF • CODE: FRESH50",
    floatingStat: "🌱 5:00 AM Fresh Harvest",
    bgGradient: "from-[#052e16]/95 via-[#064e3b]/85 to-transparent/30",
    accentColor: "#10b981",
    isActive: true,
    order: 1,
  },
  {
    title: "Handpicked Premium Seasonal Fruits",
    subtitle: "Crisp Apples, Sweet Mangoes, Pomegranates & Farm Fresh Citrus.",
    btnText: "Explore Fresh Fruits",
    link: "/shop?category=Fruits",
    image: "/banners/fruits_clean_4k.jpg",
    badge: "🍎 Juicy Orchards • 100% Naturally Sweet",
    offerPill: "SWEET & JUICY GUARANTEE",
    floatingStat: "🍎 100% Wax & Carbide Free",
    bgGradient: "from-[#451a03]/95 via-[#7c2d12]/85 to-transparent/30",
    accentColor: "#f59e0b",
    isActive: true,
    order: 2,
  },
  {
    title: "Crisp Hydroponic Greens & Exotic Salads",
    subtitle: "Fresh Iceberg, Cherry Tomatoes, Avocados, Herbs & European salad mixes.",
    btnText: "Explore Exotics",
    link: "/shop?category=Exotics",
    image: "/banners/exotics_clean_4k.jpg",
    badge: "🥑 Hydroponic & Gourmet Exotics",
    offerPill: "PESTICIDE FREE CERTIFIED",
    floatingStat: "🥑 Gourmet Fresh Daily",
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
