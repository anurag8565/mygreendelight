import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Refund & Return Policy | SubziQuick Bhopal",
  description: "Learn about SubziQuick Bhopal 100% No-Questions-Asked produce refund & return guarantee. Inspect fresh vegetables & fruits at doorstep for instant replacement or UPI refund.",
  keywords: [
    "SubziQuick refund policy",
    "Subzi Quick return guarantee",
    "instant vegetable refund Bhopal",
    "freshness guarantee Bhopal",
  ],
  alternates: {
    canonical: "https://subziquick.in/refund-policy",
  },
  openGraph: {
    title: "100% Refund & Return Policy | SubziQuick Bhopal",
    description: "Doorstep inspection with instant refund or replacement guarantee on SubziQuick.",
    url: "https://subziquick.in/refund-policy",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "100% Refund & Return Policy | SubziQuick Bhopal",
    url: "https://subziquick.in/refund-policy",
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
