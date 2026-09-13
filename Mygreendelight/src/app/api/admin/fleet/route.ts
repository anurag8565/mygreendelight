import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import Order from "@/model/order";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const riders = await User.find({ role: "deliveryboy" })
      .select("name email mobile isonline location createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Enrich with active and total delivery stats
    const enrichedRiders = await Promise.all(
      riders.map(async (rider: any) => {
        const [activeOrders, completedOrders] = await Promise.all([
          Order.countDocuments({
            assigneddelliveryboy: rider._id,
            status: { $in: ["out of delivery", "confirmed", "packed"] },
          }),
          Order.countDocuments({
            assigneddelliveryboy: rider._id,
            status: "delivered",
          }),
        ]);

        return {
          ...rider,
          activeOrders,
          completedOrders,
        };
      })
    );

    return NextResponse.json({ success: true, riders: enrichedRiders });
  } catch (error: any) {
    console.error("Admin Fleet GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, mobile, password, action, userId } = await req.json();

    // Action 1: Promote existing user by ID
    if (action === "promote" && userId) {
      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { role: "deliveryboy" } },
        { new: true }
      );
      if (!updated) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `User ${updated.name || updated.email} promoted to Delivery Partner!`,
        rider: updated,
      });
    }

    // Action 2: Create new Delivery Partner
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    const cleanMobile = mobile ? mobile.trim().replace(/[^0-9]/g, "") : "";

    if (!name || !cleanEmail || !password || !cleanMobile) {
      return NextResponse.json(
        { success: false, message: "Name, email, 10-digit mobile, and password are required." },
        { status: 400 }
      );
    }

    const existing = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } },
        { mobile: cleanMobile },
      ],
    });

    if (existing) {
      // If user already exists, update role to deliveryboy
      existing.role = "deliveryboy";
      existing.name = name.trim();
      existing.mobile = cleanMobile;
      if (password) {
        existing.password = await bcrypt.hash(password, 10);
      }
      await existing.save();

      return NextResponse.json({
        success: true,
        message: `Existing account ${cleanEmail} upgraded to Delivery Partner!`,
        rider: existing,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newRider = await User.create({
      name: name.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      password: hashedPassword,
      role: "deliveryboy",
      isonline: true,
    });

    return NextResponse.json({
      success: true,
      message: `Delivery Partner ${name} added successfully!`,
      rider: newRider,
    });
  } catch (error: any) {
    console.error("Admin Fleet POST Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { riderId, newRole, name, mobile, email, password, isonline } = await req.json();
    if (!riderId) {
      return NextResponse.json({ success: false, message: "Rider ID is required" }, { status: 400 });
    }

    const rider = await User.findById(riderId);
    if (!rider) {
      return NextResponse.json({ success: false, message: "Delivery partner not found" }, { status: 404 });
    }

    const updateFields: any = {};
    if (newRole) updateFields.role = newRole;
    if (name && name.trim()) updateFields.name = name.trim();
    if (mobile) {
      const cleanMobile = mobile.trim().replace(/[^0-9]/g, "").slice(-10);
      if (cleanMobile.length === 10) {
        updateFields.mobile = cleanMobile;
      }
    }
    if (email && email.trim()) {
      updateFields.email = email.trim().toLowerCase();
    }
    if (password && password.trim()) {
      updateFields.password = await bcrypt.hash(password.trim(), 10);
    }
    if (typeof isonline === "boolean") {
      updateFields.isonline = isonline;
    }

    const updated = await User.findByIdAndUpdate(
      riderId,
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Delivery partner ${updated?.name || ''} updated successfully!`,
      rider: updated,
    });
  } catch (error: any) {
    console.error("Admin Fleet PUT Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
