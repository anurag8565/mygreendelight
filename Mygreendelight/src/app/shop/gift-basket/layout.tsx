import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fresh Exotic Fruits & Festive Gift Baskets in Bhopal | SubziQuick",
  description: "Order premium handcrafted fresh fruit gift baskets in Bhopal for festivals, pooja, weddings, and celebrations. Artistically packed with imported & orchard-fresh fruits on SubziQuick.",
  keywords: [
    "fruit gift basket bhopal",
    "fresh fruits gift hamper bhopal",
    "diwali fruit basket bhopal",
    "wedding fruit basket bhopal",
    "SubziQuick fruit basket",
  ],
  alternates: {
    canonical: "https://subziquick.in/shop/gift-basket",
  },
  openGraph: {
    title: "Fresh Exotic Fruits & Festive Gift Baskets in Bhopal | SubziQuick",
    description: "Premium fresh fruit gift baskets delivered in Bhopal.",
    url: "https://subziquick.in/shop/gift-basket",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function GiftBasketLayout({ children }: { children: React.ReactNode }) {
  return children;
}
