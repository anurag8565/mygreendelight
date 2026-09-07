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
    default: "Online Vegetable & Fruit Delivery in Bhopal | Farm Fresh Produce - SubziQuick",
    template: "%s | SubziQuick Bhopal - Online Vegetable Delivery",
  },
  description:
    "Order farm-fresh vegetables, seasonal fruits, and exotic produce online in Bhopal at wholesale direct farm rates. 100% ozone-washed, pesticide-safe with same-day express home delivery across all Bhopal localities.",
  keywords: [
    "online vegetable delivery Bhopal",
    "fresh sabzi home delivery Bhopal",
    "fresh organic fruits Bhopal",
    "same day vegetable delivery Bhopal",
    "Bhopal online sabzi store",
    "exotic vegetables Bhopal",
    "avocado delivery Bhopal",
    "broccoli mushroom bell pepper Bhopal",
    "hydroponic greens Bhopal",
    "best online sabzi app Bhopal",
    "fresh produce Bhopal",
    "SubziQuick Bhopal",
    "organic vegetables Bhopal",
    "buy veggies Bagsewaniya",
    "vegetable store MP Nagar",
    "fruits Arera Colony",
    "fresh sabzi Kolar Road",
    "exotics Bawadiya Kalan Bhopal",
  ],
  authors: [{ name: "SubziQuick Bhopal" }],
  creator: "SubziQuick",
  publisher: "SubziQuick Bhopal",
  alternates: {
    canonical: "https://subziquick.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "SubziQuick Bhopal | Farm Fresh Daily Vegetables & Fruits Same Day Delivery",
    description:
      "Order farm-fresh vegetables, seasonal fruits & groceries online in Bhopal at wholesale farm rates. 100% ozone-washed with same-day home delivery.",
    url: "https://subziquick.in",
    siteName: "SubziQuick",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://subziquick.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "SubziQuick Bhopal - Farm Fresh Vegetables & Fruits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SubziQuick Bhopal | Farm Fresh Vegetables & Fruits Online",
    description: "Daily Farm Fresh Produce delivered same-day to your doorstep in Bhopal.",
    images: ["https://subziquick.in/og-image.png"],
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
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "name": "SubziQuick Bhopal",
    "image": "https://subziquick.in/hero_basket.jpg",
    "url": "https://subziquick.in",
    "telephone": "+919981418565",
    "email": "anuragsinghas098@gmail.com",
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
    "servesCuisine": "Fresh Vegetables, Seasonal Fruits, Fresh Produce, Dairy, Groceries",
    "sameAs": [
      "https://wa.me/919981418565"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SubziQuick",
    "url": "https://subziquick.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://subziquick.in/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to get fresh vegetable delivery in Bhopal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can order daily farm-fresh vegetables and fruits online in Bhopal via SubziQuick (https://subziquick.in). All vegetables are sourced at 5:00 AM from local farms, 100% ozone-cleaned, and delivered same-day in 15-45 minutes across Arera Colony, MP Nagar, Kolar Road, and all Bhopal societies."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I buy exotic vegetables like Avocado, Broccoli, and Hydroponic Lettuce in Bhopal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SubziQuick provides Bhopal's largest online exotic vegetable catalog including Hass Avocados, Broccoli, Zucchini, Iceberg/Romaine Lettuce, Button Mushrooms, Cherry Tomatoes, Italian Basil, and Dragon Fruit at wholesale direct farm prices."
        }
      },
      {
        "@type": "Question",
        "name": "What are the delivery slots for online vegetable orders in Bhopal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SubziQuick offers 4 daily delivery slots: Early Sunrise (6:00 AM - 8:30 AM), Morning Fresh (8:30 AM - 11:00 AM), Midday (11:00 AM - 1:00 PM), and Evening (4:00 PM - 7:30 PM) across all 20+ Bhopal localities."
        }
      },
      {
        "@type": "Question",
        "name": "Are SubziQuick vegetables pesticide-free and clean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, every batch of leafy vegetables, fruits, and salad items is ozone-bubble washed to remove 99.4% of surface pesticides, bacteria, and grime before dispatch."
        }
      }
    ]
  };

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
