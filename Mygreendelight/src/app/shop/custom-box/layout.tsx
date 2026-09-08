import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Fresh Vegetable Box Builder | SubziQuick Bhopal",
  description: "Customize your own weekly fresh vegetable and fruit box in Bhopal. Hand-pick your favourite farm harvest at discounted bundle prices with free delivery on SubziQuick.",
  keywords: [
    "custom vegetable box bhopal",
    "make your own sabzi basket bhopal",
    "weekly vegetable subscription box bhopal",
    "SubziQuick custom box",
  ],
  alternates: {
    canonical: "https://subziquick.in/shop/custom-box",
  },
  openGraph: {
    title: "Custom Fresh Vegetable Box Builder | SubziQuick Bhopal",
    description: "Build your customized weekly farm fresh produce box in Bhopal.",
    url: "https://subziquick.in/shop/custom-box",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function CustomBoxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
