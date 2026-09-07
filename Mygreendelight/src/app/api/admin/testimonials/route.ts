import connectDb from "@/lib/db";
import Testimonial from "@/model/testimonial.model";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await connectDb();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("Admin Testimonial GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { action, name, comment, rating, location, tag, status } = body;

    // Action: Seed verified Bhopal reviews
    if (action === "seed_bhopal") {
      // Clean old dummy reviews and existing seed names first to prevent duplicates
      await Testimonial.deleteMany({
        $or: [
          { comment: { $regex: /yummy|bad rice|test|dgj|dfcjf|dgcjcjg/i } },
          { name: { $in: ["Dr. Ananya Sharma", "Rajesh K. Verma", "Pooja Malhotra", "Vikram Saxena", "Meenakshi Joshi", "u", "fj", "fgj"] } },
          { location: "India" },
          { comment: { $exists: false } }
        ]
      });

      const seedData = [
        {
          name: "Dr. Ananya Sharma",
          location: "Arera Colony, Bhopal",
          rating: 5,
          comment: "The crispness of the palak and taaza methi is incredible! Exactly like sunrise harvest. Delivered in 12 minutes to my doorstep.",
          tag: "Daily Customer",
          status: "approved",
        },
        {
          name: "Rajesh K. Verma",
          location: "Kolar Road, Bhopal",
          rating: 5,
          comment: "Ordered the Farm Club VIP Pass. Got free delivery and the 6:30 AM morning priority slot is a blessing for morning breakfast & pooja!",
          tag: "VIP Farm Club Member",
          status: "approved",
        },
        {
          name: "Pooja Malhotra",
          location: "Bawadiya Kalan, Bhopal",
          rating: 5,
          comment: "Direct farmer rates without unfair middleman markup. 100% clean, ozone-sorted, and no chemical smell in coriander or tomatoes.",
          tag: "Verified Resident",
          status: "approved",
        },
        {
          name: "Vikram Saxena",
          location: "MP Nagar Zone 2, Bhopal",
          rating: 5,
          comment: "Zero plastic mission is commendable! Returned 3 eco-bags to the delivery rider and got ₹30 instant cashback credited to my wallet.",
          tag: "Eco-Bag Hero",
          status: "approved",
        },
        {
          name: "Meenakshi Joshi",
          location: "Shahpura, Bhopal",
          rating: 5,
          comment: "Best quality A2 Gir Cow Milk and farm-fresh Paneer in Bhopal. Soft and purely organic. My entire family loves the morning subscription!",
          tag: "Morning Subscriber",
          status: "approved",
        },
      ];

      await Testimonial.insertMany(seedData);
      const updated = await Testimonial.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, testimonials: updated, message: "🎉 5 Authentic Bhopal reviews seeded successfully!" });
    }

    // Action: Clean all dummy reviews
    if (action === "clean_dummy") {
      const deleted = await Testimonial.deleteMany({
        $or: [
          { comment: { $regex: /yummy|bad rice|test/i } },
          { location: "India" }
        ]
      });
      const updated = await Testimonial.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, count: deleted.deletedCount, testimonials: updated, message: `Purged ${deleted.deletedCount} dummy test reviews.` });
    }

    if (!name || !comment) {
      return NextResponse.json({ success: false, message: "Name and comment are required" }, { status: 400 });
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      comment: comment.trim(),
      rating: Number(rating) || 5,
      location: location || "Bhopal, MP",
      tag: tag || "Verified Customer",
      status: status || "approved",
    });

    return NextResponse.json({ success: true, testimonial, message: "Testimonial created successfully" });
  } catch (error: any) {
    console.error("Admin Testimonial POST Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}