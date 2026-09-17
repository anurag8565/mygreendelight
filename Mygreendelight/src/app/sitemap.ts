import { MetadataRoute } from "next";
import connectDb from "@/lib/db";
import Groseri from "@/model/groseri.model";
import Category from "@/model/category.model";

function safeDate(d: any): Date {
  if (!d) return new Date();
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://subziquick.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDb();

    // Fetch published products (exclude drafts)
    const products = await Groseri.find(
      { status: { $ne: "draft" } },
      { _id: 1, slug: 1, updatedAt: 1 }
    )
      .lean()
      .limit(1500);

    productRoutes = products.map((item: any) => ({
      url: `${baseUrl}/product/${item.slug || item._id}`,
      lastModified: safeDate(item.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.85,
    }));
  } catch (err) {
    console.warn("Sitemap dynamic fetch warning:", err);
  }

  return [...staticRoutes, ...productRoutes];
}
