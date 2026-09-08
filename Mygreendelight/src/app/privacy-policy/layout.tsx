import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SubziQuick Bhopal",
  description: "Read the official Privacy Policy of SubziQuick Bhopal. Learn how we safeguard your personal details, order history, and payment information with 100% data encryption.",
  keywords: [
    "SubziQuick privacy policy",
    "Subzi Quick data protection",
    "online vegetable delivery Bhopal privacy",
  ],
  alternates: {
    canonical: "https://subziquick.in/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | SubziQuick Bhopal",
    description: "Learn how SubziQuick protects your privacy and personal data.",
    url: "https://subziquick.in/privacy-policy",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy | SubziQuick Bhopal",
    url: "https://subziquick.in/privacy-policy",
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
