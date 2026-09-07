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
    "Order farm-fresh vegetables, seasonal fruits & groceries online in Bhopal at wholesale direct farm rates. 100% ozone-washed, pesticide-free with same-day express home delivery (15-45 mins) across all Bhopal localities. Cash on delivery & zero platform fee.",
  keywords: [
    // Category 1: High Volume Commercial & Money Keywords
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

    // Category 2: Hyperlocal Bhopal Locality Keywords
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

    // Category 3 & 4: Exotic & Daily Produce Keywords
    "buy hass avocado in bhopal online",
    "fresh green broccoli price in bhopal",
    "fresh button mushroom 200g online bhopal",
    "hydroponic romaine iceberg lettuce bhopal",
    "fresh desi tomato tamatar online delivery bhopal",
    "pahadi aaloo potato 5kg bag online bhopal",
    "nashik red onion pyaz wholesale price bhopal",
    "fresh organic spinach palak online bhopal",
    "fresh green peas matar buy online bhopal",
    "chopped ready to cook vegetable pack bhopal",
    "weekly vegetable family combo basket 10kg bhopal",

    // Category 5: Trust, Health & Voice Search Keywords
    "pesticide free vegetables in bhopal",
    "100 percent ozone washed clean vegetables bhopal",
    "direct kisan wholesale price online sabzi bhopal",
    "sunrise 5am harvest fresh farm produce bhopal",
    "instant fresh sabzi delivery near me",
    "bhopal me online sabzi order kaise karein",
    "aaj bhopal me tamatar pyaz ka rate",
    "chemical free sabzi kahan milegi bhopal me",
    "zero platform fee vegetable delivery app bhopal",
    "best vegetable delivery service in bhopal 2026",
    "SubziQuick Bhopal",
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
      "https://www.instagram.com/subziquick",
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
        "name": "Bhopal me online sabzi order kaise karein?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bhopal me online sabzi order karne ke liye SubziQuick website (subziquick.in) par jayein ya Android/iOS app open karein. Apni pasand ki taaza sabziyan aur phal cart me add karein aur Cash on Delivery (COD) ya UPI se checkout karein. 15-45 minute me delivery aapke ghar pahunch jayegi."
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
        "name": "Aaj Bhopal me tamatar aur pyaz ka rate kya chal raha hai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SubziQuick par roz subah 5 baje direct kisan farm harvest rates update hote hain. Tamatar, Pyaz aur Aaloo ke live dynamic rates dekhne ke liye subziquick.in par live price ticker check karein jahan wholesale farm bhav par sabzi milti hai."
        }
      },
      {
        "@type": "Question",
        "name": "Are SubziQuick vegetables pesticide-free and ozone cleaned?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, every batch of leafy vegetables, fruits, and salad items is ozone-bubble washed to remove 99.4% of surface chemical pesticides, bacteria, and grime before dispatch, ensuring pure and healthy food."
        }
      },
      {
        "@type": "Question",
        "name": "Is there any platform fee or surge charge on SubziQuick in Bhopal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, SubziQuick operates with Zero Platform Fee, Zero Surge Charges, and No Minimum Order limit on fresh vegetable and fruit delivery across Bhopal."
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
