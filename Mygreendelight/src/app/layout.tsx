import type { Metadata, Viewport } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProviders from "@/redux/StoreProviders";
import Inituser from "@/Inituser";
import "leaflet/dist/leaflet.css";
import SocketProvider from "@/components/SocketProvider";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import MobileBottomNav from "@/components/MobileBottomNav";
import BroadcastBar from "@/components/BroadcastBar";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f8646",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://subziquick.in"),
  title: {
    default: "SubziQuick Bhopal | Mandi Fresh Daily Vegetables & Fruits Same Day Delivery",
    template: "%s | SubziQuick Bhopal",
  },
  description:
    "Order farm-fresh vegetables, seasonal fruits & groceries online in Bhopal at wholesale Mandi rates. 100% ozone-washed, pesticide-safe produce with same-day home delivery across Bhopal.",
  keywords: [
    "online vegetable delivery Bhopal",
    "fresh sabzi home delivery Bhopal",
    "Karond Mandi online fruits Bhopal",
    "same day vegetable delivery Bhopal",
    "Bhopal online sabzi store",
    "fresh produce Bhopal",
    "SubziQuick Bhopal",
    "organic vegetables Bhopal",
  ],
  authors: [{ name: "SubziQuick Bhopal" }],
  creator: "SubziQuick",
  publisher: "SubziQuick Bhopal",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "SubziQuick Bhopal | Mandi Fresh Daily Vegetables & Fruits Same Day Delivery",
    description:
      "Order farm-fresh vegetables, seasonal fruits & groceries online in Bhopal at wholesale Mandi rates. 100% ozone-washed with same-day home delivery.",
    url: "https://subziquick.in",
    siteName: "SubziQuick",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubziQuick Bhopal | Mandi Fresh Vegetables & Fruits Online",
    description: "Daily Mandi Fresh Farm Produce delivered same-day to your doorstep in Bhopal.",
  },
  manifest: "/manifest.json",
  verification: {
    google: "googled4b785d2d9597368",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SubziQuick",
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "name": "SubziQuick Bhopal",
    "image": "https://subziquick.in/hero_basket.jpg",
    "url": "https://subziquick.in",
    "telephone": "+919981418565",
    "email": "support@subziquick.in",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Amrai, Bagsewaniya",
      "addressLocality": "Bhopal",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "462043",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.1956,
      "longitude": 77.4645
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "06:00",
        "closes": "22:00"
      }
    ],
    "areaServed": [
      "Bhopal",
      "MP Nagar",
      "Arera Colony",
      "Kolar Road",
      "Bagsewaniya",
      "Gulmohar",
      "Shahpura",
      "Hoshangabad Road",
      "Saket Nagar",
      "BHEL Bhopal",
      "Chunabhatti",
      "TT Nagar",
      "Misrod",
      "Awadhpuri",
      "Katara Hills",
      "Ayodhya Bypass",
      "Indrapuri",
      "Bawadiya Kalan",
      "Trilanga"
    ],
    "paymentAccepted": "Cash, UPI, Credit Card, Debit Card, Net Banking",
    "currenciesAccepted": "INR",
    "servesCuisine": "Fresh Vegetables, Seasonal Fruits, Mandi Produce, Dairy, Groceries",
    "sameAs": [
      "https://wa.me/919981418565"
    ]
  };

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="w-full min-h-screen bg-linear-to-b from-green-50 to-white text-gray-900 overflow-x-hidden">
        <Provider>
          <StoreProviders>
            <Inituser />
            <SocketProvider />
            <BroadcastBar />
            {children}
            <WhatsAppWidget />
            <MobileBottomNav />
          </StoreProviders>
        </Provider>
      </body>
    </html>
  );
}
