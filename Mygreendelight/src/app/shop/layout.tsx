import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Fresh Vegetables, Fruits & Exotics Delivery in Bhopal | Direct Farm Rates - SubziQuick",
  description:
    "Buy daily farm-fresh vegetables, seasonal fruits, and exotic salad produce (Broccoli, Avocado, Bell Peppers, Mushrooms, Hydroponic Greens) online in Bhopal at wholesale direct farm rates. 100% ozone-washed, pesticide-safe with same-day home delivery across Bhopal.",
  keywords: [
    "online vegetable delivery Bhopal",
    "fresh vegetables online Bhopal",
    "buy fruits online Bhopal",
    "exotic vegetables Bhopal",
    "avocado online Bhopal",
    "broccoli delivery Bhopal",
    "mushrooms online Bhopal",
    "bell peppers Bhopal",
    "hydroponic greens Bhopal",
    "online fresh vegetables Bhopal",
    "same day vegetable delivery Arera Colony",
    "vegetable delivery Kolar Road",
    "fresh sabzi MP Nagar",
    "vegetables Bawadiya Kalan Bhopal",
    "SubziQuick shop",
  ],
  alternates: {
    canonical: "https://subziquick.in/shop",
  },
  openGraph: {
    title: "Buy Fresh Vegetables, Fruits & Exotics in Bhopal | SubziQuick",
    description:
      "270+ farm-fresh vegetables, seasonal fruits, and exotic greens delivered same-day in Bhopal at direct farm wholesale rates. 100% ozone-washed.",
    url: "https://subziquick.in/shop",
    siteName: "SubziQuick Bhopal",
    images: [
      {
        url: "https://subziquick.in/hero_basket.jpg",
        width: 1200,
        height: 630,
        alt: "Fresh Vegetables, Fruits & Exotics - SubziQuick Bhopal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Vegetables, Fruits & Exotics Online in Bhopal | SubziQuick",
    description: "Daily farm fresh harvest delivered to your doorstep in Bhopal.",
    images: ["https://subziquick.in/hero_basket.jpg"],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Fresh Vegetables, Fruits & Exotics Catalog Bhopal",
    "description":
      "Browse and order farm-fresh vegetables, seasonal fruits, and premium exotics online in Bhopal with express same-day doorstep delivery.",
    "url": "https://subziquick.in/shop",
    "provider": {
      "@type": "GroceryStore",
      "name": "SubziQuick Bhopal",
      "url": "https://subziquick.in",
      "telephone": "+91-9981418565",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Amrai, Bagsewaniya",
        "addressLocality": "Bhopal",
        "addressRegion": "Madhya Pradesh",
        "postalCode": "462043",
        "addressCountry": "IN"
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://subziquick.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Fresh Produce Shop",
        "item": "https://subziquick.in/shop"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
