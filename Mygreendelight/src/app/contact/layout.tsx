import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SubziQuick Bhopal | Customer Helpline & Store Address",
  description:
    "Get in touch with SubziQuick Bhopal customer care. Call or WhatsApp +91-9981418565 for quick order support, society bulk orders, or visit SubziQuick Store at Amrai, Bagsewaniya, Bhopal.",
  keywords: [
    "SubziQuick Bhopal customer care",
    "SubziQuick phone number Bhopal",
    "vegetable delivery helpline Bhopal",
    "SubziQuick Bagsewaniya address",
  ],
  alternates: {
    canonical: "https://subziquick.in/contact",
  },
  openGraph: {
    title: "Contact SubziQuick Bhopal - Customer Helpline",
    description: "Need help with fresh produce delivery? Contact SubziQuick Bhopal team.",
    url: "https://subziquick.in/contact",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact SubziQuick Bhopal",
    "url": "https://subziquick.in/contact",
    "mainEntity": {
      "@type": "GroceryStore",
      "name": "SubziQuick Bhopal",
      "telephone": "+91-9981418565",
      "email": "anuragsinghas098@gmail.com",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  );
}
