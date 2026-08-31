import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import DinnerRecipe from "@/model/dinnerwheel.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    let recipes = await DinnerRecipe.find({ isActive: true }).sort({ createdAt: -1 });

    if (recipes.length === 0) {
      recipes = await DinnerRecipe.insertMany([
        {
          title: "Bhopali Palak Paneer",
          description: "Fresh tender spinach purée with artisanal A2 Malai Paneer and rich farm spices.",
          prepTime: "15 mins",
          servings: "2-3 Persons",
          image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=85",
          comboPrice: 149,
          mrp: 199,
          sliceColor: "#0f8646",
          isActive: true,
          ingredients: [
            { name: "Desi Palak (Spinach)", qty: "500 g", price: 35, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80" },
            { name: "Farm Fresh Malai Paneer", qty: "200 g", price: 85, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80" },
            { name: "Hybrid Red Tomatoes", qty: "250 g", price: 15, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" },
            { name: "Fresh Ginger & Green Chilli Kit", qty: "100 g", price: 14, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80" },
          ],
        },
        {
          title: "Street Style Pav Bhaji",
          description: "Mouth-watering spiced vegetable mash basket with buttery soft bakery pav.",
          prepTime: "20 mins",
          servings: "3-4 Persons",
          image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=85",
          comboPrice: 169,
          mrp: 225,
          sliceColor: "#ea580c",
          isActive: true,
          ingredients: [
            { name: "Farm Potatoes (Aloo)", qty: "500 g", price: 25, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80" },
            { name: "Sweet Green Peas (Matar)", qty: "250 g", price: 35, image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=300&q=80" },
            { name: "Cauliflower (Gobhi)", qty: "1 Pc", price: 30, image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=300&q=80" },
            { name: "Fresh Capsicum (Shimla Mirch)", qty: "250 g", price: 25, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=300&q=80" },
            { name: "Artisanal Bakery Pav", qty: "6 Pcs", price: 35, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80" },
            { name: "Desi Table Butter", qty: "50 g", price: 19, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80" },
          ],
        },
        {
          title: "Amritsari Aloo Gobhi",
          description: "Homestyle aromatic potatoes and fresh cauliflower stir-fry with ginger juliennes.",
          prepTime: "15 mins",
          servings: "2-3 Persons",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=85",
          comboPrice: 99,
          mrp: 135,
          sliceColor: "#d97706",
          isActive: true,
          ingredients: [
            { name: "Fresh Cauliflower (Gobhi)", qty: "1 Pc (500g)", price: 35, image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=300&q=80" },
            { name: "Pahadi Aloo (Potatoes)", qty: "500 g", price: 25, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80" },
            { name: "Fresh Coriander & Green Chillies", qty: "100 g", price: 15, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80" },
            { name: "Indore Lal Pyaaz (Onions)", qty: "250 g", price: 24, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80" },
          ],
        },
        {
          title: "Desi Matar Mushroom Masala",
          description: "Plump button mushrooms cooked with sweet green peas in a velvety spiced gravy.",
          prepTime: "20 mins",
          servings: "3 Persons",
          image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=85",
          comboPrice: 179,
          mrp: 240,
          sliceColor: "#7c3aed",
          isActive: true,
          ingredients: [
            { name: "Fresh White Button Mushrooms", qty: "200 g", price: 75, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80" },
            { name: "Sweet Green Peas (Matar)", qty: "250 g", price: 35, image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=300&q=80" },
            { name: "Red Ripe Tomatoes", qty: "300 g", price: 20, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" },
            { name: "Garlic, Ginger & Spices Kit", qty: "100 g", price: 20, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80" },
            { name: "Fresh Dairy Cream", qty: "100 ml", price: 29, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80" },
          ],
        },
        {
          title: "Rainbow Immunity Salad Box",
          description: "Crisp hydroponic greens, cherry tomatoes, English cucumber & zesty lemon herb dressing.",
          prepTime: "5 mins",
          servings: "2 Persons",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=85",
          comboPrice: 119,
          mrp: 160,
          sliceColor: "#059669",
          isActive: true,
          ingredients: [
            { name: "Hydroponic Lettuce Leaves", qty: "150 g", price: 45, image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=300&q=80" },
            { name: "English Seedless Cucumber", qty: "1 Pc", price: 25, image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=300&q=80" },
            { name: "Sweet Cherry Tomatoes", qty: "150 g", price: 30, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" },
            { name: "Fresh Lemon & Mint Leaves", qty: "2 Pcs", price: 19, image: "https://images.unsplash.com/photo-1534856966150-c832f7b7f09a?auto=format&fit=crop&w=300&q=80" },
          ],
        },
        {
          title: "Bhopali Kadai Paneer Feast",
          description: "Crunchy bell peppers, onions and farm paneer tossed in freshly pounded coriander kadai masala.",
          prepTime: "18 mins",
          servings: "3 Persons",
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=85",
          comboPrice: 189,
          mrp: 250,
          sliceColor: "#b91c1c",
          isActive: true,
          ingredients: [
            { name: "Fresh A2 Malai Paneer", qty: "250 g", price: 95, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80" },
            { name: "Tri-Color Capsicum (Bell Peppers)", qty: "300 g", price: 45, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=300&q=80" },
            { name: "Diced Red Onions & Tomatoes", qty: "350 g", price: 29, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80" },
            { name: "Special Kadai Whole Spices", qty: "50 g", price: 20, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80" },
          ],
        },
      ]);
    }

    return NextResponse.json({ success: true, recipes });
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
    const recipe = await DinnerRecipe.create(body);
    return NextResponse.json({ success: true, recipe, message: "New dinner recipe added to wheel!" });
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
    const recipe = await DinnerRecipe.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, recipe, message: "Dinner recipe updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
