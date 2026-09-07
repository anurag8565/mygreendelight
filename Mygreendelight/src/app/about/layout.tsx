import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SubziQuick Bhopal | Direct Farm Sourcing & Pure Fresh Story",
  description:
    "Learn how SubziQuick connects Bhopal families with direct 5:00 AM Sunrise Farm Harvest, 100% ozone-washed vegetables, and eco-friendly EV doorstep delivery across Bhopal.",
  keywords: [
    "pesticide free vegetables in bhopal",
    "100 percent ozone washed clean vegetables bhopal",
    "direct kisan wholesale price online sabzi bhopal",
    "sunrise 5am harvest fresh farm produce bhopal",
    "chemical free sabzi kahan milegi bhopal me",
    "about SubziQuick Bhopal",
    "direct farm vegetable sourcing",
    "farm fresh produce Bhopal story",
  ],
  alternates: {
    canonical: "https://subziquick.in/about",
  },
  openGraph: {
    title: "About SubziQuick Bhopal - Farm Fresh Sourcing",
    description: "Direct Kisan connections & pure farm fresh produce delivered across Bhopal.",
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
    "description": "SubziQuick is Bhopal's leading farm-to-table fresh vegetable and fruit delivery network sourced directly from local organic contract farms.",
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
