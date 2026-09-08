import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | SubziQuick Bhopal",
  description: "Terms of service, zero platform fee guidelines, return conditions, and user agreement for SubziQuick Bhopal online fresh vegetable and fruit delivery.",
  keywords: [
    "SubziQuick terms and conditions",
    "Subzi Quick service rules",
    "online vegetable delivery terms Bhopal",
  ],
  alternates: {
    canonical: "https://subziquick.in/terms-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | SubziQuick Bhopal",
    description: "Terms and conditions for ordering fresh produce on SubziQuick Bhopal.",
    url: "https://subziquick.in/terms-conditions",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions | SubziQuick Bhopal",
    url: "https://subziquick.in/terms-conditions",
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
