import React from "react";
import connectDb from "@/lib/db";
import Grocery from "@/model/groseri.model";
import Nav from "@/components/Nav";
import { auth } from "@/auth";
import User from "@/model/user.model";
import ProductDetailsClient from "./ProductDetailsClient";
import type { Metadata } from "next";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  try {
    await connectDb();
    
    // Find by ObjectId or Slug
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const product = isObjectId
      ? await Grocery.findById(id).lean()
      : await Grocery.findOne({ slug: id }).lean();

    if (product) {
      const priceText = product.price ? `₹${product.price}` : "";
      const unitText = product.unit ? `(${product.unit})` : "";
      const defaultTitle = `${product.name} ${unitText} - ${priceText} | SubziQuick Bhopal`;
      const defaultDesc =
        product.description ||
        `Order farm fresh ${product.name} online in Bhopal at Mandi rates on SubziQuick. 100% ozone-washed & pesticide-safe with same-day home delivery across Bhopal.`;

      const title = product.metaTitle || defaultTitle;
      const description = product.metaDescription || defaultDesc;
      const productUrl = product.canonicalUrl || `https://subziquick.in/product/${product._id}`;

      return {
        title,
        description,
        keywords: product.metaKeywords || `${product.name}, fresh vegetables bhopal, mandi rate bhopal`,
        alternates: {
          canonical: productUrl,
        },
        openGraph: {
          title,
          description,
          url: productUrl,
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
    title: "Mandi Fresh Farm Produce | SubziQuick Bhopal",
    description: "Daily Karond Mandi fresh vegetables, fruits & staples with same-day home delivery in Bhopal on SubziQuick.",
  };
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  // Fetch product
  let product = null;
  let relatedProducts = [];
  try {
    await connectDb();
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const rawProduct = isObjectId
      ? await Grocery.findById(id).lean()
      : await Grocery.findOne({ slug: id }).lean();

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
          <p className="text-gray-500 mt-2">This item may have been removed or updated.</p>
        </div>
      </>
    );
  }

  // Rich Schema.org JSON-LD for Google Rich Snippets
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image ? [product.image] : [],
    description:
      product.metaDescription ||
      product.description ||
      `Fresh ${product.name} delivered same-day in Bhopal at Karond Mandi rates on SubziQuick.`,
    sku: `SQ-${String(product._id).slice(-6).toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "SubziQuick Bhopal",
    },
    offers: {
      "@type": "Offer",
      url: product.canonicalUrl || `https://subziquick.in/product/${product._id}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "SubziQuick Bhopal",
        telephone: "+91-9981418565",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Amrai, Bagsewaniya",
          addressLocality: "Bhopal",
          addressRegion: "Madhya Pradesh",
          postalCode: "462043",
          addressCountry: "IN",
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating && product.rating > 0 ? String(product.rating) : "4.8",
      reviewCount: product.numReviews && product.numReviews > 0 ? String(product.numReviews) : "89",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://subziquick.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category || "Produce",
        item: "https://subziquick.in/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://subziquick.in/product/${product._id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Nav user={userData as any} />
      <div className="min-h-screen bg-[#fcfdfc] pt-0">
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
      </div>
    </>
  );
}
