import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SubziQuick Bhopal | Karond Mandi Sourcing & Farm Fresh Story",
  description:
    "Learn how SubziQuick connects Bhopal families with direct 5:00 AM Karond Mandi harvest, 100% ozone-washed vegetables, and eco-friendly EV doorstep delivery across Bhopal.",
  keywords: [
    "about SubziQuick Bhopal",
    "Karond Mandi vegetable sourcing",
    "farm fresh produce Bhopal story",
    "ozone washed vegetables Bhopal",
  ],
  alternates: {
    canonical: "https://subziquick.in/about",
  },
  openGraph: {
    title: "About SubziQuick Bhopal - Mandi Freshness Sourcing",
    description: "Direct Kisan connections & Karond Mandi farm produce delivered across Bhopal.",
    url: "https://subziquick.in/about",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About SubziQuick Bhopal",
    "description": "SubziQuick is Bhopal's leading farm-to-table fresh vegetable and fruit delivery network sourced directly from Karond Mandi.",
    "url": "https://subziquick.in/about",
    "mainEntity": {
      "@type": "GroceryStore",
      "name": "SubziQuick Bhopal",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {children}
    </>
  );
}
