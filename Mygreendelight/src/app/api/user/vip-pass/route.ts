import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    isMember: false,
    vipPass: null,
  });
}

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "VIP Membership is currently not active. Enjoy direct offers on all orders!",
  }, { status: 400 });
}
