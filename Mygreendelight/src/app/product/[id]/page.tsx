import React from "react";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import Nav from "@/components/Nav";
import { auth } from "@/auth";
import User from "@/model/user.model";
import ProductDetailsClient from "./ProductDetailsClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  try {
    await connectDb();
    const product = await Grocery.findById(id).lean();
    if (product) {
      const priceText = product.price ? `₹${product.price}` : "";
      const unitText = product.unit ? `(${product.unit})` : "";
      const title = `${product.name} ${unitText} - ${priceText} | SubziQuick Bhopal`;
      const description =
        product.description ||
        `Order fresh ${product.name} online in Bhopal on SubziQuick. 10-15 Min Express Delivery direct from sunrise farms. 100% ozone-washed & fresh.`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://subziquick.in/product/${id}`,
          siteName: "SubziQuick Bhopal",
          images: [
            {
              url: product.image,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [product.image],
        },
      };
    }
  } catch (error) {}

  return {
    title: "Fresh Farm Produce | SubziQuick Bhopal",
    description: "10-15 Min Express Delivery of Farm Fresh Vegetables & Fruits in Bhopal on SubziQuick.",
  };
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  // Fetch product
  let product = null;
  let relatedProducts = [];
  try {
    await connectDb();
    const rawProduct = await Grocery.findById(id).lean();
    if (rawProduct) {
      product = JSON.parse(JSON.stringify(rawProduct));

      const related = await Grocery.find({
        category: product.category,
        _id: { $ne: product._id },
      })
        .limit(4)
        .lean();
      relatedProducts = JSON.parse(JSON.stringify(related));
    }
  } catch (error) {
    console.error("Invalid product ID or fetch error:", error);
  }

  // Fetch user data for Nav
  let userData = { role: "user" }; // default fallback
  try {
    const session = await auth();
    if (session?.user?.id) {
      const user = await User.findById(session.user.id).lean();
      if (user) {
        userData = JSON.parse(JSON.stringify(user));
      }
    }
  } catch (error) {}

  if (!product) {
    return (
      <>
        <Nav user={userData as any} />
        <div className="min-h-screen pt-32 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Product Not Found</h1>
          <p className="text-gray-500 mt-2">This item may have been removed.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav user={userData as any} />
      <div className="min-h-screen bg-[#fcfdfc] pt-0">
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
      </div>
    </>
  );
}
