import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import CustomBoxIngredient from "@/model/custombox.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    let ingredients = await CustomBoxIngredient.find({ isAvailable: true }).sort({ category: 1 });

    if (ingredients.length === 0) {
      ingredients = await CustomBoxIngredient.insertMany([
        // Bases
        {
          name: "Hydroponic Crisp Lettuce",
          category: "base",
          price: 40,
          calories: 15,
          protein: 1.4,
          image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Tender Baby Spinach (Palak)",
          category: "base",
          price: 35,
          calories: 23,
          protein: 2.9,
          image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Crisp Purple Cabbage",
          category: "base",
          price: 30,
          calories: 31,
          protein: 1.5,
          image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        // Veggies
        {
          name: "Sweet Cherry Tomatoes",
          category: "veggie",
          price: 25,
          calories: 27,
          protein: 1.3,
          image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "English Seedless Cucumber",
          category: "veggie",
          price: 20,
          calories: 16,
          protein: 0.7,
          image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Tri-Color Bell Peppers",
          category: "veggie",
          price: 30,
          calories: 31,
          protein: 1.0,
          image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Steamed Green Broccoli",
          category: "veggie",
          price: 35,
          calories: 35,
          protein: 2.8,
          image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Sweet American Corn",
          category: "veggie",
          price: 25,
          calories: 86,
          protein: 3.2,
          image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        // Protein & Crunch
        {
          name: "Fresh Hass Avocado Slices",
          category: "protein_crunch",
          price: 55,
          calories: 160,
          protein: 2.0,
          image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Artisanal Malai Paneer Cubes",
          category: "protein_crunch",
          price: 45,
          calories: 140,
          protein: 9.0,
          image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Roasted Almonds & Flaxseeds",
          category: "protein_crunch",
          price: 35,
          calories: 110,
          protein: 4.5,
          image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        // Dressings
        {
          name: "Zesty Lemon Herb Dressing",
          category: "dressing",
          price: 20,
          calories: 45,
          protein: 0.2,
          image: "https://images.unsplash.com/photo-1534856966150-c832f7b7f09a?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Extra Virgin Olive Oil & Herbs",
          category: "dressing",
          price: 25,
          calories: 80,
          protein: 0.1,
          image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
        {
          name: "Mint Lime Farm Vinaigrette",
          category: "dressing",
          price: 20,
          calories: 35,
          protein: 0.3,
          image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=300&q=80",
          isAvailable: true,
        },
      ]);
    }

    return NextResponse.json({ success: true, ingredients });
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
    const ingredient = await CustomBoxIngredient.create(body);
    return NextResponse.json({ success: true, ingredient, message: "Ingredient added successfully!" });
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
    const ingredient = await CustomBoxIngredient.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, ingredient, message: "Ingredient updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
