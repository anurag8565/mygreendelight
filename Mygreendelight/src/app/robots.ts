import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mygreendelight.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/user/checkout", "/user/ordersuccess"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
