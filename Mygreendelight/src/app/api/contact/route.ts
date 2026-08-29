import connectDb from "@/lib/db";
import ContactMessage from "@/model/contact.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
      status: "unread",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully! Our team will get back to you shortly.",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
