import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Fresh Vegetables, Fruits & Exotics Delivery in Bhopal | Direct Farm Rates - SubziQuick",
  description:
    "Buy daily farm-fresh vegetables, seasonal fruits, and exotic salad produce (Broccoli, Avocado, Bell Peppers, Mushrooms, Hydroponic Greens) online in Bhopal at wholesale direct farm rates. 100% ozone-washed, pesticide-safe with same-day home delivery across Bhopal.",
  keywords: [
    "online vegetable delivery in bhopal",
    "buy fresh fruits online bhopal",
    "fresh sabzi online cash on delivery bhopal",
    "today vegetable rate in bhopal",
    "buy hass avocado in bhopal online",
    "fresh green broccoli price in bhopal",
    "fresh button mushroom 200g online bhopal",
    "hydroponic romaine iceberg lettuce bhopal",
    "fresh desi tomato tamatar online delivery bhopal",
    "pahadi aaloo potato 5kg bag online bhopal",
    "nashik red onion pyaz wholesale price bhopal",
    "fresh organic spinach palak online bhopal",
    "fresh green peas matar buy online bhopal",
    "vegetable delivery in arera colony bhopal",
    "fresh fruit delivery kolar road bhopal",
    "online sabzi delivery mp nagar bhopal",
    "organic vegetables bawadiya kalan bhopal",
    "vegetable home delivery katara hills bhopal",
    "pesticide free vegetables in bhopal",
    "zero platform fee vegetable delivery app bhopal",
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
