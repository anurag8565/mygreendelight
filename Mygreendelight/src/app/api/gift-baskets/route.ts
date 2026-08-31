import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import GiftBasket from "@/model/giftbasket.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    let baskets = await GiftBasket.find({ isActive: true }).sort({ createdAt: -1 });

    if (baskets.length === 0) {
      baskets = await GiftBasket.insertMany([
        {
          title: "Royal Bhopal Festive Fruit & Dry Fruit Hamper",
          occasion: "Festive & Celebrations",
          description: "Premium imported apples, seedless grapes, kiwi, sweet oranges, and handpicked almonds with gold ribbon packaging.",
          contents: ["Kashmiri Royal Apples (1kg)", "Nagpur Sweet Oranges (1kg)", "Imported Green Kiwi (3 pcs)", "Seedless Sweet Grapes (500g)", "California Almonds (200g)"],
          price: 599,
          originalPrice: 799,
          image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
          ribbonColor: "Gold & Emerald Ribbon",
          isPopular: true,
          isActive: true,
        },
        {
          title: "Grandparents' Morning Vitality Basket",
          occasion: "Parents & Health Care",
          description: "Pure A2 cow milk, artisanal soft malai paneer, tender baby spinach, organic amla, and desi carrots.",
          contents: ["A2 Pure Gir Cow Milk (1L)", "Soft Malai Paneer (250g)", "Tender Spinach (500g)", "Fresh Indian Amla (250g)", "Sweet Red Carrots (1kg)"],
          price: 349,
          originalPrice: 450,
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
          ribbonColor: "Silver Silk Ribbon",
          isPopular: true,
          isActive: true,
        },
        {
          title: "Get Well Soon Immunity Booster Hamper",
          occasion: "Get Well Soon & Wellness",
          description: "Fresh coconuts with straw, Mosambi sweet limes, ginger, pure honey, and fresh mint leaves.",
          contents: ["Fresh Tender Coconuts (2 pcs)", "Sweet Limes (Mosambi 1kg)", "Wild Raw Honey (250g)", "Fresh Hill Ginger (250g)", "Crisp Pudina Leaves"],
          price: 449,
          originalPrice: 580,
          image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80",
          ribbonColor: "Green Leaf Ribbon",
          isPopular: false,
          isActive: true,
        },
        {
          title: "Exotic Hydroponic Chef Salad Basket",
          occasion: "Housewarming & Foodies",
          description: "Hydroponic butterhead lettuce, English cucumber, purple cabbage, cherry tomatoes, and microgreens.",
          contents: ["Hydroponic Butterhead Lettuce", "English Cucumbers (500g)", "Purple Cabbage (1 pc)", "Cherry Tomatoes (250g)", "Exotic Salad Dressing Herb Mix"],
          price: 399,
          originalPrice: 499,
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
          ribbonColor: "Rustic Jute Ribbon",
          isPopular: false,
          isActive: true,
        },
      ]);
    }

    return NextResponse.json({ success: true, baskets });
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
    const basket = await GiftBasket.create(body);
    return NextResponse.json({ success: true, basket, message: "Gift hamper created successfully!" });
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
    const basket = await GiftBasket.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, basket, message: "Gift hamper updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
