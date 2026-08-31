import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import RecipeKit from "@/model/recipekit.model";

export const dynamic = "force-dynamic";

const initialBhopalKits = [
  {
    name: "Desi Palak Paneer Kit",
    hindiName: "देसी पालक पनीर किट",
    serves: "3-4 Persons",
    cookTime: "25 Mins",
    badge: "⭐ Chef's Favorite",
    price: 149,
    mrp: 199,
    image: "/categories/vegetables.jpg",
    isActive: true,
    ingredients: [
      { name: "Farm Fresh Spinach (Palak)", qty: "500g", price: 30, image: "/categories/vegetables.jpg" },
      { name: "Fresh Malai Paneer", qty: "200g", price: 85, image: "/categories/exotic.jpg" },
      { name: "Desi Ripe Tomatoes", qty: "250g", price: 15, image: "/categories/vegetables.jpg" },
      { name: "Ginger, Garlic & Green Chillies Combo", qty: "100g", price: 19, image: "/categories/vegetables.jpg" },
    ],
  },
  {
    name: "Street Style Pav Bhaji Basket",
    hindiName: "स्ट्रीट स्टाइल पाव भाजी किट",
    serves: "4 Persons",
    cookTime: "30 Mins",
    badge: "🔥 Weekend Special",
    price: 169,
    mrp: 220,
    image: "/categories/vegetables.jpg",
    isActive: true,
    ingredients: [
      { name: "Fresh Farm Potatoes (Aloo)", qty: "500g", price: 25, image: "/categories/vegetables.jpg" },
      { name: "Fresh Cauliflower (Gobhi)", qty: "500g", price: 35, image: "/categories/vegetables.jpg" },
      { name: "Green Bell Peppers (Capsicum)", qty: "250g", price: 29, image: "/categories/vegetables.jpg" },
      { name: "Fresh Green Peas (Matar)", qty: "250g", price: 40, image: "/categories/vegetables.jpg" },
      { name: "Fresh Coriander & Lemons", qty: "1 pack", price: 40, image: "/categories/vegetables.jpg" },
    ],
  },
  {
    name: "Immunity Rainbow Salad Box",
    hindiName: "इम्यूनिटी फ्रेश सलाद बॉक्स",
    serves: "2 Persons",
    cookTime: "5 Mins (Ready)",
    badge: "🌿 100% Raw Detox",
    price: 119,
    mrp: 155,
    image: "/categories/fruits.jpg",
    isActive: true,
    ingredients: [
      { name: "Crispy English Cucumber", qty: "2 pcs", price: 30, image: "/categories/vegetables.jpg" },
      { name: "Sweet Beetroot (Chukandar)", qty: "250g", price: 25, image: "/categories/vegetables.jpg" },
      { name: "Juicy Farm Carrots (Gajar)", qty: "250g", price: 25, image: "/categories/vegetables.jpg" },
      { name: "Fresh Mint & Lemon Dressing", qty: "1 pack", price: 39, image: "/categories/vegetables.jpg" },
    ],
  },
];

export async function GET() {
  try {
    await connectDb();

    let count = await RecipeKit.countDocuments();
    if (count === 0) {
      await RecipeKit.insertMany(initialBhopalKits);
    }

    const kits = await RecipeKit.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, kits });
  } catch (error: any) {
    console.error("GET Recipe Kits Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const { name, hindiName, serves, cookTime, badge, price, mrp, image, ingredients } = body;

    if (!name || !price || !mrp) {
      return NextResponse.json(
        { success: false, message: "Name, price and MRP are required" },
        { status: 400 }
      );
    }

    const newKit = new RecipeKit({
      name: name.trim(),
      hindiName: hindiName || "",
      serves: serves || "3-4 Persons",
      cookTime: cookTime || "25 Mins",
      badge: badge || "⭐ Special",
      price: Number(price),
      mrp: Number(mrp),
      image: image || "/categories/vegetables.jpg",
      isActive: true,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
    });

    await newKit.save();

    return NextResponse.json({
      success: true,
      message: "Recipe kit created successfully in database!",
      kit: newKit,
    });
  } catch (error: any) {
    console.error("POST Recipe Kit Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
