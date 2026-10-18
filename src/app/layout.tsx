import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/ui/FloatingNav";
import Footer from "@/components/ui/Footer";
import RFQModal from "@/components/rfq/RFQModal";
import JsonLd from "@/components/seo/JsonLd";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { RFQProvider } from "@/hooks/useRFQBasket";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steels Vision | Global Metal Solutions & High-Trusted Partnerships",
  description:
    "Steels Vision is an ISO 9001:2015, 14001:2015, 45001:2018 certified manufacturer and global exporter of Ferrous and Non-Ferrous metals (Pipes, Tubes, Coils, Sheets, Plates, Round Bars, Flanges & Fittings). Approved for Lloyd's, DNV, TUV, BV, and IBR inspection.",
  keywords: [
    "Steels Vision",
    "Vishal Mehta",
    "HRS Ferritic equivalent metals",
    "ASTM A312 Stainless Steel Pipes",
    "ASTM A240 Stainless Steel Sheets and Coils",
    "ASTM A516 Boiler Plates",
    "Centerless Ground Round Bars",
    "ASME B16.5 Forged Flanges",
    "High Nickel Alloys Inconel Monel Hastelloy",
    "Duplex 2205 Super Duplex 2507",
    "Double Ferrule Tube Fittings",
    "Copper Earthing Jumpers",
    "ISO 9001 Metal Exporters India",
  ],
  authors: [{ name: "Steels Vision" }],
  openGraph: {
    title: "Steels Vision - Global Metal Solutions | ISO Certified",
    description:
      "Strong Materials. Stronger Projects. Built for performance, delivered with trust. Global supply of Pipes, Tubes, Coils, Sheets, Plates, Bars & Flanges.",
    url: "https://www.steelsvision.com",
    siteName: "Steels Vision",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#05070B] text-slate-100 flex flex-col min-h-screen selection:bg-red-500/30 selection:text-white`}
      >
        <SmoothScroll>
          <RFQProvider>
            <FloatingNav />
            <main className="flex-1 industrial-grid pt-18 sm:pt-24">{children}</main>
            <Footer />
            <RFQModal />
          </RFQProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
