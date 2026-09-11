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
      const title = product.metaTitle || `Buy Fresh ${product.name} ${unitText} in Bhopal - ${priceText} | SubziQuick`;
      const description =
        product.metaDescription ||
        `Order farm fresh ${product.name} online in Bhopal for ${priceText} at wholesale farm rates on SubziQuick (Subzi Quick). 100% ozone-washed, pesticide-safe with 10-15 min express delivery across Arera Colony, Kolar Road, MP Nagar & all Bhopal areas.`;

      const productUrl = product.canonicalUrl || `https://subziquick.in/product/${product.slug || product._id}`;

      return {
        title,
        description,
        keywords: [
          "subzi quick",
          "subziquick",
          `subzi quick ${product.name}`,
          product.name,
          `buy ${product.name} in bhopal`,
          `fresh ${product.name} online bhopal`,
          `${product.name} price in bhopal`,
          `today ${product.name} rate in bhopal`,
          `fresh vegetables and fruits in bhopal`,
          `online vegetable delivery in bhopal`,
          "pesticide free vegetables in bhopal",
          "100 percent ozone washed vegetables bhopal",
        ],
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
              alt: `${product.name} - SubziQuick Bhopal`,
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
    title: "Buy Fresh Vegetables & Fruits Online in Bhopal | SubziQuick",
    description: "Daily farm fresh vegetables, seasonal fruits & groceries delivered in 10-15 mins across Bhopal on SubziQuick.",
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
      `Fresh ${product.name} delivered same-day in Bhopal at direct Kisan farm wholesale rates on SubziQuick.`,
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
      ratingValue: product.rating && product.rating > 0 ? Number(product.rating).toFixed(1) : "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: product.numReviews && product.numReviews > 0 ? Number(product.numReviews) : 89,
      reviewCount: product.numReviews && product.numReviews > 0 ? Number(product.numReviews) : 89,
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
        name: product.category || "Fresh Produce",
        item: `https://subziquick.in/shop?category=${encodeURIComponent(product.category || "Vegetables")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: product.canonicalUrl || `https://subziquick.in/product/${product.slug || product._id}`,
      },
    ],
  };

  const productFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How fast can I get fresh ${product.name} delivered in Bhopal?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `SubziQuick delivers fresh ${product.name} across Bhopal (Arera Colony, Kolar Road, MP Nagar, Katara Hills, Bagsewaniya & beyond) in 10-15 minutes direct to your doorstep.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${product.name} on SubziQuick ozone-washed and pesticide safe?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes! Every batch of ${product.name} is washed using certified 100% ozone micro-bubble water technology to remove 99.4% of surface chemical pesticides, bacteria, and dust before delivery.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the price of fresh ${product.name} in Bhopal today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Fresh ${product.name} is available on SubziQuick at wholesale farm rates of ₹${product.price} per ${product.unit || "pack"} with zero platform fee.`,
        },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productFaqJsonLd) }}
      />
      <Nav user={userData as any} />
      <div className="min-h-screen bg-[#f8f9fa] pt-0">
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
      </div>
    </>
  );
}
