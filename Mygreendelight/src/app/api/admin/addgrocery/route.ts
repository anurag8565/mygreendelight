import { auth } from "@/auth";
import uploadoncloudinary from "@/lib/Cloudinary";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {

    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "admin") {

      return NextResponse.json(
        {
          message: "You are not authorized",
        },
        {
          status: 401,
        }
      );
    }

    const formdata = await req.formData();

    const name = formdata.get("name") as string;

    const price = formdata.get("price") as string;
    const stock = formdata.get("stock") as string;
    const category = formdata.get("category") as string;
    const unit = formdata.get("unit") as string;
    const description = formdata.get("description") as string || "";
    const sourcing = formdata.get("sourcing") as string || "";
    const storage = formdata.get("storage") as string || "";
    const file = formdata.get("image") as File | null;

    // VALIDATION
    if (
      !name ||
      !price ||
      !stock ||
      !category ||
      !unit ||
      !file
    ) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // FILE BUFFER
  

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);


    // CLOUDINARY


    const imageurl = await uploadoncloudinary(buffer);

    const variationsStr = formdata.get("variations") as string;
    let variations = [];
    if (variationsStr) {
      try {
        variations = JSON.parse(variationsStr);
      } catch (e) {
        console.log("Error parsing variations", e);
      }
    }

    const mrp = formdata.get("mrp") as string || "";
    const rating = formdata.get("rating") as string || "4.8";
    const isTopRated = formdata.get("isTopRated") === "true";
    const isFeatured = formdata.get("isFeatured") === "true";
    const status = (formdata.get("status") as string) === "draft" ? "draft" : "published";

    // =========================
    // CREATE GROCERY
    // =========================

    const grocery = await Grocery.create({
      name,
      price: Number(price),
      mrp: mrp ? Number(mrp) : Math.round(Number(price) * 1.25),
      rating: Number(rating) || 4.8,
      isTopRated,
      isFeatured,
      status,
      stock: Number(stock),
      image: imageurl,
      category,
      unit,
      description,
      sourcing,
      storage,
      variations,
    });

    return NextResponse.json(
      {
        message: "Grocery Added Successfully",
        grocery,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.log(
      "ADD GROCERY ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}