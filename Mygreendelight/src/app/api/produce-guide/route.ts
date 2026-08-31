import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ProduceGuide from "@/model/produceGuide.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    let guides = await ProduceGuide.find({}).sort({ createdAt: 1 });

    if (guides.length === 0) {
      guides = await ProduceGuide.insertMany([
        {
          category: "Saag & Leafy Greens (Palak, Methi, Coriander)",
          icon: "🥬",
          idealStorage: "Wrap in clean dry cotton cloth or perforated zip bag in refrigerator crisper drawer.",
          temperature: "4°C - 7°C (Chilled)",
          shelfLifeDays: 4,
          ripenessTips: "Look for vibrant deep green unblemished leaves with firm, snappy stems. Avoid yellow edges.",
          kitchenHacks: "Store coriander stems submerged in a small glass of water like flowers to keep crisp for 10+ days.",
          washingAdvice: "Ozone sanitized at harvest. Wash thoroughly in cold water only right before cooking to prevent moisture rot.",
        },
        {
          category: "Tomatoes & Soft Fruits (Desi Tamatar, Berries)",
          icon: "🍅",
          idealStorage: "Store stem-side down at room temperature away from direct sunlight. Do not refrigerate under-ripe tomatoes.",
          temperature: "18°C - 22°C (Room Temp)",
          shelfLifeDays: 6,
          ripenessTips: "Firm to gentle squeeze with fragrant earthy aroma at the stem. Fully red for sweet Indian curries.",
          kitchenHacks: "Refrigerating tomatoes degrades their sweetness and texture. Only chill once fully ripe and cut.",
          washingAdvice: "100% Ozone washed. Wipe with clean towel or rinse in room-temperature water.",
        },
        {
          category: "Root Staples (Aloo, Pyaaz, Adrak, Lahsun)",
          icon: "🥔",
          idealStorage: "Cool, dry, dark, well-ventilated wicker basket or jute bag. Never store onions and potatoes together.",
          temperature: "15°C - 20°C (Dry Dark Shelf)",
          shelfLifeDays: 14,
          ripenessTips: "Heavy for their size with smooth tight skin, zero green spots, and no sprouting eyes.",
          kitchenHacks: "Keep onions and potatoes in separate baskets! Onions release ethylene gas that causes potatoes to sprout prematurely.",
          washingAdvice: "Brush off dry soil before storing. Wash potatoes only right before peeling or boiling.",
        },
        {
          category: "Dairy & Artisanal Malai Paneer",
          icon: "🧀",
          idealStorage: "Submerge paneer block completely in clean drinking water in an airtight container inside the fridge.",
          temperature: "2°C - 4°C (Coldest Fridge Shelf)",
          shelfLifeDays: 5,
          ripenessTips: "Pristine milky-white color with soft spongy elasticity and sweet fresh dairy aroma.",
          kitchenHacks: "Change the submerged water in the paneer container every 24 hours to keep it bakery-soft for up to 7 days.",
          washingAdvice: "Prepared in sterile conditions. Rinse under cold drinking water before cutting into cubes.",
        },
        {
          category: "Exotics & Hydroponic Salads (Lettuce, Broccoli, Bell Peppers)",
          icon: "🥗",
          idealStorage: "Keep in original breathable clamshell container or wrapped in a paper towel in refrigerator crisper.",
          temperature: "3°C - 6°C (Refrigerated)",
          shelfLifeDays: 7,
          ripenessTips: "Tight, dense heads with zero browning on florets or outer leaves.",
          kitchenHacks: "Revive limp lettuce or celery in an ice-water bath for 10 minutes to restore maximum crunch!",
          washingAdvice: "Hydroponically grown and ozone rinsed. Ready to eat straight out of the box after a light cold splash.",
        },
      ]);
    }

    return NextResponse.json({ success: true, guides });
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
    const guide = await ProduceGuide.create(body);
    return NextResponse.json({ success: true, guide, message: "Produce guide added successfully!" });
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
    const guide = await ProduceGuide.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, guide, message: "Produce guide updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
