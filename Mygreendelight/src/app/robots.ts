import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://subziquick.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/offers", "/about", "/contact", "/product/*"],
        disallow: ["/admin/", "/api/", "/user/checkout", "/user/ordersuccess", "/user/wallet"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/shop", "/offers", "/product/*", "/categories/*", "/*.jpg", "/*.png", "/*.webp"],
        disallow: ["/admin/", "/api/", "/user/checkout"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
