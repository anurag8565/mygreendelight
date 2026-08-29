import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProviders from "@/redux/StoreProviders";
import Inituser from "@/Inituser";
import 'leaflet/dist/leaflet.css'
import SocketProvider from "@/components/SocketProvider";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "MyGreenDelight | Bhopal Mandi Farm Fresh Grocery | Bhopal's #1 Farm Fresh Online Grocery Store",
  description: "Bhopal's #1 Farm Fresh Online Grocery Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    >
      <body className="w-full min-h-screen bg-linear-to-b from-green-100 to-white">
        <Provider>
          <StoreProviders>
            <Inituser/>
            <SocketProvider />
            {children}
            <WhatsAppWidget />
            <MobileBottomNav />
          </StoreProviders>
        </Provider>
      </body>
    </html>
  );
}
