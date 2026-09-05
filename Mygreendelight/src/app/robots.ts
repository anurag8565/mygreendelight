import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://subziquick.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/user/checkout", "/user/ordersuccess"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
