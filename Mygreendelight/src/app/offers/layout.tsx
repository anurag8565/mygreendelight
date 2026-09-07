import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vegetables & Fruits Coupons, Farm Fresh Deals & Offers in Bhopal | SubziQuick",
  description:
    "Save big on daily fresh vegetables, fruits, and exotic produce with exclusive SubziQuick Bhopal discount coupons, scratch rewards, and Direct Farm Price Drop Offers.",
  keywords: [
    "free vegetable delivery in bhopal",
    "cheap fresh vegetable delivery online bhopal",
    "no minimum order vegetable delivery bhopal",
    "zero platform fee vegetable delivery app bhopal",
    "online sabzi delivery app bhopal free delivery",
    "sabzi discount coupon bhopal",
    "vegetable offers bhopal",
    "fresh vegetable discount bhopal",
    "SubziQuick promo code",
  ],
  alternates: {
    canonical: "https://subziquick.in/offers",
  },
  openGraph: {
    title: "Vegetables & Fruits Discount Offers Bhopal | SubziQuick",
    description: "Unlock instant savings & scratch card rewards on farm fresh produce in Bhopal.",
    url: "https://subziquick.in/offers",
    siteName: "SubziQuick Bhopal",
    type: "website",
  },
};

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
