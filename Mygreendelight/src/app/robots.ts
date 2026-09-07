import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://subziquick.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/offers", "/about", "/contact", "/product/*"],
        disallow: ["/admin/", "/api/", "/user/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/shop", "/offers", "/about", "/contact", "/product/*", "/categories/*", "/*.jpg", "/*.png", "/*.webp"],
        disallow: ["/admin/", "/api/", "/user/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
