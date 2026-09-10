import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Provider from "@/Provider";
import StoreProviders from "@/redux/StoreProviders";
import Inituser from "@/Inituser";
import "leaflet/dist/leaflet.css";
import SocketProvider from "@/components/SocketProvider";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import MobileBottomNav from "@/components/MobileBottomNav";
import BroadcastBar from "@/components/BroadcastBar";
import ContentProtection from "@/components/ContentProtection";

const brandSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-brand-serif",
  display: "swap",
});

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
    default: "SubziQuick: Online Fresh Vegetable & Fruit Delivery in Bhopal | 10-15 Min Express",
    template: "%s | SubziQuick Bhopal",
  },
  description:
    "SubziQuick (Subzi Quick) is Bhopal's #1 farm-fresh vegetable & fruit delivery service. 100% ozone-washed, pesticide-safe produce sourced at 5:00 AM from local Kisan farms. Delivered in 10-15 mins with cash on delivery & zero platform fee across all Bhopal societies.",
  keywords: [
    // Primary Brand & Name Variations (For #1 Brand Search Ranking)
    "subzi quick",
    "subziquick",
    "subzi quick bhopal",
    "subziquick bhopal",
    "subziquick in",
    "subzi quick app",
    "subzi quick online vegetable delivery",
    "subziquick fresh vegetables",
    "subzi quick bagsewaniya bhopal",

    // Primary High-Volume Category Keywords (Vegetables & Fruits in Bhopal)
    "vegetables and fruits in bhopal",
    "fresh vegetables and fruits in bhopal",
    "online vegetable delivery in bhopal",
    "buy fresh fruits online bhopal",
    "fresh sabzi online cash on delivery bhopal",
    "today vegetable rate in bhopal",
    "same day fresh vegetable delivery bhopal",
    "online sabzi delivery app bhopal free delivery",
    "fresh farm vegetables home delivery bhopal",
    "no minimum order vegetable delivery bhopal",
    "free vegetable delivery in bhopal",
    "cheap fresh vegetable delivery online bhopal",
    "taaza sabzi online bhopal",
    // Fast Delivery & Time-Based Speed Keywords
    "10-15 minute grocery delivery bhopal",
    "15 minute vegetable delivery bhopal",
    "fastest sabzi delivery bhopal",
    "instant fresh vegetable delivery near me bhopal",
    "quick commerce vegetable delivery bhopal",
    "early morning vegetable delivery bhopal",
    "express grocery delivery bhopal",

    // Hyperlocal Bhopal Locality Keywords
    "vegetable delivery in arera colony bhopal",
    "fresh fruit delivery kolar road bhopal",
    "online sabzi delivery mp nagar bhopal",
    "organic vegetables bawadiya kalan bhopal",
    "vegetable home delivery katara hills bhopal",
    "fresh vegetables delivery shahpura bhopal",
    "fresh farm produce bittan market e4 bhopal",
    "fresh fruits and sabzi ayodhya bypass bhopal",
    "online vegetable delivery indrapuri bhel bhopal",
    "doorstep vegetable delivery hoshangabad road",
    "fresh veggies gulmohar bhopal",
    "vegetables delivery chunabhatti bhopal",
    "fresh fruits saket nagar bhopal",
    "sabzi delivery bagsewaniya bhopal",
    "fresh vegetables trilanga bhopal",
    "vegetable delivery misrod bhopal",

    // Exotic & Daily Produce Keywords
    "buy hass avocado in bhopal online",
    "fresh green broccoli price in bhopal",
    "fresh button mushroom 200g online bhopal",
    "hydroponic romaine iceberg lettuce bhopal",
    "fresh desi tomato tamatar online delivery bhopal",
    "pahadi aaloo potato 5kg bag online bhopal",
    "nashik red onion pyaz wholesale price bhopal",
    "fresh organic spinach palak online bhopal",
    "fresh green peas matar buy online bhopal",
    "weekly vegetable family combo basket 10kg bhopal",

    // Trust, Purity & Voice Search Queries
    "pesticide free vegetables in bhopal",
    "100 percent ozone washed clean vegetables bhopal",
    "direct kisan wholesale price online sabzi bhopal",
    "sunrise 5am harvest fresh farm produce bhopal",
    "instant fresh sabzi delivery near me",
    "bhopal me online sabzi order kaise karein",
    "aaj bhopal me tamatar pyaz ka rate",
    "best app to buy fresh vegetables in bhopal",
    "zero platform fee vegetable delivery app bhopal",
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
    "@id": "https://subziquick.in/#store",
    "name": "SubziQuick",
    "alternateName": [
      "Subzi Quick",
      "SubziQuick Bhopal",
      "Subzi Quick Bhopal",
      "SubziQuick.in",
      "Subzi Quick App",
      "Subzi Quick Online Vegetable Delivery"
    ],
    "description": "SubziQuick (Subzi Quick) is Bhopal's leading 10-15 min online vegetable and fruit delivery service. 100% ozone-washed, direct Kisan farm harvest at wholesale prices with zero platform fee.",
    "disambiguatingDescription": "Online vegetable and fruit delivery service headquartered in Bagsewaniya, Bhopal, delivering across all Bhopal residential colonies.",
    "image": "https://subziquick.in/hero_basket.jpg",
    "logo": "https://subziquick.in/logo.png",
    "url": "https://subziquick.in",
    "telephone": "+919981418565",
    "email": "anuragsinghas098@gmail.com",
    "priceRange": "₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI, Credit Card, Debit Card, Net Banking",
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
    "knowsAbout": [
      "Subzi Quick",
      "SubziQuick",
      "Online Vegetable Delivery in Bhopal",
      "Fresh Fruit Delivery Bhopal",
      "Ozone Washed Chemical Free Vegetables",
      "Bhopal Sabzi Mandi Bhav"
    ],
    "servesCuisine": "Fresh Vegetables, Seasonal Fruits, Hydroponic Exotics, Farm Produce, Groceries",
    "sameAs": [
      "https://www.instagram.com/subziquick",
      "https://wa.me/919981418565",
      "https://www.facebook.com/profile.php?id=61594046110147"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://subziquick.in/#website",
    "name": "SubziQuick",
    "alternateName": [
      "Subzi Quick",
      "SubziQuick Bhopal",
      "Subzi Quick Bhopal",
      "Subzi Quick App",
      "subziquick.in"
    ],
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
        "name": "What is SubziQuick (Subzi Quick) in Bhopal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SubziQuick (also searched as Subzi Quick) is Bhopal's dedicated hyperlocal quick-commerce platform delivering 100% ozone-washed, farm-fresh vegetables and seasonal fruits to your doorstep in 10-15 minutes at wholesale mandi prices with zero platform fee."
        }
      },
      {
        "@type": "Question",
        "name": "How to order fresh vegetables and fruits in Bhopal online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can order daily farm-fresh vegetables and fruits online in Bhopal via SubziQuick (https://subziquick.in). All vegetables are sourced at 5:00 AM from local Kisan farms, 100% ozone-cleaned, and delivered same-day in 10-15 minutes across Arera Colony, MP Nagar, Kolar Road, and all Bhopal societies with Cash on Delivery (COD) and UPI."
        }
      },
      {
        "@type": "Question",
        "name": "Bhopal me online sabzi aur phal order kaise karein?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bhopal me online taaza sabzi aur phal order karne ke liye SubziQuick website (subziquick.in) open karein. Apni pasand ki taaza sabziyan cart me add karein aur Cash on Delivery (COD) ya UPI se order place karein. 10-15 minute me Bagsewaniya central store se delivery aapke ghar pahunch jayegi."
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
        "name": "Are SubziQuick vegetables pesticide-free and ozone cleaned?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, every batch of vegetables and fruits is ozone micro-bubble washed to remove 99.4% of surface chemical pesticides, bacteria, and grime before dispatch, ensuring pure and healthy food."
        }
      },
      {
        "@type": "Question",
        "name": "Is there any platform fee or surge charge on SubziQuick in Bhopal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, SubziQuick operates with Zero Platform Fee, Zero Surge Charges, and No Minimum Order limit on fresh vegetable and fruit delivery across Bhopal."
        }
      },
      {
        "@type": "Question",
        "name": "Bhopal me sabse fast 10-15 minute me sabzi delivery kaun karta hai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SubziQuick Bhopal me sabse fast 10-15 minute express hyperlocal delivery provide karta hai. Taaza sabzi aur fruits direct kisan farm se Bagsewaniya hub se deliver hote hain."
        }
      },
      {
        "@type": "Question",
        "name": "How fast is vegetable delivery in Bhopal on SubziQuick?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SubziQuick delivers within 10 to 15 minutes across all major Bhopal residential societies including Arera Colony, MP Nagar, Kolar Road, and Bagsewaniya with real-time delivery status."
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
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({
                  appId: "6fa7f8ec-5436-446f-93b4-7b4bcad7055d",
                });
              });
            `,
          }}
        />
      </head>
      <body className={`${brandSerif.variable} w-full min-h-screen bg-linear-to-b from-green-50 to-white text-gray-900 overflow-x-hidden font-sans`}>
        <ContentProtection />
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
