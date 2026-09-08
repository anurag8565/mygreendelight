import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10-15 Min Express Delivery & Shipping Policy | SubziQuick Bhopal",
  description: "SubziQuick Bhopal shipping policy details: 10-15 min express delivery slots, morning farm dispatch (6:00 AM - 10:00 PM), free delivery over ₹199 across Arera Colony, Kolar Road, MP Nagar, and all Bhopal areas.",
  keywords: [
    "SubziQuick shipping policy",
    "Subzi Quick delivery timings",
    "15 min vegetable delivery Bhopal",
    "free grocery delivery Bhopal",
  ],
  alternates: {
    canonical: "https://subziquick.in/shipping-policy",
  },
  openGraph: {
    title: "10-15 Min Express Delivery & Shipping Policy | SubziQuick Bhopal",
    description: "Fast 10-15 min delivery guidelines and operating slots across Bhopal.",
    url: "https://subziquick.in/shipping-policy",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function ShippingPolicyLayout({ children }: { children: React.ReactNode }) {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shipping & Delivery Policy | SubziQuick Bhopal",
    url: "https://subziquick.in/shipping-policy",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      {children}
    </>
  );
}
