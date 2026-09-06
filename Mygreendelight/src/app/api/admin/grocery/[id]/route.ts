import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDb();
    const { id } = await context.params;
    const grocery = await Grocery.findById(id);

    if (!grocery) {
      return NextResponse.json(
        { success: false, message: "Grocery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, grocery });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch grocery" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    const grocery = await Grocery.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!grocery) {
      return NextResponse.json(
        {
          success: false,
          message: "Grocery not found",
        },
        {
          status: 404,
        }
      );
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      grocery,
      message: "Grocery updated successfully",
    });
  } catch (error) {
    console.error("Update grocery error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Update grocery failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const deleted = await Grocery.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Grocery not found" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "Grocery deleted successfully",
    });
  } catch (error) {
    console.error("Delete grocery error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete grocery" },
      { status: 500 }
    );
  }
}