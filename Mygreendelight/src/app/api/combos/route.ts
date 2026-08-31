import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ComboBundle from "@/model/combo.model";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    let combos = await ComboBundle.find({ isActive: true }).sort({ createdAt: -1 });

    if (combos.length === 0) {
      combos = await ComboBundle.insertMany([
        {
          title: "Desi Sabzi Tadka & Daily Gravy Essentials",
          subtitle: "Aloo (1kg) + Desi Pyaaz (1kg) + Red Tamatar (500g) + Ginger Garlic (200g)",
          badge: "Save 22%",
          originalPrice: 165,
          comboPrice: 129,
          discountPercentage: 22,
          image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=400&q=80",
          items: [
            { name: "Farm Fresh Aloo", quantity: 1, unit: "1 kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=200&q=80" },
            { name: "Nashik Red Onion (Pyaaz)", quantity: 1, unit: "1 kg", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=200&q=80" },
            { name: "Desi Juicy Tamatar", quantity: 1, unit: "500 g", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80" },
            { name: "Fresh Adrak & Garlic Kit", quantity: 1, unit: "200 g", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80" },
          ],
          isActive: true,
        },
        {
          title: "High Protein Morning Breakfast Pack",
          subtitle: "Pure A2 Cow Milk (1L) + Malai Paneer (200g) + 6 Farm Desi Eggs",
          badge: "Save 18%",
          originalPrice: 220,
          comboPrice: 179,
          discountPercentage: 18,
          image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80",
          items: [
            { name: "Pure A2 Cow Milk", quantity: 1, unit: "1 Litre", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80" },
            { name: "Fresh Malai Paneer", quantity: 1, unit: "200 g", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=200&q=80" },
            { name: "Farm Fresh Desi Eggs", quantity: 1, unit: "6 Pcs", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=200&q=80" },
          ],
          isActive: true,
        },
        {
          title: "Super Immunity Green Detox Salad Kit",
          subtitle: "Baby Spinach (250g) + English Cucumber (500g) + Cherry Tomatoes (250g) + Lemon (4 pcs)",
          badge: "Save 25%",
          originalPrice: 180,
          comboPrice: 135,
          discountPercentage: 25,
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
          items: [
            { name: "Tender Palak (Spinach)", quantity: 1, unit: "250 g", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=200&q=80" },
            { name: "English Cucumber", quantity: 1, unit: "500 g", image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=200&q=80" },
            { name: "Sweet Cherry Tomatoes", quantity: 1, unit: "250 g", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80" },
          ],
          isActive: true,
        },
        {
          title: "Weekly Vitamin C Citrus Fruits Hamper",
          subtitle: "Kinnow / Sweet Oranges (1kg) + Kashmiri Apple (500g) + Fresh Lemons",
          badge: "Save 20%",
          originalPrice: 240,
          comboPrice: 189,
          discountPercentage: 20,
          image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80",
          items: [
            { name: "Sweet Nagpur Oranges", quantity: 1, unit: "1 kg", image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=200&q=80" },
            { name: "Kashmiri Red Apple", quantity: 1, unit: "500 g", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80" },
          ],
          isActive: true,
        },
      ]);
    }

    return NextResponse.json({ success: true, combos });
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
    const combo = await ComboBundle.create(body);
    return NextResponse.json({ success: true, combo, message: "Combo bundle created successfully!" });
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
    const combo = await ComboBundle.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, combo, message: "Combo updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
