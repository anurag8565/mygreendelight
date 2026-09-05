import { MetadataRoute } from "next";
import connectDb from "@/lib/db";
import Groseri from "@/model/groseri.model";
import Category from "@/model/category.model";

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

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDb();

    // Fetch categories
    const categories = await Category.find({}, { name: 1, updatedAt: 1 }).lean();
    categoryRoutes = categories.map((cat: any) => ({
      url: `${baseUrl}/shop?category=${encodeURIComponent(cat.name)}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    }));

    // Fetch products
    const products = await Groseri.find({}, { _id: 1, slug: 1, updatedAt: 1 }).lean().limit(1500);
    productRoutes = products.map((item: any) => ({
      url: `${baseUrl}/product/${item.slug || item._id}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.warn("Sitemap dynamic fetch warning:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
