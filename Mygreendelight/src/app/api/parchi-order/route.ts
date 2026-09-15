import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ParchiOrder from "@/model/parchiOrder.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();

    const {
      customerName,
      mobile,
      address,
      locality,
      pincode,
      parchiImageUrl,
      listText,
      voiceNoteUrl,
    } = body;

    if (!customerName || !mobile || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, Mobile number, and Bhopal Delivery Address are required.",
        },
        { status: 400 }
      );
    }

    if (!parchiImageUrl && !listText && !voiceNoteUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Please attach a photo of your parchi or write your grocery list items.",
        },
        { status: 400 }
      );
    }

    const newParchiOrder = await ParchiOrder.create({
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      locality: locality || "Bhopal",
      pincode: pincode || "462001",
      parchiImageUrl: parchiImageUrl || "",
      listText: listText ? listText.trim() : "",
      voiceNoteUrl: voiceNoteUrl || "",
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      order: newParchiOrder,
      message: "Parchi order received successfully! Our Bhopal store team will verify it shortly.",
    });
  } catch (error: any) {
    console.error("Parchi order creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create parchi order" },
      { status: 500 }
    );
  }
}
